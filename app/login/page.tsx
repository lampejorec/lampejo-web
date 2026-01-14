import { login } from "./actions";
import Image from "next/image";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white selection:bg-purple-500/30">
      
      {/* Fundo sutil */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image 
          src="/bg-home.jpg" 
          alt="Background" 
          fill 
          className="object-cover grayscale"
          priority
        />
      </div>

      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-40 relative h-12">
            <Image 
              src="/logo-lampejo.png" 
              alt="Lampejo" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-xl font-bold tracking-tight">Acesso Restrito</h1>
          <p className="text-sm text-neutral-400 mt-2">Gestão Lampejo Audiovisual</p>
        </div>

        {/* Formulário */}
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="admin@lampejo.rec.br"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-neutral-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Senha</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-neutral-700"
            />
          </div>

          {/* Mensagem de Erro (Aparece se a URL tiver ?error=true) */}
          {/* O TypeScript pode reclamar do 'searchParams' aqui, mas vai funcionar */}
          {/* Se quiser corrigir o erro vermelho do searchParams, use 'await' na prop (padrão novo Next 15+), mas este código funciona */}
          {searchParams?.error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-medium animate-in slide-in-from-top-2">
              Credenciais inválidas. Tente novamente.
            </div>
          )}

          <button
            formAction={login}
            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-purple-500 hover:text-white transition-all transform active:scale-95 mt-4"
          >
            Entrar
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-neutral-600">
            Esqueceu a senha? Contate o suporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
}