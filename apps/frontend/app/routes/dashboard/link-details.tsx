import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { useUserFilesQuery, useDeleteFile } from '~/service/api';
import type { FileItem } from 'types/types';
import { FileCard } from '~/components/file-card';
import Spinner from '~/components/spinner';
import { toast } from 'sonner';
import { ArrowLeft, Key, AlertTriangle, Files } from 'lucide-react';

function LinkPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [key, setKey] = useState('');
  const [iv, setIv] = useState('');
  const [inputValue, setInputValue] = useState("");
  const [showKeyIvInput, setShowKeyIvInput] = useState(false);

  const limit = 10;

  const { data, isError, error, isLoading, refetch } = useUserFilesQuery(id ?? '', token, page, limit);
  const files = data?.data;
  const currentPage = data?.page;

  const { mutateAsync: deleteFile } = useDeleteFile();
  const handleDeleteFile = async (file: FileItem) => {
    try {
      await deleteFile({ linkId: id ?? '', fileId: file.id });
      toast.success('File deleted');
      refetch();
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hashKey = hashParams.get("key");
    const hashIv = hashParams.get("iv");
    if (hashKey && hashIv) { setKey(hashKey); setIv(hashIv); }
  }, []);

  useEffect(() => { refetch(); }, [page]);

  if (isLoading) return (
    <div className="min-h-screen flex justify-center items-center">
      <Spinner size={28} />
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-400">{error.message}</p>
      </div>
    </div>
  );

  const loadNextPage = () => setPage((prev) => prev + 1);
  const loadPrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const handleKeyIvInput = () => {
    try {
      const parsed = JSON.parse(inputValue.trim());
      if (parsed.key && parsed.iv) {
        setKey(parsed.key);
        setIv(parsed.iv);
        toast.success("Key and IV set successfully!");
        setShowKeyIvInput(false);
        setInputValue("");
      } else {
        toast.error("Key or IV missing in input");
      }
    } catch (e) {
      toast.error("Invalid JSON format. Please ensure the input is valid.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen text-white px-4 py-6">
      {/* Back + Key button row */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={() => setShowKeyIvInput(!showKeyIvInput)}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 hover:text-white transition-colors"
        >
          <Key size={14} />
          {showKeyIvInput ? 'Cancel' : 'Add Backup Key/IV'}
        </button>
      </div>

      {/* Decrypt warning */}
      <div className="flex items-start gap-2.5 p-4 mb-6 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-300/80 text-sm max-w-3xl">
        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5 text-amber-400" />
        <p>
          When you click <strong className="text-amber-300">Decrypt</strong>, the file is downloaded and decrypted in your browser.
          This may take time depending on file size. Do not close or refresh the tab during decryption.
        </p>
      </div>

      {/* Key/IV input panel */}
      {showKeyIvInput && (
        <div className="mb-6 p-5 border border-white/10 rounded-2xl bg-white/4 backdrop-blur-sm">
          <p className="text-sm text-gray-300 mb-3 font-medium">Paste your backup JSON (with key and iv):</p>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-black/40 text-white border border-white/10 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-sm font-mono resize-none"
            placeholder={`{"key":"...","iv":"..."}`}
            autoFocus
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleKeyIvInput}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg transition-colors font-medium"
            >
              Set Key/IV
            </button>
            <button
              onClick={() => setShowKeyIvInput(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* File grid */}
      {files?.length > 0 ? (
        <>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file: FileItem) => (
              <FileCard key={file.id} file={file} iv={iv} token={token} ivkey={key} onDelete={handleDeleteFile} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-3">
            <button
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm disabled:opacity-40 transition-colors"
              onClick={loadPrevPage}
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">Page {currentPage}</span>
            <button
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm disabled:opacity-40 transition-colors"
              onClick={loadNextPage}
              disabled={files.length < limit}
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <Files size={22} className="text-gray-600" />
          </div>
          <p className="text-gray-400 font-medium mb-1">No files uploaded yet</p>
          <p className="text-gray-600 text-sm">Share the upload link to receive encrypted files.</p>
        </div>
      )}
    </div>
  );
}

export default LinkPage;
