"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  LayoutDashboard, FileText, Plus, Trash2, Printer, DollarSign, ChevronLeft, 
  LogOut, Lock, Users, MessageSquare, Upload, Star, FileCheck, TrendingUp, 
  Camera, Database, Wallet, Pencil, File, Download, AlertCircle, Palette
} from "lucide-react";
import { 
  XAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Navbar from "../components/Navbar";

// ============================================================================
// CONFIG & SUPABASE
// ============================================================================
const supabaseUrl = "https://bxpmulhcxaqlflcvepqz.supabase.co"; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_QoeoPSw5XYcvFPxg-sDwoA_SCOH_A8j"; 
const supabase = createClient(supabaseUrl, supabaseKey);

const MESES_FULL = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const CATEGORIAS_EQUIPAMENTO = ["Câmeras", "Lentes", "Iluminação", "Áudio", "Drones", "Estabilizadores", "Tripés", "Computadores", "Transmissão", "Acessórios", "Outros"];
const CNPJ_LENZ = "63.030.132/0001-86"; 

const formatarDataSimples = (dataStr: string) => {
  if (!dataStr) return "--";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
};
const formatCurrency = (val: number) => Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

async function uploadFile(file: File) {
    const fileName = `doc_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const { error } = await supabase.storage.from('documentos').upload(fileName, file);
    if (error) throw error;
    const { data: publicData } = supabase.storage.from('documentos').getPublicUrl(fileName);
    return publicData.publicUrl;
}

// ============================================================================
// COMPONENTES UI
// ============================================================================
function NavButton({ icon, label, active, onClick }: any) {
  return <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full text-left ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-neutral-500 hover:bg-white/5 hover:text-white'}`}>{icon} <span>{label}</span></button>;
}

function KPICard({ title, value, customValue, color, icon, bg = "bg-[#0f0f0f]" }: any) {
  return <div className={`${bg} border border-white/5 p-6 rounded-[32px] flex flex-col justify-between aspect-video relative overflow-hidden group`}><div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">{icon}</div><div className="flex justify-between items-center text-neutral-400 text-[10px] font-black uppercase tracking-widest relative z-10">{title} {icon}</div><p className={`text-2xl font-black tracking-tighter relative z-10 ${color}`}>{customValue || formatCurrency(value)}</p></div>;
}

function LoginView() {
    const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [loading, setLoading] = useState(false);
    async function handleLogin(e: React.FormEvent) { e.preventDefault(); setLoading(true); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) alert("Credenciais Inválidas"); else window.location.reload(); setLoading(false); }
    return <div className="min-h-screen flex items-center justify-center bg-black p-8"><form onSubmit={handleLogin} className="w-full max-w-sm bg-[#0f0f0f] border border-white/10 p-12 rounded-[48px] space-y-6 shadow-2xl relative text-white"><div className="absolute top-0 left-0 w-full h-1.5 bg-purple-600" /><div className="text-center mb-10"><Lock className="mx-auto text-purple-500 mb-6" size={48} /><h2 className="font-black uppercase tracking-[0.3em] text-xl">Lenz Hub</h2></div><input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="input-field bg-black text-white mb-4" required /><input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="input-field bg-black text-white" required /><button disabled={loading} className="w-full bg-purple-600 text-white font-black py-5 rounded-2xl tracking-[0.2em] uppercase text-xs shadow-lg active:scale-95 transition-all mt-6">{loading ? "Validando..." : "Entrar"}</button></form></div>;
}

