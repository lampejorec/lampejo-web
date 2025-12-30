"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloqueia o scroll da página quando o menu mobile está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || isOpen ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
          
          {/* LOGO */}
          <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-purple-500 transition-colors z-50">
            LAMPEJO
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/portfolio" className="hover:text-white transition-colors">Portfólio</Link>
            <Link href="/academy" className="hover:text-purple-400 transition-colors">Academy</Link>
            <Link href="/contato" className="bg-white text-black px-6 py-2 rounded-full hover:bg-purple-500 hover:text-white transition-all">
              Contato
            </Link>
          </div>

          {/* BOTÃO MOBILE */}
          <button 
            className="md:hidden text-white z-50 p-2 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MENU MOBILE (FIXO FORA DA BARRA DE NAVEGAÇÃO PARA EVITAR BUGS DE LAYOUT) */}
      <div 
        className={`fixed inset-0 bg-black z-[999] flex flex-col items-center justify-center gap-8 text-3xl font-bold tracking-tighter transition-all duration-500 ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        {/* Botão de Fechar Extra no Topo */}
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-6 right-6 text-white p-2"
        >
          <X size={32} />
        </button>

        <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-purple-500 text-white">HOME</Link>
        <Link href="/portfolio" onClick={() => setIsOpen(false)} className="hover:text-purple-500 text-white">PORTFÓLIO</Link>
        <Link href="/academy" onClick={() => setIsOpen(false)} className="hover:text-purple-500 text-white">ACADEMY</Link>
        <Link href="/contato" onClick={() => setIsOpen(false)} className="text-purple-500 border border-purple-500 px-8 py-3 rounded-full hover:bg-purple-500 hover:text-white transition-all">CONTATO</Link>
      </div>
    </>
  );
}