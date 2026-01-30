"use client";

import { useState } from "react";
import Image from "next/image"; 
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ArrowRight, Play, Quote } from "lucide-react";

// DADOS (Mantidos aqui para não quebrar o código, mas não serão usados visualmente)
const SERVICES = [
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
    text: "A LENZ entregou em 2 horas o que outras agências pediam 2 dias. A qualidade cinematográfica no real-time é surreal.",
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

  return (
    <div className="bg-black text-white selection:bg-purple-500/30 overflow-x-hidden font-sans">
      <Navbar />

      <main>
        {/* SESSÃO 1: HERO */}
        <section className="h-[100dvh] flex flex-col justify-center items-center px-6 text-center relative overflow-hidden pt-20 md:pt-0">
          
          {/* DESKTOP VIDEO */}
          <div className="hidden md:block absolute inset-0 z-0">
            <video 
              className="w-full h-full object-cover opacity-60" 
              autoPlay 
              loop 
              muted 
              playsInline 
              poster="/poster-home.jpg"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* MOBILE IMAGE */}
          <div className="md:hidden absolute inset-0 z-0">
            <Image
              src="/poster-home.jpg"
              alt="Lenz Background"
              fill
              priority
              className="object-cover opacity-50"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-purple-900/20 blur-[100px] rounded-full animate-glow z-0 pointer-events-none mix-blend-screen" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-8xl font-bold tracking-tighter mb-6 animate-in slide-in-from-bottom-10 fade-in duration-1000 leading-tight">
              SOMOS O PONTO DE 
              CONVERGÊNCIA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                ENTRE A LUZ E A IDEIA.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-neutral-300 mb-10 leading-relaxed animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-200 px-4">
              Nascemos para encurtar a distância entre a ideia e o play. <br className="hidden md:block"/>
              Sem burocracia. Apenas fluxo e qualidade cinematográfica.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300 w-full px-4 md:px-0">
              <Link href="/portfolio" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-transform active:scale-95 w-full md:w-auto">
                VER TRABALHOS
              </Link>
              <Link href="/contato" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 w-full md:w-auto">
                INICIAR PROJETO <ArrowRight size={18}/>
              </Link>
            </div>
          </div>
        </section>

{/* SESSÃO 2: CLIENTES OTIMIZADA */}
<section className="py-12 bg-white overflow-hidden">
  <div className="w-full">
    <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.2em] mb-8 text-center">
      Marcas que confiam no nosso olhar
    </p>
    
    {/* CORREÇÃO DO SCROLL INFINITO AQUI */}
    <div className="flex overflow-hidden relative w-full group mask-linear-fade">
      
      {/* FAIXA 1 */}
      <div className="flex animate-scroll min-w-full flex-shrink-0 justify-around items-center gap-12 px-4">
        {CLIENTS.map((client, index) => (
          <div key={`a-${index}`} className="relative w-32 h-14 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 flex items-center justify-center">
            <Image 
              src={client.logo} 
              alt={client.name}
              width={140}
              height={70}
              className="object-contain w-auto h-full max-w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* FAIXA 2 (Cópia exata para cobrir o buraco) */}
      <div className="flex animate-scroll min-w-full flex-shrink-0 justify-around items-center gap-12 px-4" aria-hidden="true">
        {CLIENTS.map((client, index) => (
          <div key={`b-${index}`} className="relative w-32 h-14 grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 flex items-center justify-center">
            <Image 
              src={client.logo} 
              alt={client.name}
              width={140}
              height={70}
              className="object-contain w-auto h-full max-w-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>

    </div>
  </div>
</section>

        {/* --- SEÇÕES OCULTAS TEMPORARIAMENTE (DEPOIMENTOS, SERVIÇOS E ACADEMY) --- */}

        {/* <section className="py-20 bg-neutral-900 border-y border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-black/50 border border-white/10 p-8 rounded-2xl relative">
                  <Quote className="text-purple-500 mb-4 opacity-50" size={32} />
                  <p className="text-lg md:text-xl text-neutral-300 italic mb-6 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-white">{t.author}</p>
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-widest">{t.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 md:order-1">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none mb-8">
                CRIAMOS NARRATIVAS <br /> QUE PRENDEM.
              </h2>
              <div className="min-h-[100px]">
                  <p className="text-lg text-neutral-400 leading-relaxed mb-8">
                    {SERVICES[activeService].description}
                  </p>
              </div>
              
              <div className="space-y-4">
                {SERVICES.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveService(index)}
                    className={`w-full flex items-center gap-4 text-lg md:text-xl font-medium border-b border-white/10 pb-4 transition-colors text-left group ${activeService === index ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'}`}
                    aria-label={`Ver serviço ${item.title}`}
                  >
                    <span className={`w-2 h-2 rounded-full transition-transform ${activeService === index ? 'bg-blue-500 scale-125' : 'bg-neutral-800'}`} />
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative order-1 md:order-2 aspect-video md:aspect-[4/5] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
               <div className="absolute inset-0 bg-neutral-900" /> 
               
               <div className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-neutral-800 to-black ${activeService % 2 === 0 ? 'opacity-100' : 'opacity-80'}`} />
               
               <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12 z-20">
                 <div className="flex justify-between items-start">
                   <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                     {SERVICES[activeService].tag}
                   </span>
                 </div>

                 <div>
                   <button 
                     className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mb-6 hover:bg-blue-600 hover:border-blue-500 hover:scale-110 transition-all duration-300"
                     aria-label="Play Case"
                   >
                     <Play size={24} className="text-white fill-current ml-1"/>
                   </button>
                   <h3 className="text-2xl md:text-3xl font-bold text-white leading-none tracking-tighter max-w-[80%]">
                     {SERVICES[activeService].videoTitle}
                   </h3>
                 </div>
               </div>
            </div>

          </div>
        </section>

        <section className="py-32 bg-neutral-950 border-t border-white/5 relative">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <span className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold tracking-widest uppercase mb-6">
              LENZ ACADEMY
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
              COMPARTILHAMOS <br /> O CÓDIGO FONTE.
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
              Não guardamos segredos. Acesse nossos cursos, LUTs e processos de trabalho na LENZ Academy.
            </p>
            <Link 
              href="/academy" 
              className="inline-flex items-center gap-2 text-white border-b border-white/30 pb-1 hover:text-purple-400 hover:border-purple-400 transition-colors text-lg"
            >
              EXPLORAR A ACADEMY 
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
        */}

      </main>
      
      <Footer />
    </div>
  );
}