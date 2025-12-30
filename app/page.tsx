"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import { ArrowRight, Play, Quote } from "lucide-react";

// DADOS DOS SERVIÇOS
const SERVICES = [
  {
    id: 0,
    title: "Manifesto Lampejo",
    description: "Nossa essência em movimento. Entenda como pensamos e por que fazemos o que fazemos.",
    tag: "Showreel 2025",
    videoTitle: "ASSISTA AO MANIFESTO"
  },
  {
    id: 1,
    title: "Cobertura Real-Time",
    description: "Captação, edição e postagem enquanto o evento acontece. A velocidade que o feed exige.",
    tag: "Eventos & Experience",
    videoTitle: "CASE: NIC.BR AO VIVO"
  },
  {
    id: 2,
    title: "Transmissão & Lives",
    description: "Estúdio móvel, multicâmera e corte ao vivo. Levamos a estrutura de TV para o seu evento.",
    tag: "Broadcast",
    videoTitle: "TRANSMISSÃO OAB/DF"
  },
  {
    id: 3,
    title: "Podcasts & Videocasts",
    description: "Da captação de áudio cristalino aos cortes virais para TikTok e Reels. Estrutura completa.",
    tag: "Estúdio & Conteúdo",
    videoTitle: "PRODUÇÃO DE VIDEOCAST"
  },
  {
    id: 4,
    title: "Conteúdo Vertical",
    description: "Vídeos pensados nativamente para a tela do celular. Reels e TikToks que retêm a atenção.",
    tag: "Social Video",
    videoTitle: "REELS: ESTADÃO"
  }
];

const CLIENTS = [
  { name: "NIC.br", logo: "/nicbr.png" },
  { name: "CGI.br", logo: "/cgibr.png" },
  { name: "Safernet", logo: "/safernet.png" },
  { name: "CAADF", logo: "/caadf.png" },
  { name: "OAB/DF", logo: "/oabdf.png" },
  { name: "Estadão", logo: "/estadao.png" },
  { name: "HY Produções", logo: "/hy.png" },
  { name: "Sem Rótulo", logo: "/semrotulo.png" },
  { name: "Sinicon", logo: "/sinicon.png" },
];

const TESTIMONIALS = [
  {
    text: "A Lampejo entregou em 2 horas o que outras agências pediam 2 dias. A qualidade cinematográfica no real-time é surreal.",
    author: "Diretor de Marketing",
    company: "NIC.br"
  },
  {
    text: "Eles entendem a linguagem da internet. Não é aquele vídeo institucional chato, é conteúdo que engaja de verdade.",
    author: "Head de Conteúdo",
    company: "Estadão"
  }
];

