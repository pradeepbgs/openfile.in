import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Copy, Check, Link2, Download, Shield } from "lucide-react";
import { downloadKeyFile } from "~/utils/dowload-key";
import { useNavigate } from "react-router";
import { useCreateLinkMutation } from "~/service/api";
import Spinner from "~/components/spinner";
import { generateKeyAndIVWithWebCrypto } from "~/utils/encrypt-decrypt";
import { useAuth } from "~/zustand/store";
import { saveCryptoSecret } from "~/utils/crypto-store";
import { toast } from "sonner";

const createLinkSchema = z.object({
  maxUploads: z.number({ required_error: "Max uploads is required" }).min(1),
  allowedFileType: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
  name: z.string().optional(),
});

type CreateLinkData = z.infer<typeof createLinkSchema>;
type TimeUnit = "minutes" | "hours" | "days";

export default function CreateLinkPage() {
  const user = useAuth.getState().user;
  const userPlan = user?.subscription?.planName || 'free';
  const maxUploadVal =
    userPlan === "free" ? 3 : userPlan === "pro" ? 5 : userPlan === "enterprise" ? 10 : 1;

  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [relativeTime, setRelativeTime] = useState<Record<string, string>>({ value: "1", unit: "hours" });
  const [shouldDownloadKey, setShouldDownloadKey] = useState<boolean>(true);
  const [shouldExpireLinkAfterFirstUpload, setShouldExpireLinkAfterFirstUpload] = useState<boolean>(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const { mutateAsync: createLink, isError: isCreateLinkError, error: createLinkError, isPending: isCreateLinkPending } = useCreateLinkMutation();

  const handleCopy = () => {
    if (!uploadUrl) return;
    navigator.clipboard.writeText(uploadUrl);
    setCopied(true);
    toast('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const onSubmit = async (data: CreateLinkData) => {
    let expiresAt: string | undefined;
    if (relativeTime.value) {
      const now = new Date();
      const amount = parseInt(relativeTime.value);
      if (relativeTime.unit === "minutes") now.setMinutes(now.getMinutes() + amount);
      if (relativeTime.unit === "hours") now.setHours(now.getHours() + amount);
      if (relativeTime.unit === "days") now.setDate(now.getDate() + amount);
      expiresAt = now.toISOString();
    } else {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 10);
      expiresAt = now.toISOString();
    }

    const { iv, key: secretKey } = await generateKeyAndIVWithWebCrypto();
    const payload = { ...data, expiresAt, expireAfterFirstUpload: shouldExpireLinkAfterFirstUpload };

    try {
      interface Result { uploadUrl?: string; token?: string; }
      const result: Result | void = await createLink({ payload, navigate, secretKey, iv });
      if (result) {
        const { token } = result;
        const fullLink = `${import.meta.env.VITE_UPLOAD_URL}?token=${token}#key=${secretKey}&iv=${iv}`;
        setUploadUrl(fullLink);
        toast('Secure link created');
        saveCryptoSecret(token!, { iv, key: secretKey });
        shouldDownloadKey && downloadKeyFile(fullLink, secretKey, iv);
      }
    } catch (err) {
      console.error("Failed to create link");
      toast.error("Failed to create link");
    }
  };

  const inputClass = "w-full bg-white/5 border border-white/10 text-white placeholder-gray-600 px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors";
  const labelClass = "block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen text-white flex flex-col items-center px-4 py-8">
      {/* Page header */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className="text-purple-400" />
          <h1 className="text-xl font-bold text-white">Create Secure Link</h1>
        </div>
        <p className="text-gray-500 text-sm">Generate an encrypted upload link to privately receive files.</p>
      </div>

      <div className="w-full max-w-lg space-y-4">
        {/* Form card */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div>
              <label className={labelClass}>
                Link name <span className="text-gray-600 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Client project files"
                {...register("name")}
                className={inputClass}
              />
            </div>

            {/* Max uploads + Expiry — row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Max uploads</label>
                <input
                  type="number"
                  defaultValue={maxUploadVal}
                  {...register("maxUploads", { valueAsNumber: true })}
                  className={inputClass}
                />
                {errors.maxUploads && (
                  <p className="text-xs text-red-400 mt-1">{errors.maxUploads.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Expires in</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    value={relativeTime.value}
                    onChange={(e) => setRelativeTime({ ...relativeTime, value: e.target.value })}
                    className="w-16 bg-white/5 border border-white/10 text-white px-2 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                  <select
                    value={relativeTime.unit}
                    onChange={(e) => setRelativeTime({ ...relativeTime, unit: e.target.value as TimeUnit })}
                    className="flex-1 bg-white/5 border border-white/10 text-white px-2 py-2 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  >
                    <option value="minutes" className="bg-gray-900">Minutes</option>
                    <option value="hours" className="bg-gray-900">Hours</option>
                    <option value="days" className="bg-gray-900">Days</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              <label className={labelClass}>Options</label>

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/3 transition-colors">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={shouldDownloadKey}
                    onChange={(e) => setShouldDownloadKey(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${shouldDownloadKey ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-white/20'}`}>
                    {shouldDownloadKey && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Download encryption key file</span>
                  <p className="text-xs text-gray-600 mt-0.5">Save the key/IV backup to your device</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group p-3 rounded-xl hover:bg-white/3 transition-colors">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={shouldExpireLinkAfterFirstUpload}
                    onChange={(e) => setShouldExpireLinkAfterFirstUpload(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${shouldExpireLinkAfterFirstUpload ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-white/20'}`}>
                    {shouldExpireLinkAfterFirstUpload && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Expire after first upload</span>
                  <p className="text-xs text-gray-600 mt-0.5">Link becomes invalid after one use</p>
                </div>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || isCreateLinkPending}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2.5 text-sm font-semibold disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20"
            >
              {isCreateLinkPending ? (
                <><Spinner size={15} /> Generating...</>
              ) : (
                <><Link2 size={15} /> Generate Link</>
              )}
            </button>
          </form>
        </div>

        {/* Output card */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Generated Link</p>

          {isCreateLinkError && (
            <p className="text-red-400 text-sm mb-3">
              {createLinkError instanceof Error ? createLinkError.message : String(createLinkError)}
            </p>
          )}

          {uploadUrl ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8">
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 break-all text-sm underline-offset-2 hover:underline flex-1"
                >
                  {uploadUrl.length > 80 ? `${uploadUrl.substring(0, 80)}...` : uploadUrl}
                </a>
                <button
                  onClick={handleCopy}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  title="Copy link"
                >
                  {copied
                    ? <Check size={15} className="text-green-400" />
                    : <Copy size={15} className="text-gray-400" />
                  }
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/8 border border-white/8 text-gray-300 hover:text-white transition-colors"
                >
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button
                  onClick={() => downloadKeyFile(uploadUrl, '', '')}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg bg-white/5 hover:bg-white/8 border border-white/8 text-gray-300 hover:text-white transition-colors"
                >
                  <Download size={14} />
                  Key
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-white/10 text-center">
              <Link2 size={20} className="text-gray-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Your generated link will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
