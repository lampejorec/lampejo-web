"use client";
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lampejo-cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('lampejo-cookie-consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-white/10 p-4 z-[100]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-400 text-xs md:text-sm">
          Nós utilizamos cookies para melhorar a experiência. 
          Ao continuar, você concorda com nossa política.
        </p>
        <button 
          onClick={acceptCookies}
          className="bg-white text-black px-6 py-2 text-xs font-bold uppercase rounded-sm hover:bg-gray-200"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}