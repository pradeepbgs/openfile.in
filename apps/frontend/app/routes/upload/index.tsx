import { useEffect, useState } from "react";
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
import { CircleX } from "lucide-react";
import { GLOBAL_BG } from "constant";
import { SelectedFilesList } from "~/components/selected-file";
import { encryptFileWithWorker, getHashParams } from "./upload.util";

const MAX_FREE_USER_UPLOAD_MB = import.meta.env.VITE_MAX_FREE_USER_UPLOAD_MB ?? 200 as number;

type UploadMode = "sequential" | "parallel";


function UploadPage() {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { iv, key } = getHashParams(window.location.hash)

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [uploadMode, setUploadMode] = useState<UploadMode>("sequential");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const user = useAuth.getState().user;
  const isFreeUser = user?.subscription?.planName === "free";

  const {
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const files = selectedFiles

  const {
    isError: isTokenInvalid,
    isLoading: isTokenValidating,
    error: tokenValidationError,
  } = useValidateTokenQuery(token || "");

  const { mutateAsync: uploadFilesMutation, isPending: isUploading } = useUploadS3Mutation();

  const { mutateAsync: UpdateDbS3 } = useUpdateS3UploadDB();
  const { addFile, updateStatus, setError } = useUploadStatusStore.getState();
  const fileStatusList = useUploadStatusStore((state) => state.uploads);

  useEffect(() => {
    if (!files || files.length === 0) {
      setTotalSize(0);
      return;
    }

    let size = 0;
    const existingStatus = useUploadStatusStore.getState().uploads;

    selectedFiles.forEach((file) => {
      size += file.size

      const existingFile = existingStatus.find((f) => f.name === file.name)
      if (!existingFile) {
        addFile({ id: file.name, name: file.name, progress: 0, status: "pending" });
      }

    });

    setTotalSize(size);

  }, [selectedFiles]);

  const processUploads = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    if (!files || files.length === 0) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    if (!key || !iv) {
      setErrorMessage("Missing encryption key or IV.");
      setIsProcessing(false);
      return;
    }

    const maxTotalSize = isFreeUser ? MAX_FREE_USER_UPLOAD_MB * 1024 * 1024 : Infinity;

    if (totalSize > maxTotalSize) {
      setErrorMessage(
        `can only upload up to 200MB. Your total is ${(totalSize / 1024 / 1024).toFixed(2)}MB.`
      );
      setIsProcessing(false)
      return;
    }

    if (uploadMode === "sequential") {
      await handleSequentialUpload();
    } else {
      await handleParallelUpload();
    }

    setIsProcessing(false);
  }


  const uploadSingleFile = async (file: File) => {
    const status = fileStatusList.find((f) => f.name === file.name);
    if (status?.status === "done") return;

    try {
      const mimeType = file.type || 'application/octet-stream';
      const { url, key: s3Key } = await getUploadUrl(mimeType, token, file.size);
      const encryptedBlob = await encryptFileWithWorker(file, key, iv);
      const encryptedFile = new File([encryptedBlob], file.name, { type: file.type });

      await uploadFilesMutation({ encryptFile: encryptedBlob, type: mimeType, url, name: file.name })
      await UpdateDbS3({ s3Key, size: encryptedFile.size, token, filename: file.name })

      updateStatus(file.name, "done");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(file.name, message ?? "error while upload this file");
      throw error;
    }
  };

  const handleSequentialUpload = async () => {
    for (const file of files) {
      try {
        await uploadSingleFile(file);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }
  };

  const handleParallelUpload = async () => {
    const uploadPromises = files.map(file => uploadSingleFile(file).catch(e => e));
    await Promise.all(uploadPromises);
  };

  if (!token)
    return (
      <div className={`h-screen w-full ${GLOBAL_BG}`}>
        {/* No token found. Please check your link again. */}
        <p className="text-center text-red-500 font-semibold py-20">
          Invalid or missing link. Please check your URL and try again.
        </p>
      </div>
    );


  if (isTokenValidating)
    return <div className="text-center bg-black w-ful h-screen text-gray-100">
      <Spinner size={20} color="white" />
    </div>;

  if (isTokenInvalid) {
    return (
      <div className="text-center bg-black w-full h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg font-medium">
          {tokenValidationError.message ?? "This link has expired or is invalid."}
        </p>
      </div>
    );
  }

  return (
    <div className={`text-white min-h-screen ${GLOBAL_BG}`}>
  <Header />
  
  <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div className="w-full">
      <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-xl shadow-xl space-y-6 text-white backdrop-blur-md">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Upload Files</h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Securely upload and share your files.
          </p>
        </div>
  
        <form onSubmit={handleSubmit(processUploads)} className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">Select Files</label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={(e) => setSelectedFiles(prev => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])])}
              className="w-full bg-white/10 text-white border border-white/10 px-3 py-2 text-sm rounded-md file:border-0 file:bg-gray-700 file:text-white hover:border-white/20"
            />
            {errors.files && (
              <p className="text-sm text-red-400 mt-1">{(errors.files as any).message || "Please select at least one file."}</p>
            )}
          </div>
  
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 p-3 rounded-md space-y-3 sm:space-y-0">
            <span className="text-sm text-gray-300">Upload Mode</span>
            <div className="flex items-center space-x-3">
              <span className={`text-sm ${uploadMode === 'sequential' ? 'text-white' : 'text-gray-500'}`}>Sequential</span>
              <button
                type="button"
                onClick={() => setUploadMode(prev => prev === 'sequential' ? 'parallel' : 'sequential')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${uploadMode === 'parallel' ? 'bg-purple-600' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${uploadMode === 'parallel' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm ${uploadMode === 'parallel' ? 'text-white' : 'text-gray-500'}`}>Parallel</span>
            </div>
          </div>
  
          {errorMessage && <p className="text-sm text-red-400 text-center">{errorMessage}</p>}
  
          <button
            type="submit"
            disabled={isUploading || !files?.length || isProcessing}
            className={`w-full py-3 text-sm font-semibold rounded-md transition duration-300 flex justify-center items-center ${isUploading || !files?.length || isProcessing
              ? "bg-white/10 cursor-not-allowed text-white/50"
              : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
          >
            {isProcessing ? <Spinner size={16} color="white" /> : "Upload"}
          </button>
        </form>
      </div>
    </div>

    {/* Selected Files List */}
    {files.length > 0 && (
      <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-xl w-full max-h-[30rem] overflow-auto space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-white text-lg font-medium">Selected Files</h2>
          <button onClick={() => { setSelectedFiles([]); reset() }} className="text-gray-400 hover:text-white transition-colors">
            <CircleX size={20} />
          </button>
        </div>
        <SelectedFilesList files={files} />
      </div>
    )}
  </div>
</div>

  );
}

export default UploadPage;