export default function Home() {
  const [activeService, setActiveService] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // EFEITO: Força o play no Desktop e Mobile
  useEffect(() => {
    if (videoRef.current) {
      // 1. Garante que está mudo (Crucial para Chrome Desktop)
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      
      // 2. Tenta dar o play
      videoRef.current.play().catch((error) => {
        console.error("Autoplay falhou:", error);
      });
    }
  }, []);

  return (
    <div className="bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <main>
        {/* SESSÃO 1: HERO */}
        <section className="h-[100dvh] flex flex-col justify-center items-center px-6 text-center relative overflow-hidden pt-20 md:pt-0">
          
          {/* BACKGROUND: Vídeo + Glow */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Overlay Escuro */}
            <div className="absolute inset-0 bg-black/60 z-20 pointer-events-none" />

            {/* Glow Pulsante (Atrás do vídeo ou na frente com blend-mode) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-900/30 blur-[100px] rounded-full animate-glow z-10 pointer-events-none mix-blend-screen" />
            
            {/* VÍDEO COMPONENTE REACT (Refatorado) */}
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-70 z-0"
              autoPlay 
              loop 
              muted 
              playsInline 
              poster="/poster-home.jpg"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>
          
          {/* CONTEÚDO (Texto) */}
          <h1 className="text-4xl md:text-8xl font-bold tracking-tighter mb-8 z-30 animate-in slide-in-from-bottom-10 fade-in duration-1000 leading-tight relative">
            AUDIOVISUAL NA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              VELOCIDADE DO AGORA.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-neutral-300 max-w-3xl mb-12 z-30 leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200 relative">
            Nascemos para encurtar a distância entre a ideia e o play. <br className="hidden md:block"/>
            Sem burocracia. Apenas fluxo e qualidade cinematográfica.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 z-30 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300 w-full md:w-auto px-4 md:px-0 relative">
            <Link href="/portfolio" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105 w-full md:w-auto">
              VER TRABALHOS
            </Link>
            <Link href="/contato" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 w-full md:w-auto">
              INICIAR PROJETO <ArrowRight size={18}/>
            </Link>
          </div>
        </section>

        {/* SESSÃO 2: CLIENTES */}
        <section className="py-12 bg-white overflow-hidden">
          <div className="max-w-full mx-auto">
            <p className="text-sm text-neutral-500 font-bold uppercase tracking-widest mb-8 text-center">
              Marcas que confiam no nosso olhar
            </p>
            <div className="flex overflow-hidden relative w-full group">
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex animate-scroll min-w-full flex-shrink-0 justify-around items-center gap-10 px-10">
                {CLIENTS.map((client, index) => (
                  <div key={index} className="flex items-center justify-center w-32 md:w-48 h-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                    <img src={client.logo} alt={client.name} className="max-h-14 w-auto object-contain" />
                  </div>
                ))}
              </div>
              <div className="flex animate-scroll min-w-full flex-shrink-0 justify-around items-center gap-10 px-10" aria-hidden="true">
                {CLIENTS.map((client, index) => (
                  <div key={`dup-${index}`} className="flex items-center justify-center w-32 md:w-48 h-20 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                    <img src={client.logo} alt={client.name} className="max-h-14 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SESSÃO 2.5: DEPOIMENTOS */}
        <section className="py-20 bg-neutral-900 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-black/50 border border-white/10 p-8 rounded-2xl relative">
                  <Quote className="text-purple-500 mb-4 opacity-50" size={32} />
                  <p className="text-lg md:text-xl text-neutral-300 italic mb-6">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-white">{t.author}</p>
                    <p className="text-sm text-purple-400 font-bold uppercase tracking-widest">{t.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SESSÃO 3: O QUE FAZEMOS */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Esquerda */}
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-8">
                CRIAMOS NARRATIVAS <br /> QUE PRENDEM.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-8 min-h-[60px]">
                {SERVICES[activeService].description}
              </p>
              
              <div className="space-y-4">
                {SERVICES.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveService(index)}
                    className={`w-full flex items-center gap-4 text-xl font-medium border-b border-white/10 pb-4 transition-all text-left group ${activeService === index ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    <span className={`w-2 h-2 rounded-full transition-all ${activeService === index ? 'bg-blue-500 scale-125' : 'bg-neutral-700'}`} />
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Direita */}
            <div className="relative aspect-square md:aspect-[4/5] lg:aspect-video rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-neutral-900 shadow-2xl transition-all duration-500">
               <div className={`absolute inset-0 bg-gradient-to-br from-neutral-800 to-black transition-all duration-500 ${activeService % 2 === 0 ? 'opacity-100' : 'opacity-80'}`}></div>
               
               <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-20">
                 <div className="flex justify-between items-start">
                   <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                     {SERVICES[activeService].tag}
                   </span>
                 </div>

                 <div>
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-6 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:scale-110 transition-all duration-300">
                     <Play size={24} className="text-white fill-current ml-1"/>
                   </div>
                   <h3 className="text-2xl md:text-3xl font-bold text-white leading-none tracking-tighter">
                     {SERVICES[activeService].videoTitle}
                   </h3>
                 </div>
               </div>
            </div>

          </div>
        </section>

        {/* SESSÃO 4: ACADEMY */}
        <section className="py-32 bg-neutral-900/30 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6">
              LAMPEJO ACADEMY
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8">
              COMPARTILHAMOS <br /> O CÓDIGO FONTE.
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-12">
              Não guardamos segredos. Acesse nossos cursos, LUTs e processos de trabalho na Lampejo Academy.
            </p>
            <Link 
              href="/academy" 
              className="inline-flex items-center gap-2 text-white border-b border-white pb-1 hover:text-purple-400 hover:border-purple-400 transition-all text-lg"
            >
              EXPLORAR A ACADEMY 
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}