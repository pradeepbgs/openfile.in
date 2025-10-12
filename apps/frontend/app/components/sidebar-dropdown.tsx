import React from 'react'
import { FiLogOut } from 'react-icons/fi'
import { MdWorkspacePremium } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { logout } from '~/service/api'

const tabs = [
    {
        name: "Premium Pro",
        icon: <MdWorkspacePremium className="text-yellow-500" />,
        navigateTo: '/plan'
    }
]

function SidebarDropdown() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
        navigate('/auth')
    }

    return (
        <div className="absolute left-0 bottom-14 w-full bg-white border rounded-md shadow-lg z-10">
            <ul className="py-2 text-sm text-gray-700">
                {tabs.map((tab, index) => (
                    <li key={index}>
                        <button
                            onClick={() => navigate(tab.navigateTo)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default React.memo(SidebarDropdown)
