import { FiDownload } from "react-icons/fi";
import type { FileItem } from "types/types";
import { useState } from "react";
import { decryptAndDownloadFileWithCrypto } from "~/utils/encrypt-decrypt";
import Spinner from "./spinner";
import PreviewFile from "./preview-file";
import { toast } from "sonner";

type FileCardProps = {
  file: FileItem;
  token: string;
  iv: string;
  ivkey: string;
};

export function FileCard({ file, iv, ivkey, token }: FileCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDecrypt = async () => {
    if (decryptedBlob) return;

    if (iv === "undefined" || ivkey === "undefined") {
      toast.error("No Iv/Key found, please add Iv/Key");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const blob = await decryptAndDownloadFileWithCrypto(file, file.name, token, ivkey, iv);
      if (blob) {
        setDecryptedBlob(blob);
        setDecryptedUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Decryption failed:", error);
      toast.error("Failed to decrypt file. Check your key/IV or the console for more details.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTogglePreview = async () => {
    if (showPreview) {
      setShowPreview(false);
      // if (decryptedUrl) URL.revokeObjectURL(decryptedUrl);
      // setDecryptedBlob(null);
      // setDecryptedUrl(null);
    }
    else {
      setShowPreview(true);
      if (!decryptedBlob) await handleDecrypt();
    }
  };

  const handleDownload = async () => {
    // if we already have decrypted blob then just download that.
    if (decryptedBlob) {
      const link = document.createElement("a");
      link.href = decryptedUrl!;
      link.download = file.name;
      link.click();
    }
    
    if (iv === "undefined" || ivkey === "undefined") {
      toast.error("No Iv/Key found, please add Iv/Key");
      return;
    }
    // othwrwise do this.
    else {
      setIsProcessing(true);
      try {
        const blob = await decryptAndDownloadFileWithCrypto(file, file.name, token, ivkey, iv);
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name;
          link.click();
          URL.revokeObjectURL(url);
        }
      } catch (error) {
        console.error("Decryption for download failed:", error);
        toast.error("Failed to decrypt and download file.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="bg-white/5 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col justify-between gap-2 hover:shadow-lg transition-all">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-white truncate">{file.name}</p>
        <p className="text-sm text-gray-400">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>

      {showPreview && <PreviewFile file={file} previewUrl={decryptedUrl} isLoading={isProcessing} />}

      <button
        onClick={handleTogglePreview}
        disabled={isProcessing && !decryptedUrl}
        className="flex items-center justify-center gap-2 py-2 px-4 text-sm rounded-xl text-white bg-gray-700 hover:bg-gray-800 transition disabled:opacity-50"
      >
        {isProcessing && !decryptedUrl ? (
          <Spinner size={18} color="white" />
        ) : showPreview ? (
          "Hide Preview"
        ) : (
          "Show Preview"
        )}
      </button>

      <button
        onClick={handleDownload}
        disabled={isProcessing}
        className="flex items-center justify-center gap-2 mt-2 py-2 px-4 text-sm rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {isProcessing ? (
          <Spinner size={19} color="white" />
        ) : (
          <>
            <FiDownload size={16} />
            Download
          </>
        )}
      </button>
    </div>
  );
}
