import React from 'react'
import type { LinkItem } from 'types/types'
import { filesize } from 'filesize'
import Spinner from './spinner'

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}


function UserStats(
  {
    links,
    storageUsed,
    storageUsedLoading,
    storageUsedError,
    linkCount,
  }: {
    links: LinkItem[],
    storageUsed: number,
    storageUsedLoading: boolean,
    storageUsedError: Error | null,
    linkCount: number,
  }
) {
  const totalUploads = links.length && links?.reduce((sum, l) => sum + (l.uploadCount || 0), 0)
  const activeLinks = links && links?.filter(link => {
    if (!link.expiresAt) return true;
    return new Date(link.expiresAt) > new Date();
  }).length;


  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard
        label="Total Links"
        value={linkCount}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              className='text-blue-400'
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        }
      />

      <StatCard
        label="Active Links"
        value={activeLinks}
        icon={
          <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              className='text-green-400'
            />
          </svg>
        }
      />

      <StatCard
        label="Total Uploads"
        value={totalUploads}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              className='text-yellow-400'
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        }
      />

      <StatCard
        label="Storage Used"
        value={filesize(storageUsed)}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              className='text-red-400'
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
        }
      />

    </div>
  )
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  className = ''
}) => (
  <div className={`bg-white/5 rounded-lg px-4 py-3 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-white font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-lg font-semibold text-white mt-1">
          {value}
        </p>
      </div>
      {icon && (
        <div className="text-gray-400">
          {icon}
        </div>
      )}
    </div>
  </div>
)

export default React.memo(UserStats)
