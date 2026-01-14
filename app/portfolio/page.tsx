"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, PlayCircle, Instagram, Youtube, MonitorPlay, Film } from "lucide-react";
import Image from "next/image";

// --- TIPO DE DADOS ---
type VideoType = "Reels" | "Youtube" | "Cinema";

interface Project {
  id: string; 
  title: string;
  type: VideoType;
  image: string; 
  link: string;  
}

interface ClientData {
  id: string;
  name: string;
  logo: string;
  description: string; 
  fullDescription?: string;
  invert?: boolean;
  projects: Project[];
}

// --- DADOS ---
const clientsData: ClientData[] = [
  // CLIENTE: NIC.BR (NOVO - COMPLETO)
  {
    id: "nicbr",
    name: "NIC.br",
    logo: "/nicbr.png",
    description: "Núcleo de Informação e Coordenação do Ponto BR. Cobertura de eventos de infraestrutura e governança da internet.",
    fullDescription: `
      O NIC.br é o braço executivo do Comitê Gestor da Internet no Brasil (CGI.br), responsável por coordenar e integrar as iniciativas de serviços da Internet no país.
      
      A Lampejo atua como parceira audiovisual na cobertura de grandes eventos técnicos, como a Semana de Infraestrutura e o IX Fórum. Nosso desafio é transformar temas complexos de tecnologia, segurança e governança em conteúdos dinâmicos e acessíveis.
      
      Realizamos desde a captação integral de palestras até a produção de "Melhores Momentos" e entrevistas, garantindo que o conhecimento gerado nesses encontros alcance um público ainda maior.
    `,
    projects: [
      {
        id: "nic_vid1",
        title: "O Futuro do Jornalismo em Debate: Seminário CGI.br (Resumo 4K) | Produção Lampejo",
        type: "Youtube",
        image: "https://img.youtube.com/vi/wxYwa6FBCG8/maxresdefault.jpg",
        link: "https://youtu.be/wxYwa6FBCG8"
      },
      {
        id: "nic_vid2",
        title: "15ª Semana de Infraestrutura da Internet no Brasil: Recorde de Público e Inovação",
        type: "Youtube",
        image: "https://img.youtube.com/vi/QQgNEAxNmu0/maxresdefault.jpg",
        link: "https://youtu.be/QQgNEAxNmu0"
      },
      {
        id: "nic_vid3",
        title: "Lançamento TIC Provedores 2024: Os desafios de Qualidade e Segurança | Cobertura Semana de Infra",
        type: "Youtube",
        image: "https://img.youtube.com/vi/FADq90T95YA/maxresdefault.jpg",
        link: "https://youtu.be/FADq90T95YA"
      },
      {
        id: "nic_vid4",
        title: "35 Anos do Domínio .br: Sessão Solene na Câmara dos Deputados | NIC.br",
        type: "Youtube",
        image: "https://img.youtube.com/vi/5o5KVqQsNT8/maxresdefault.jpg",
        link: "https://youtu.be/5o5KVqQsNT8"
      },
      {
        id: "nic_vid5",
        title: "Para Além do Acesso: Debates sobre Conectividade Significativa | Cetic.br",
        type: "Youtube",
        image: "https://img.youtube.com/vi/sDlfm4sPM1s/maxresdefault.jpg",
        link: "https://youtu.be/sDlfm4sPM1s"
      },
      {
        id: "nic_vid6",
        title: "NETmundial+10: O Brasil no Centro do Debate Global sobre a Internet | Cobertura Oficial",
        type: "Youtube",
        image: "https://img.youtube.com/vi/x5Gqf0Tbg14/maxresdefault.jpg",
        link: "https://youtu.be/x5Gqf0Tbg14"
      },
      {
        id: "nic_vid7",
        title: "A Voz da Juventude na Governança Digital: Programa Youth no NETmundial+10",
        type: "Youtube",
        image: "https://img.youtube.com/vi/AeQ5mwh_mjQ/maxresdefault.jpg",
        link: "https://youtu.be/AeQ5mwh_mjQ"
      },
      {
        id: "nic_vid8",
        title: "A História da Internet no Brasil: NIC.br celebra 35 anos do .br | Produção Lampejo",
        type: "Youtube",
        image: "https://img.youtube.com/vi/a83MeM-KdKo/maxresdefault.jpg",
        link: "https://youtu.be/a83MeM-KdKo"
      },
      {
        id: "nic_vid9",
        title: "Tour pela 15ª Semana de Infraestrutura da Internet",
        type: "Youtube",
        image: "https://img.youtube.com/vi/nowQ1VjkI3Q/maxresdefault.jpg",
        link: "https://youtu.be/nowQ1VjkI3Q"
      }
    ]
  },
  // CLIENTE: HY PRODUÇÕES
  {
    id: "hyproducoes",
    name: "HY Produções",
    logo: "/hy.png",
    description: "Produção de eventos corporativos e experiências de marca com excelência.",
    fullDescription: `
      A Lampejo Audiovisual atua como parceira estratégica de conteúdo para a HY Produções & Eventos, registrando o crescimento e a magnitude de suas entregas.
      
      Nesta seleção, destacamos a versatilidade da nossa parceria: desde filmes institucionais que marcam a nova fase da empresa, até a cobertura Real-Time de grandes congressos como o 75º ENCAT e eventos sociais.
      
      Nosso objetivo é traduzir em vídeo a infraestrutura de ponta e o cuidado aos detalhes que consolidam a HY como referência no setor de eventos.
    `,
    projects: [
      {
        id: "hy_nova_fase",
        title: "Institucional: A Nova Fase da HY",
        type: "Cinema",
        image: "https://img.youtube.com/vi/x9Inswbubok/maxresdefault.jpg",
        link: "https://www.youtube.com/watch?v=x9Inswbubok"
      },
      {
        id: "hy_encat",
        title: "Cobertura Real-Time: 75º ENCAT",
        type: "Youtube",
        image: "https://img.youtube.com/vi/N1AycrlH2nY/maxresdefault.jpg",
        link: "https://www.youtube.com/watch?v=N1AycrlH2nY"
      },
      {
        id: "hy_social",
        title: "Experiência e Cenografia: Evento Social",
        type: "Cinema",
        image: "https://img.youtube.com/vi/Guk7voKRXME/maxresdefault.jpg",
        link: "https://youtu.be/Guk7voKRXME"
      }
    ]
  },
  // CLIENTE: ESTADÃO
  {
    id: "estadao",
    name: "Estadão",
    logo: "/estadao.png",
    description: "Cobertura estratégica de fóruns nacionais, transformando debates complexos em conteúdo multiplataforma.",
    fullDescription: `
      Como parceiros de conteúdo audiovisual do Estadão em Brasília, a Lampejo tem a missão de ampliar o alcance dos principais fóruns e seminários promovidos pelo veículo.
      
      Nossa atuação vai além do registro: transformamos horas de debates técnicos sobre Segurança Pública, Saúde e Economia em narrativas acessíveis e ágeis. 
      
      Entregamos desde a cobertura completa dos painéis (formato broadcast) até pílulas dinâmicas (Reels/Shorts) para redes sociais, garantindo que a informação de qualidade circule em todas as plataformas com a credibilidade da marca Estadão.
    `,
    projects: [
      {
        id: "est_seguranca_painel",
        title: "Seminário de Segurança Pública: A Convergência Necessária",
        type: "Youtube",
        image: "https://img.youtube.com/vi/b0sVn7eHBng/maxresdefault.jpg",
        link: "https://youtu.be/b0sVn7eHBng"
      },
      {
        id: "est_saude_painel",
        title: "Fórum Saúde: A Missão de Eliminar o Câncer",
        type: "Youtube",
        image: "https://img.youtube.com/vi/_Lli5m9tcnI/maxresdefault.jpg",
        link: "https://youtu.be/_Lli5m9tcnI"
      },
      {
        id: "est_saude_shorts",
        title: "Giro Estadão: Avanços na Vacinação HPV",
        type: "Reels",
        image: "https://img.youtube.com/vi/ImWtX3bo-0w/maxresdefault.jpg",
        link: "https://youtube.com/shorts/ImWtX3bo-0w"
      },
      {
        id: "est_seguranca_shorts",
        title: "Highlights: Um Novo Modelo de Segurança?",
        type: "Reels",
        image: "https://img.youtube.com/vi/dc1jaXybPKw/maxresdefault.jpg",
        link: "https://youtube.com/shorts/dc1jaXybPKw"
      },
      {
        id: "est_coccao_limpa",
        title: "Fórum Estadão Think: O Desafio da Cocção Limpa no Brasil | Cobertura Real-Time",
        type: "Reels",
        // Use thumb-coccao.jpg se você salvou, ou hqdefault como fallback seguro
        image: "https://img.youtube.com/vi/ykZbQL3smxg/hqdefault.jpg",
        link: "https://youtube.com/shorts/ykZbQL3smxg?feature=share"
      }
    ]
  },
  // CLIENTE: THREADS
  {
    id: "threads",
    name: "Threads Concept",
    logo: "/threads.png",
    invert: true, // para logos escuras
    description: "O maior encontro científico dedicado exclusivamente aos Fios Faciais e à Estética Regenerativa no Brasil.",
    fullDescription: `
      Bem-vindos à cobertura oficial do Threads Concept Conference, um dos maiores encontros científicos dedicados aos Fios Faciais e à Estética Regenerativa no Brasil.
      
      Realizado no Royal Tulip em Brasília, o evento consolidou a capital federal como um polo nacional da Harmonização Orofacial. Sob a idealização dos especialistas Dra. Juliane Guiotti e Dr. Diogo Lustosa, o congresso reuniu grandes nomes da saúde estética para debater técnicas avançadas.
      
      A atuação da Lampejo foi estratégica e ágil: além da cobertura completa, cuidamos da produção dos vídeos resumos e da edição especial exibida no telão ao final de cada dia (Same Day Edit). Essa entrega em tempo real permitiu que os congressistas revivessem os melhores momentos instantaneamente, elevando a experiência do evento.
    `,
    projects: [
      {
        id: "threads_aftermovie",
        title: "Aftermovie Oficial Threads 2024",
        type: "Cinema",
        image: "https://img.youtube.com/vi/ccAmCKWbv0Y/maxresdefault.jpg",
        link: "https://youtu.com/ccAmCKWbv0Y?si=bNhK1Xy-VgVGIBr5"
      },
      {
        id: "threads_highlights",
        title: "Highlights: Ciência e Naturalidade",
        type: "Youtube",
        image: "https://img.youtube.com/vi/RbaCJ3wbB1g/maxresdefault.jpg",
        link: "https://youtu.com/RbaCJ3wbB1g?si=PKWdQFAFODa-S977"
      }
    ]
  },
  // CLIENTE: SEM RÓTULO
  {
    id: "semrotulo",
    name: "Sem Rótulo",
    logo: "/semrotulo.png",
    description: "A Revolução da Beleza Limpa. Série de conteúdos verticais desmistificando a indústria cosmética.",
    fullDescription: `
      Apresentamos a série de conteúdos estratégicos produzida pela Lampejo Audiovisual para a Sem Rótulo Cosméticos, captada durante o Threads Concept Conference, em Brasília.
      
      Neste projeto, desenvolvemos uma narrativa visual para as fundadoras Melyssa Esser e Lais Theis, com o objetivo de desmistificar a indústria da beleza tradicional. Abordamos a importância da leitura de rótulos, o alerta sobre ingredientes tóxicos e como a saúde da pele começa pela nutrição.
      
      O resultado não foi apenas uma cobertura de evento, mas um posicionamento de marca sólido: a Sem Rótulo não vende apenas cosméticos, vende consciência e saúde integrativa.
    `,
    projects: [
      {
        id: "vid1",
        title: "O Perigo nas Letras Miúdas",
        type: "Reels",
        image: "https://img.youtube.com/vi/JjAYcyPIA8w/maxresdefault.jpg",
        link: "https://youtube.com/shorts/JjAYcyPIA8w"
      },
      {
        id: "vid2",
        title: "Nutrição vs. Cosméticos",
        type: "Reels",
        image: "https://img.youtube.com/vi/1o8-XBJSf_Q/maxresdefault.jpg",
        link: "https://youtube.com/shorts/1o8-XBJSf_Q"
      },
      {
        id: "vid3",
        title: "O Básico: Água e Sono",
        type: "Reels",
        image: "https://img.youtube.com/vi/cTPSTsAlPlE/maxresdefault.jpg",
        link: "https://youtube.com/shorts/cTPSTsAlPlE"
      },
      {
        id: "vid4",
        title: "Gloss com Vitaminas",
        type: "Reels",
        image: "https://img.youtube.com/vi/E26tmGSkg7g/maxresdefault.jpg",
        link: "https://youtube.com/shorts/E26tmGSkg7g"
      },
      {
        id: "vid5",
        title: "Alerta Sobre Sua Saúde",
        type: "Reels",
        image: "https://img.youtube.com/vi/DB8VZAW83bo/maxresdefault.jpg",
        link: "https://youtube.com/shorts/DB8VZAW83bo"
      }
    ]
  },
  // OUTROS CLIENTES (PLACEHOLDERS)
  {
    id: "safernet",
    name: "Safernet",
    logo: "/safernet.png",
    description: "Campanhas de conscientização e segurança digital com impacto social.",
    projects: []
  },
  {
    id: "sinicon",
    name: "Sinicon",
    logo: "/sinicon.png",
    description: "Infraestrutura e construção pesada.",
    projects: []
  },
  {
    id: "caadf",
    name: "CAADF",
    logo: "/caadf.png",
    description: "Cobertura de eventos e conteúdo institucional.",
    projects: []
  },
  {
    id: "oabdf",
    name: "OAB/DF",
    logo: "/oabdf.png",
    description: "Conteúdo jurídico.",
    projects: []
  }
];

