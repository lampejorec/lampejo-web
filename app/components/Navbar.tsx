"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lógica de Scroll (Esconder/Mostrar Navbar)
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Verifica se está no topo
        if (currentScrollY < 10) {
          setIsAtTop(true);
        } else {
          setIsAtTop(false);
        }

        // Esconder ao descer, mostrar ao subir
        if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMobileMenuOpen) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY, isMobileMenuOpen]);

  // Função para fechar o menu ao clicar em um link
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav 
        className={`fixed w-full z-50 top-0 left-0 flex items-center justify-between px-6 md:px-12 transition-all duration-500 ease-in-out
        ${isVisible ? "translate-y-0" : "-translate-y-full"} 
        ${isAtTop && !isMobileMenuOpen ? "bg-transparent py-8" : "bg-black/90 backdrop-blur-md py-4 border-b border-white/5"}
        `}
      >
        
        {/* LOGO */}
        <div className="z-50 relative">
          <Link 
            href="/" 
            className="text-2xl font-bold tracking-tighter text-white hover:opacity-80 transition-opacity"
            onClick={closeMenu}
          >
            LAMPEJO
          </Link>
        </div>

        {/* MENU DESKTOP (Escondido no celular) */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors uppercase">Início</Link>
          <Link href="/portfolio" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors uppercase">Portfólio</Link>
          <Link href="/insights" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors uppercase">Insights</Link>
          <Link href="/academy" className="text-xs font-bold tracking-widest text-purple-400 hover:text-white transition-colors uppercase">Academy</Link>
          <Link href="/contato" className="text-xs font-bold tracking-widest text-neutral-400 hover:text-white transition-colors uppercase">Contato</Link>
        </div>

        {/* BOTÃO HAMBURGUER (Aparece só no celular) */}
        <button 
          className="md:hidden z-50 text-white font-bold tracking-widest text-sm uppercase focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? "FECHAR" : "MENU"}
        </button>

      </nav>

      {/* OVERLAY MOBILE (Tela cheia preta com os links) */}
      <div 
        className={`fixed inset-0 bg-black z-40 flex flex-col justify-center items-center gap-8 transition-all duration-500 md:hidden
        ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
        `}
      >
        <Link 
          href="/" 
          onClick={closeMenu}
          className="text-3xl font-bold text-white hover:text-blue-500 transition-colors tracking-tighter"
        >
          INÍCIO
        </Link>

        <Link 
          href="/portfolio" 
          onClick={closeMenu}
          className="text-3xl font-bold text-white hover:text-blue-500 transition-colors tracking-tighter"
        >
          PORTFÓLIO
        </Link>
        
        <Link 
          href="/insights" 
          onClick={closeMenu}
          className="text-3xl font-bold text-white hover:text-blue-500 transition-colors tracking-tighter"
        >
          INSIGHTS
        </Link>
        
        <Link 
          href="/academy" 
          onClick={closeMenu}
          className="text-3xl font-bold text-purple-500 hover:text-white transition-colors tracking-tighter"
        >
          ACADEMY
        </Link>
        
        <Link 
          href="/contato" 
          onClick={closeMenu}
          className="text-3xl font-bold text-white hover:text-blue-500 transition-colors tracking-tighter"
        >
          CONTATO
        </Link>
      </div>
    </>
  );
}