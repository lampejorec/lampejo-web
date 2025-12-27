import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Share2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { notFound } from "next/navigation";
import ShareButton from "@/app/components/ShareButton";

// --- DADOS DOS ARTIGOS ---
const articles = [
  {
    id: 1,
    title: "O Futuro do Audiovisual com IA",
    category: "IA & Tecnologia",
    date: "20 DEZ 2025",
    description: "Como ferramentas generativas estão mudando a pré-produção, o roteiro e o fluxo criativo das grandes agências.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop",
    slug: "futuro-ia",
    content: "A inteligência artificial não veio para substituir o artista, mas para acelerar a imaginação. Ferramentas como Midjourney e Runway Gen-2 permitem que diretores visualizem storyboards complexos em minutos, não dias. Neste artigo, exploramos como agências de ponta estão integrando esses fluxos para entregar pitches vencedores."
  },
  {
    id: 2,
    title: "Bastidores: Projeto Neon",
    category: "Making Of",
    date: "18 DEZ 2025",
    description: "Um breakdown completo da iluminação e color grading do nosso último comercial automotivo.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop",
    slug: "projeto-neon",
    content: "A luz neon é desafiadora para sensores digitais. O azul estoura, o vermelho perde textura. Para o comercial do novo SUV elétrico, utilizamos tubos de Astera Titan controlados via iPad para criar uma dança de luzes sincronizada com a trilha sonora. O segredo? Expor para os highlights e recuperar as sombras no DaVinci Resolve."
  },
  {
    id: 3,
    title: "Minimalismo na Edição",
    category: "Edição",
    date: "15 DEZ 2025",
    description: "Por que cortes secos e narrativas diretas estão dominando o mercado e retendo mais atenção.",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?q=80&w=2670&auto=format&fit=crop",
    slug: "minimalismo",
    content: "Vivemos a era da economia da atenção. O espectador médio decide se vai assistir ao seu vídeo nos primeiros 3 segundos. O minimalismo na edição remove transições desnecessárias e foca puramente no ritmo e na mensagem. Menos efeitos, mais história."
  },
  {
    id: 4,
    title: "A Psicologia das Cores",
    category: "Color Grading",
    date: "12 DEZ 2025",
    description: "Como o teal & orange manipula emoções e por que você deveria quebrar essa regra às vezes.",
    image: "https://images.unsplash.com/photo-1533158388470-9a56699990c6?q=80&w=2588&auto=format&fit=crop",
    slug: "psicologia-cores",
    content: "Cores não são apenas estética, são linguagem. O azul acalma e distancia; o laranja aproxima e aquece. O contraste complementar (Teal & Orange) domina Hollywood porque separa a pele humana (laranja) de qualquer fundo (azul/verde). Mas quando queremos causar desconforto ou estranheza, quebrar essa harmonia é a ferramenta mais poderosa do colorista."
  },
  {
    id: 5,
    title: "Sound Design Invisível",
    category: "Áudio",
    date: "10 DEZ 2025",
    description: "O som representa 70% da experiência. Aprenda técnicas de foley que elevam sua produção.",
    image: "https://images.unsplash.com/photo-1594433568633-8a962a93b482?q=80&w=2574&auto=format&fit=crop",
    slug: "sound-design",
    content: "Se você nota o som, ele provavelmente está errado. O melhor Sound Design é aquele que você sente, mas não percebe conscientemente. Desde o ruído de tecido da roupa se movendo até o 'room tone' de uma sala vazia, são essas camadas sutis que transformam um vídeo amador em cinema."
  },
  {
    id: 6,
    title: "Narrativas Verticais",
    category: "Social Media",
    date: "08 DEZ 2025",
    description: "O desafio de contar histórias cinematográficas em 9:16 para TikTok e Reels.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2574&auto=format&fit=crop",
    slug: "videos-verticais",
    content: "O formato 9:16 exige um novo tipo de enquadramento. Não temos mais as laterais para esconder informações ou criar respiro. Tudo é close-up, tudo é urgente. Adaptar a linguagem do cinema para a tela vertical é o maior desafio atual dos diretores de fotografia."
  },
  {
    id: 7,
    title: "Drones FPV no Cinema",
    category: "Tendência",
    date: "05 DEZ 2025",
    description: "Como pilotos de drone estão substituindo gruas e helicópteros em cenas de ação complexas.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?q=80&w=2670&auto=format&fit=crop",
    slug: "drones-fpv",
    content: "O drone FPV (First Person View) permite movimentos que desafiam a física. Mergulhar de um prédio de 50 andares e entrar pela janela de um carro em movimento num único take contínuo. Isso mudou a forma como dirigimos cenas de perseguição."
  },
  {
    id: 8,
    title: "Storytelling Corporativo",
    category: "Branding",
    date: "01 DEZ 2025",
    description: "Empresas não querem mais vídeos institucionais chatos. Elas querem manifestos.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop",
    slug: "storytelling-corporativo",
    content: "O vídeo institucional clássico ('Nossa missão, visão e valores...') morreu. Hoje, marcas precisam de manifestos. Vídeos que vendem um propósito, uma atitude. O público não compra o que você faz, mas por que você faz."
  },
  {
    id: 9,
    title: "Câmeras de Cinema vs. Mirrorless",
    category: "Equipamento",
    date: "28 NOV 2025",
    description: "A linha tênue entre uma Sony FX3 e uma ARRI Alexa em produções comerciais modernas.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2602&auto=format&fit=crop",
    slug: "cameras-cinema",
    content: "Até pouco tempo atrás, era fácil distinguir uma imagem de cinema de uma imagem de câmera fotográfica. Hoje, com câmeras como a Sony FX3 ou Blackmagic Pocket 6K, essa linha se borrou. A diferença não está mais na resolução, mas na ciência de cor e na latitude dinâmica."
  },
  {
    id: 10,
    title: "O Poder do VFX Invisível",
    category: "Pós-Produção",
    date: "25 NOV 2025",
    description: "Limpeza de cena, extensão de set e os efeitos visuais que ninguém nota, mas fazem a diferença.",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2670&auto=format&fit=crop",
    slug: "vfx-invisivel",
    content: "O melhor efeito visual é aquele que você jura que é real. Remover uma placa de rua, adicionar mais árvores no horizonte, limpar a pele do ator. 90% do trabalho de VFX em publicidade é 'invisível' e serve apenas para deixar a imagem perfeita sem distrair."
  },
  {
    id: 11,
    title: "Direção de Atores Não-Atores",
    category: "Direção",
    date: "22 NOV 2025",
    description: "Como extrair performances naturais de CEOs e colaboradores em vídeos empresariais.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2670&auto=format&fit=crop",
    slug: "direcao-atores",
    content: "Dirigir um ator profissional é uma troca. Dirigir um CEO ou um funcionário tímido é psicologia. O segredo é criar um ambiente seguro, esquecer o roteiro decorado e focar na conversa real. As melhores frases surgem quando a câmera 'já parou de gravar' (só que não)."
  },
  {
    id: 12,
    title: "Iluminação Prática",
    category: "Fotografia",
    date: "20 NOV 2025",
    description: "Usando luzes do próprio cenário (abajures, neons, janelas) para criar profundidade realista.",
    image: "https://images.unsplash.com/photo-1550745165-90148454d808?q=80&w=2670&auto=format&fit=crop",
    slug: "iluminacao-pratica",
    content: "Iluminação prática ('practicals') são fontes de luz que aparecem em cena. Elas dão vida e motivação para a luz. Em vez de esconder um refletor enorme fora de quadro, por que não colocar um abajur elegante dentro da cena que ilumina o rosto do ator de forma motivada?"
  },
  {
    id: 13,
    title: "A Revolução do 3D na Web",
    category: "Web Design",
    date: "15 NOV 2025",
    description: "Como sites imersivos com Three.js estão redefinindo portfólios de produtoras.",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop",
    slug: "3d-web",
    content: "A web plana morreu. Produtoras de vanguarda estão usando tecnologias como WebGL e Three.js para transformar seus sites em experiências 3D interativas. Não é apenas sobre mostrar o vídeo, é sobre imergir o cliente no seu universo visual desde o primeiro clique."
  }
];

