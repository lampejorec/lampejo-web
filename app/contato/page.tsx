"use client";

import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Estados do formulário: 'idle' (parado), 'submitting' (enviando), 'success' (sucesso), 'error' (erro)
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("https://formspree.io/f/xojqvrep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" }); // Limpa o form
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          
          {/* LADO ESQUERDO: Texto e Infos */}
          <div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              VAMOS CRIAR <br/>
              <span className="text-purple-500">ALGO NOVO.</span>
            </h1>
            <p className="text-xl text-neutral-400 mb-12 leading-relaxed">
              Tem um projeto em mente? Quer saber mais sobre nossos processos? 
              Estamos prontos para ouvir e transformar sua ideia em frames.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center border border-white/10">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Email</p>
                  <a href="mailto:contato@lampejo.rec.br" className="text-lg font-bold hover:text-purple-400 transition-colors">contato@lampejo.rec.br</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center border border-white/10">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-neutral-500 tracking-widest">WhatsApp</p>
                  <a href="https://wa.me/5561994079423" target="_blank" className="text-lg font-bold hover:text-purple-400 transition-colors">+55 61 9 9407-9423</a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center border border-white/10">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-neutral-500 tracking-widest">QG</p>
                  <p className="text-lg font-bold">Lago Sul, Brasília - DF</p>
                </div>
              </div>
            </div>
          </div>

          {/* LADO DIREITO: Formulário Formspree */}
          <div className="bg-neutral-900/50 p-8 rounded-2xl border border-white/10 relative overflow-hidden">
            
            {/* MENSAGEM DE SUCESSO (Aparece se status === success) */}
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mensagem Recebida!</h3>
                <p className="text-neutral-400 mb-8">Obrigado pelo contato. Responderemos em breve.</p>
                <button 
                  onClick={() => setStatus("idle")} 
                  className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              // FORMULÁRIO PADRÃO
              <>
                <h3 className="text-2xl font-bold mb-6">Mande um oi.</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Nome</label>
                    <input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      type="text" 
                      placeholder="Seu nome" 
                      className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition-colors"
                      required 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Email *</label>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email" 
                        placeholder="seu@email.com" 
                        className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Celular / WhatsApp *</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        type="tel" 
                        placeholder="(61) 99999-9999" 
                        className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-neutral-500 mb-2">Mensagem</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4} 
                      placeholder="Conte um pouco sobre o projeto..." 
                      className="w-full bg-black border border-white/10 rounded-lg p-4 text-white focus:border-purple-500 outline-none transition-colors resize-none" 
                      required
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                      <AlertCircle size={16}/> Erro ao enviar. Tente novamente ou use o WhatsApp.
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full bg-white text-black hover:bg-purple-500 hover:text-white py-4 rounded-lg font-bold tracking-widest transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      <><Loader2 size={18} className="animate-spin"/> Enviando...</>
                    ) : (
                      <><Send size={18} /> Enviar Mensagem</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}