import { Shield, Lock, Upload, Download, ArrowRight, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router';
import Header from '~/components/header';
import Footer from '~/components/footer';
import PlansPage from './dashboard/plan';
import { GLOBAL_BG } from 'constant';

function App() {
  return (
    <div className={`min-h-screen text-white ${GLOBAL_BG}`}>
      <Header />

      <main className="">
        
        {/* Hero Section */}
        <section className="relative text-center px-6 py-24 md:py-32 overflow-hidden ">
          {/* Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
                Receive Files
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Privately & Securely
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                OpenFile lets you receive files without revealing personal details. No sign-up needed for senders.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  to={'/dashboard'}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/30">
                  Get Started for Free
                </Link>
                <a href='#how-it-works' className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-gray-200 hover:text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                  How It Works?
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-20 bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose OpenFile?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience the most secure and private way to share and receive files
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Encryption */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Client-side Encryption</h3>
                <p className="text-gray-300 leading-relaxed">
                  Files are encrypted before they leave your device. Only the recipient can decrypt them — not even we can access them.
                </p>
              </div>

              {/* Zero Knowledge */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Zero-Knowledge Privacy</h3>
                <p className="text-gray-300 leading-relaxed">
                  You hold the key — literally. We never see your files or decrypt them. You’re in full control.
                </p>
              </div>

              {/* No Account Needed */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Private & Effortless</h3>
                <p className="text-gray-300 leading-relaxed">
                  No signup needed. Senders can upload without accounts. Files land securely in your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="px-6 py-20 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">How It Works</h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                Let others send files to you — securely and anonymously, in just three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">1. Create a Unique Link</h3>
                <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Generate a private upload link for others to send you files.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <ArrowRight className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">2. Share the Link</h3>
                <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                  Send the link to anyone you want to receive files from — friends, clients, anyone.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Download className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">3. They Upload the Files</h3>
                <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                  The recipient uploads files securely through the link. You get them instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-900 py-10">
          <PlansPage />
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 ">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Share Files Securely?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust OpenFile for their secure file sharing needs.
            </p>
            <Link to={'/dashboard'} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 rounded-xl font-semibold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;