import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '~/zustand/store'
import OpenfileLogo from './openfile-logo'

function Header() {
  const isLoggedIn = useAuth.getState()?.user?.email
  return (
    <header className="relative  z-10 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <OpenfileLogo />
          <Link to={'/'} className="text-2xl font-bold text-white">OpenFile</Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
            How it works?
          </a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </a>
          <Link to={'/plan'} className='text-gray-300'>Pricing</Link>
          {isLoggedIn ?
            <Link to={'/dashboard'} className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-6 py-2 rounded-lg transition-all duration-300">
              Dashboard
            </Link>
            : <Link to={'/auth'} className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-6 py-2 rounded-lg transition-all duration-300">
              Login
            </Link>
          }
        </div>
      </nav>
    </header>
  )
}

export default React.memo(Header)
