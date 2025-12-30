"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detecta rolagem para mudar a cor do fundo
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
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

        {/* BOTÃO MOBILE (HAMBURGUER) */}
        <button 
          className="md:hidden text-white z-50 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* MENU MOBILE (FULLSCREEN) */}
        <div className={`fixed inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-2xl font-bold tracking-tighter transition-all duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-purple-500">HOME</Link>
          <Link href="/portfolio" onClick={() => setIsOpen(false)} className="hover:text-purple-500">PORTFÓLIO</Link>
          <Link href="/academy" onClick={() => setIsOpen(false)} className="hover:text-purple-500">ACADEMY</Link>
          <Link href="/contato" onClick={() => setIsOpen(false)} className="text-purple-500 border border-purple-500 px-8 py-3 rounded-full">CONTATO</Link>
        </div>

      </div>
    </nav>
  );
}