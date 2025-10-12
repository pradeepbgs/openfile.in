
const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold text-black mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: July 18, 2025</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🔒 What We Collect</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Your name and email address (for account creation).</li>
          <li>Uploaded files (encrypted and auto-expired).</li>
          {/* <li>IP address and basic usage analytics (for performance and safety).</li> */}
        </ul>
        <p className="mt-3 text-green-700 font-medium">We never sell your data.</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📦 How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>To enable secure file sharing.</li>
          <li>To send notifications for file activity or account updates.</li>
          <li>To detect abuse (spam, malware, etc.).</li>
          <li>To improve service based on anonymized usage.</li>
        </ul>
      </section>

      <section id="terms" className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📜 Terms of Service</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Only share files you have the right to share.</li>
          <li>Do not use OpenFile for illegal or harmful purposes.</li>
          <li>We may suspend abusive users or links.</li>
        </ul>
      </section>

      <section id="security" className="mb-10">
        <h2 className="text-xl font-semibold mb-2">🔐 Security</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>file gets encrypted during upload.</li>
          <li>we don't store your secret key and iv ( it gets stored on your browser locally )</li>
          <li>Files are stored temporarily and deleted after expiry.</li>
          <li>Industry-standard practices ensure data safety.</li>
        </ul>
        <p className="mt-3 text-blue-700 font-medium">Your files = your privacy. Always.</p>
      </section>

      <section id="contact" className="mb-10">
        <h2 className="text-xl font-semibold mb-2">📬 Contact</h2>
        <p className="text-gray-700">
          If you have any questions, reach out to us at{' '}
          <a href="mailto:teamopenfile@gmail.com" className="text-blue-600 hover:underline">
            teamopenfile@gmail.com
          </a>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
