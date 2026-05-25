import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '~/zustand/store'
import OpenfileLogo from './openfile-logo'
import { FiMenu, FiX } from 'react-icons/fi'

function Header() {
  const isLoggedIn = useAuth.getState()?.user?.username
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#1e1e1e] bg-[#111111]/95 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <OpenfileLogo />
          <Link to={'/'} className="text-sm font-semibold text-white">OpenFile</Link>
        </div>

        <div className="hidden md:flex items-center gap-7">
          <a href="#how-it-works" className="text-sm text-neutral-500 hover:text-white transition-colors">
            How it works
          </a>
          <a href="#features" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-neutral-500 hover:text-white transition-colors">
            Pricing
          </a>
          {isLoggedIn ? (
            <Link
              to={'/dashboard'}
              className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-neutral-100 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to={'/auth'}
              className="text-sm border border-[#2a2a2a] text-neutral-300 hover:text-white hover:border-[#3a3a3a] px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-neutral-500 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#1e1e1e] bg-[#111111] px-6 py-4 flex flex-col gap-4">
          <a
            href="#how-it-works"
            className="text-sm text-neutral-400 hover:text-white transition-colors py-1"
            onClick={() => setMobileOpen(false)}
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-sm text-neutral-400 hover:text-white transition-colors py-1"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-neutral-400 hover:text-white transition-colors py-1"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </a>
          {isLoggedIn ? (
            <Link
              to={'/dashboard'}
              className="text-sm bg-white text-black px-4 py-2 rounded-lg text-center font-medium hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to={'/auth'}
              className="text-sm border border-[#2a2a2a] text-neutral-300 px-4 py-2 rounded-lg text-center font-medium transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default React.memo(Header)
