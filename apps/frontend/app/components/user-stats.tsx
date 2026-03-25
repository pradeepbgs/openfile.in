import React from 'react'
import type { LinkItem } from 'types/types'
import { filesize } from 'filesize'
import { Link2, CheckCircle, Upload, HardDrive } from 'lucide-react'

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  accent: string;
}

function UserStats({
  links,
  storageUsed,
  linkCount,
}: {
  links: LinkItem[],
  storageUsed: number,
  storageUsedLoading: boolean,
  storageUsedError: Error | null,
  linkCount: number,
}) {
  const totalUploads = links.length ? links.reduce((sum, l) => sum + (l.uploadCount || 0), 0) : 0;
  const activeLinks = links ? links.filter(link => {
    if (!link.expiresAt) return true;
    return new Date(link.expiresAt) > new Date();
  }).length : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Total Links"
        value={linkCount ?? 0}
        accent="border-blue-500/50 bg-blue-500/5"
        icon={<Link2 size={16} className="text-blue-400" />}
      />
      <StatCard
        label="Active Links"
        value={activeLinks}
        accent="border-green-500/50 bg-green-500/5"
        icon={<CheckCircle size={16} className="text-green-400" />}
      />
      <StatCard
        label="Total Uploads"
        value={totalUploads}
        accent="border-yellow-500/50 bg-yellow-500/5"
        icon={<Upload size={16} className="text-yellow-400" />}
      />
      <StatCard
        label="Storage Used"
        value={filesize(storageUsed || 0)}
        accent="border-red-400/50 bg-red-500/5"
        icon={<HardDrive size={16} className="text-red-400" />}
      />
    </div>
  );
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, accent }) => (
  <div className={`rounded-xl border px-4 py-3.5 bg-white/3 ${accent}`}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
      <div className="p-1.5 rounded-lg bg-white/5">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default React.memo(UserStats);
