import Link from "next/link";
import Image from "next/image";
import Navbar from "./components/Navbar";

// AGORA VAI FUNCIONAR: Caminhos diretos na raiz /
const clients = [
  { name: "NIC.br", logo: "/nicbr.png" },
  { name: "CGI.br", logo: "/cgibr.png" },
  { name: "Safernet", logo: "/safernet.png" },
  { name: "CAADF", logo: "/caadf.png" },
  { name: "OAB/DF", logo: "/oabdf.png" },
  { name: "Estadão", logo: "/estadao.png" },
  { name: "HY Produções", logo: "/hy.png" },
];

export default function Home() {
  return (
    <div className="bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <main>
        {/* SESSÃO 1: HERO */}
        <section className="h-screen flex flex-col justify-center items-center px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 z-10">
            AUDIOVISUAL NA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              VELOCIDADE DO AGORA.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 max-w-3xl mb-12 z-10 leading-relaxed">
            Nascemos para encurtar a distância entre a ideia e o play. 
            Sem burocracia. Apenas fluxo e qualidade cinematográfica.
          </p>
          <div className="flex flex-col md:flex-row gap-6 z-10">
            <Link href="/portfolio" className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-200 transition-all hover:scale-105">
              VER TRABALHOS
            </Link>
            <Link href="/contato" className="border border-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              INICIAR PROJETO
            </Link>
          </div>
        </section>

        {/* SESSÃO 2: CLIENTES (Fundo Branco para Logos Coloridas) */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="max-w-full mx-auto text-center">
            <p className="text-sm text-neutral-800 font-bold uppercase tracking-widest mb-12">
              Quem confia no nosso olhar
            </p>
            
            <div className="relative flex overflow-x-hidden group py-4">
              
              {/* Máscaras laterais brancas */}
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

              {/* FAIXA 1 */}
              <div className="animate-scroll flex items-center gap-16 md:gap-24 pr-16 md:pr-24 whitespace-nowrap will-change-transform">
                {clients.map((client, index) => (
                  <div key={index} className="relative h-12 md:h-20 w-auto transition-all flex items-center justify-center hover:scale-105 duration-300">
                    <Image 
                      src={client.logo}
                      alt={`Logo ${client.name}`}
                      width={200}
                      height={100}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>

              {/* FAIXA 2 (Loop) */}
              <div className="animate-scroll flex items-center gap-16 md:gap-24 pr-16 md:pr-24 whitespace-nowrap will-change-transform" aria-hidden="true">
                {clients.map((client, index) => (
                  <div key={`dup-${index}`} className="relative h-12 md:h-20 w-auto transition-all flex items-center justify-center hover:scale-105 duration-300">
                    <Image 
                      src={client.logo}
                      alt={`Logo ${client.name}`}
                      width={200}
                      height={100}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* SESSÃO 3: O QUE FAZEMOS */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
                CRIAMOS NARRATIVAS <br />
                QUE PRENDEM.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed">
                Da captação dinâmica com gimbals de alta precisão até a colorimetria que define o mood. Nossa pós-produção não conserta erros, ela eleva a narrativa.
              </p>
              <ul className="space-y-4 pt-4">
                {["Direção de Fotografia", "Edição & Color Grading", "Cobertura de Eventos", "Conteúdo para Redes"].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-xl font-medium border-b border-white/10 pb-4">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[600px] bg-neutral-900 rounded-3xl overflow-hidden border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
              <div className="absolute bottom-8 left-8 z-20">
                <p className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-2">Showreel 2025</p>
                <h3 className="text-3xl font-bold text-white">ASSISTA AO MANIFESTO</h3>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </section>

        {/* SESSÃO 4: ACADEMY TEASER */}
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}