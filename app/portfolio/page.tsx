"use client";
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';
import { X, PlayCircle } from 'lucide-react';

// --- ÁREA DE EDIÇÃO ---
// Cole os links normais do navegador (YouTube ou Vimeo)
const projects = [
  {
    id: 1,
    title: "Campanha Nike 2025",
    category: "Publicidade",
    image: "https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=2664&auto=format&fit=crop",
    link: "https://www.youtube.com/watch?v=lxO-6rlihSg" // Exemplo: Link normal do YouTube
  },
  {
    id: 2,
    title: "Documentário Sertão",
    category: "Cinema",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?q=80&w=2698&auto=format&fit=crop",
    link: "https://vimeo.com/76979871" // Exemplo: Link normal do Vimeo
  },
  {
    id: 3,
    title: "Fashion Film Vogue",
    category: "Moda",
    image: "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2670&auto=format&fit=crop",
    link: "https://www.youtube.com/watch?v=ScMzIvxBSi4"
  },
];
// ----------------------

export default function Portfolio() {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  // Função que transforma link normal em link de player (Embed)
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes('vimeo.com')) {
      const videoId = url.split('.com/')[1];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-12">
          TRABALHOS <span className="text-gray-600">SELECIONADOS</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              onClick={() => setCurrentVideo(project.link)}
              className="group cursor-pointer"
            >
              {/* Card da Imagem */}
              <div className="relative aspect-video overflow-hidden rounded-sm mb-4 bg-gray-900 border border-white/10 group-hover:border-white/30 transition-all">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                
                {/* Ícone de Play (Overlay) */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/0 transition-all">
                  <PlayCircle className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                </div>
              </div>
              
              {/* Textos */}
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wide group-hover:text-white transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL DE VÍDEO (JANELA FLUTUANTE) */}
      {currentVideo && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setCurrentVideo(null)} // Fecha ao clicar fora
        >
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
            <button 
              onClick={() => setCurrentVideo(null)}
              className="absolute top-4 right-4 z-10 text-white hover:text-red-500 transition-colors bg-black/50 rounded-full p-2"
            >
              <X size={24} />
            </button>
            
            <iframe 
              src={getEmbedUrl(currentVideo)} 
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </main>
  );
}