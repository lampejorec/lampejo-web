import Navbar from '@/app/components/Navbar';

export default function Politica() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <section className="pt-32 px-6 max-w-4xl mx-auto pb-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-8">
          POLÍTICA DE PRIVACIDADE
        </h1>

        <div className="prose prose-invert prose-lg text-gray-400">
          <p className="mb-6">
            Última atualização: Dezembro de 2025.
          </p>

          <p className="mb-6">
            A <strong>LENZ AUDIOVISUAL</strong> preza pela transparência e segurança dos dados de seus usuários. 
            Esta Política de Privacidade descreve como coletamos e utilizamos suas informações ao acessar nosso portfólio.
          </p>

          <h3 className="text-white text-xl font-bold mt-8 mb-4">1. COLETA DE DADOS</h3>
          <p className="mb-4">
            Nós coletamos o mínimo de dados necessários para o funcionamento do site:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Cookies de Navegação:</strong> Pequenos arquivos de texto salvos no seu navegador para melhorar a performance e lembrar suas preferências.</li>
            <li><strong>Métricas de Acesso:</strong> Podemos utilizar ferramentas anônimas para saber quantas pessoas visitaram o site.</li>
          </ul>

          <h3 className="text-white text-xl font-bold mt-8 mb-4">2. CONTEÚDO DE TERCEIROS</h3>
          <p className="mb-6">
            Nosso site exibe vídeos hospedados em plataformas externas (YouTube e Vimeo). Ao interagir com esses vídeos, essas plataformas podem utilizar seus próprios cookies.
          </p>

          <h3 className="text-white text-xl font-bold mt-8 mb-4">3. SEUS DIREITOS (LGPD)</h3>
          <p className="mb-6">
            De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito de solicitar informações sobre qualquer dado pessoal que tenhamos armazenado.
          </p>

          <div className="mt-12 pt-12 border-t border-white/10">
            <p className="text-sm">
              Dúvidas? Entre em contato: <br />
              <span className="text-white">contato@lenzaudiovisual.com.br</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}