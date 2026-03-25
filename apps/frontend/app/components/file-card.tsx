import { Download, Eye, EyeOff } from "lucide-react";
import { filesize } from 'filesize';
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

function getFileExt(name: string) {
  return name.split('.').pop()?.toUpperCase() ?? 'FILE';
}

function getExtColor(ext: string): string {
  const images = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG', 'AVIF'];
  const videos = ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM'];
  const docs = ['PDF', 'DOC', 'DOCX', 'TXT', 'MD'];
  const code = ['JS', 'TS', 'TSX', 'JSX', 'PY', 'GO', 'RS', 'JSON'];
  const archives = ['ZIP', 'RAR', 'TAR', 'GZ', '7Z'];
  if (images.includes(ext)) return 'bg-blue-500/20 text-blue-300';
  if (videos.includes(ext)) return 'bg-pink-500/20 text-pink-300';
  if (docs.includes(ext)) return 'bg-orange-500/20 text-orange-300';
  if (code.includes(ext)) return 'bg-green-500/20 text-green-300';
  if (archives.includes(ext)) return 'bg-yellow-500/20 text-yellow-300';
  return 'bg-white/10 text-gray-400';
}

export function FileCard({ file, iv, ivkey, token }: FileCardProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [decryptedBlob, setDecryptedBlob] = useState<Blob | null>(null);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const ext = getFileExt(file.name);

  const handleDecrypt = async () => {
    if (decryptedBlob) return;
    if (iv === "undefined" || ivkey === "undefined") {
      toast.error("No Key/IV found — please add your backup Key/IV.");
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
      toast.error("Failed to decrypt file. Check your key/IV.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTogglePreview = async () => {
    if (showPreview) {
      setShowPreview(false);
    } else {
      setShowPreview(true);
      if (!decryptedBlob) await handleDecrypt();
    }
  };

  const handleDownload = async () => {
    if (decryptedBlob) {
      const link = document.createElement("a");
      link.href = decryptedUrl!;
      link.download = file.name;
      link.click();
      return;
    }
    if (iv === "undefined" || ivkey === "undefined") {
      toast.error("No Key/IV found — please add your backup Key/IV.");
      return;
    }
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
  };

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl p-4 flex flex-col gap-3 hover:border-white/15 hover:bg-white/6 transition-all duration-200">
      {/* File info */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getExtColor(ext)}`}>
          <span className="text-[9px] font-bold font-mono">{ext}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate" title={file.name}>{file.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{filesize(file.size)}</p>
        </div>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="rounded-xl overflow-hidden border border-white/8 bg-black/20">
          <PreviewFile file={file} previewUrl={decryptedUrl} isLoading={isProcessing} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={handleTogglePreview}
          disabled={isProcessing && !decryptedUrl}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-lg text-gray-300 bg-white/5 hover:bg-white/10 border border-white/8 transition-colors disabled:opacity-40"
        >
          {isProcessing && !decryptedUrl ? (
            <Spinner size={13} color="white" />
          ) : showPreview ? (
            <><EyeOff size={13} /> Hide</>
          ) : (
            <><Eye size={13} /> Preview</>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={isProcessing}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs rounded-lg text-white bg-indigo-600/80 hover:bg-indigo-600 border border-indigo-500/30 transition-colors disabled:opacity-40"
        >
          {isProcessing ? (
            <Spinner size={13} color="white" />
          ) : (
            <><Download size={13} /> Download</>
          )}
        </button>
      </div>
    </div>
  );
}
