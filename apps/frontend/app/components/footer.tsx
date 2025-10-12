import { FileText } from 'lucide-react';
import React from 'react';

function Footer() {
    return (
        <footer className="px-6 py-12 bg-black/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">OpenFile</span>
                        </div>
                        <p className="text-gray-400">
                            Secure, private, and reliable file sharing for everyone.
                        </p>
                        <p className='text-gray-300'>
                            Mail us @<a href="mailto:exvillagerbgs@gmail.com" className="text-blue-500 hover:text-blue-400 transition-colors">exvillagerbgs@gmail.com</a>
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="/plan" className="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="/privacy-policy/#security" className="hover:text-white transition-colors">Security</a></li>
                        </ul>
                    </div>

                    {/* <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="" className="hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div> */}

                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/privacy-policy/" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="/privacy-policy/#contact" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 OpenFile. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default React.memo(Footer);
