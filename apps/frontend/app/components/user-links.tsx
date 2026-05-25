import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import type { LinkItem } from 'types/types';
import { formatDistanceToNow, isBefore } from 'date-fns';
import AlertMenu from './alert-menu';
import { useDeleteLink } from '~/service/api';
import { getCryptoSecret } from '~/utils/crypto-store';
import { toast } from "sonner";
import { Copy, ExternalLink, RefreshCw, Link2, Plus } from "lucide-react";

function UserLinks({ links, handleRefresh }: { links: LinkItem[], handleRefresh: () => void }) {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [secretsMap, setSecretsMap] = useState<Record<string, { key: string, iv: string }>>({});

  const navigate = useNavigate();

  const handleCopyLink = (linkToCopy: string) => {
    navigator.clipboard.writeText(linkToCopy);
    toast("Copied to clipboard");
  };

  const route = (linkId: string, token: string, secret: { key: string, iv: string }) => {
    navigate(`/dashboard/link/${linkId}?token=${token}#key=${secret?.key}&iv=${secret?.iv}`);
  };

  const { mutateAsync: deleteLink } = useDeleteLink();
  const handleLinkDelete = async (id: string) => {
    await deleteLink(id);
    toast("Link deleted");
    handleRefresh();
  };

  const handleRefreshLink = async () => {
    setSpinning(true);
    try { handleRefresh(); }
    catch (error: any) { console.error("Refresh failed", error?.message); }
    finally { setTimeout(() => setSpinning(false), 300); }
  };

  useEffect(() => {
    const loadSecrets = async () => {
      const newSecrets: Record<string, { key: string, iv: string }> = {};
      for (const link of links) {
        const secret = await getCryptoSecret(link.token);
        if (secret) newSecrets[link.token] = secret;
      }
      setSecretsMap(newSecrets);
    };
    loadSecrets();
  }, []);

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#222222] flex items-center justify-center mb-4">
          <Link2 size={20} className="text-neutral-600" />
        </div>
        <p className="text-neutral-300 font-medium mb-1">No links yet</p>
        <p className="text-neutral-600 text-sm mb-6">Create your first secure upload link to get started.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm rounded-lg font-medium hover:bg-neutral-100 transition-colors"
        >
          <Plus size={14} />
          Create Link
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-white">Your Links</h2>
        <button
          onClick={handleRefreshLink}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-[#1a1a1a]"
        >
          <RefreshCw size={12} className={`transition-transform duration-500 ${spinning ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-[#222222] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#222222] bg-[#161616]">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">Link</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">Uploads</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide hidden sm:table-cell">Expires</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e1e]">
            {links.map((link: LinkItem) => {
              const secret = secretsMap[link.token];
              const fullLink = `${import.meta.env.VITE_UPLOAD_URL}?token=${link.token}#key=${secret?.key}&iv=${secret?.iv}`;
              const isExpired = link.expiresAt && isBefore(new Date(link.expiresAt), new Date());
              const expiryText = link.expiresAt
                ? isExpired
                  ? `Expired ${formatDistanceToNow(new Date(link.expiresAt))} ago`
                  : `in ${formatDistanceToNow(new Date(link.expiresAt))}`
                : 'Never';

              return (
                <tr key={link.id} className="hover:bg-[#161616] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => route(link.id, link.token, secret)}
                        className="text-sm text-white hover:text-neutral-300 transition-colors font-medium truncate max-w-[160px] sm:max-w-[240px] text-left"
                        title={link.name || fullLink}
                      >
                        {link.name || `Link #${link.id}`}
                      </button>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleCopyLink(fullLink)}
                          className="p-1 rounded text-neutral-600 hover:text-neutral-300 transition-colors"
                          title="Copy link"
                        >
                          <Copy size={12} />
                        </button>
                        <Link
                          to={fullLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded text-neutral-600 hover:text-neutral-300 transition-colors"
                          title="Open link"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{link.uploadCount}</span>
                      <span className="text-neutral-600 text-xs">/ {link.maxUploads === 0 ? '∞' : link.maxUploads}</span>
                      {link.maxUploads > 0 && (
                        <div className="hidden sm:block w-16 h-1 bg-[#222222] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-neutral-400 rounded-full transition-all"
                            style={{ width: `${Math.min(100, (link.uploadCount / link.maxUploads) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className={`text-xs font-medium ${
                      isExpired ? 'text-red-400' : link.expiresAt ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      {expiryText}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <AlertMenu onConfirm={() => handleLinkDelete(link.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(UserLinks);
