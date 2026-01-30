import Link from "next/link";
import Navbar from "../components/Navbar"; // Note os dois pontos (..)
import { COURSES } from "../lib/courses";

export default function AcademyPage() {
  return (
    <div className="bg-black text-white min-h-screen selection:bg-purple-500/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-purple-400 font-bold tracking-widest uppercase text-xs mb-4 block">
            LENZ Academy
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            O SEGREDO DO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              NOSSO FLUXO.
            </span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Não guardamos segredos. Aprenda o fluxo de trabalho, as técnicas e a visão por trás das nossas produções.
          </p>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <div key={course.id} className="group flex flex-col bg-neutral-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:-translate-y-1">
              
              {/* Thumbnail */}
              <div className={`h-48 w-full bg-gradient-to-br ${course.thumbnailColor} relative`}>
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded text-xs font-bold text-white border border-white/10">
                  {course.type}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold mb-3 leading-tight group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-6 line-clamp-2">
                  {course.shortDescription}
                </p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">
                    {course.price}
                  </span>
                  <Link 
                    href={`/academy/${course.slug}`}
                    className="bg-white text-black text-sm font-bold px-6 py-3 rounded-full hover:bg-neutral-200 transition-colors"
                  >
                    VER DETALHES
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}