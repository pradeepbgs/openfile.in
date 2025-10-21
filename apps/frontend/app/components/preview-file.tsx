import React from "react";
import type { FileItem } from "types/types";

type PreviewFileProps = {
  file: FileItem;
  previewUrl: string | null;
  isLoading: boolean;
};

function PreviewFile({ file, previewUrl, isLoading }: PreviewFileProps) {
  const isImage = /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(file.name);
  const isVideo = /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(file.name);

  if (!isImage && !isVideo) {
    return (
      <div className="flex items-center justify-center bg-gray-800/40 rounded-xl h-32 text-gray-400 text-sm">
        No preview available
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-gray-800/40 rounded-xl h-32 text-gray-400 text-sm">
        Decrypting preview...
      </div>
    );
  }

  if (!previewUrl) return null;

  return (
    <div className="flex justify-center mt-2 w-full">
      {isImage ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="rounded-xl max-h-60 w-full object-contain border border-white/10"
        />
      ) : (
        <video
          src={previewUrl}
          controls
          muted
          className="w-full max-h-60 object-contain bg-black rounded-xl"
          disablePictureInPicture
        />
      )}
    </div>
  );
}

export default React.memo(PreviewFile);