// ============================================================================
// TEMPLATE DE PROPOSTA UNIFICADO (PREVIEW E PRINT)
// ============================================================================
// Este componente garante que o que você vê é o que sai no PDF
function ProposalTemplateA4({ data, cli, total }: any) {
    return (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden text-black font-sans bg-white selection:bg-purple-200 selection:text-black">
            {/* IMAGEM DE FUNDO (Z-INDEX BAIXO PARA NÃO INTERFERIR) */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                <img src="/bg-home.jpg" className="w-full h-full object-cover opacity-[0.02] grayscale" style={{zIndex: -1}} />
            </div>

            <div className="relative z-10">
                {/* CABEÇALHO FIXO */}
                <div className="flex justify-between items-end mb-8 pb-6 border-b border-neutral-900">
                    <div>
                        <p className="font-black text-3xl uppercase tracking-tighter leading-none text-black">LENZ AUDIOVISUAL</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">Video • Foto • Transmissão</p>
                    </div>
                    {cli && cli.logo_url && <img src={cli.logo_url} className="h-10 object-contain ml-4"/>}
                </div>

                {/* TÍTULO PRINCIPAL & SUBTÍTULO */}
                <div className="mb-12">
                    <h1 
                        className="font-black uppercase leading-[0.95] tracking-tight mb-4" 
                        style={{ fontSize: `${data.tamanho_titulo || 48}px`, color: data.cor_titulo || '#000000' }}
                    >
                        {data.projeto}
                    </h1>
                    <p 
                        className="font-bold uppercase tracking-[0.15em] border-l-2 border-purple-500 pl-4"
                        style={{ fontSize: `${data.tamanho_subtitulo || 12}px`, color: data.cor_subtitulo || '#666666' }}
                    >
                        {formatarDataSimples(data.data)} • {data.local_evento || 'LOCAL À DEFINIR'}
                    </p>
                </div>

                {/* BOX DO ESCOPO - FORMATADO PARA NÃO QUEBRAR NA IMPRESSÃO */}
                {/* A técnica aqui é usar Borda e Padding, SEM fundo cinza */}
                <div className="mb-10">
                    <div className="border border-neutral-200 rounded-lg p-6 bg-transparent">
                        <h3 className="font-black uppercase text-[9px] text-neutral-400 mb-4 tracking-[0.25em]">Contexto & Escopo</h3>
                        <div 
                            className="font-medium whitespace-pre-wrap leading-relaxed text-justify"
                            style={{ fontSize: `${data.tamanho_corpo || 12}px`, color: data.cor_corpo || '#000000' }}
                        >
                            {data.introducao}
                        </div>
                        
                        {data.entregaveis && (
                            <div 
                                className="mt-6 pt-4 border-t border-dashed border-neutral-200 font-bold whitespace-pre-wrap text-justify"
                                style={{ fontSize: `${data.tamanho_corpo || 12}px`, color: data.cor_corpo || '#000000' }}
                            >
                                {data.entregaveis}
                            </div>
                        )}
                    </div>
                </div>

                {/* ITENS OU TOTAL */}
                <div className="mb-8">
                    {data.visualizacao === 'simples' ? (
                        <div className="py-8 text-center border-t border-b border-neutral-200">
                            <p className="font-black text-sm uppercase tracking-widest text-neutral-400">Investimento Total do Projeto</p>
                        </div>
                    ) : (
                        <div>
                            <p className="font-black text-[9px] uppercase text-neutral-400 mb-2 tracking-[0.2em] border-b border-neutral-200 pb-2">Composição de Investimento</p>
                            <table className="w-full text-left" style={{ fontSize: `${data.tamanho_corpo || 12}px`, color: data.cor_corpo || '#000000' }}>
                                <tbody>
                                    {data.itens.map((it:any, i:number) => (
                                        <tr key={i} className="border-b border-neutral-100 last:border-0">
                                            <td className="py-2.5 font-bold uppercase">{it.qtd}x {it.descricao}</td>
                                            <td className="py-2.5 font-black text-right w-40 whitespace-nowrap">{formatCurrency(it.valor * (it.qtd||1))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* RODAPÉ ALINHADO NO FUNDO */}
            <div className="mt-auto border-t-4 border-black pt-4 flex justify-between items-end relative z-10 bg-white">
                <div>
                    <p className="text-[9px] font-black uppercase text-neutral-400 mb-1 tracking-wider">Total Final</p>
                    <p className="font-black tracking-tighter leading-none" style={{ fontSize: `${data.tamanho_total || 50}px`, color: data.cor_total || '#000000' }}>
                        {formatCurrency(total)}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-[8px] font-bold uppercase text-neutral-400 tracking-wider">LENZ AUDIOVISUAL • {CNPJ_LENZ}</p>
                    <p className="text-[8px] font-bold uppercase text-neutral-400 tracking-wider">Validade da Proposta: 7 dias</p>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// TELAS DE GERENCIAMENTO
// ============================================================================

function DashboardView({ propostas, financeiro, equipamentos }: any) {
    const stats = useMemo(() => {
      const totalAprovado = propostas.filter((p:any) => p.status === 'aprovada').reduce((acc:any, p:any) => acc + (p.itens?.reduce((a:any, i:any) => a + (Number(i.qtd) * Number(i.valor)), 0) || 0), 0);
      const dinheiroNaMesa = propostas.filter((p:any) => p.status !== 'aprovada').reduce((acc:any, p:any) => acc + (p.itens?.reduce((a:any, i:any) => a + (Number(i.qtd) * Number(i.valor)), 0) || 0), 0);
      const entradas = financeiro.filter((t:any) => t.tipo === 'entrada').reduce((acc:any, t:any) => acc + Number(t.valor), 0);
      const saidas = financeiro.filter((t:any) => t.tipo === 'saida').reduce((acc:any, t:any) => acc + Number(t.valor), 0);
      const patrimonio = equipamentos.reduce((acc:any, e:any) => acc + (Number(e.valor_compra) * Number(e.quantidade || 1)), 0);
      return { totalAprovado, saldo: entradas - saidas, valorEmpresa: (entradas - saidas) + patrimonio, patrimonio, dinheiroNaMesa };
    }, [propostas, financeiro, equipamentos]);

    const chartData = useMemo(() => {
        const last6 = Array.from({length: 6}, (_, i) => { const d = new Date(); d.setMonth(d.getMonth() - i); return d.toISOString().slice(0, 7); }).reverse();
        return last6.map(mesAno => {
            const ent = financeiro.filter((t:any) => t.data.startsWith(mesAno) && t.tipo === 'entrada').reduce((a:any, b:any) => a + Number(b.valor), 0);
            const sai = financeiro.filter((t:any) => t.data.startsWith(mesAno) && t.tipo === 'saida').reduce((a:any, b:any) => a + Number(b.valor), 0);
            return { name: mesAno.split('-')[1], entradas: ent, saidas: sai };
        });
    }, [financeiro]);

    return (
        <div className="space-y-8 animate-in fade-in pb-20">
          <h1 className="text-4xl font-black uppercase text-white">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="Receita Aprovada" value={stats.totalAprovado} color="text-green-400" icon={<TrendingUp size={24}/>} />
            <KPICard title="Em Negociação" value={stats.dinheiroNaMesa} color="text-yellow-400" icon={<AlertCircle size={24}/>} />
            <KPICard title="Saldo Líquido" value={stats.saldo} color="text-white" bg="bg-purple-600 shadow-purple-500/20" icon={<DollarSign size={24}/>} />
            <KPICard title="Patrimônio Total" value={stats.valorEmpresa} color="text-blue-400" icon={<Database size={24}/>} />
          </div>
          <div className="h-[400px] bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl">
              <h3 className="text-[10px] font-black uppercase text-neutral-500 mb-8 tracking-widest">Fluxo Semestral</h3>
              <ResponsiveContainer width="100%" height="85%">
                  <AreaChart data={chartData}>
                      <defs><linearGradient id="colorEnt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/><stop offset="95%" stopColor="#9333ea" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                      <XAxis dataKey="name" stroke="#444" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{background: '#000', border: '1px solid #333', borderRadius: '12px'}} />
                      <Area type="monotone" dataKey="entradas" stroke="#9333ea" fillOpacity={1} fill="url(#colorEnt)" strokeWidth={3} />
                      <Area type="monotone" dataKey="saidas" stroke="#ef4444" fill="transparent" strokeWidth={2} />
                  </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>
    );
}

function FinanceiroView({ financeiro, refresh, session, propostas, onPrint }: any) {
    const [mesAtivo, setMesAtivo] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [anoAtivo, setAnoAtivo] = useState(new Date().getFullYear().toString());
    const [novo, setNovo] = useState<any>({ descricao: '', valor: 0, tipo: 'entrada', imposto_porcentagem: 6, imposto_retido: 0, proposta_id: "", data: new Date().toISOString().slice(0, 10), custos_extras: [], split_regras: { socio_pct: 100, empresa_pct: 0 } });

    useEffect(() => { if(novo.valor && novo.imposto_porcentagem >= 0) setNovo((prev: any) => ({...prev, imposto_retido: (prev.valor * prev.imposto_porcentagem)/100})); }, [novo.valor, novo.imposto_porcentagem]);
    useEffect(() => {
        if(novo.proposta_id) {
            const p = propostas.find((p:any) => p.id === novo.proposta_id);
            if(p) {
               const total = p.itens?.reduce((acc:any, i:any) => acc + (Number(i.qtd)*Number(i.valor)), 0) || 0;
               setNovo((prev: any) => ({...prev, valor: total, descricao: `Entrada: ${p.projeto} (${p.cliente})`, tipo: 'entrada'}));
            }
        }
    }, [novo.proposta_id, propostas]);

    async function salvar() {
        if(!novo.descricao || novo.valor <= 0) return alert("Preencha dados válidos");
        const payload = { ...novo, custos_extras: novo.custos_extras||[], split_regras: novo.split_regras||{}, proposta_id: novo.proposta_id||null, user_id: session.user.id };
        const { error } = await supabase.from('financeiro').insert([payload]);
        if(error) alert("Erro (Verifique SQL): " + error.message);
        else { refresh(); setNovo({...novo, descricao: '', valor: 0, custos_extras: []}); }
    }
    const filtradas = financeiro.filter((t:any) => t.data.startsWith(`${anoAtivo}-${mesAtivo}`));
    const resumo = filtradas.reduce((acc:any, t:any) => { if(t.tipo==='entrada') acc.ent+=Number(t.valor); else acc.sai+=Number(t.valor); return acc; }, {ent:0, sai:0});
    const calculo = useMemo(() => {
       const v = Number(novo.valor||0); const i = Number(novo.imposto_retido||0); const c = novo.custos_extras?.reduce((acc:number,x:any)=>acc+Number(x.valor),0)||0;
       return { totalCustos: c, lucroLiquido: (v-i-c) > 0 ? v-i-c : 0 };
    }, [novo]);

    return (
        <div className="space-y-8 animate-in fade-in text-white">
            <div className="flex justify-between items-end"><h1 className="text-4xl font-black uppercase">Financeiro</h1><button onClick={() => onPrint({ mes: `${mesAtivo}/${anoAtivo}`, entradas: resumo.ent, saidas: resumo.sai, itens: filtradas })} className="p-4 bg-white/5 rounded-2xl"><Printer className="text-purple-400"/></button></div>
            <div className="bg-[#0f0f0f] p-2 rounded-2xl flex items-center gap-4 overflow-x-auto border border-white/5"><select value={anoAtivo} onChange={e => setAnoAtivo(e.target.value)} className="bg-black p-3 rounded-xl uppercase text-xs font-bold border border-white/10 outline-none text-white"><option>2025</option><option>2026</option></select><div className="flex gap-1">{MESES_FULL.map((m,i) => (<button key={m} onClick={()=>setMesAtivo((i+1).toString().padStart(2,'0'))} className={`px-4 py-2 rounded-xl text-[10px] uppercase font-bold ${mesAtivo === (i+1).toString().padStart(2,'0') ? 'bg-purple-600 text-white' : 'text-neutral-500'}`}>{m}</button>))}</div></div>
            <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-8 space-y-6 shadow-2xl">
                 <h3 className="text-xs font-black uppercase text-purple-400 flex items-center gap-2"><Wallet size={16}/> Lançamento</h3>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4"><select className="input-field col-span-1" value={novo.proposta_id || ""} onChange={e=>setNovo({...novo, proposta_id: e.target.value})}><option value="">Vincular Proposta (Auto)</option>{propostas.map((p:any)=><option key={p.id} value={p.id}>{p.projeto}</option>)}</select><input className="input-field col-span-2" placeholder="Descrição" value={novo.descricao} onChange={e=>setNovo({...novo, descricao:e.target.value})} /><div className="flex bg-black rounded-xl border border-white/10 p-1 col-span-1"><button onClick={()=>setNovo({...novo, tipo: 'entrada'})} className={`flex-1 rounded-lg text-xs font-black uppercase ${novo.tipo==='entrada' ? 'bg-green-600 text-white' : 'text-neutral-500'}`}>Entrada</button><button onClick={()=>setNovo({...novo, tipo: 'saida'})} className={`flex-1 rounded-lg text-xs font-black uppercase ${novo.tipo==='saida' ? 'bg-red-600 text-white' : 'text-neutral-500'}`}>Saída</button></div></div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-black/40 p-6 rounded-2xl border border-white/5"><div><label className="label-field">Bruto</label><input type="number" className="input-field" value={novo.valor} onChange={e=>setNovo({...novo, valor: Number(e.target.value)})} /></div><div><label className="label-field">Imposto (%)</label><input type="number" className="input-field" value={novo.imposto_porcentagem} onChange={e=>setNovo({...novo, imposto_porcentagem: Number(e.target.value)})} /></div><div><label className="label-field">Retido (R$)</label><input disabled className="input-field bg-white/5 text-red-400 font-bold" value={novo.imposto_retido.toFixed(2)} /></div></div>
                 {novo.tipo === 'entrada' && (
                     <div className="pt-4 border-t border-white/10"><div className="flex justify-between items-center mb-4"><p className="text-xs font-black uppercase text-blue-400">Distribuição</p><button onClick={()=>setNovo({...novo, custos_extras: [...(novo.custos_extras||[]), {descricao: '', valor: 0}]})} className="text-[10px] bg-white/10 px-2 py-1 rounded text-white font-bold">+ Custo</button></div>{novo.custos_extras?.map((c:any,i:number) => (<div key={i} className="flex gap-2 mb-2"><input className="input-field flex-1" placeholder="Ex: Freela" value={c.descricao} onChange={e=>{const cp=[...novo.custos_extras]; cp[i].descricao=e.target.value; setNovo({...novo, custos_extras: cp})}} /><input type="number" className="input-field w-32" value={c.valor} onChange={e=>{const cp=[...novo.custos_extras]; cp[i].valor=Number(e.target.value); setNovo({...novo, custos_extras: cp})}} /><button onClick={()=>setNovo({...novo, custos_extras: novo.custos_extras.filter((_:any,x:number)=>x!==i)})} className="p-2 bg-red-500/10 text-red-500 rounded"><Trash2 size={16}/></button></div>))}<div className="mt-4 pt-4 border-t border-white/5"><div className="flex justify-between text-xs font-bold uppercase text-neutral-400 mb-2"><span>Sócio: {novo.split_regras?.socio_pct}%</span><span>Empresa: {novo.split_regras?.empresa_pct}%</span></div><input type="range" className="w-full accent-purple-600 bg-black h-2 rounded-lg cursor-pointer" min="0" max="100" value={novo.split_regras?.socio_pct || 100} onChange={e => setNovo({...novo, split_regras: { socio_pct: Number(e.target.value), empresa_pct: 100 - Number(e.target.value) }})} /><p className="text-right text-sm font-black text-white mt-2">Líquido do Projeto: {formatCurrency(calculo.lucroLiquido)}</p></div></div>
                 )}
                 <button onClick={salvar} className="w-full bg-purple-600 text-white font-black py-4 rounded-xl uppercase text-xs hover:bg-purple-500 transition-all">Lançar</button>
            </div>
            <div className="grid gap-2">{filtradas.map((t:any) => (<div key={t.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-3xl flex justify-between items-center group"><div><p className="font-bold text-white uppercase text-sm">{t.descricao}</p><p className="text-[10px] uppercase text-neutral-500">{formatarDataSimples(t.data)}</p></div><div className="flex gap-4 items-center"><p className={`text-lg font-black ${t.tipo==='entrada'?'text-green-400':'text-red-400'}`}>{t.tipo==='entrada'?'+':'-'} {formatCurrency(t.valor)}</p><button onClick={async()=>{if(confirm("Apagar?")) { await supabase.from('financeiro').delete().eq('id', t.id); refresh(); }}}><Trash2 size={16} className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100"/></button></div></div>))}</div>
        </div>
    )
}

function ClientesView({ clientes, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    async function save() {
        if(!editing.nome_fantasia) return alert("Nome obrigatório");
        const payload = {
            nome_fantasia: editing.nome_fantasia, endereco: editing.endereco || "", cnpj: editing.cnpj || "", logo_url: editing.logo_url || "",
            contatos: Array.isArray(editing.contatos) ? editing.contatos : [], user_id: session.user.id
        };
        const query = editing.id === 'new' ? supabase.from('clientes').insert([payload]) : supabase.from('clientes').update(payload).eq('id', editing.id);
        const { error } = await query;
        if(error) alert(error.message); else { setEditing(null); refresh(); }
    }
    if(editing) return (
        <div className="space-y-6 max-w-lg mx-auto text-white animate-in slide-in-from-right">
            <button onClick={()=>setEditing(null)} className="flex items-center gap-2 text-neutral-500 hover:text-white"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] space-y-4">
                <h2 className="text-xl font-black uppercase text-white mb-6">Ficha Cliente</h2>
                <input className="input-field" placeholder="Nome Fantasia / Empresa" value={editing.nome_fantasia || ""} onChange={e=>setEditing({...editing, nome_fantasia: e.target.value})} />
                <div className="grid grid-cols-2 gap-4"><input className="input-field" placeholder="CNPJ" value={editing.cnpj || ''} onChange={e=>setEditing({...editing, cnpj: e.target.value})} /><input className="input-field" placeholder="Endereço / UF" value={editing.endereco || ''} onChange={e=>setEditing({...editing, endereco: e.target.value})} /></div>
                <input className="input-field" placeholder="Link da Logo (URL)" value={editing.logo_url || ''} onChange={e=>setEditing({...editing, logo_url: e.target.value})} />
                <div className="pt-4 border-t border-white/10"><div className="flex justify-between items-center mb-4"><p className="label-field">Contatos</p><button onClick={() => setEditing({...editing, contatos: [...(editing.contatos || []), {nome: '', tel: ''}]})} className="text-[10px] text-purple-400 font-bold uppercase hover:bg-white/5 p-2 rounded">+ Add</button></div><div className="space-y-3">{(editing.contatos || []).map((ct:any, i:number) => (<div key={i} className="flex gap-2 items-center bg-black/40 p-2 rounded-xl border border-white/5"><div className="flex-1"><input className="w-full bg-transparent text-sm text-white placeholder-neutral-600 outline-none font-bold" placeholder="Nome" value={ct.nome || ""} onChange={e => {const c=[...editing.contatos];c[i].nome=e.target.value;setEditing({...editing, contatos:c})}} /></div><div className="w-[1px] h-4 bg-white/10 mx-1"></div><div className="w-1/3"><input className="w-full bg-transparent text-sm text-white placeholder-neutral-600 outline-none" placeholder="WhatsApp" value={ct.tel || ""} onChange={e => {const c=[...editing.contatos];c[i].tel=e.target.value;setEditing({...editing, contatos:c})}} /></div><button onClick={()=>setEditing({...editing, contatos: editing.contatos.filter((_:any,x:number)=>x!==i)})} className="p-2 text-neutral-600 hover:text-red-500"><Trash2 size={14}/></button></div>))}</div></div>
                <button onClick={save} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase text-xs hover:bg-neutral-200">Salvar Ficha</button>
            </div>
        </div>
    );
    return <div className="space-y-6 text-white"><div className="flex justify-between items-center"><h1 className="text-4xl font-black uppercase">Clientes CRM</h1><button onClick={() => setEditing({id:'new', nome_fantasia:'', contatos: []})} className="btn-primary"><Plus size={16}/> Novo Cliente</button></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{clientes.map((c:any) => (<div key={c.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] hover:border-purple-500/50 transition-all flex flex-col justify-between h-full"><div><div className="flex justify-between items-start mb-6"><div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-2 border border-white/5 overflow-hidden">{c.logo_url ? <img src={c.logo_url} className="w-full h-full object-contain"/> : <Users className="text-neutral-500"/>}</div></div><h3 className="text-xl font-black uppercase mb-1">{c.nome_fantasia}</h3></div><div className="pt-4 border-t border-white/5 flex items-center justify-between"><div className="flex -space-x-2">{c.contatos?.slice(0,4).map((ct:any,i:number) => (<a key={i} href={`https://wa.me/${ct.tel?.replace(/\D/g,'')}`} target="_blank" className="w-8 h-8 rounded-full bg-neutral-800 border border-black flex items-center justify-center text-green-500 cursor-pointer hover:scale-110 transition-transform" title={ct.nome}><MessageSquare size={14}/></a>))}</div><button onClick={() => setEditing(c)} className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-black uppercase">Editar</button></div></div>))}</div></div>
}

function DocumentosView({ documentos, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    async function save() {
        if(!editing.conteudo) return alert("Digite um título");
        let url = editing.arquivo_url;
        if(fileRef.current?.files && fileRef.current.files.length > 0) {
            setUploading(true);
            try { url = await uploadFile(fileRef.current.files[0]); } catch(e:any) { alert("Erro: "+e.message); setUploading(false); return; }
            setUploading(false);
        }
        const payload = { tipo: 'Contrato', conteudo: editing.conteudo, categoria: editing.categoria || 'Geral', arquivo_url: url, user_id: session.user.id };
        const query = editing.id==='new'?supabase.from('documentos').insert([payload]):supabase.from('documentos').update(payload).eq('id',editing.id);
        const {error} = await query;
        if(error) alert(error.message); else { setEditing(null); refresh(); }
    }
    
    async function deleteDoc(id: string) { if(confirm("Deletar?")) { await supabase.from('documentos').delete().eq('id',id); refresh(); } }
    
    if(editing) return (
        <div className="max-w-lg mx-auto space-y-6 pt-10 text-white animate-in slide-in-from-right"><button onClick={()=>setEditing(null)} className="flex items-center gap-2 text-neutral-500"><ChevronLeft size={16}/> Voltar</button><div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] space-y-6"><h2 className="text-xl font-black uppercase text-white mb-6">Editor de Documento</h2><div><label className="label-field">Título do Arquivo</label><input className="input-field" placeholder="Ex: Contrato X" value={editing.conteudo || ''} onChange={e=>setEditing({...editing, conteudo:e.target.value})} /></div><div><label className="label-field">Categoria</label><select className="input-field" value={editing.categoria||'Geral'} onChange={e=>setEditing({...editing, categoria:e.target.value})}><option>Geral</option><option>Modelo</option><option>Contrato</option><option>Assinado</option><option>Pendente</option></select></div><div><label className="label-field">Arquivo PDF</label><div className="flex gap-2"><button onClick={()=>fileRef.current?.click()} className="flex-1 bg-white/10 hover:bg-white/20 p-3 rounded-xl text-xs uppercase font-bold text-center border border-dashed border-white/20">{uploading?'Subindo...':'Selecionar Novo'}</button>{editing.arquivo_url && <a href={editing.arquivo_url} target="_blank" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl" title="Baixar"><Download size={16}/></a>}</div><input type="file" ref={fileRef} hidden accept=".pdf,.doc,.docx" /></div><button onClick={save} className="w-full bg-white text-black font-black py-4 rounded-xl uppercase text-xs">Salvar Documento</button></div></div>
    )

    return (
        <div className="space-y-6 text-white"><div className="flex justify-between items-center"><h1 className="text-4xl font-black uppercase">Jurídico</h1><button onClick={() => setEditing({id:'new', conteudo: '', categoria: 'Geral'})} className="btn-primary flex gap-2"><Plus size={16}/> Novo Doc</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{documentos.map((d:any) => (<div key={d.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[32px] flex justify-between items-center hover:border-purple-500/50 transition-all group"><div className="overflow-hidden w-full mr-4"><div className="flex items-center gap-2 mb-2"><File className="text-purple-400" size={18}/><span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-neutral-400 uppercase font-bold">{d.categoria}</span></div><h4 className="font-bold text-xs truncate text-white">{d.conteudo}</h4></div><div className="flex gap-2"><a href={d.arquivo_url} target="_blank" className="p-2 bg-white/10 rounded-lg text-white"><Download size={14}/></a><button onClick={()=>setEditing(d)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><Pencil size={14}/></button><button onClick={()=>deleteDoc(d.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={14}/></button></div></div>))}</div></div>
    )
}

function EquipamentosView({ equipamentos, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    async function save() {
        if(!editing.nome) return alert("Nome obrigatório");
        const payload = { nome: editing.nome, marca_modelo: editing.marca_modelo || "", categoria: editing.categoria || "Geral", status: editing.status || "Disponível", quantidade: Number(editing.quantidade), valor_compra: Number(editing.valor_compra), user_id: session.user.id };
        const q = editing.id === 'new' ? supabase.from('equipamentos').insert([payload]) : supabase.from('equipamentos').update(payload).eq('id', editing.id);
        const { error } = await q; if(error) alert(error.message); else { setEditing(null); refresh(); }
    }
    if(editing) return <div className="max-w-xl mx-auto space-y-4 pt-10 text-white animate-in fade-in"><h2 className="font-black text-2xl uppercase">Ficha Equipamento</h2><input className="input-field" placeholder="Nome" value={editing.nome || ''} onChange={e=>setEditing({...editing, nome:e.target.value})}/><input className="input-field" placeholder="Marca" value={editing.marca_modelo || ''} onChange={e=>setEditing({...editing, marca_modelo:e.target.value})}/><div className="grid grid-cols-2 gap-4"><select className="input-field" value={editing.status || 'Disponível'} onChange={e=>setEditing({...editing, status:e.target.value})}><option>Disponível</option><option>Em Uso</option><option>Manutenção</option></select><select className="input-field" value={editing.categoria||'Geral'} onChange={e=>setEditing({...editing, categoria:e.target.value})}>{CATEGORIAS_EQUIPAMENTO.map(c=><option key={c}>{c}</option>)}</select></div><div className="grid grid-cols-2 gap-4"><input className="input-field" type="number" placeholder="Qtd" value={editing.quantidade || ''} onChange={e=>setEditing({...editing, quantidade:e.target.value})}/><input className="input-field" type="number" placeholder="Valor Unit." value={editing.valor_compra || ''} onChange={e=>setEditing({...editing, valor_compra:e.target.value})}/></div><button onClick={save} className="btn-primary w-full justify-center">Salvar</button><button onClick={()=>setEditing(null)} className="w-full text-center text-xs mt-4 text-neutral-500">Cancelar</button></div>
    return <div className="space-y-6 text-white"><div className="flex justify-between items-center"><h1 className="text-4xl font-black uppercase">Inventário</h1><button onClick={()=>setEditing({id:'new', nome:'', quantidade:1, valor_compra:0, status:'Disponível'})} className="btn-primary"><Plus size={16}/> Novo</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{equipamentos.map((e:any)=>(<div key={e.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-lg flex flex-col justify-between group hover:border-purple-500/50 transition-all"><div className="mb-4"><span className={`px-2 py-1 text-[8px] uppercase font-black rounded ${e.status==='Disponível'?'bg-green-500/20 text-green-400':e.status==='Em Uso'?'bg-red-500/20 text-red-400':'bg-yellow-500/20 text-yellow-400'}`}>{e.status}</span><h3 className="font-black text-lg mt-2 uppercase text-white">{e.nome}</h3></div><div className="pt-4 border-t border-white/5 flex justify-between"><div><p className="text-[8px] font-black uppercase text-neutral-500">Valor</p><p className="text-white font-bold">{formatCurrency(e.valor_compra)}</p></div><button onClick={()=>setEditing(e)} className="text-[10px] uppercase font-bold text-neutral-500 hover:text-white">Editar</button></div></div>))}</div></div>
}

function EquipeView({ equipe, session, refresh }: any) {
    const [editing, setEditing] = useState<any>(null);
    async function save() { 
        if(!editing.nome) return alert("Nome obrigatorio");
        const payload = { nome: editing.nome, funcao: editing.funcao||"", valor_diaria: Number(editing.valor_diaria||0), whatsapp: editing.whatsapp||"", user_id: session.user.id };
        const q = editing.id === 'new' ? supabase.from('equipe').insert([payload]) : supabase.from('equipe').update(payload).eq('id',editing.id);
        const { error } = await q; if(error) alert(error.message); else { setEditing(null); refresh(); } 
    }
    if(editing) return <div className="max-w-lg mx-auto text-white space-y-6 pt-10 animate-in fade-in"><h2 className="text-2xl font-black uppercase">Membro</h2><input className="input-field" placeholder="Nome" value={editing.nome || ''} onChange={e=>setEditing({...editing, nome:e.target.value})}/><input className="input-field" placeholder="Função" value={editing.funcao || ''} onChange={e=>setEditing({...editing, funcao:e.target.value})}/><input type="number" className="input-field" placeholder="Diária (R$)" value={editing.valor_diaria || ''} onChange={e=>setEditing({...editing, valor_diaria:Number(e.target.value)})}/><input className="input-field" placeholder="WhatsApp" value={editing.whatsapp || ''} onChange={e=>setEditing({...editing, whatsapp:e.target.value})}/><button onClick={save} className="btn-primary w-full justify-center">Salvar</button><button onClick={()=>setEditing(null)} className="w-full text-center text-xs text-neutral-500 mt-4">Cancelar</button></div>
    return <div className="space-y-6 text-white"><div className="flex justify-between items-center"><h1 className="text-4xl font-black uppercase">Equipe</h1><button onClick={()=>setEditing({id:'new', nome:'', valor_diaria:0})} className="btn-primary"><Plus size={16}/> Novo</button></div><div className="grid grid-cols-1 md:grid-cols-4 gap-6">{equipe.map((m:any) => (<div key={m.id} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-[32px] text-center hover:scale-105 transition-all"><div className="w-16 h-16 bg-purple-600 rounded-full mx-auto flex items-center justify-center font-black text-xl mb-4">{m.nome[0]}</div><h3 className="text-sm font-black uppercase">{m.nome}</h3><p className="text-[10px] uppercase font-bold text-neutral-500 mb-2">{m.funcao}</p><div className="flex justify-center gap-2"><a href={`https://wa.me/${m.whatsapp}`} target="_blank" className="p-2 bg-green-900/20 text-green-500 rounded-lg"><MessageSquare size={14}/></a><button onClick={()=>setEditing(m)} className="p-2 bg-white/10 rounded-lg"><Pencil size={14}/></button></div></div>))}</div></div>
}

function PropostasView({ propostas, clientes, refresh, session, onPrint }: any) {
    const [editing, setEditing] = useState<any>(null);

    async function changeStatus(p: any, novo: string) { await supabase.from('propostas').update({ status: novo }).eq('id', p.id); refresh(); }
    async function save() { 
        if(!editing.cliente || !editing.projeto) return alert("Falta dados");
        // Save styles + data
        const payload = {
            cliente: editing.cliente, projeto: editing.projeto, local_evento: editing.local_evento || "",
            introducao: editing.introducao||'', entregaveis: editing.entregaveis||'', itens: editing.itens || [],
            data: editing.data || new Date().toISOString(), status: editing.status || 'rascunho', 
            visualizacao: editing.visualizacao || 'detalhado',
            // Salva as preferencias de estilo
            tamanho_titulo: editing.tamanho_titulo || 48, cor_titulo: editing.cor_titulo || '#000000',
            tamanho_subtitulo: editing.tamanho_subtitulo || 14, cor_subtitulo: editing.cor_subtitulo || '#666666',
            tamanho_corpo: editing.tamanho_corpo || 14, cor_corpo: editing.cor_corpo || '#000000',
            tamanho_total: editing.tamanho_total || 60, cor_total: editing.cor_total || '#000000',
            user_id: session.user.id
        };
        const q = editing.id==='new' ? supabase.from('propostas').insert([payload]) : supabase.from('propostas').update(payload).eq('id',editing.id);
        const {error} = await q; if(error) alert(error.message); else { setEditing(null); refresh(); }
    }
    
    // EDITOR COMPLETO COM ESTILOS E RENDERIZAÇÃO A4 CORRIGIDA
    if(editing) {
       const cli = clientes.find((c:any)=>c.nome_fantasia===editing.cliente);
       const total = (editing.itens || []).reduce((acc:any, i:any)=>acc+(Number(i.valor)*Number(i.qtd)),0);
       return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
               <div className="space-y-4 overflow-y-auto pr-4 pb-20 custom-scrollbar">
                   <button onClick={()=>setEditing(null)} className="flex items-center gap-2 text-neutral-500 hover:text-white"><ChevronLeft size={16}/> Voltar</button>
                   <div className="bg-[#0f0f0f] p-8 rounded-[40px] space-y-4 border border-white/5">
                       <h2 className="font-black text-xl text-purple-400 uppercase">Editor & Design</h2>
                       <select className="input-field" value={editing.cliente || ''} onChange={e=>setEditing({...editing, cliente:e.target.value})}><option>Selecionar Cliente...</option>{clientes.map((c:any)=><option key={c.id} value={c.nome_fantasia}>{c.nome_fantasia}</option>)}</select>
                       <input className="input-field" placeholder="Título (Projeto)" value={editing.projeto || ''} onChange={e=>setEditing({...editing, projeto:e.target.value})}/>
                       <input className="input-field" placeholder="Subtítulo (Local/Data)" value={editing.local_evento || ''} onChange={e=>setEditing({...editing, local_evento:e.target.value})}/>
                       <select className="input-field" value={editing.visualizacao||'detalhado'} onChange={e=>setEditing({...editing, visualizacao:e.target.value})}><option value="detalhado">Visual: Tabela</option><option value="simples">Visual: Valor Único</option></select>
                       
                       {/* DESIGN PANEL - ESTILOS PERSONALIZÁVEIS PARA TUDO */}
                       <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-4">
                           <h3 className="text-xs font-black uppercase text-purple-300 mb-2 flex gap-2"><Palette size={14}/> Estilo do PDF</h3>
                           <div className="grid grid-cols-[1fr_50px_40px] gap-2 items-center"><span className="text-[10px] font-bold text-gray-400">TÍTULO</span><input type="range" min="20" max="80" className="accent-purple-600 h-1 bg-neutral-700 w-full" value={editing.tamanho_titulo||48} onChange={e=>setEditing({...editing, tamanho_titulo:Number(e.target.value)})}/><input type="color" className="w-6 h-6 rounded bg-transparent border-none" value={editing.cor_titulo||'#000000'} onChange={e=>setEditing({...editing, cor_titulo:e.target.value})}/></div>
                           <div className="grid grid-cols-[1fr_50px_40px] gap-2 items-center"><span className="text-[10px] font-bold text-gray-400">DATA/LOCAL</span><input type="range" min="10" max="30" className="accent-purple-600 h-1 bg-neutral-700 w-full" value={editing.tamanho_subtitulo||14} onChange={e=>setEditing({...editing, tamanho_subtitulo:Number(e.target.value)})}/><input type="color" className="w-6 h-6 rounded bg-transparent border-none" value={editing.cor_subtitulo||'#666666'} onChange={e=>setEditing({...editing, cor_subtitulo:e.target.value})}/></div>
                           <div className="grid grid-cols-[1fr_50px_40px] gap-2 items-center"><span className="text-[10px] font-bold text-gray-400">CORPO TEXTO</span><input type="range" min="10" max="24" className="accent-purple-600 h-1 bg-neutral-700 w-full" value={editing.tamanho_corpo||14} onChange={e=>setEditing({...editing, tamanho_corpo:Number(e.target.value)})}/><input type="color" className="w-6 h-6 rounded bg-transparent border-none" value={editing.cor_corpo||'#000000'} onChange={e=>setEditing({...editing, cor_corpo:e.target.value})}/></div>
                           <div className="grid grid-cols-[1fr_50px_40px] gap-2 items-center"><span className="text-[10px] font-bold text-gray-400">VALOR TOTAL</span><input type="range" min="30" max="100" className="accent-purple-600 h-1 bg-neutral-700 w-full" value={editing.tamanho_total||60} onChange={e=>setEditing({...editing, tamanho_total:Number(e.target.value)})}/><input type="color" className="w-6 h-6 rounded bg-transparent border-none" value={editing.cor_total||'#000000'} onChange={e=>setEditing({...editing, cor_total:e.target.value})}/></div>
                       </div>

                       <textarea className="input-field h-24" placeholder="Intro/Descrição" value={editing.introducao || ''} onChange={e=>setEditing({...editing, introducao:e.target.value})}/>
                       <textarea className="input-field h-24" placeholder="Escopo Técnico (Opcional)" value={editing.entregaveis || ''} onChange={e=>setEditing({...editing, entregaveis:e.target.value})}/>
                       <div className="border-t border-white/10 pt-4 space-y-2"><p className="label-field">Tabela de Preço</p>{(editing.itens||[]).map((it:any,i:number)=>(<div key={i} className="flex gap-2"><input className="input-field flex-1" placeholder="Item" value={it.descricao} onChange={e=>{const cp=[...editing.itens];cp[i].descricao=e.target.value;setEditing({...editing, itens:cp})}}/><input className="input-field w-16" placeholder="Qtd" value={it.qtd} onChange={e=>{const cp=[...editing.itens];cp[i].qtd=Number(e.target.value);setEditing({...editing, itens:cp})}}/><input className="input-field w-24" placeholder="Val" value={it.valor} onChange={e=>{const cp=[...editing.itens];cp[i].valor=Number(e.target.value);setEditing({...editing, itens:cp})}}/><button onClick={()=>setEditing({...editing, itens:editing.itens.filter((_:any,x:number)=>x!==i)})}><Trash2 size={16} className="text-red-500"/></button></div>))}<button onClick={()=>setEditing({...editing, itens:[...(editing.itens||[]), {descricao:'', qtd:1, valor:0}]})} className="text-xs text-purple-400 font-bold uppercase">+ Add Item</button></div>
                   </div>
                   <button onClick={save} className="w-full bg-purple-600 text-white font-black py-4 rounded-xl uppercase text-xs">Salvar Alterações</button>
               </div>
               
               {/* PREVIEW A4 NO SITE (USANDO CLASSES QUE EVITAM O FUNDO CINZA NO PDF) */}
               <div className="bg-[#111] border border-white/5 p-4 rounded-[40px] flex justify-center items-start overflow-auto h-full hidden lg:flex">
                   <div className="bg-white text-black w-[210mm] min-h-[297mm] p-[15mm] relative shadow-2xl flex flex-col justify-between origin-top scale-[0.55] overflow-hidden">
                       {/* Marca D'água */}
                       <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center"><img src="/bg-home.jpg" className="w-full h-full object-cover opacity-[0.03]" /></div>
                       <div className="relative z-10">
                            {/* Header */}
                            <div className="flex justify-between items-end mb-10 pb-6 border-b border-black">
                                <p className="font-black text-2xl uppercase tracking-tighter">LENZ AUDIOVISUAL</p>
                                {cli && cli.logo_url && <img src={cli.logo_url} className="h-10 object-contain ml-4"/>}
                            </div>
                            {/* Titulos Personalizáveis */}
                            <h1 className="font-black uppercase mb-4 leading-none tracking-tighter" style={{fontSize: `${editing.tamanho_titulo||48}px`, color: editing.cor_titulo||'#000'}}>{editing.projeto}</h1>
                            <p className="font-bold uppercase tracking-[0.2em] mb-12" style={{fontSize: `${editing.tamanho_subtitulo||14}px`, color: editing.cor_subtitulo||'#666'}}>{formatarDataSimples(editing.data)} • {editing.local_evento || 'LOCAL À DEFINIR'}</p>
                            
                            {/* CAIXA SEM FUNDO (Borda Simples) */}
                            <div className="border border-neutral-300 rounded-lg p-8 mb-8" style={{fontSize: `${editing.tamanho_corpo||14}px`, color: editing.cor_corpo||'#000'}}>
                                <h3 className="font-black uppercase text-[10px] text-neutral-400 mb-4 tracking-[0.25em]">Contexto</h3>
                                <div className="leading-relaxed whitespace-pre-wrap font-medium">{editing.introducao}</div>
                                {editing.entregaveis && <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 font-bold whitespace-pre-wrap">{editing.entregaveis}</div>}
                            </div>
                            
                            {/* Tabela */}
                            <div className="mt-4">
                                {editing.visualizacao === 'simples' ? (
                                    <div className="text-center py-8 border-t border-b border-black">
                                        <p className="font-bold text-lg uppercase tracking-widest text-neutral-400">Investimento Total Unificado</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left" style={{fontSize: `${editing.tamanho_corpo||14}px`, color: editing.cor_corpo||'#000'}}><tbody>{(editing.itens||[]).map((it:any,i:number)=>(<tr key={i} className="border-b border-neutral-100 last:border-0"><td className="py-3 font-bold uppercase">{it.qtd}x {it.descricao}</td><td className="py-3 font-black text-right whitespace-nowrap">{formatCurrency(it.valor*it.qtd)}</td></tr>))}</tbody></table>
                                )}
                            </div>
                       </div>
                       
                       {/* Rodapé */}
                       <div className="mt-auto border-t-2 border-black pt-4 flex justify-between items-end relative z-10">
                            <div><p className="text-[10px] font-black uppercase text-neutral-400">Total Proposta</p><p className="font-black tracking-tighter leading-none" style={{fontSize: `${editing.tamanho_total||60}px`, color: editing.cor_total||'#000'}}>{formatCurrency(total)}</p></div>
                            <div className="text-right text-[10px] uppercase font-bold text-neutral-400">CNPJ: {CNPJ_LENZ}<br/>Validade: 7 dias</div>
                       </div>
                   </div>
               </div>
          </div>
       )
    }

    return (
        <div className="space-y-6 text-white"><div className="flex justify-between items-center"><h1 className="text-4xl font-black uppercase">Propostas</h1><button onClick={()=>setEditing({id:'new', cliente:'', projeto:'', tamanho_titulo: 48, itens:[{descricao:'',qtd:1,valor:0}], introducao:'', entregaveis:''})} className="btn-primary"><Plus size={16}/> Nova Proposta</button></div><div className="grid gap-4">{propostas.map((p:any) => (<div key={p.id} className="bg-[#0f0f0f] p-6 rounded-3xl border border-white/5 flex justify-between items-center group"><div><h3 className="font-black text-xl uppercase mb-1">{p.projeto}</h3><p className="text-xs text-neutral-500 uppercase">{p.cliente} • {formatarDataSimples(p.data)}</p></div><div className="flex gap-4 items-center"><button onClick={()=>onPrint(p)} className="p-3 bg-purple-600/10 text-purple-400 rounded-xl hover:bg-purple-600 hover:text-white transition-all"><Printer size={18}/></button><button onClick={()=>setEditing(p)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-white/10"><Pencil size={18}/></button><button onClick={async()=>{if(confirm('Excluir?')){await supabase.from('propostas').delete().eq('id',p.id); refresh()}}} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"><Trash2 size={18}/></button></div></div>))}</div></div>
    )
}

// ============================================================================
// MAIN APP & IMPRESSÃO A4 REFINADA (SEM CINZA)
// ============================================================================
export default function LampejoSystem() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState('dashboard');
  const [data, setData] = useState<any>({propostas:[], financeiro:[], clientes:[], equipamentos:[], equipe:[], documentos:[]});
  const [printData, setPrintData] = useState<any>(null);

  async function refresh() {
      const [p,f,c,e,eq,d] = await Promise.all([
          supabase.from('propostas').select('*').order('created_at', {ascending: false}),
          supabase.from('financeiro').select('*').order('data', {ascending: false}),
          supabase.from('clientes').select('*').order('nome_fantasia', {ascending: true}),
          supabase.from('equipamentos').select('*'), supabase.from('equipe').select('*'),
          supabase.from('documentos').select('*').order('created_at', {ascending: false})
      ]);
      setData({ propostas: p.data||[], financeiro: f.data||[], clientes: c.data||[], equipamentos: e.data||[], equipe: eq.data||[], documentos: d.data||[] });
  }

  useEffect(() => { 
      supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if(session) refresh(); });
      if(printData) setTimeout(() => { window.print(); setPrintData(null); }, 500);
  }, [printData]);

  if (!session) return <LoginView />;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-600 selection:text-white">
      <Navbar />
      <style jsx global>{`
         .input-field { background: #1a1a1a; border: 1px solid #333; padding: 12px; border-radius: 12px; color: white; width: 100%; outline: none; font-size: 13px; font-weight: 500; }
         .input-field:focus { border-color: #9333ea; background: #000; }
         .label-field { font-size: 10px; text-transform: uppercase; font-weight: 900; color: #666; display: block; margin-bottom: 4px; }
         .btn-primary { background: white; color: black; font-weight: 900; padding: 12px 24px; border-radius: 16px; font-size: 10px; text-transform: uppercase; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; }
         .btn-primary:hover { transform: scale(1.02); }
         
         @media print {
            @page { margin: 0; size: A4; }
            /* FORÇA FUNDO BRANCO E TEXTO PRETO NA IMPRESSÃO */
            body, html { background-color: white !important; color: black !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body * { visibility: hidden; }
            #print-layer, #print-layer * { visibility: visible; }
            #print-layer { 
                position: fixed; top: 0; left: 0; width: 210mm; min-height: 297mm; 
                display: block !important; 
                background: white !important; 
                color: black !important; 
                padding: 15mm; 
                z-index: 999999;
            }
            .hide-print, aside, nav, main { display: none !important; }
            /* Remove fundos que podem sair cinza */
            .bg-gray-100, .bg-gray-50, .bg-neutral-100 { background-color: white !important; }
         }
      `}</style>

      <div className="flex pt-20 h-screen overflow-hidden print:hidden">
        <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-4 gap-1 overflow-y-auto">
          <NavButton icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={<DollarSign size={18}/>} label="Financeiro" active={view === 'financeiro'} onClick={() => setView('financeiro')} />
          <NavButton icon={<Users size={18}/>} label="CRM Clientes" active={view === 'clientes'} onClick={() => setView('clientes')} />
          <NavButton icon={<FileText size={18}/>} label="Propostas" active={view === 'propostas'} onClick={() => setView('propostas')} />
          <NavButton icon={<FileCheck size={18}/>} label="Jurídico" active={view === 'documentos'} onClick={() => setView('documentos')} />
          <NavButton icon={<Camera size={18}/>} label="Inventário" active={view === 'equipamentos'} onClick={() => setView('equipamentos')} />
          <NavButton icon={<Star size={18}/>} label="Equipe" active={view === 'equipe'} onClick={() => setView('equipe')} />
          <button onClick={() => supabase.auth.signOut().then(()=>window.location.reload())} className="mt-8 flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-white/5 rounded-xl text-xs uppercase font-black"><LogOut size={16}/> Sair</button>
        </aside>
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {view === 'dashboard' && <DashboardView {...data} />}
          {view === 'financeiro' && <FinanceiroView {...data} refresh={refresh} session={session} onPrint={(d:any)=>setPrintData({type:'financeiro', data:d})} />}
          {view === 'clientes' && <ClientesView {...data} refresh={refresh} session={session} />}
          {view === 'propostas' && <PropostasView {...data} refresh={refresh} session={session} onPrint={(d:any)=>setPrintData({type:'proposta', data:d, cli:data.clientes.find((c:any)=>c.nome_fantasia===d.cliente)})} />}
          {view === 'documentos' && <DocumentosView {...data} refresh={refresh} session={session} />}
          {view === 'equipamentos' && <EquipamentosView {...data} refresh={refresh} session={session} />}
          {view === 'equipe' && <EquipeView {...data} refresh={refresh} session={session} />}
        </main>
      </div>

      {printData && (
        <div id="print-layer" className="bg-white text-black h-screen w-screen hidden">
           {printData.type === 'proposta' ? (
             <div className="flex flex-col h-[280mm] justify-between relative overflow-hidden bg-white">
                <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
                    <img src="/bg-home.jpg" className="w-full h-full object-cover opacity-[0.03]" style={{zIndex: -1}} />
                </div>
                <div className="relative z-10 bg-white/0">
                     <div className="flex justify-between items-end mb-10 pb-6 border-b border-black">
                         <p className="font-black text-2xl uppercase tracking-tighter">LENZ AUDIOVISUAL</p>
                         {printData.cli?.logo_url && <img src={printData.cli.logo_url} className="h-10 mb-2 object-contain ml-auto"/>}
                     </div>
                     <div className="mb-14">
                        <h1 className="font-black uppercase mb-4 leading-none tracking-tighter" style={{ fontSize: `${printData.data.tamanho_titulo||48}px`, color: printData.data.cor_titulo||'#000' }}>{printData.data.projeto}</h1>
                        <p className="font-bold uppercase tracking-[0.2em] text-black" style={{ fontSize: `${printData.data.tamanho_subtitulo||14}px`, color: printData.data.cor_subtitulo||'#666' }}>{formatarDataSimples(printData.data.data)} • {printData.data.local_evento || 'LOCAL À DEFINIR'}</p>
                     </div>
                     
                     {/* BOX LIMPO COM BORDA E SEM FUNDO PARA GARANTIR BRANCO NO PDF */}
                     <div className="border border-neutral-300 rounded-lg p-8 mb-12 bg-transparent">
                         <h3 className="text-xs font-black uppercase text-neutral-400 mb-2 tracking-widest">Contexto</h3>
                         <div className="text-black font-medium leading-relaxed whitespace-pre-wrap" style={{ fontSize: `${printData.data.tamanho_corpo||14}px`, color: printData.data.cor_corpo||'#000' }}>{printData.data.introducao}</div>
                         {printData.data.entregaveis && <div className="mt-6 pt-4 border-t border-dashed border-neutral-200 font-bold whitespace-pre-wrap" style={{ fontSize: `${printData.data.tamanho_corpo||14}px`, color: printData.data.cor_corpo||'#000' }}>{printData.data.entregaveis}</div>}
                     </div>
                     
                     <div>
                         {printData.data.visualizacao === 'simples' ? <div className="text-center py-8 border-t border-b border-black"><p className="text-lg font-bold uppercase text-neutral-400">Investimento Total Unificado</p></div> : 
                         <div>
                             <p className="text-xs font-black uppercase text-neutral-400 mb-4 tracking-widest border-b pb-2">Composição</p>
                             <table className="w-full text-left" style={{ fontSize: `${printData.data.tamanho_corpo||14}px`, color: printData.data.cor_corpo||'#000' }}>
                                <tbody>{printData.data.itens.map((it:any,i:number)=>(<tr key={i} className="border-b border-neutral-200"><td className="py-3 font-bold uppercase">{it.qtd}x {it.descricao}</td><td className="py-3 font-black text-right whitespace-nowrap">{formatCurrency(it.valor*it.qtd)}</td></tr>))}</tbody>
                             </table>
                         </div>}
                     </div>
                </div>
                <div className="border-t-2 border-black pt-4 flex justify-between items-end mt-auto relative z-10 bg-white">
                     <div><p className="text-xs font-black uppercase text-neutral-400">Total Proposta</p><p className="font-black tracking-tighter leading-none text-black" style={{fontSize: `${printData.data.tamanho_total||60}px`, color: printData.data.cor_total||'#000'}}>{formatCurrency(printData.data.itens.reduce((a:number,b:any)=>a+(b.valor*b.qtd),0))}</p></div>
                     <div className="text-right text-[10px] uppercase font-bold text-neutral-400">CNPJ: {CNPJ_LENZ}<br/>Validade: 7 dias</div>
                </div>
             </div>
           ) : (
             <div className="p-8">
                 <h1 className="text-4xl font-black uppercase mb-8 text-purple-600">Relatório Financeiro</h1>
                 <p className="mb-12 font-bold uppercase tracking-widest text-gray-500 border-b pb-4">Ref: {printData.data.mes}</p>
                 <div className="grid grid-cols-2 gap-8 mb-12"><div><p className="uppercase text-xs font-bold text-gray-400">Entradas</p><p className="text-4xl font-black text-green-600">{formatCurrency(printData.data.entradas)}</p></div><div><p className="uppercase text-xs font-bold text-gray-400">Saídas</p><p className="text-4xl font-black text-red-600">{formatCurrency(printData.data.saidas)}</p></div></div>
                 <table className="w-full text-xs text-left border-collapse"><thead><tr className="border-b-2 border-black"><th className="pb-4 uppercase font-bold text-gray-400">Data</th><th className="pb-4 uppercase font-bold text-gray-400">Histórico</th><th className="pb-4 uppercase font-bold text-gray-400 text-right">Movimentação</th></tr></thead><tbody>{printData.data.itens.map((t:any)=>(<tr key={t.id} className="border-b border-gray-100"><td className="py-4 font-mono text-gray-500">{formatarDataSimples(t.data)}</td><td className="py-4 uppercase font-bold text-black">{t.descricao}</td><td className={`py-4 text-right font-black ${t.tipo==='entrada'?'text-green-600':'text-red-600'}`}>{t.tipo==='entrada'?'+':'-'} {formatCurrency(t.valor)}</td></tr>))}</tbody></table>
             </div>
           )}
        </div>
      )}
    </div>
  );
}