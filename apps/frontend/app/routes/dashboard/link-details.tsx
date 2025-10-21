import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useUserFilesQuery } from '~/service/api';
import { decryptAndDownloadFileWithCrypto } from '~/utils/encrypt-decrypt';
import type { FileItem } from 'types/types';
import { FileCard } from '~/components/file-card';
import Spinner from '~/components/spinner';
import { toast } from 'sonner';

const hashParams = new URLSearchParams(window.location.hash.slice(1));
const hashKey = hashParams.get("key") || "";
const hashIv = hashParams.get("iv") || "";

function LinkPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { id } = useParams();

  const [page, setPage] = useState<number>(1);
  const [key, setKey] = useState(hashKey);
  const [iv, setIv] = useState(hashIv);
  const [inputValue, setInputValue] = useState("");
  const [showKeyIvInput, setShowKeyIvInput] = useState(false);

  const limit = 10;

  const { data, isError, error, isLoading, refetch } = useUserFilesQuery(Number(id), token, page, limit);
  const files = data?.data;
  const currentPage = data?.page;

  useEffect(() => {
    refetch();
  }, [page]);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Spinner size={28} /></div>;
  if (isError) return <p className="h-full flex justify-center items-center p-4 text-red-400">{error.message}</p>;

  const loadNextPage = () => setPage((prev) => prev + 1);
  const loadPrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const handleKeyIvInput = () => {
    try {
      const parsed = JSON.parse(inputValue.trim());
      if (parsed.key && parsed.iv) {
        setKey(parsed.key);
        setIv(parsed.iv);
        toast.success("Key and IV set successfully!");
        setShowKeyIvInput(false); // Hide on success
        setInputValue(""); // Clear input
      } else {
        toast.error("Key or IV missing in input");
      }
    } catch (e) {
      toast.error("Invalid JSON format. Please ensure the input is valid.");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto min-h-screen text-white">
        <h3 className="text-sm text-yellow-400 text-center mb-4 max-w-3xl mx-auto">
          ⚠️ Please note: When you click "Decrypt", the file will first be downloaded and then decrypted in your browser.
          This process may take some time depending on the file size and your device performance.
          Please do not close or refresh the tab while decryption is in progress.
        </h3>

        {showKeyIvInput ? (
          <div className="mb-6 p-4 border border-yellow-500/50 rounded-lg bg-yellow-900/20 backdrop-blur-sm">
            <p className="text-sm mb-2 text-yellow-300">Paste your backup JSON (with key and iv):</p>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={4}
              className="w-full p-2 rounded bg-gray-800 text-white border border-white/20 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              placeholder={`{"key":"...","iv":"..."}`}
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleKeyIvInput}
                className="px-4 py-1 bg-blue-600 text-black rounded hover:bg-blue-400 transition-colors"
              >
                Set Key
              </button>
              <button
                onClick={() => setShowKeyIvInput(false)}
                className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 flex justify-end">
            <button onClick={() => setShowKeyIvInput(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-sm">
              Add Backup Key/IV
            </button>
          </div>
        )}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file: FileItem) => (
            <FileCard
              key={file.id}
              file={file}
              iv={iv}
              token={token}
              ivkey={key}
            />
          ))}
        </div>

        {!files?.length && (
          <div className='flex justify-center items-center'>
            <p className="p-4 text-gray-300">No files available.</p>
          </div>
        )}

        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
            onClick={loadPrevPage}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-white">Page {currentPage}</span>
          <button
            className="px-3 py-1 bg-gray-700 rounded"
            onClick={loadNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default LinkPage;
