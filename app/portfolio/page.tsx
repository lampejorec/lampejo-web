"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import { X, PlayCircle, ArrowLeft, Instagram, Youtube, MonitorPlay } from "lucide-react";
import Image from "next/image";

// --- TIPO DE DADOS ---
type VideoType = "Reels" | "Youtube" | "Cinema";

interface Project {
  title: string;
  type: VideoType;
  image: string; // Thumbnail
  link: string;  // Link do vídeo
}

interface ClientData {
  id: string;
  name: string;
  logo: string;
  description: string;
  projects: Project[];
}

// --- SEUS DADOS AQUI ---
// Configure aqui os vídeos de cada cliente
const clientsData: ClientData[] = [
  {
    id: "estadao",
    name: "Estadão",
    logo: "/estadao.png", // Usando as logos que já colocamos na raiz
    description: "Cobertura dinâmica e conteúdo ágil no formato vertical para um dos maiores veículos de comunicação do país.",
    projects: [
      {
        title: "Cobertura Política 2025",
        type: "Reels",
        image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2670&auto=format&fit=crop",
        link: "https://youtube.com/shorts/VIDEO_ID_AQUI" // Exemplo de Short/Reel
      },
      {
        title: "Bastidores da Redação",
        type: "Reels",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2670&auto=format&fit=crop",
        link: "https://youtube.com/shorts/VIDEO_ID_AQUI_2"
      },
      {
        title: "Entrevista Exclusiva",
        type: "Reels",
        image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?q=80&w=2670&auto=format&fit=crop",
        link: "https://youtube.com/shorts/VIDEO_ID_AQUI_3"
      }
    ]
  },
  {
    id: "nicbr",
    name: "NIC.br",
    logo: "/nicbr.png",
    description: "Produções institucionais e educacionais sobre a infraestrutura da internet no Brasil.",
    projects: [
      {
        title: "Semana de Infraestrutura",
        type: "Youtube",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
        link: "https://www.youtube.com/watch?v=VIDEO_ID_NORMAL"
      },
      {
        title: "Tutorial IX.br",
        type: "Reels",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
        link: "https://youtube.com/shorts/VIDEO_ID_SHORT"
      },
      {
        title: "Documentário 30 Anos",
        type: "Cinema",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2669&auto=format&fit=crop",
        link: "https://www.youtube.com/watch?v=DOC_ID"
      }
    ]
  },
  {
    id: "safernet",
    name: "Safernet",
    logo: "/safernet.png",
    description: "Campanhas de conscientização e segurança digital com impacto social.",
    projects: [
      {
        title: "Campanha Dia da Internet Segura",
        type: "Youtube",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
        link: "https://www.youtube.com/watch?v=VIDEO_ID"
      },
      {
        title: "Shorts Educativo: Senhas",
        type: "Reels",
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2670&auto=format&fit=crop",
        link: "https://youtube.com/shorts/VIDEO_ID"
      }
    ]
  },
  {
    id: "caadf",
    name: "CAADF",
    logo: "/caadf.png",
    description: "Cobertura de eventos e conteúdo institucional para a advocacia.",
    projects: [
      {
        title: "Aftermovie Baile da Advocacia",
        type: "Cinema",
        image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2574&auto=format&fit=crop",
        link: "https://www.youtube.com/watch?v=VIDEO_ID"
      }
    ]
  }
];

export default function Portfolio() {
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);

  // Função inteligente de Embed (Mantida)
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0`;
    }
    if (url.includes("vimeo.com")) {
      const vimeoId = url.split(".com/")[1]?.split("/")[0];
      if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    }
    return url;
  };

  // Função para retornar ícone baseado no tipo
  const getTypeIcon = (type: VideoType) => {
    switch (type) {
      case "Reels": return <Instagram size={16} />;
      case "Youtube": return <Youtube size={16} />;
      default: return <MonitorPlay size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />

      <section className="pt-32 px-6 max-w-7xl mx-auto pb-20 min-h-screen flex flex-col">
        
        {/* HEADER DA PÁGINA (Sempre visível se nenhum cliente selecionado) */}
        {!selectedClient && (
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              PORTFÓLIO <span className="text-neutral-600">POR CLIENTE</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg">
              Selecione uma marca para explorar os projetos e narrativas que construímos juntos.
            </p>
          </div>
        )}

        {/* NÍVEL 1: GRID DE CLIENTES (Logos) */}
        {!selectedClient && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {clientsData.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="group relative aspect-square bg-neutral-900/30 border border-white/10 rounded-2xl flex items-center justify-center p-8 hover:bg-neutral-900 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative w-full h-full">
                  {/* Logo em preto e branco que fica colorida no hover */}
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                </div>
                <div className="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Ver Projetos</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* NÍVEL 2: DENTRO DO CLIENTE (Lista de Vídeos) */}
        {selectedClient && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* Cabeçalho do Cliente */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/10 pb-8">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tighter flex items-center gap-4">
                    {selectedClient.name}
                  </h2>
                </div>
              </div>
              <p className="text-neutral-400 max-w-lg text-sm md:text-right">
                {selectedClient.description}
              </p>
            </div>

            {/* Grid de Vídeos do Cliente */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {selectedClient.projects.map((project, index) => (
                <div 
                  key={index}
                  className={`group cursor-pointer relative overflow-hidden rounded-xl bg-neutral-900 border border-white/5 hover:border-purple-500/30 transition-all ${project.type === "Reels" ? "aspect-[9/16] max-w-xs mx-auto w-full" : "aspect-video"}`}
                  onClick={() => setCurrentVideo(project.link)}
                >
                  {/* Imagem */}
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  
                  {/* Badge de Tipo (Reels/Youtube) */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10">
                    {getTypeIcon(project.type)}
                    {project.type}
                  </div>

                  {/* Overlay Play */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                      <PlayCircle className="w-8 h-8 text-white fill-current" />
                    </div>
                  </div>

                  {/* Título no rodapé */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Estado Vazio (Se não tiver vídeos ainda) */}
            {selectedClient.projects.length === 0 && (
              <div className="text-center py-20 text-neutral-500">
                <p>Em breve os projetos deste cliente estarão disponíveis.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* MODAL PLAYER (Igual ao anterior) */}
      {currentVideo && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <button 
            onClick={() => setCurrentVideo(null)}
            className="absolute top-6 right-6 text-white hover:text-blue-500 transition-colors bg-white/10 p-2 rounded-full z-50"
          >
            <X size={32} />
          </button>

          <div className="w-full h-full flex items-center justify-center">
            {/* Lógica para adaptar tamanho se for Reels ou Horizontal */}
            <div className={`w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative ${currentVideo.includes("shorts") ? "max-w-[400px] aspect-[9/16]" : "max-w-6xl aspect-video"}`}>
              <iframe 
                src={getEmbedUrl(currentVideo)} 
                className="w-full h-full absolute inset-0"
                allow="autoplay; fullscreen; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}