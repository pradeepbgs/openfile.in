import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
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
  const userPlan = user?.subscription?.planName || 'free'
  const maxUploadVal =
    userPlan === "free" ? 3 : userPlan === "pro" ? 5 : userPlan === "enterprise" ? 10 : 1;

  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [relativeTime, setRelativeTime] = useState<Record<string, string>>({
    value: "1",
    unit: "hours",
  });

  const [shouldDownloadKey, setShouldDownloadKey] = useState<boolean>(false);
  const [shouldExpireLinkAfterFirstUpload, setShouldExpireLinkAfterFirstUpload] = useState<boolean>(false)

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateLinkData>({
    resolver: zodResolver(createLinkSchema),
  });

  const {
    mutateAsync: createLink,
    isError: isCreateLinkError,
    error: createLinkError,
    isPending: isCreateLinkPending,
  } = useCreateLinkMutation();

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

    const { iv, key: secretKey } = await generateKeyAndIVWithWebCrypto()
    const payload = {
      ...data,
      expiresAt,
      expireAfterFirstUpload: shouldExpireLinkAfterFirstUpload
    };

    try {
      interface Result {
        uploadUrl?: string;
        token?: string;
      }
      const result: Result | void = await createLink({ payload, navigate, secretKey, iv });
      if (result) {
        const { token, uploadUrl } = result;
        const fullLink = `${uploadUrl}#key=${secretKey}&iv=${iv}`;
        setUploadUrl(fullLink);
        toast('secure link created successfully')
        saveCryptoSecret(token!, { iv, key: secretKey })
        shouldDownloadKey && downloadKeyFile(fullLink, secretKey, iv);
      }
    } catch (err) {
      console.error("Failed to create link");
    }
  };

  return (
    <div className="min-h-screen  text-white flex flex-col  items-center px-4 py-6">
      <h1 className="md:text-3xl text-[1.3rem] font-extrabold text-center mb-6 text-white">
        Create Secure Upload Link
      </h1>

      <div className="max-w-5xl md:w-[60%] gap-6 border border-white/10 rounded-md p-6 shadow-lg bg-white/5 text-white">
        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Uploads + Expiry */}
          <div className="flex flex-col md:flex-row gap-4">
            <div>
              <label htmlFor="">Name ( optional )</label>
              <input
                type="text"
                {...register("name")}
                className="w-full border border-white/10 bg-white/10 text-white px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max Uploads
              </label>
              <input
                type="number"
                defaultValue={maxUploadVal}
                {...register("maxUploads", { valueAsNumber: true })}
                className="w-24 border border-white/10 bg-white/10 text-white px-2 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.maxUploads && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.maxUploads.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Expires In
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="1"
                  value={relativeTime.value}
                  onChange={(e) =>
                    setRelativeTime({ ...relativeTime, value: e.target.value })
                  }
                  className="w-24 border border-white/10 bg-white/10 text-white px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={relativeTime.unit}
                  onChange={(e) =>
                    setRelativeTime({
                      ...relativeTime,
                      unit: e.target.value as TimeUnit,
                    })
                  }
                  className="border border-white/10 bg-white/10 text-white px-2 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="minutes" className="text-black">Minutes</option>
                  <option value="hours" className="text-black">Hours</option>
                  <option value="days" className="text-black">Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Download checkbox + Generate key */}
          <div className="flex flex-wrap items-center gap-4">

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={shouldDownloadKey}
                onChange={(e) => setShouldDownloadKey(e.target.checked)}
              />
              <label className="ml-2 text-sm text-gray-300">Download key & IV?</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={shouldExpireLinkAfterFirstUpload}
                onChange={(e) => setShouldExpireLinkAfterFirstUpload(e.target.checked)}
              />
              <label className="ml-2 text-sm text-gray-300">Expire after first upload?</label>
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm disabled:opacity-60 transition duration-300"
          >
            {isCreateLinkPending ? <Spinner size={15} /> : "Generate Link"}
          </button>
        </form>

        <hr className="border-white/10 my-6" />

        {/* OUTPUT LINK */}
        <div className="space-y-4 mt-4">

          {isCreateLinkError && (
            <p className="text-red-400 text-center">
              {createLinkError instanceof Error ? createLinkError.message : String(createLinkError)}
            </p>
          )}


          <div className="w-full border border-white/10 rounded-md p-4 text-sm break-words bg-white/5 backdrop-blur text-white">
            {uploadUrl ? (
              <div className="flex items-start gap-4">
                <FaCopy
                  size={22}
                  className="mt-1 cursor-pointer text-gray-400 hover:text-white"
                  onClick={() => navigator.clipboard.writeText(uploadUrl)}
                />
                <a
                  href={uploadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 break-all underline"
                >
                  {uploadUrl}
                </a>
              </div>
            ) : (
              <p className="text-gray-400">Your generated link will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
