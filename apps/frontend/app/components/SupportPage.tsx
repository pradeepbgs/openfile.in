import React from 'react';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400">Support OpenFile</h1>
        <p className="text-gray-300">
          Your support helps keep OpenFile fast, free, and open. If you'd like to show appreciation, consider donating below.
        </p>

        {/* Buy Me a Coffee */}
        <a
          href="https://buymeacoffee.com/pradeepsahu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          ☕ Buy Me a Coffee
        </a>

        <p className="text-sm text-gray-400">or choose a custom amount:</p>

        {/* Donation Options */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://checkout.dodopayments.com/buy/pdt_r0o4sFbrxAyIfY58BLPaK?quantity=1&redirect_url=https://openfile-one.vercel.app%2F"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded bg-gray-800 hover:bg-gray-700 transition border border-yellow-500 text-yellow-400 font-semibold"
          >
            Click to Donate us custom amount on dodo payments
          </a>
        </div>

        <p className="text-xs text-gray-500">
          Thank you for supporting independent open-source work
        </p>
      </div>
    </div>
  );
}
