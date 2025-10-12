import { FileText } from 'lucide-react'
import React from 'react'

function OpenfileLogo() {
    return (
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
        </div>
    )
}

export default OpenfileLogo