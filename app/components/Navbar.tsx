"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; 
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? "text-white font-bold opacity-100" 
      : "text-neutral-400 font-medium opacity-70 hover:opacity-100 hover:text-white";
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY + 10 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 10 || currentScrollY < 100) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  // --- AQUI ESTÁ A ALTERAÇÃO: OCULTANDO OS LINKS ---
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Portfólio", path: "/portfolio" },
    // { name: "Insights", path: "/insights" }, // Oculto temporariamente
    // { name: "Academy", path: "/academy" },   // Oculto temporariamente
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out transform ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          (lastScrollY > 50 && !isOpen) ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-50">
          
          <Link href="/" className="text-2xl font-bold tracking-tighter hover:text-purple-500 transition-colors z-50">
            LENZ AUDIOVISUAL
          </Link>

          {/* MENU DESKTOP */}
          <div className="hidden md:flex items-center gap-8 text-sm tracking-widest uppercase">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path} 
                className={`transition-colors duration-300 ${isActive(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
            
            <Link 
              href="/contato" 
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                pathname === "/contato" 
                  ? "bg-purple-600 text-white border border-purple-500" 
                  : "bg-white text-black hover:bg-purple-500 hover:text-white"
              }`}
            >
              Contato
            </Link>
          </div>

          <button 
            className="md:hidden text-white z-50 p-2 focus:outline-none transition-transform duration-300 active:scale-90"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      <div 
        className={`fixed inset-0 bg-black z-[40] flex flex-col items-center justify-center gap-8 text-3xl font-bold tracking-tighter transition-all duration-500 ease-in-out ${
          isOpen 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-10 pointer-events-none"
        }`}
      >
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            href={link.path} 
            onClick={() => setIsOpen(false)} 
            className={`transition-colors duration-300 ${
              pathname === link.path ? "text-purple-500" : "text-white hover:text-purple-400"
            }`}
          >
            {link.name.toUpperCase()}
          </Link>
        ))}
        
        <Link 
          href="/contato" 
          onClick={() => setIsOpen(false)} 
          className={`border px-8 py-3 rounded-full transition-all ${
             pathname === "/contato" ? "border-purple-500 text-purple-500" : "border-white text-white hover:bg-white hover:text-black"
          }`}
        >
          CONTATO
        </Link>
      </div>
    </>
  );
}