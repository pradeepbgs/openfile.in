import { FiDownload } from "react-icons/fi";
import type { FileItem } from "types/types";
import Spinner from "./spinner";

type FileCardProps = {
  file: FileItem;
  onDownload: () => void;
  isDecrypting: boolean;
};

export function FileCard({ file, onDownload, isDecrypting }: FileCardProps) {
  return (
    <div className="bg-white/5 border border-white/20 rounded-2xl shadow-md p-4 flex flex-col justify-between gap-2 hover:shadow-lg transition-all">
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-white truncate">{file.name}</p>
        <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <button
        onClick={onDownload}
        disabled={isDecrypting}
        className="flex items-center  cursor-pointer justify-center gap-2 mt-2 py-2 px-4 text-sm rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {
          isDecrypting ? <Spinner size={19} color="white" /> : (
            <>
              <FiDownload size={16} />
              Download
            </>
          )
        }
      </button>
    </div>
  );
}
