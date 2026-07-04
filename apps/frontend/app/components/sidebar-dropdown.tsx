import React from 'react'
import { FiLogOut, FiStar } from 'react-icons/fi'
import { useNavigate } from 'react-router'
import { logout } from '~/service/api'

function SidebarDropdown() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/auth')
    }

    return (
        <div className="absolute left-0 bottom-[calc(100%+8px)] w-full bg-[#161616] border border-[#222222] rounded-lg shadow-lg z-50 overflow-hidden">
            <ul className="py-1.5 text-sm">
                <li>
                    <button
                        onClick={() => navigate('/plan')}
                        className="w-full text-left px-4 py-2.5 text-neutral-300 hover:bg-[#1a1a1a] hover:text-white flex items-center gap-2.5 transition-colors"
                    >
                        <FiStar className="text-yellow-400" size={15} />
                        Upgrade to Pro
                    </button>
                </li>
                <li className="border-t border-[#222222] mt-1 pt-1">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-400 hover:bg-[#1a1a1a] hover:text-red-300 flex items-center gap-2.5 transition-colors"
                    >
                        <FiLogOut size={15} />
                        Sign out
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default React.memo(SidebarDropdown)
