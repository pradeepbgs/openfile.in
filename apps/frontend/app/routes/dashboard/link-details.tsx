import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useUserFilesQuery } from '~/service/api';
import { decryptAndDownloadFileWithCrypto } from '~/utils/encrypt-decrypt';
import type { FileItem } from 'types/types';
import { FileCard } from '~/components/file-card';
import Spinner from '~/components/spinner';

function LinkPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { id } = useParams();

  const [page, setPage] = useState<number>(1);
  const [decryptingFileId, setDecryptingFileId] = useState<number | null>(null);
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [inputValue, setInputValue] = useState("");

  const limit = 10;

  // Try to get key and iv from URL hash
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hashKey = hashParams.get("key") || "";
    const hashIv = hashParams.get("iv") || "";
    setKey(hashKey);
    setIv(hashIv);
  }, []);

  const { data, isError, error, isLoading, refetch } = useUserFilesQuery(Number(id), token, page, limit);
  const files = data?.data;
  const currentPage = data?.page;

  useEffect(() => {
    refetch();
  }, [page]);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Spinner size={28} /></div>;
  if (isError) return <p className="h-full flex justify-center items-center p-4 text-red-400">{error.message}</p>;

  const handleDecryptDownload = async (file: FileItem) => {
    setDecryptingFileId(file.id);
    try {
      await decryptAndDownloadFileWithCrypto(file, file.name, token, key, iv);
    } finally {
      setDecryptingFileId(null);
    }
  };

  const loadNextPage = () => setPage((prev) => prev + 1);
  const loadPrevPage = () => setPage((prev) => Math.max(1, prev - 1));

  const handleKeyIvInput = () => {
    try {
      const parsed = JSON.parse(inputValue.trim());
      if (parsed.key && parsed.iv) {
        setKey(parsed.key);
        setIv(parsed.iv);
        alert("Key and IV set successfully!");
      } else {
        alert("Key or IV missing in input");
      }
    } catch (e) {
      alert("Invalid JSON format. Please ensure the input is valid.");
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

        <div className="mb-6 p-4 border border-yellow-500 rounded ">
          <p className="text-sm mb-2 text-yellow-300">Paste your backup JSON (with key and iv):</p>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            rows={4}
            className="w-full p-2 rounded"
            placeholder={`{"key":"...","iv":"..."}`}
          />
          <button
            onClick={handleKeyIvInput}
            className="mt-2 px-4 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400"
          >
            Add
          </button>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {files.map((file: FileItem) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={() => handleDecryptDownload(file)}
              isDecrypting={decryptingFileId === file.id}
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
