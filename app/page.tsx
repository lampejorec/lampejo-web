import Header from './components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header/>

      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-20 text-center">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
          AUDIOVISUAL NA <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
            VELOCIDADE DO AGORA.
          </span>
        </h1>

        <p className="max-w-2xl text-gray-400 text-lg md:text-xl mb-10 font-light">
          Nascemos para encurtar a distância entre a ideia e o play. 
          Sem burocracia. Apenas fluxo e qualidade cinematográfica.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/portfolio" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm">
            Ver Trabalhos
          </Link>
          <Link href="/contato" className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all rounded-sm">
            Iniciar Projeto
          </Link>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-600 text-sm border-t border-white/5">
        <p>© 2025 LAMPEJO. Todos os direitos reservados.</p>
        <p>Brasília, DF.</p>
      </footer>
    </main>
  );
}