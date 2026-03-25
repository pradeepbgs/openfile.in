import { useUploadStatusStore } from "~/zustand/upload-status-store";
import { filesize } from "filesize";
import { CheckCircle, XCircle, Loader } from "lucide-react";

function getFileExt(name: string) {
    return name.split('.').pop()?.toUpperCase() ?? 'FILE';
}

export function SelectedFilesList({ files }: { files: File[] | undefined }) {
    const fileStatusList = useUploadStatusStore((state) => state.uploads);
    const errors = useUploadStatusStore((state) => state.errors);

    if (!files || files.length === 0) return null;

    return (
        <div className="space-y-2">
            {files.map((file) => {
                const status = fileStatusList.find((f) => f.name === file.name);
                const isDone = status?.status === "done";
                const isError = status?.status === "error";
                const isUploading = status?.status === "uploading";

                return (
                    <div key={file.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                        {/* Ext badge */}
                        <div className="w-10 h-10 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] font-bold text-gray-400 font-mono">{getFileExt(file.name)}</span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{filesize(file.size)}</p>

                            {status && (
                                <div className="mt-1.5">
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isError ? "bg-red-500" : isDone ? "bg-green-500" : "bg-purple-500"
                                            }`}
                                            style={{ width: isDone ? '100%' : `${status.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {errors?.[file.name] && (
                                <p className="text-xs text-red-400 mt-1">{errors[file.name]}</p>
                            )}
                        </div>

                        {/* Status icon */}
                        {status && (
                            <div className="flex-shrink-0">
                                {isDone && <CheckCircle size={18} className="text-green-400" />}
                                {isError && <XCircle size={18} className="text-red-400" />}
                                {isUploading && <Loader size={18} className="text-purple-400 animate-spin" />}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
