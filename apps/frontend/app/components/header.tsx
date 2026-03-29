import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '~/zustand/store'
import OpenfileLogo from './openfile-logo'
import { FiMenu, FiX } from 'react-icons/fi'

function Header() {
  const isLoggedIn = useAuth.getState()?.user?.username
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/60 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <OpenfileLogo />
          <Link to={'/'} className="text-xl font-bold text-white">OpenFile</Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
            How it works
          </a>
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </a>
          {isLoggedIn ? (
            <Link
              to={'/dashboard'}
              className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to={'/auth'}
              className="text-sm border border-purple-500/60 text-purple-300 hover:bg-purple-500 hover:text-white px-5 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-black/80 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
          <a
            href="#how-it-works"
            className="text-sm text-gray-300 hover:text-white transition-colors py-1"
            onClick={() => setMobileOpen(false)}
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-sm text-gray-300 hover:text-white transition-colors py-1"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-gray-300 hover:text-white transition-colors py-1"
            onClick={() => setMobileOpen(false)}
          >
            Pricing
          </a>
          {isLoggedIn ? (
            <Link
              to={'/dashboard'}
              className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-center font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to={'/auth'}
              className="text-sm border border-purple-500/60 text-purple-300 hover:bg-purple-500 hover:text-white px-4 py-2 rounded-lg text-center font-medium transition-all"
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
