import { useLinkCount, useStorageUsedQuery, useUserLinksQuery } from "~/service/api";
import { FiSearch } from 'react-icons/fi';
import UserLinks from "~/components/user-links";
import UserStats from "~/components/user-stats";
import Spinner from "~/components/spinner";
import { useEffect, useState } from "react";

function Profile() {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebounceSearch] = useState<string | null>(null);

  const limit = 10;
  const { data, isLoading, isError, refetch } = useUserLinksQuery(page, searchText, limit);
  const { data: storageUsed, isLoading: storageUsedLoading, error: storageUsedError } = useStorageUsedQuery();
  const { data: LinkCounts } = useLinkCount();

  useEffect(() => {
    const handler = setTimeout(() => setDebounceSearch(searchText), 300);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => { refetch(); }, [page, debouncedSearch]);

  if (isLoading) return (
    <div className="min-h-screen flex justify-center items-center">
      <Spinner size={28} />
    </div>
  );

  if (isError) return (
    <div className="min-h-screen flex justify-center items-center">
      <p className="text-red-400 text-sm">Error loading links. Please try again later.</p>
    </div>
  );

  const { data: links, totalPages, page: currentPage } = data;

  const handleRefresh = async () => { await refetch(); };
  const loadNextPage = () => setPage((prev) => prev + 1);
  const loadPrevPage = () => setPage((prev) => prev - 1);

  return (
    <div className="min-h-screen text-white px-4 md:px-8 py-8">
      <div className="mb-8">
        <UserStats
          links={links}
          storageUsed={storageUsed?.data?.storageUsed || 0}
          storageUsedLoading={storageUsedLoading}
          storageUsedError={storageUsedError}
          linkCount={LinkCounts?.links}
        />
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" size={15} />
        <input
          type="text"
          placeholder="Search links by name…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-[#1a1a1a] text-white placeholder-neutral-600 rounded-lg border border-[#262626] focus:outline-none focus:ring-1 focus:ring-[#3a3a3a] focus:border-[#3a3a3a] text-sm transition-colors"
        />
      </div>

      <UserLinks links={links} handleRefresh={handleRefresh} />

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#1e1e1e] border border-[#262626] rounded-lg text-sm text-neutral-300 disabled:opacity-40 transition-colors"
            onClick={loadPrevPage}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="text-sm text-neutral-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-[#1e1e1e] border border-[#262626] rounded-lg text-sm text-neutral-300 disabled:opacity-40 transition-colors"
            onClick={loadNextPage}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
