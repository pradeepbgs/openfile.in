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
      <p className="text-red-400">Error loading links. Please try again later.</p>
    </div>
  );

  const { data: links, totalPages, page: currentPage } = data;

  const handleRefresh = async () => { await refetch(); };
  const loadNextPage = () => setPage((prev) => prev + 1);
  const loadPrevPage = () => setPage((prev) => prev - 1);

  return (
    <div className="min-h-screen text-white px-4 md:px-8 py-8">
      {/* Stats */}
      <div className="mb-8">
        <UserStats
          links={links}
          storageUsed={storageUsed?.data?.storageUsed || 0}
          storageUsedLoading={storageUsedLoading}
          storageUsedError={storageUsedError}
          linkCount={LinkCounts?.links}
        />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Search links by name…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white/5 text-white placeholder-gray-600 rounded-xl border border-white/8 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm transition-colors"
        />
      </div>

      {/* Links table */}
      <UserLinks links={links} handleRefresh={handleRefresh} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-3">
          <button
            className="px-4 py-1.5 bg-white/8 hover:bg-white/15 border border-white/10 rounded-lg text-sm disabled:opacity-40 transition-colors"
            onClick={loadPrevPage}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-4 py-1.5 bg-white/8 hover:bg-white/15 border border-white/10 rounded-lg text-sm disabled:opacity-40 transition-colors"
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
