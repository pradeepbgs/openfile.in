import React from "react";
import { FileX } from "lucide-react";
import type { FileItem } from "types/types";
import Spinner from "./spinner";

type PreviewFileProps = {
  file: FileItem;
  previewUrl: string | null;
  isLoading: boolean;
};

const isImage = (name: string) => /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(name);
const isVideo = (name: string) => /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(name);

export const isPreviewable = (name: string) => isImage(name) || isVideo(name);

function PreviewPlaceholder({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 h-32 mt-2 mb-2 mx-2 px-4 rounded-lg border-2 border-black bg-white/50 text-black/50 text-sm font-bold text-center">
      {children}
      <span>{label}</span>
    </div>
  );
}

function PreviewFile({ file, previewUrl, isLoading }: PreviewFileProps) {
  if (!isPreviewable(file.name)) {
    return (
      <PreviewPlaceholder label="Preview not supported for this file type">
        <FileX size={22} className="text-black/30" />
      </PreviewPlaceholder>
    );
  }

  if (isLoading) {
    return (
      <PreviewPlaceholder label="Decrypting preview...">
        <Spinner size={22} color="black" />
      </PreviewPlaceholder>
    );
  }

  if (!previewUrl) return null;

  return (
    <div className="flex justify-center mt-2 w-full">
      {isImage(file.name) ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="rounded-lg max-h-60 w-full object-contain border-2 border-black"
        />
      ) : (
        <video
          src={previewUrl}
          controls
          muted
          className="w-full max-h-60 object-contain bg-black rounded-lg border-2 border-black"
          disablePictureInPicture
        />
      )}
    </div>
  );
}

export default React.memo(PreviewFile);
