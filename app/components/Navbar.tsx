"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          L<span className="text-white">⚡</span>MPEJO
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
          <Link href="/portfolio" className="hover:text-white transition-colors">Portfólio</Link>
          <Link href="/cursos" className="hover:text-white transition-colors">Academy</Link>
          <Link href="/loja" className="hover:text-white transition-colors">Shop</Link>
          <Link href="/contato" className="hover:text-white transition-colors">Contato</Link>
        </nav>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-white/10 p-6 flex flex-col gap-6 text-center uppercase tracking-widest"
        >
          <Link href="/portfolio" onClick={() => setIsOpen(false)}>Portfólio</Link>
          <Link href="/cursos" onClick={() => setIsOpen(false)}>Academy</Link>
          <Link href="/loja" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link href="/contato" onClick={() => setIsOpen(false)}>Contato</Link>
        </motion.div>
      )}
    </header>
  );
}