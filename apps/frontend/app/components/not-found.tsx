import Lottie from 'lottie-react';
import animationData from 'public/404.json'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black p-4">
      <div className="w-80 sm:w-96">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <h1 className="mt-4 text-2xl font-semibold">Oops! Page not found.</h1>
      <p className="text-gray-600">The page you are looking for doesn’t exist.</p>
    </div>
  );
}

export default NotFound;
