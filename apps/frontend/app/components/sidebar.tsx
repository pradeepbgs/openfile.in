import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { FiHome, FiChevronDown, FiMenu, FiLink, FiX } from 'react-icons/fi'
import { useAuth } from '~/zustand/store';
import SidebarDropdown from './sidebar-dropdown';
import OpenfileLogo from './openfile-logo';

const Tabs = [
  { name: "Create Link", path: "/dashboard", icon: <FiHome size={15} /> },
  { name: "My Links", path: "/dashboard/links", icon: <FiLink size={15} /> },
];

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useAuth.getState().user;
  const planName = user?.subscription?.planName || 'free';

  return (
    <>
      {!sidebarOpen && (
        <button
          className="md:hidden p-3 text-neutral-500 hover:text-white absolute left-2 top-2 z-50 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu size={20} />
        </button>
      )}

      <aside
        className={`
          flex flex-col justify-between
          fixed top-0 left-0 h-screen w-56 z-40
          bg-[#111111] border-r border-[#1e1e1e]
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex flex-col gap-6 p-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <OpenfileLogo />
              <span className="text-sm font-semibold text-white">OpenFile</span>
            </Link>
            <button
              className="md:hidden text-neutral-500 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={16} />
            </button>
          </div>

          <nav className="flex flex-col gap-0.5">
            {Tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                end={tab.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#1e1e1e] text-white font-medium'
                      : 'text-neutral-500 hover:bg-[#1a1a1a] hover:text-neutral-200'
                  }`
                }
              >
                {tab.icon}
                <span>{tab.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <div className="mb-2 px-3">
            <span className="text-xs text-neutral-600 font-medium">
              {planName === 'pro' ? 'Pro plan' : 'Free plan'}
            </span>
          </div>

          <div
            className="relative rounded-lg bg-[#1a1a1a] border border-[#222222] hover:bg-[#1e1e1e] transition-colors cursor-pointer p-3"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <button className="flex items-center gap-2.5 w-full">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=222222&color=fff`}
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm text-white truncate flex-1 text-left">{user?.name || "User"}</span>
              <FiChevronDown
                size={13}
                className={`text-neutral-500 flex-shrink-0 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {dropdownOpen && <SidebarDropdown />}
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
