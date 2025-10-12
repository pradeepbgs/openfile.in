import { useUploadStatusStore } from "~/zustand/upload-status-store";

export function SelectedFilesList({ files }: { files: File[] | undefined }) {
    const fileStatusList = useUploadStatusStore((state) => state.uploads);
    const errors = useUploadStatusStore((state) => state.errors); // ✅ added

    if (!files || files.length === 0) return null;

    return (
        <div>
            {
            files.map((file) => {
                const status = fileStatusList.find((f) => f.name === file.name);
                return (
                    <div key={file.name} className="text-white text-sm border-b border-white/10 pb-2">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-gray-400 text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {status && (
                            <div className="mt-1">
                                <div className="w-full bg-white/10 h-2 rounded overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 
                      ${status.status === "error"
                                                ? "bg-red-500"
                                                : status.status === "done"
                                                    ? "bg-green-500"
                                                    : "bg-purple-500"
                                            }`}
                                        style={{ width: `${status.progress}%` }}
                                    />
                                </div>
                                <p
                                    className={`text-xs 
                    ${status.status === "error"
                                            ? "text-red-500"
                                            : status.status === "done"
                                                ? "text-green-500"
                                                : "text-purple-300"}
                    mt-1 capitalize`}
                                >
                                    {status.status}
                                </p>

                                {errors?.[file.name] && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors[file.name]}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