export default function Portfolio() {
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // --- FUNÇÃO DE EMBED ROBUSTA ---
  const getEmbedUrl = (videoLink: string): string | null => {
    try {
      if (!videoLink) return null;

      const url = new URL(videoLink);
      let videoId = "";

      if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      } else if (url.pathname.includes("/shorts/")) {
        const parts = url.pathname.split("/shorts/");
        videoId = parts[1] ? parts[1] : "";
      } else if (url.searchParams.has("v")) {
        videoId = url.searchParams.get("v") || "";
      }

      if (videoId.includes("&")) videoId = videoId.split("&")[0];
      if (videoId.includes("?")) videoId = videoId.split("?")[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&playsinline=1`;
      }
    } catch (error) {
      console.error("Erro ao processar URL:", videoLink, error);
    }
    return null;
  };

  const getTypeIcon = (type: VideoType) => {
    switch (type) {
      case "Reels": return <Instagram size={16} />;
      case "Youtube": return <Youtube size={16} />;
      case "Cinema": return <Film size={16} />;
      default: return <MonitorPlay size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 px-6 max-w-7xl mx-auto w-full pb-20">
        
        {/* VIEW 1: SELEÇÃO DE CLIENTES */}
        {!selectedClient && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                PORTFÓLIO <span className="text-neutral-600">POR CLIENTE</span>
              </h1>
              <p className="text-neutral-400 max-w-2xl text-lg mx-auto md:mx-0">
                Selecione uma marca para explorar os projetos e narrativas que construímos juntos.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {clientsData.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="group relative aspect-square bg-white rounded-2xl flex items-center justify-center p-8 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl overflow-hidden border border-transparent hover:border-purple-500/50"
                >
                  <div className="relative w-full h-full p-4">
                    {/* COR DA LOGO RETOMADA: Removi 'grayscale' e 'opacity'. Mantive apenas o 'invert' para Threads */}
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      className={`object-contain transition-all duration-500 group-hover:scale-110 ${client.id === 'threads' ? 'invert' : ''}`}
                    />
                  </div>
                  <div className="absolute bottom-4 left-0 w-full text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest bg-white/90 px-3 py-1 rounded-full">Ver Projetos</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: DENTRO DO CLIENTE */}
        {selectedClient && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            
            {/* HEADER COM DESCRIÇÃO COMPLETA */}
            <div className="mb-12">
              <button 
                onClick={() => { setSelectedClient(null); setActiveVideoId(null); }}
                className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Voltar ao Menu
              </button>

              <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
                {/* Logo Grande */}
                <div className="w-32 h-32 md:w-40 md:h-40 relative bg-white rounded-2xl p-4 flex-shrink-0">
                   <Image 
                     src={selectedClient.logo} 
                     alt={selectedClient.name} 
                     fill 
                     className={`object-contain p-4 ${selectedClient.id === 'threads' ? 'invert' : ''}`} 
                   />
                </div>

                {/* Textos */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                    {selectedClient.name}
                  </h2>
                  
                  <div className="text-neutral-300 leading-relaxed text-lg space-y-4 max-w-3xl">
                    {(selectedClient.fullDescription || selectedClient.description).split('\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {/* TAGS DINÂMICAS */}
                    {selectedClient.id === 'estadao' && (
                        <>
                          <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Multiplataforma</span>
                          <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Broadcast</span>
                        </>
                    )}
                    {selectedClient.id === 'nicbr' && (
                       <>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Infraestrutura</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Tecnologia</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Live Streaming</span>
                      </>
                    )}
                    {selectedClient.id === 'threads' && (
                      <>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Aftermovie</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Cinema</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Same Day Edit</span>
                      </>
                    )}
                    {selectedClient.id === 'semrotulo' && (
                       <>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Social Video</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Estratégia</span>
                      </>
                    )}
                    {selectedClient.id === 'hyproducoes' && (
                       <>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Institucional</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Eventos</span>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs font-bold uppercase text-neutral-400">Real-Time</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 my-12" />

            {/* GRID DE VÍDEOS (INLINE PLAYER) */}
            <div className={`grid gap-8 ${selectedClient.projects.some(p => p.type !== 'Reels') ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {selectedClient.projects.map((project) => (
                <div 
                  key={project.id}
                  className={`relative rounded-xl overflow-hidden bg-neutral-900 border border-white/5 transition-all ${
                    project.type === "Reels" 
                      ? "aspect-[9/16] max-w-[320px] mx-auto w-full" 
                      : "aspect-video w-full" 
                  } ${activeVideoId === project.id ? "ring-2 ring-purple-500 shadow-purple-500/20 shadow-lg" : "hover:border-purple-500/30"}`}
                >
                  
                  {activeVideoId === project.id ? (
                    <div className="absolute inset-0 w-full h-full bg-black">
                      {/* IFRAME COM VALIDAÇÃO: SÓ RENDERIZA SE TIVER URL VÁLIDA */}
                      {getEmbedUrl(project.link) ? (
                        <iframe 
                          src={getEmbedUrl(project.link)!} 
                          className="w-full h-full"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-neutral-500 gap-2">
                          <Film size={32} />
                          <p className="text-sm font-bold">Vídeo Indisponível</p>
                          <p className="text-xs text-neutral-600">Link inválido ou privado</p>
                        </div>
                      )}
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveVideoId(null); }}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-red-500/80 transition-colors z-20"
                        title="Parar vídeo"
                      >
                         <div className="w-2 h-2 bg-white rounded-sm m-1"></div>
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="group cursor-pointer w-full h-full relative"
                      onClick={() => setActiveVideoId(project.id)}
                    >
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.style.backgroundColor = '#171717';
                        }}
                      />
                      
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/10 z-10">
                        {getTypeIcon(project.type)}
                        {project.type}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                          <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform z-10">
                        <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

            {selectedClient.projects.length === 0 && (
              <div className="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
                <p>Em breve os projetos deste cliente estarão disponíveis.</p>
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}