"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link'; // <--- O IMPORT ESSENCIAL

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verifica se já aceitou
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
    <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-white/10 p-4 z-[100] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* TEXTO COM O LINK CLICÁVEL ABAIXO */}
        <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
          Utilizamos cookies para melhorar a experiência. Ao continuar, você concorda com nossa{' '}
          <Link href="/politica" className="underline text-white hover:text-gray-300 transition-colors">
            Política de Privacidade
          </Link>.
        </p>
        
        <button 
          onClick={acceptCookies}
          className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-gray-200 transition-colors"
        >
          Aceitar
        </button>
      </div>
    </div>
  );
}