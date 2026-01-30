import Image from "next/image";
import Link from "next/link";
import { 
  MessageCircle, 
  Youtube, 
  Linkedin, 
  Instagram, 
  Mail, 
  ArrowUpRight,
  MonitorPlay,
  GraduationCap,
  Newspaper
} from "lucide-react";

export default function LinksPage() {
  // --- CONFIGURE SEUS LINKS AQUI ---
  const socialLinks = {
    whatsapp: "https://wa.me/5561994079423?text=Ol%C3%A1%2C%20vim%20pelo%20Instagram%20e%20gostaria%20de%20falar%20sobre%20um%20projeto.", // Coloque seu número
    instagram: "https://www.instagram.com/lenzaudiovisual/",
    linkedin: "https://www.linkedin.com/in/lenzaudiovisual/",
    youtube: "https://youtube.com/@lenzAudiovisual",
    facebook: "https://facebook.com/lenzaudiovisual",
    email: "mailto:contato@lenzaudiovisual.com.br"
  };

  const buttons = [
    {
      id: 1,
      label: "Iniciar um Projeto",
      sublabel: "Fale diretamente conosco no WhatsApp",
      url: socialLinks.whatsapp,
      icon: MessageCircle,
      highlight: true, // Botão de destaque
    },
    {
      id: 2,
      label: "Nosso Portfólio",
      sublabel: "Veja nossos filmes e produções",
      url: "/portfolio",
      icon: MonitorPlay,
      highlight: false,
    },
    {
      id: 3,
      label: "LENZ Academy",
      sublabel: "Cursos, LUTs e Materiais",
      url: "/academy",
      icon: GraduationCap,
      highlight: false,
    },
    {
      id: 4,
      label: "Ler Insights",
      sublabel: "Artigos sobre mercado e técnica",
      url: "/insights",
      icon: Newspaper,
      highlight: false,
    },
    {
      id: 5,
      label: "Canal do YouTube",
      sublabel: "Tutoriais e Making ofs",
      url: socialLinks.youtube,
      icon: Youtube,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center py-12 px-6 relative overflow-hidden selection:bg-purple-500/30">
      
      {/* BACKGROUND ANIMADO (AMBIENT LIGHT) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        
        {/* LOGO / AVATAR */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
          <div className="relative w-28 h-28 rounded-full bg-black border-2 border-white/10 overflow-hidden flex items-center justify-center p-4">
             {/* Se quiser usar a logo do arquivo, descomente a linha abaixo e comente o texto */}
             {/* <Image src="/logo-lenz.png" alt="LENZ" width={100} height={100} className="object-contain" /> */}
             <span className="font-bold text-2xl tracking-tighter">LENZ</span>
          </div>
        </div>

        {/* HEADER TEXT */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold tracking-tight mb-2">LENZ Audiovisual</h1>
          <p className="text-neutral-400 text-sm max-w-xs mx-auto">
            Transformamos ideias em narrativas visuais que prendem e convertem.
          </p>
        </div>

        {/* LISTA DE BOTÕES */}
        <div className="w-full flex flex-col gap-4">
          {buttons.map((btn) => (
            <Link 
              key={btn.id} 
              href={btn.url}
              target={btn.url.startsWith("http") ? "_blank" : "_self"}
              className={`
                group relative flex items-center p-4 rounded-xl transition-all duration-300
                border hover:scale-[1.02] active:scale-[0.98]
                ${btn.highlight 
                  ? "bg-white text-black border-white hover:bg-neutral-200" 
                  : "bg-neutral-900/50 backdrop-blur-md border-white/10 hover:border-white/30 text-white hover:bg-white/5"
                }
              `}
            >
              <div className={`
                p-3 rounded-full mr-4 transition-colors
                ${btn.highlight ? "bg-black/5 text-black" : "bg-white/5 text-white group-hover:bg-white/10"}
              `}>
                <btn.icon size={20} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-sm">{btn.label}</h3>
                <p className={`text-xs ${btn.highlight ? "text-neutral-600" : "text-neutral-500"}`}>
                  {btn.sublabel}
                </p>
              </div>

              <ArrowUpRight 
                size={16} 
                className={`opacity-50 group-hover:opacity-100 transition-opacity ${btn.highlight ? "text-black" : "text-white"}`} 
              />
            </Link>
          ))}
        </div>

        {/* RODAPÉ DE ÍCONES SOCIAIS */}
        <div className="mt-12 flex gap-6">
          <a href={socialLinks.email} className="text-neutral-500 hover:text-white transition-colors hover:scale-110 transform">
            <Mail size={24} />
          </a>
          <a href={socialLinks.linkedin} target="_blank" className="text-neutral-500 hover:text-[#0077b5] transition-colors hover:scale-110 transform">
            <Linkedin size={24} />
          </a>
          <a href={socialLinks.instagram} target="_blank" className="text-neutral-500 hover:text-[#E1306C] transition-colors hover:scale-110 transform">
            <Instagram size={24} />
          </a>
        </div>

        <p className="mt-8 text-xs text-neutral-600 font-mono uppercase tracking-widest">
          © 2025 lenzaudiovisual.com.br
        </p>

      </div>
    </div>
  );
}