import React from "react";
import type { FileItem } from "types/types";

type PreviewFileProps = {
  file: FileItem;
  previewUrl: string | null;
  isLoading: boolean;
};

const isImage = (name: string) => /\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i.test(name);
const isVideo = (name: string) => /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(name);

export const isPreviewable = (name: string) => isImage(name) || isVideo(name);

function PreviewFile({ file, previewUrl, isLoading }: PreviewFileProps) {
  if (!isPreviewable(file.name)) {
    return (
      <div className="flex items-center justify-center bg-[#FFF8E7] rounded-lg h-32 text-black/50 text-sm font-bold">
        Preview not supported for this file type
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-[#FFF8E7] rounded-lg h-32 text-black/50 text-sm font-bold">
        Decrypting preview...
      </div>
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
