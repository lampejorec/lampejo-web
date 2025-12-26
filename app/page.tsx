import Image from 'next/image';
import Navbar from './components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    // Adicionei 'relative' para poder posicionar o fundo 'absolute' dentro dele
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* --- CAMADA 1: A IMAGEM DE FUNDO --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/bg-home.jpg" // O nome do arquivo que você colocou na pasta public
          alt="Background Lente Cinema"
          fill // Faz a imagem preencher todo o espaço
          className="object-cover" // Garante que não distorça, cortando as bordas se precisar
          priority // Carrega com prioridade máxima
          quality={90} // Alta qualidade
        />
        {/* --- CAMADA 2: A PELÍCULA ESCURA (Overlay) --- */}
        {/* Mude o 'bg-black/60' para /40 se quiser mais claro, ou /80 se quiser mais escuro */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* --- CAMADA 3: O CONTEÚDO REAL (Precisa de z-index alto) --- */}
      {/* Navbar já tem z-index alto no componente dela */}
      <Navbar /> 
      
      {/* Adicionei 'relative z-10' para garantir que o texto fique SOBRE a imagem */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-20 text-center relative z-10">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none text-white">
          AUDIOVISUAL NA <br />
          {/* Mudei ligeiramente o gradiente para se destacar mais sobre o fundo novo */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            VELOCIDADE DO AGORA.
          </span>
        </h1>
        
        <p className="max-w-2xl text-gray-300 text-lg md:text-xl mb-10 font-light">
          Nascemos para encurtar a distância entre a ideia e o play. 
          Sem burocracia. Apenas fluxo e qualidade cinematográfica.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/portfolio" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-all rounded-sm">
            Ver Trabalhos
          </Link>
          {/* Link corrigido para /contato (iremos criar a página em breve) */}
          <Link href="/contato" className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all rounded-sm backdrop-blur-sm">
            Iniciar Projeto
          </Link>
        </div>
      </section>

      <footer className="py-10 text-center text-gray-500 text-sm border-t border-white/10 relative z-10">
        <p>© 2025 LAMPEJO. Todos os direitos reservados.</p>
        <p>Brasília, DF.</p>
      </footer>
    </main>
  );
}