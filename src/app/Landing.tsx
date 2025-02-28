"use client"
import type React from 'react';
import { useRouter } from 'next/navigation';

const Landing: React.FC = () => {
  const router = useRouter();

  const handleBuyClick = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">
          $trump Token
        </h1>
        <p className="text-gray-600 text-xl mb-8">
          Join the future of digital currency
        </p>
        <button
          onClick={handleBuyClick}
          type="button"
          className="bg-black text-white px-8 py-3 rounded-lg hover:opacity-90">
          Buy $trump Now
        </button>
      </div>
    </div>
  );
};

export default Landing;
