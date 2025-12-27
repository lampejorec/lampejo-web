"use client";

import { 
  Share2, 
  Check, 
  Link as LinkIcon, 
  X, 
  Linkedin, 
  Facebook, 
  Twitter, 
  Mail,
  MessageCircle 
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  description: string;
}

export default function ShareButton({ title, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getUrl = () => window.location.href;
  const text = encodeURIComponent(title);
  
  const shareLinks = {
    whatsapp: () => `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(getUrl())}`,
    linkedin: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`,
    twitter: () => `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(getUrl())}`,
    facebook: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`,
    email: () => `mailto:?subject=${text}&body=Veja este artigo: ${getUrl()}`
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Erro ao copiar", err);
    }
  };

  const openPopup = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* BOTÃO PRINCIPAL */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 text-sm font-bold transition-all px-6 py-3 rounded-full border ${
          isOpen 
            ? "bg-white text-black border-white" 
            : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-purple-500"
        }`}
      >
        {isOpen ? <X className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        COMPARTILHAR
      </button>

      {/* MENU FLUTUANTE (A CAIXINHA) */}
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-4 w-72 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">
            Compartilhar em
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp */}
            <button 
              onClick={() => openPopup(shareLinks.whatsapp())}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                <MessageCircle size={20} />
              </div>
              <span className="text-[10px] font-medium text-neutral-300">WhatsApp</span>
            </button>

            {/* LinkedIn */}
            <button 
              onClick={() => openPopup(shareLinks.linkedin())}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#0077b5]/20 flex items-center justify-center text-[#0077b5] group-hover:scale-110 transition-transform">
                <Linkedin size={20} />
              </div>
              <span className="text-[10px] font-medium text-neutral-300">LinkedIn</span>
            </button>

            {/* X (Twitter) */}
            <button 
              onClick={() => openPopup(shareLinks.twitter())}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Twitter size={20} />
              </div>
              <span className="text-[10px] font-medium text-neutral-300">X / Twitter</span>
            </button>

            {/* Facebook */}
            <button 
              onClick={() => openPopup(shareLinks.facebook())}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2] group-hover:scale-110 transition-transform">
                <Facebook size={20} />
              </div>
              <span className="text-[10px] font-medium text-neutral-300">Facebook</span>
            </button>

            {/* Email */}
            <button 
              onClick={() => window.location.href = shareLinks.email()}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-700/30 flex items-center justify-center text-neutral-400 group-hover:scale-110 transition-transform">
                <Mail size={20} />
              </div>
              <span className="text-[10px] font-medium text-neutral-300">Email</span>
            </button>

            {/* Copiar Link */}
            <button 
              onClick={handleCopy}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${copied ? 'bg-green-500/20 text-green-500' : 'bg-neutral-700/30 text-white'}`}>
                {copied ? <Check size={20} /> : <LinkIcon size={20} />}
              </div>
              <span className={`text-[10px] font-medium ${copied ? 'text-green-500' : 'text-neutral-300'}`}>
                {copied ? 'Copiado!' : 'Copiar'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}