// --- FUNÇÃO PARA GERAR PARÂMETROS ESTÁTICOS (ESSENCIAL PARA BUILD ESTÁTICO) ---
export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((p) => p.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-black text-white min-h-screen selection:bg-purple-500/30">
      <Navbar />

      <article>
        {/* HERO IMAGE */}
        <div className="relative h-[60vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 max-w-7xl mx-auto">
            <Link 
              href="/insights"
              className="inline-flex items-center text-sm font-bold text-neutral-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              VOLTAR PARA INSIGHTS
            </Link>
            
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-widest">
                {article.category}
              </span>
              <span className="flex items-center text-neutral-400 text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                {article.date}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>

        {/* CONTEÚDO DO ARTIGO */}
        <div className="max-w-3xl mx-auto px-6 py-20">
          <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed mb-12 font-medium border-l-4 border-purple-500 pl-6">
            {article.description}
          </p>

          <div className="prose prose-invert prose-lg max-w-none">
            {/* Conteúdo */}
            <p className="text-neutral-400 leading-relaxed mb-8">
              {article.content}
            </p>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3 className="text-2xl font-bold text-white mt-12 mb-6">Uma nova perspectiva</h3>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            {/* Citação de destaque */}
            <blockquote className="bg-neutral-900/50 p-8 rounded-2xl border border-white/10 my-12">
              <p className="text-xl font-serif italic text-white">
                "A criatividade é a inteligência se divertindo. No audiovisual, é a tecnologia servindo à emoção."
              </p>
            </blockquote>

            <p className="text-neutral-400 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </div>

          {/* RODAPÉ DO ARTIGO - SUBSTITUA ESSA PARTE FINAL */}
          <div className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="text-sm text-neutral-500">
              Escrito por <strong className="text-white">Equipe Lampejo</strong>
            </div>
            
            {/* O BOTÃO NOVO */}
            <ShareButton title={article.title} description={article.description} />
            
          </div>
        </div>
      </article>
    </div>
  );
}