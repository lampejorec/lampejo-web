"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, Download, Play, Lock } from "lucide-react";
import Image from "next/image";

// BANCO DE DADOS FAKE
const PROJECTS: any = {
  "nicbr": {
    client: "NIC.br",
    logo: "/nicbr.png",
    title: "Semana de Infraestrutura - Daily 01",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
    version: "V1",
    date: "28/12/2025"
  },
  "estadao": {
    client: "Estadão",
    logo: "/estadao.png",
    title: "Cobertura Política - Reels",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0",
    version: "V2 - Ajuste Cor",
    date: "29/12/2025"
  }
};

export default function ApprovalPage({ params }: { params: { cliente: string } }) {
  const slug = params.cliente; 
  const project = PROJECTS[slug];

  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const checkPassword = () => {
    if (password === "lampejo") setIsUnlocked(true);
    else alert("Senha incorreta");
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Projeto não encontrado</h1>
        <p className="text-neutral-500">Verifique o link enviado.</p>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="bg-neutral-900 p-8 rounded-2xl border border-white/10 w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
             <Lock className="text-black" />
          </div>
          <h1 className="text-xl font-bold mb-2">Área Restrita | {project.client}</h1>
          <p className="text-neutral-400 text-sm mb-6">Material confidencial. Digite a senha.</p>
          <input 
            type="password" 
            className="w-full bg-black border border-white/20 rounded-lg p-3 text-center text-white mb-4 focus:border-purple-500 outline-none"
            placeholder="Senha de Acesso"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={checkPassword} className="w-full bg-purple-600 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors">ACESSAR MATERIAL</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src={project.logo} alt="logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-lg leading-none">{project.title}</h1>
            <p className="text-[10px] md:text-xs text-neutral-500 mt-1 uppercase tracking-widest">
              {project.version} • {project.date}
            </p>
          </div>
        </div>
        <div className="hidden md:block">
           <span className="text-[10px] bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
             Aguardando Aprovação
           </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-10">
        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl mb-8 relative">
          <iframe 
            src={project.videoUrl} 
            className="w-full h-full" 
            title="Video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5 h-full">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-neutral-400">
              <Download size={16}/> Arquivos
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-black hover:bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center text-sm transition-colors group">
                <span className="font-bold text-white group-hover:text-purple-400 transition-colors">Master 4K (ProRes)</span>
                <span className="text-xs text-neutral-600">2.4 GB</span>
              </button>
              <button className="w-full bg-black hover:bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center text-sm transition-colors group">
                <span className="font-bold text-white group-hover:text-purple-400 transition-colors">Versão Web (MP4)</span>
                <span className="text-xs text-neutral-600">150 MB</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 h-full">
            <button 
              onClick={() => window.open(`https://wa.me/5561994079423?text=Olá! O vídeo "${project.title}" foi APROVADO! Podem seguir.`, '_blank')}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-xl flex items-center justify-between px-8 transition-all group shadow-lg hover:shadow-green-900/20"
            >
              <span className="text-lg font-bold">APROVAR VÍDEO</span>
              <CheckCircle2 size={28} className="text-green-200 group-hover:text-white group-hover:scale-110 transition-all" />
            </button>

            <button 
              onClick={() => window.open(`https://wa.me/5561994079423?text=Olá! Preciso de alterações no vídeo "${project.title}". Seguem os detalhes:`, '_blank')}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center justify-between px-8 transition-all group border border-white/5"
            >
              <span className="text-lg font-bold text-neutral-300 group-hover:text-white">PEDIR AJUSTE</span>
              <MessageSquare size={28} className="text-neutral-500 group-hover:text-white group-hover:scale-110 transition-all" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- A MÁGICA: ISSO CORRIGE O ERRO DE BUILD ---
export async function generateStaticParams() {
  // Retorna a lista de "clientes" que devem virar páginas estáticas HTML
  // Isso deve bater com as chaves do objeto PROJECTS lá em cima
  return [
    { cliente: "nicbr" },
    { cliente: "estadao" }
  ];
}