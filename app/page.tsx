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

  useEffect(() => {
    // Tenta forçar o play assim que carrega
    const playVideo = async () => {
      if (videoRef.current) {
        try {
          videoRef.current.muted = true; // Garante mudo
          await videoRef.current.play();
        } catch (err) {
          console.log("Autoplay bloqueado (provavelmente modo economia de bateria ou audio track):", err);
        }
      }
    };
    playVideo();
  }, []);

  return (
    <div className="bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <main>
        {/* SESSÃO 1: HERO */}
        <section className="h-screen flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
          
          {/* VIDEO BACKGROUND */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10" />
            <video 
              ref={videoRef}
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover opacity-60"
              poster="/poster-home.jpg" // Garanta que essa imagem existe!
              preload="auto"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 z-10 animate-in slide-in-from-bottom-10 fade-in duration-1000">
            AUDIOVISUAL NA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              VELOCIDADE DO AGORA.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-neutral-300 max-w-3xl mb-12 z-10 leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
            Nascemos para encurtar a distância entre a ideia e o play. <br className="hidden md:block"/>
            Sem burocracia. Apenas fluxo e qualidade cinematográfica.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 z-10 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
            <Link href="/portfolio" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105">
              VER TRABALHOS
            </Link>
            <Link href="/contato" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
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
              
              <div className="flex animate-scroll min-w-full flex-shrink-0 justify