"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

// DADOS DOS SERVIÇOS (Conteúdo que muda ao clicar)
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

// CLIENTES (Logos)
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

export default function Home() {
  // Estado para controlar qual serviço está ativo (Começa no 0 - Manifesto)
  const [activeService, setActiveService] = useState(0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <main>
        {/* SESSÃO 1: HERO */}
        <section className="h-screen flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
          
          {/* Fundo Limpo com Efeito de Luz */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black opacity-80" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          </div>

          <div className="relative z-10 max-w-5xl space-y-8">
            <h1 className="text-5xl md:text-9xl font-bold tracking-tighter mb-4 animate-in slide-in-from-bottom-10 fade-in duration-1000">
              LAMPEJO
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200">
              Audiovisual na velocidade do agora. <br className="hidden md:block"/>
              Encurtamos a distância entre a ideia e o play.
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-8 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300">
              <Link 
                href="/portfolio" 
                className="group bg-white text-black px-8 py-4 rounded-full font-bold tracking-widest text-sm flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all duration-300"
              >
                VER PORTFÓLIO <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
              
              <Link 
                href="/contato" 
                className="px-8 py-4 rounded-full font-bold tracking-widest text-sm text-white border border-white/20 hover:bg-white/10 transition-all flex items-center gap-2"
              >
                ORÇAMENTO
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 animate-bounce">
            <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent opacity-50"></div>
          </div>
        </section>

        {/* SESSÃO 2: CLIENTES (Carrossel Infinito) */}
        <section className="py-12 bg-white overflow-hidden border-y border-white/10">
          <div className="max-w-full mx-auto relative group">
            
            {/* Máscaras laterais para suavizar o carrossel */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex animate-scroll hover:pause whitespace-nowrap">
              {/* Loop Duplo para efeito infinito */}
              {[...CLIENTS, ...CLIENTS].map((client, index) => (
                <div key={index} className="flex items-center justify-center mx-10 w-32 md:w-48 h-20 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img 
                    src={client.logo} 
                    alt={client.name} 
                    className="max-h-12 w-auto object-contain" 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SESSÃO 3: O QUE FAZEMOS (INTERATIVA) */}
        <section className="py-32 px-6 border-t border-white/10 bg-neutral-950">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            
            {/* COLUNA DA ESQUERDA: LISTA INTERATIVA */}
            <div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                NÃO É SÓ VÍDEO.<br/>
                <span className="text-purple-500">É ESTRATÉGIA.</span>
              </h2>
              <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                {SERVICES[activeService].description}
              </p>
              
              <div className="space-y-2">
                {SERVICES.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveService(index)}
                    className={`w-full text-left py-4 px-6 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                      activeService === index 
                        ? "bg-white text-black border-white scale-[1.02] shadow-xl" 
                        : "bg-transparent text-neutral-500 border-white/5 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span className="font-bold text-lg flex items-center gap-3">
                      {activeService === index && <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"/>}
                      {item.title}
                    </span>
                    {activeService === index ? <ArrowRight size={20}/> : <span className="opacity-0 group-hover:opacity-50 text-2xl">+</span>}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <Link href="/portfolio" className="text-white border-b border-purple-500 pb-1 hover:text-purple-400 transition-colors inline-flex items-center gap-2">
                  Ver todos os projetos <ArrowRight size={14}/>
                </Link>
              </div>
            </div>

            {/* COLUNA DA DIREITA: PLAYER DINÂMICO */}
            <div className="relative aspect-square md:aspect-[4/5] lg:aspect-video rounded-3xl overflow-hidden border border-white/10 group cursor-pointer bg-neutral-900 shadow-2xl transition-all duration-500">
               
               {/* Fundo Dinâmico (Simulado com gradiente que muda levemente) */}
               <div className={`absolute inset-0 bg-gradient-to-br from-neutral-800 to-black transition-all duration-500 ${activeService % 2 === 0 ? 'opacity-100' : 'opacity-80'}`}></div>
               
               {/* Overlay de Conteúdo */}
               <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-20">
                 <div className="flex justify-between items-start">
                   <span className="bg-purple-600/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                     {SERVICES[activeService].tag}
                   </span>
                   <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                      <ArrowRight className="-rotate-45" size={20} />
                   </div>
                 </div>

                 <div>
                   <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-6 group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:scale-110 transition-all duration-300">
                     <Play size={24} className="text-white fill-current ml-1"/>
                   </div>
                   <h3 className="text-3xl md:text-4xl font-bold text-white leading-none tracking-tighter">
                     {SERVICES[activeService].videoTitle}
                   </h3>
                 </div>
               </div>

               {/* Imagem de Fundo (Opcional - Noise) */}
               <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
            </div>

          </div>
        </section>

        {/* SESSÃO 4: ACADEMY TEASER */}
        <section className="py-32 bg-neutral-900/30 border-t border-white/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
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
          
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
        </section>
      </main>

      <Footer />
    </div>
  );
}