import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import Header from "~/components/header";
import {
  getUploadUrl,
  useUpdateS3UploadDB,
  useUploadS3Mutation,
  useValidateTokenQuery,
} from "~/service/api";
import { useAuth } from "~/zustand/store";
import Spinner from "~/components/spinner";
import { useUploadStatusStore } from "~/zustand/upload-status-store";
import { Upload, X, Lock, AlertTriangle } from "lucide-react";
import { GLOBAL_BG } from "constant";
import { SelectedFilesList } from "~/components/selected-file";
import { encryptFileWithWorker, getHashParams } from "./upload.util";
import { filesize } from "filesize";

const MAX_FREE_USER_UPLOAD_MB = import.meta.env.VITE_MAX_FREE_USER_UPLOAD_MB ?? 200 as number;

type UploadMode = "sequential" | "parallel";

function UploadPage() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { iv, key } = getHashParams(window.location.hash);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [uploadMode, setUploadMode] = useState<UploadMode>("sequential");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const user = useAuth.getState().user;
  const isFreeUser = user?.subscription?.planName === "free";

  const { handleSubmit, formState: { errors }, reset } = useForm();

  const files = selectedFiles;

  const {
    isError: isTokenInvalid,
    isLoading: isTokenValidating,
    error: tokenValidationError,
  } = useValidateTokenQuery(token || "");

  const { mutateAsync: uploadFilesMutation, isPending: isUploading } = useUploadS3Mutation();
  const { mutateAsync: UpdateDbS3 } = useUpdateS3UploadDB();
  const { addFile, updateStatus, setError } = useUploadStatusStore.getState();
  const fileStatusList = useUploadStatusStore((state) => state.uploads);

  const addFiles = (newFiles: File[]) => {
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  useEffect(() => {
    if (!files || files.length === 0) { setTotalSize(0); return; }
    let size = 0;
    const existingStatus = useUploadStatusStore.getState().uploads;
    selectedFiles.forEach((file) => {
      size += file.size;
      const existingFile = existingStatus.find((f) => f.name === file.name);
      if (!existingFile) {
        addFile({ id: file.name, name: file.name, progress: 0, status: "pending" });
      }
    });
    setTotalSize(size);
  }, [selectedFiles]);

  const processUploads = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    if (!files || files.length === 0) { setErrorMessage("Please select at least one file."); return; }
    if (!key || !iv) { setErrorMessage("Missing encryption key or IV."); setIsProcessing(false); return; }
    const maxTotalSize = isFreeUser ? MAX_FREE_USER_UPLOAD_MB * 1024 * 1024 : Infinity;
    if (totalSize > maxTotalSize) {
      setErrorMessage(`Total size exceeds the ${MAX_FREE_USER_UPLOAD_MB}MB limit. Your total: ${(totalSize / 1024 / 1024).toFixed(2)}MB.`);
      setIsProcessing(false);
      return;
    }
    if (uploadMode === "sequential") { await handleSequentialUpload(); }
    else { await handleParallelUpload(); }
    setIsProcessing(false);
  };

  const uploadSingleFile = async (file: File) => {
    const status = fileStatusList.find((f) => f.name === file.name);
    if (status?.status === "done") return;
    try {
      const mimeType = file.type || 'application/octet-stream';
      const { url, key: s3Key } = await getUploadUrl(mimeType, token, file.size);
      const encryptedBlob = await encryptFileWithWorker(file, key, iv);
      const encryptedFile = new File([encryptedBlob], file.name, { type: file.type });
      await uploadFilesMutation({ encryptFile: encryptedBlob, type: mimeType, url, name: file.name });
      await UpdateDbS3({ s3Key, size: encryptedFile.size, token, filename: file.name });
      updateStatus(file.name, "done");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(file.name, message ?? "error while uploading this file");
      throw error;
    }
  };

  const handleSequentialUpload = async () => {
    for (const file of files) {
      try { await uploadSingleFile(file); } catch (error) { console.error(`Failed to upload ${file.name}:`, error); }
    }
  };

  const handleParallelUpload = async () => {
    const uploadPromises = files.map(file => uploadSingleFile(file).catch(e => e));
    await Promise.all(uploadPromises);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) addFiles(dropped);
  };

  if (!token)
    return (
      <div className={`h-screen w-full flex items-center justify-center ${GLOBAL_BG}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium">Invalid or missing link.</p>
          <p className="text-gray-500 text-sm mt-1">Please check your URL and try again.</p>
        </div>
      </div>
    );

  if (isTokenValidating)
    return (
      <div className={`h-screen w-full flex items-center justify-center ${GLOBAL_BG}`}>
        <Spinner size={24} color="white" />
      </div>
    );

  if (isTokenInvalid)
    return (
      <div className={`h-screen w-full flex items-center justify-center ${GLOBAL_BG}`}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium">{tokenValidationError.message ?? "This link has expired or is invalid."}</p>
        </div>
      </div>
    );

  return (
    <div className={`text-white min-h-screen ${GLOBAL_BG}`}>
      <Header />

      <div className="max-w-xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-500/30 bg-green-500/10 text-green-300 text-xs font-medium mb-4">
            <Lock size={12} />
            End-to-end encrypted upload
          </div>
          <h1 className="text-2xl font-bold text-white">Upload Files</h1>
          <p className="text-gray-400 text-sm mt-1">Files are encrypted in your browser before uploading.</p>
        </div>

        <form onSubmit={handleSubmit(processUploads)} className="space-y-4">
          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files ? Array.from(e.target.files) : [])}
            />
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
              isDragging ? 'bg-purple-500/20' : 'bg-white/8'
            }`}>
              <Upload size={24} className={isDragging ? 'text-purple-400' : 'text-gray-400'} />
            </div>
            <p className="text-white font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Drag files here or click to browse'}
            </p>
            <p className="text-gray-500 text-sm">Any file type supported</p>
            {isFreeUser && (
              <p className="text-gray-600 text-xs mt-2">Max {MAX_FREE_USER_UPLOAD_MB}MB total</p>
            )}
          </div>

          {/* Upload mode toggle */}
          <div className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl px-4 py-3">
            <div>
              <p className="text-sm text-white font-medium">Upload Mode</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {uploadMode === 'sequential' ? 'Files upload one at a time' : 'All files upload simultaneously'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${uploadMode === 'sequential' ? 'text-white' : 'text-gray-500'}`}>Sequential</span>
              <button
                type="button"
                onClick={() => setUploadMode(prev => prev === 'sequential' ? 'parallel' : 'sequential')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  uploadMode === 'parallel' ? 'bg-purple-600' : 'bg-white/15'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  uploadMode === 'parallel' ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-xs ${uploadMode === 'parallel' ? 'text-white' : 'text-gray-500'}`}>Parallel</span>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-red-900/20 border border-red-500/20 text-red-300 text-sm">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !files?.length || isProcessing}
            className="w-full py-3 text-sm font-semibold rounded-xl transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-purple-500/20"
          >
            {isProcessing ? (
              <><Spinner size={16} color="white" /> Encrypting & Uploading...</>
            ) : (
              <><Upload size={16} /> Upload {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''}` : 'Files'}</>
            )}
          </button>
        </form>

        {/* Selected Files */}
        {files.length > 0 && (
          <div className="mt-6 bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b border-white/8">
              <div>
                <h2 className="text-white text-sm font-semibold">{files.length} file{files.length > 1 ? 's' : ''} selected</h2>
                <p className="text-gray-500 text-xs mt-0.5">Total: {filesize(totalSize)}</p>
              </div>
              <button
                onClick={() => { setSelectedFiles([]); reset(); }}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>
            <div className="p-4 max-h-72 overflow-auto space-y-2">
              <SelectedFilesList files={files} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;
