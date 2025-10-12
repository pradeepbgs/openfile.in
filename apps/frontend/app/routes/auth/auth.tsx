import Header from "~/components/header";
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLoginHandler } from "~/service/api";
import { useState, useEffect } from "react";
import { GLOBAL_BG } from "constant";

export default function AuthPage() {
    const handleGoogleLogin = useGoogleLoginHandler();
    const [showCookieWarning, setShowCookieWarning] = useState(true); // or use detection logic

    const openHelpPage = () => {
        window.open("https://support.google.com/accounts/answer/61416?hl=en", "_blank");
    };

    return (
        <div className={`${GLOBAL_BG} min-h-screen`}>
            <Header />
            <div className="flex items-center justify-center px-4 min-h-screen">
                <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-md">
                    {showCookieWarning && (
                        <div className="mb-4 p-3 rounded-md bg-yellow-100 text-yellow-800 text-sm text-center font-medium">
                            ⚠️ Login might not work if third-party cookies are blocked. 
                            because my frontend is on diffrent domain and server is on diffrent domain so cookies can't be set unless enable third party cookies.
                            <br />
                            Please enable them in your browser settings.
                            <div className="mt-3">
                                <button
                                    onClick={openHelpPage}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1.5 px-3 mt-2 rounded"
                                >
                                    How to Enable Third-Party Cookies
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={(res) => handleGoogleLogin(res.credential)}
                            onError={() => console.log('Login Failed')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
