import { useLinkCount, useStorageUsedQuery, useUserLinksQuery } from "~/service/api";
import { FiSearch } from 'react-icons/fi';
import UserLinks from "~/components/user-links";
import UserStats from "~/components/user-stats";
import Spinner from "~/components/spinner";
import { useEffect, useState } from "react";

function Profile() {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState('')
  const [debouncedSearch, setDebounceSearch] = useState<string | null>(null);

  const limit = 10;
  const { data, isLoading, isError, refetch } = useUserLinksQuery(page, searchText, limit);
  const { data: storageUsed, isLoading: storageUsedLoading, error: storageUsedError } = useStorageUsedQuery()
  const { data: LinkCounts } = useLinkCount()


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(searchText);
    }, 300)

    return () => {
      clearTimeout(handler);
    }
  }, [searchText])

  useEffect(() => {
    refetch();
  }, [page, debouncedSearch]);

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Spinner size={28} /></div>;

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-400 text-lg">Error loading links. Please try again later.</p>
      </div>
    );
  }

  const handleRefresh = async () => {
    await refetch();
  }

  const { data: links, totalPages, page: currentPage } = data;


  const loadNextPage = async () => {
    setPage((prev) => {
      return prev + 1
    })
  }

  const loadPrevPage = async () => {
    setPage((prev) => prev - 1)
  }


  const handleSearch = async (e: any) => {
    e.preventDefault()
    refetch()
  }


  return (
    <div className="min-h-screen text-white px-4 md:px-10 py-10 md:py-5">
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

      {/* Search bar  */}
      <form
        className="flex justify-center items-center gap-3 mb-6"
        onSubmit={handleSearch}
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search links by name or URL"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 text-white rounded border border-white/10 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </form>

      {/* Recent Links */}
      <UserLinks
        links={links}
        handleRefresh={handleRefresh}
      />

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-3">
        <button
          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm disabled:opacity-40 transition-colors"
          onClick={loadPrevPage}
          disabled={page === 1}
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm disabled:opacity-40 transition-colors"
          onClick={loadNextPage}
          disabled={LinkCounts === 0 ? true : page === totalPages}
        >
          Next →
        </button>
      </div>
    </div>

  );
}

export default Profile;
