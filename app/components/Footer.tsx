import Link from "next/link";
import { Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t border-white/10 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* COLUNA 1: MARCA */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">LENZ</h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
              Somos o ponto de convergência entre a luz e a ideia.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Youtube size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* COLUNA 2: MAPA */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-6 tracking-widest">Explorar</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/portfolio" className="hover:text-purple-400 transition-colors">Portfólio</Link></li>
              <li><Link href="/academy" className="hover:text-purple-400 transition-colors">Academy</Link></li>
              <li><Link href="/insights" className="hover:text-purple-400 transition-colors">Insights</Link></li>
              <li><Link href="/contato" className="hover:text-purple-400 transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* COLUNA 3: CONTATO */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-6 tracking-widest">Fale Conosco</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <span className="block text-neutral-500 text-xs mb-1">Novos Projetos</span>
                <a href="mailto:contato@lenzaudiovisual.com.br" className="hover:text-purple-400 transition-colors">contato@lenzaudiovisual.com.br</a>
              </li>
              <li>
                <span className="block text-neutral-500 text-xs mb-1">WhatsApp</span>
                <a href="https://wa.me/5561994079423" className="hover:text-purple-400 transition-colors">+55 61 9 9407-9423</a>
              </li>
            </ul>
          </div>

          {/* COLUNA 4: ENDEREÇO */}
          <div>
            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-6 tracking-widest">QG</h3>
            <address className="text-sm not-italic text-neutral-400 leading-relaxed">
              Lago Sul, Brasília - DF<br />
              Brasil<br />
              <span className="block mt-4 text-xs text-neutral-600">CNPJ 63.030.132/0001-86</span>
            </address>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-600">© 2025 LENZ Audiovisual. Todos os direitos reservados.</p>
          <p className="text-xs text-neutral-700 flex items-center gap-1">
            Design by <span className="text-white font-bold">LENZ</span>
          </p>
        </div>
      </div>
    </footer>
  );
}