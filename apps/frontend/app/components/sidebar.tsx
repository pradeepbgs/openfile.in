import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { FiHome, FiChevronDown, FiMenu, FiLink, FiX } from 'react-icons/fi'
import { useAuth } from '~/zustand/store';
import SidebarDropdown from './sidebar-dropdown';
import OpenfileLogo from './openfile-logo';

const Tabs = [
  { name: "Create Link", path: "/dashboard", icon: <FiHome size={16} /> },
  { name: "My Links", path: "/dashboard/links", icon: <FiLink size={16} /> },
];

export default function Sidebar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useAuth.getState().user;
  const planName = user?.subscription?.planName || 'free';

  return (
    <>
      {/* Mobile hamburger */}
      {!sidebarOpen && (
        <button
          className="md:hidden p-3 text-gray-400 hover:text-white absolute left-2 top-2 z-50 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu size={22} />
        </button>
      )}

      <aside
        className={`
          flex flex-col justify-between
          fixed top-0 left-0 h-screen w-60 z-40
          bg-[#080810] border-r border-white/8
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        {/* Top */}
        <div className="flex flex-col gap-6 p-4">
          {/* Logo + close button on mobile */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <OpenfileLogo />
              <span className="text-base font-bold text-white">OpenFile</span>
            </Link>
            <button
              className="md:hidden text-gray-500 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex flex-col gap-1">
            {Tabs.map((tab) => (
              <NavLink
                key={tab.name}
                to={tab.path}
                end={tab.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                {tab.icon}
                <span>{tab.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom — User */}
        <div className="p-4">
          {/* Plan badge */}
          <div className="mb-3 px-3">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              planName === 'pro'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-gray-500 border border-white/10'
            }`}>
              {planName === 'pro' ? '⭐ Pro' : 'Free plan'}
            </span>
          </div>

          <div
            className="relative rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors cursor-pointer p-3"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <button className="flex items-center gap-2.5 w-full">
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6d28d9&color=fff`}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <span className="text-sm text-white truncate flex-1 text-left">{user?.name || "User"}</span>
              <FiChevronDown
                size={14}
                className={`text-gray-400 flex-shrink-0 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {dropdownOpen && <SidebarDropdown />}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
