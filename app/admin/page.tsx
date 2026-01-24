"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  LayoutDashboard, FileText, Settings, Plus, 
  Trash2, Printer, CheckCircle, 
  ArrowUpRight, ArrowDownRight, DollarSign, 
  ChevronLeft, LogOut, Lock, Users, Globe, Briefcase, Link, MessageSquare, Upload, Star, FileCheck, TrendingUp, Camera, Box, Database
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import Navbar from "../components/Navbar";

// ============================================================================
// 1. CONFIGURAÇÕES
// ============================================================================

// COLAR SUAS CHAVES AQUI DENTRO DAS ASPAS VERDES:
const supabaseUrl = "https://bxpmulhcxaqlflcvepqz.supabase.co"; 
const supabaseKey = "sb_publishable_QoeoPSw5XYcvFPxg-sDwoA_SCOH_A8j";

const supabase = createClient(supabaseUrl, supabaseKey);

const LOGO_DB: Record<string, string> = {
  "nic": "/nicbr.png", "cgi": "/nicbr.png", "estadão": "/estadao.png",
  "threads": "/threads.png", "oab": "/oabdf.png", "caadf": "/caadf.png",
};

const MESES_FULL = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const CATEGORIAS_EQUIPAMENTO = [
  "Câmeras & Corpos", "Lentes & Óticas", "Iluminação & Grip", "Áudio & Microfones", 
  "Drones & Aéreos", "Estabilizadores & Gimbals", "Tripés & Suportes", 
  "Cabos & Conectividade", "Mídia & Armazenamento", "Computadores & Edição", 
  "Live Streaming & Switchers", "Cases & Transporte"
];

const formatarDataSimples = (dataStr: string) => {
  if (!dataStr) return "--";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
};

// ============================================================================
// 2. COMPONENTES UI
// ============================================================================
function NavButton({ icon, label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full text-left ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-neutral-500 hover:bg-white/5 hover:text-white'}`}>
      {icon} <span>{label}</span>
    </button>
  );
}

function KPICard({ title, value, customValue, color, icon, bg = "bg-[#0f0f0f]" }: any) {
  return (
    <div className={`${bg} border border-white/5 p-6 rounded-[32px] flex flex-col justify-between aspect-video relative overflow-hidden group`}>
      <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <div className="flex justify-between items-center text-neutral-400 text-[10px] font-black uppercase tracking-widest relative z-10">{title} {icon}</div>
      <p className={`text-2xl font-black tracking-tighter relative z-10 ${color}`}>{customValue || (value ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00")}</p>
    </div>
  );
}

function LoginView() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Credenciais Inválidas ou Erro de Conexão");
        else window.location.reload();
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-8">
            <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#0f0f0f] border border-white/10 p-12 rounded-[48px] space-y-6 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-purple-600" />
                <div className="text-center mb-10"><Lock className="mx-auto text-purple-500 mb-6" size={48} /><h2 className="font-black uppercase tracking-[0.3em] text-xl">Lampejo Hub</h2></div>
                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 text-white font-bold" required />
                <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 text-white font-bold" required />
                <button disabled={loading} className="w-full bg-purple-600 text-white font-black py-5 rounded-2xl tracking-[0.2em] uppercase text-xs shadow-lg active:scale-95 transition-all">{loading ? "Validando..." : "Entrar"}</button>
            </form>
        </div>
    );
}

// ============================================================================
// 3. TELAS (VIEWS)
// ============================================================================

function DashboardView({ propostas, financeiro, clientes, projetos }: any) {
    const stats = useMemo(() => {
      const totalAprovado = propostas.filter((p:any) => p.status === 'aprovada').reduce((acc:any, p:any) => acc + (p.itens?.reduce((a:any, i:any) => a + (Number(i.qtd) * Number(i.valor)), 0) || 0), 0);
      const entradas = financeiro.filter((t:any) => t.tipo === 'entrada').reduce((acc:any, t:any) => acc + Number(t.valor), 0);
      const saidas = financeiro.filter((t:any) => t.tipo === 'saida').reduce((acc:any, t:any) => acc + Number(t.valor), 0);
      return { totalAprovado, saldo: entradas - saidas, totalClientes: clientes.length, ativos: projetos.filter((p:any) => p.status !== 'Finalizado').length };
    }, [propostas, financeiro, clientes, projetos]);

    const chartData = useMemo(() => {
        const last6 = Array.from({length: 6}, (_, i) => {
            const d = new Date(); d.setMonth(d.getMonth() - i); return d.toISOString().slice(0, 7);
        }).reverse();
        return last6.map(mesAno => {
            const ent = financeiro.filter((t:any) => t.data.startsWith(mesAno) && t.tipo === 'entrada').reduce((a:any, b:any) => a + Number(b.valor), 0);
            const sai = financeiro.filter((t:any) => t.data.startsWith(mesAno) && t.tipo === 'saida').reduce((a:any, b:any) => a + Number(b.valor), 0);
            return { name: mesAno.split('-')[1], entradas: ent, saidas: sai };
        });
    }, [financeiro]);

    const clientData = useMemo(() => {
        const map = new Map();
        propostas.filter((p: any) => p.status === 'aprovada').forEach((p: any) => {
            const total = p.itens?.reduce((a: any, i: any) => a + (Number(i.qtd) * Number(i.valor)), 0) || 0;
            map.set(p.cliente, (map.get(p.cliente) || 0) + total);
        });
        return Array.from(map, ([name, value]) => ({ name, value })).sort((a: any, b: any) => b.value - a.value).slice(0, 5);
    }, [propostas]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20 text-white">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Intelligence Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KPICard title="Receita Aprovada" value={stats.totalAprovado} color="text-green-400" icon={<TrendingUp size={24}/>} />
            <KPICard title="Saldo em Caixa" value={stats.saldo} color="text-white" bg="bg-purple-600 shadow-purple-500/20" icon={<DollarSign size={24}/>} />
            <KPICard title="Projetos Ativos" customValue={stats.ativos.toString()} color="text-blue-400" icon={<Briefcase size={24}/>} />
            <KPICard title="Base Clientes" customValue={stats.totalClientes.toString()} color="text-purple-400" icon={<Users size={24}/>} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl h-[400px]">
                  <h3 className="text-[10px] font-black uppercase text-neutral-500 mb-8 tracking-widest">Fluxo de Caixa (6 meses)</h3>
                  <ResponsiveContainer width="100%" height="90%">
                      <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                          <XAxis dataKey="name" stroke="#444" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{background: '#000', border: '1px solid #222', borderRadius: '10px'}} />
                          <Area type="monotone" dataKey="entradas" stroke="#9333ea" fill="#9333ea20" strokeWidth={3} />
                          <Area type="monotone" dataKey="saidas" stroke="#ef4444" fill="transparent" strokeWidth={2} />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
              <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl h-[400px]">
                  <h3 className="text-[10px] font-black uppercase text-neutral-500 mb-8 tracking-widest">Top 5 Faturamento Clientes</h3>
                  <ResponsiveContainer width="100%" height="90%">
                      <BarChart data={clientData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="#fff" fontSize={10} fontWeight="black" width={80} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: '#222'}} contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '15px' }} />
                          <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                              {clientData.map((_: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#9333ea' : '#333'} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
        </div>
    );
}

function ClientesView({ clientes, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    async function handleFileUpload(e: any) {
        const file = e.target.files[0]; if (!file) return; setUploading(true);
        const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
        await supabase.storage.from('logos').upload(`logos/${fileName}`, file);
        const { data } = supabase.storage.from('logos').getPublicUrl(`logos/${fileName}`);
        setEditing({ ...editing, logo_url: data.publicUrl }); setUploading(false);
    }
    async function handleSave() {
        if (!editing.nome_fantasia) return alert("Nome vazio");
        const { id, ...data } = editing;
        const res = editing.id === 'new' ? await supabase.from('clientes').insert([{ ...data, user_id: session.user.id }]) : await supabase.from('clientes').update(data).eq('id', editing.id);
        if (res.error) alert(res.error.message); else { setEditing(null); refresh(); }
    }
    if (editing) return (
        <div className="max-w-4xl mx-auto space-y-6 text-white"><button onClick={() => setEditing(null)} className="text-neutral-500 flex items-center gap-2"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] p-10 rounded-[48px] border border-white/5 space-y-8 shadow-2xl">
                <input value={editing.nome_fantasia || ""} onChange={e => setEditing({...editing, nome_fantasia: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="Nome Fantasia" />
                <input value={editing.endereco || ""} onChange={e => setEditing({...editing, endereco: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="Endereço" />
                <div className="w-full h-32 bg-black border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                    {editing.logo_url ? <img src={editing.logo_url} className="h-full w-full object-contain p-4" /> : <Upload className="text-neutral-500" />}
                    <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    <div className="absolute bottom-0 w-full bg-purple-600 text-white text-[8px] font-black text-center py-1 opacity-0 group-hover:opacity-100 transition-all">{uploading ? "SUBINDO..." : "CLIQUE PARA TROCAR LOGO"}</div>
                </div>
                <button onClick={handleSave} className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl">Salvar CRM</button>
            </div>
        </div>
    );
    return (<div className="space-y-8"><div className="flex justify-between items-center text-white"><h1 className="text-4xl font-black tracking-tighter uppercase">Clientes</h1><button onClick={() => setEditing({id:'new', nome_fantasia:''})} className="bg-white text-black px-8 py-4 rounded-3xl font-black uppercase text-[10px]"><Plus size={18}/> Novo Cliente</button></div><div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">{clientes.map((c:any) => (<div key={c.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-xl hover:border-purple-500/50 transition-all"><div className="flex justify-between items-start mb-6"><div className="w-16 h-16 bg-white/5 rounded-2xl p-3 flex items-center justify-center border border-white/5">{c.logo_url ? <img src={c.logo_url} className="max-w-full max-h-full object-contain" /> : <Globe className="text-neutral-700" />}</div><span className="text-[8px] font-black uppercase text-purple-400 bg-purple-900/10 px-2 py-1 rounded">Ativo</span></div><h3 className="text-xl font-black uppercase tracking-tighter mb-1">{c.nome_fantasia}</h3><p className="text-[10px] text-neutral-500 font-bold uppercase mb-6 truncate">{c.endereco || "Sem endereço"}</p><button onClick={() => setEditing(c)} className="w-full bg-white/5 py-3 rounded-xl hover:bg-white/10 text-xs font-bold text-white transition-all">Editar Ficha</button></div>))}</div></div>);
}

function EquipamentosView({ equipamentos, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    const stats = useMemo(() => {
        const totalItens = equipamentos.reduce((acc: number, e: any) => acc + (Number(e.quantidade) || 1), 0);
        const valorPatrimonio = equipamentos.reduce((acc: number, e: any) => acc + (Number(e.valor_compra) * (Number(e.quantidade) || 1)), 0);
        return { totalItens, valorPatrimonio };
    }, [equipamentos]);

    async function handleSave() {
        if (!editing.nome) return alert("Nome obrigatório");
        const { id, ...data } = editing;
        const res = editing.id === 'new' 
            ? await supabase.from('equipamentos').insert([{ ...data, user_id: session.user.id }]) 
            : await supabase.from('equipamentos').update(data).eq('id', editing.id);
        if (res.error) alert(res.error.message); else { setEditing(null); refresh(); }
    }

    if (editing) return (
        <div className="max-w-2xl mx-auto space-y-6 text-white animate-in slide-in-from-right duration-300">
            <button onClick={() => setEditing(null)} className="text-neutral-500 flex items-center gap-2"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] p-10 rounded-[48px] border border-white/5 space-y-6 shadow-2xl">
                <h2 className="text-3xl font-black uppercase tracking-tighter">Ficha Técnica</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <select value={editing.categoria || "Geral"} onChange={e => setEditing({...editing, categoria: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none">
                            <option value="Geral">Categoria...</option>
                            {CATEGORIAS_EQUIPAMENTO.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <input value={editing.nome || ""} onChange={e => setEditing({...editing, nome: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none" placeholder="Nome do Equipamento" />
                    </div>
                    <input value={editing.marca_modelo || ""} onChange={e => setEditing({...editing, marca_modelo: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none" placeholder="Marca / Modelo" />
                    <input value={editing.n_serie || ""} onChange={e => setEditing({...editing, n_serie: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none" placeholder="Número de Série" />
                    <div className="grid grid-cols-3 gap-4">
                        <input type="number" value={editing.quantidade || ""} onChange={e => setEditing({...editing, quantidade: Number(e.target.value)})} className="bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none" placeholder="Qtd" />
                        <input type="number" value={editing.valor_compra || ""} onChange={e => setEditing({...editing, valor_compra: Number(e.target.value)})} className="bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none" placeholder="Valor Unit (R$)" />
                        <select value={editing.status || "Disponível"} onChange={e => setEditing({...editing, status: e.target.value})} className="bg-black border border-white/10 rounded-2xl p-4 text-sm text-white outline-none">
                            <option value="Disponível">Disponível</option><option value="Em Uso">Em Uso</option><option value="Manutenção">Manutenção</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleSave} className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl uppercase text-xs shadow-xl transition-all hover:scale-[1.02]">Salvar no Inventário</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 text-white">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase font-white">Inventário</h1>
                    <p className="text-neutral-500 text-sm mt-1">Patrimônio: <strong className="text-green-400">{stats.valorPatrimonio.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</strong> • {stats.totalItens} Itens</p>
                </div>
                <button onClick={() => setEditing({id:'new', nome:'', status:'Disponível', quantidade: 1, categoria: 'Geral'})} className="bg-white text-black px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2"><Plus size={18}/> Novo Item</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipamentos.map((e: any) => (
                    <div key={e.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] shadow-2xl flex flex-col h-full hover:border-purple-500/50 transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Box size={100}/></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="p-3 bg-white/5 rounded-2xl text-purple-400"><Camera size={24}/></div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${e.status === 'Disponível' ? 'bg-green-500/20 text-green-400' : e.status === 'Manutenção' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{e.status}</span>
                                <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">{e.categoria || 'Geral'}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-black uppercase text-white tracking-tight leading-none mb-1 relative z-10">{e.nome}</h3>
                        <p className="text-xs text-neutral-500 mb-6 uppercase tracking-widest relative z-10">{e.marca_modelo || 'Genérico'}</p>
                        
                        <div className="mt-auto pt-6 border-t border-white/5 relative z-10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Valor Unitário</p>
                                    <p className="text-sm font-black text-white">{Number(e.valor_compra).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest mb-1">Qtd</p>
                                    <p className="text-xl font-black text-white">{e.quantidade || 1}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditing(e)} className="w-full bg-white/5 py-3 rounded-xl hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all">Gerenciar Item</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EquipeView({ equipe, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    async function handleSave() {
        const { id, ...data } = editing;
        const res = editing.id === 'new' ? await supabase.from('equipe').insert([{ ...data, user_id: session.user.id }]) : await supabase.from('equipe').update(data).eq('id', editing.id);
        if (res.error) alert(res.error.message); else { setEditing(null); refresh(); }
    }
    if (editing) return (
        <div className="max-w-2xl mx-auto space-y-6 text-white"><button onClick={() => setEditing(null)} className="text-neutral-500 flex items-center gap-2"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] p-10 rounded-[48px] border border-white/5 space-y-6 shadow-2xl text-white font-white">
                <input value={editing.nome || ""} onChange={e => setEditing({...editing, nome: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="Nome" />
                <input value={editing.funcao || ""} onChange={e => setEditing({...editing, funcao: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="Função" />
                <input type="number" value={editing.valor_diaria || ""} onChange={e => setEditing({...editing, valor_diaria: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="Valor Diária" />
                <input value={editing.whatsapp || ""} onChange={e => setEditing({...editing, whatsapp: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="WhatsApp" />
                <button onClick={handleSave} className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl uppercase text-xs">Salvar Talento</button>
            </div>
        </div>
    );
    // LAYOUT RICO RESTAURADO PARA EQUIPE
    return (
        <div className="space-y-8 text-white">
            <div className="flex justify-between items-center text-white"><h1 className="text-4xl font-black tracking-tighter uppercase">Equipe</h1><button onClick={() => setEditing({id:'new', nome:''})} className="bg-white text-black px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl"><Plus size={18}/> Novo Talento</button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipe.map((e: any) => (
                    <div key={e.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] group hover:border-purple-500/50 transition-all flex flex-col shadow-2xl relative overflow-hidden h-full justify-between">
                        <div className="flex justify-between mb-6 relative z-10">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-purple-500/30">{(e.nome && e.nome[0]) ? e.nome[0] : "?"}</div>
                            <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full h-fit">{e.funcao || "Freelancer"}</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tight mb-2 text-white relative z-10">{e.nome}</h3>
                            <p className="text-xs text-neutral-500 mb-8 relative z-10">Diária Base: <span className="text-green-400 font-bold">{e.valor_diaria ? Number(e.valor_diaria).toLocaleString('pt-BR', {style:'currency', currency:'BRL'}) : 'R$ 0,00'}</span></p>
                        </div>
                        <div className="flex gap-2 mt-auto relative z-10">
                            {e.whatsapp && <a href={`https://wa.me/${e.whatsapp.replace(/\D/g,'')}`} target="_blank" className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all"><MessageSquare size={18}/></a>}
                            <button onClick={() => setEditing(e)} className="p-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all ml-auto"><Settings size={18}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjetosView({ projetos, clientes, refresh, session }: any) {
    const [editing, setEditing] = useState<any>(null);
    async function handleSave() {
        const { id, clientes, ...data } = editing;
        const res = editing.id === 'new' ? await supabase.from('projetos').insert([{ ...data, user_id: session.user.id }]) : await supabase.from('projetos').update(data).eq('id', editing.id);
        if (res.error) alert(res.error.message); else { setEditing(null); refresh(); }
    }
    if (editing) return (
        <div className="max-w-2xl mx-auto space-y-6 text-white"><button onClick={() => setEditing(null)} className="text-neutral-500 flex items-center gap-2"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] p-10 rounded-[48px] border border-white/5 space-y-6 shadow-2xl text-white">
                <input value={editing.nome || ""} onChange={e => setEditing({...editing, nome: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-sm text-white" placeholder="Projeto" />
                <button onClick={handleSave} className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl uppercase text-xs">Salvar Projeto</button>
            </div>
        </div>
    );
    return (<div className="space-y-8 text-white"><div className="flex justify-between items-center text-white font-white"><h1 className="text-4xl font-black tracking-tighter uppercase font-white text-white font-white">Projetos</h1><button onClick={() => setEditing({id:'new', nome:''})} className="bg-white text-black px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest"><Plus size={18}/> Novo Projeto</button></div><div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] overflow-hidden text-white font-white"><table className="w-full text-left text-sm"><tbody>{projetos.map((p:any) => (<tr key={p.id}><td className="p-6">{p.nome}</td></tr>))}</tbody></table></div></div>);
}

function DocumentosView({ documentos, clientes, projetos, refresh, session, onPrint }: any) {
    const [editing, setEditing] = useState<any>(null);
    const contratoTemplate = (cli: any, proj: any) => `CONTRATO DE PRESTAÇÃO DE SERVIÇOS AUDIOVISUAIS\n\nCONTRATADA: LAMPEJO AUDIOVISUAL\nCONTRATANTE: ${cli?.razao_social || cli?.nome_fantasia}\n\nOBJETO: ${proj?.nome || '___'}`;
    async function handleSave() { const { id, clientes, projetos, ...data } = editing; const res = editing.id === 'new' ? await supabase.from('documentos').insert([{ ...data, user_id: session.user.id }]) : await supabase.from('documentos').update(data).eq('id', editing.id); if (res.error) alert(res.error.message); else { setEditing(null); refresh(); } }
    if (editing) return (
        <div className="max-w-4xl mx-auto space-y-6 text-white"><button onClick={() => setEditing(null)} className="text-neutral-500 flex items-center gap-2"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] p-10 rounded-[48px] border border-white/5 space-y-6 shadow-2xl text-white font-white">
                <textarea value={editing.conteudo || ""} onChange={e => setEditing({...editing, conteudo: e.target.value})} rows={12} className="w-full bg-black border border-white/10 rounded-2xl p-6 text-xs font-mono text-white outline-none" />
                <button onClick={handleSave} className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl uppercase text-xs shadow-xl transition-all">Salvar</button>
            </div>
        </div>
    );
    return (<div className="space-y-8 text-white"><h1 className="text-4xl font-black tracking-tighter uppercase">Jurídico</h1><button onClick={() => setEditing({id:'new', conteudo:''})} className="bg-white text-black px-8 py-4 rounded-3xl font-black uppercase text-[10px] shadow-xl"><Plus size={18}/> Novo Doc</button></div>);
}

function FinanceiroView({ financeiro, refresh, session, onPrint, equipamentos }: any) {
    const [mesAtivo, setMesAtivo] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [anoAtivo, setAnoAtivo] = useState(new Date().getFullYear().toString());
    const [novo, setNovo] = useState({ descricao: '', valor: 0, tipo: 'saida', data: new Date().toISOString().slice(0, 10) });
    const dataFiltro = `${anoAtivo}-${mesAtivo}`;
    
    // Cálculo do Patrimônio (Soma de todos os equipamentos)
    const valorPatrimonio = useMemo(() => {
        return equipamentos.reduce((acc: number, item: any) => acc + (Number(item.valor_compra) * (Number(item.quantidade) || 1)), 0);
    }, [equipamentos]);

    const filtradas = useMemo(() => financeiro.filter((t: any) => t.data.startsWith(dataFiltro)), [financeiro, dataFiltro]);
    const resumo = useMemo(() => { const ent = filtradas.filter((t:any) => t.tipo === 'entrada').reduce((a:any, b:any) => a + Number(b.valor), 0); const sai = filtradas.filter((t:any) => t.tipo === 'saida').reduce((a:any, b:any) => a + Number(b.valor), 0); return { ent, sai, sal: ent - sai }; }, [filtradas]);
    async function addTransacao() { if (!novo.descricao || novo.valor <= 0) return alert("Faltam dados"); const { error } = await supabase.from('financeiro').insert([{ user_id: session.user.id, descricao: novo.descricao, valor: novo.valor, tipo: novo.tipo, data: novo.data }]); if (error) alert(error.message); else { setNovo({ ...novo, descricao: '', valor: 0 }); refresh(); } }
    
    return (
      <div className="space-y-8 animate-in fade-in duration-500 text-white font-white">
        <div className="flex justify-between items-end text-white text-white"><div><h1 className="text-4xl font-black tracking-tighter uppercase font-white text-white">Financeiro & Valuation</h1><p className="text-neutral-500 text-sm italic font-white text-white font-white">Gestão Financeira Global.</p></div><button onClick={() => onPrint({ mes: dataFiltro, entradas: resumo.ent, saidas: resumo.sai, itens: filtradas })} className="p-4 bg-[#0f0f0f] border border-white/10 rounded-2xl text-purple-400 hover:text-white transition-all"><Printer size={24}/></button></div>
        <div className="bg-[#0f0f0f] p-4 rounded-[32px] border border-white/5"><div className="flex gap-4 items-center border-b border-white/5 pb-4"><select value={anoAtivo} onChange={e => setAnoAtivo(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase text-white outline-none focus:border-purple-500"><option value="2025">2025</option><option value="2026">2026</option></select><div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">{MESES_FULL.map((m, i) => (<button key={m} onClick={() => setMesAtivo((i+1).toString().padStart(2, '0'))} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${mesAtivo === (i+1).toString().padStart(2, '0') ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'text-neutral-500 hover:text-white transition-all'}`}>{m}</button>))}</div></div></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-white">
            <div className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5 text-green-400"><p className="text-[10px] font-black uppercase mb-2">Entradas (Mês)</p><p className="text-2xl font-black">{resumo.ent.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div>
            <div className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5 text-red-400"><p className="text-[10px] font-black uppercase mb-2">Saídas (Mês)</p><p className="text-2xl font-black">{resumo.sai.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div>
            <div className="bg-purple-600 p-8 rounded-[32px] text-white shadow-xl shadow-purple-500/20 font-white font-white"><p className="text-[10px] font-black uppercase mb-2 opacity-60">Saldo Líquido</p><p className="text-2xl font-black">{resumo.sal.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div>
            {/* NOVO CARD: PATRIMÔNIO E VALUATION */}
            <div className="bg-[#0f0f0f] p-8 rounded-[32px] border border-white/5 text-blue-400 relative overflow-hidden">
                <div className="absolute right-0 top-0 p-4 opacity-10"><Database size={60}/></div>
                <p className="text-[10px] font-black uppercase mb-2 relative z-10">Patrimônio (Ativos)</p>
                <p className="text-2xl font-black relative z-10">{valorPatrimonio.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p>
            </div>
        </div>
        <div className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[32px] flex flex-wrap gap-4 items-end shadow-2xl text-white font-white"><div className="flex-1 min-w-[200px] text-white font-white"><label className="text-[10px] font-black text-neutral-500 mb-2 block uppercase tracking-widest text-white font-white">Descrição</label><input value={novo.descricao} onChange={e => setNovo({...novo, descricao: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white focus:border-purple-500 outline-none" /></div><div className="w-32 text-white font-white"><label className="text-[10px] font-black text-neutral-500 mb-2 block uppercase tracking-widest text-white font-white">Valor</label><input type="number" value={novo.valor} onChange={e => setNovo({...novo, valor: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white" /></div><div className="w-32 text-white font-white font-white"><label className="text-[10px] font-black text-neutral-500 mb-2 block uppercase tracking-widest text-white font-white font-white">Tipo</label><select value={novo.tipo} onChange={e => setNovo({...novo, tipo: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-500"><option value="entrada">Entrada</option><option value="saida">Saída</option></select></div><button onClick={addTransacao} className="bg-white text-black font-black px-8 h-12 rounded-xl transition-all active:scale-95 shadow-xl uppercase text-[10px]">Lançar</button></div>
        <div className="bg-[#0f0f0f] border border-white/5 rounded-[32px] overflow-hidden text-white font-white font-white font-white font-white font-white font-white font-white font-white"><table className="w-full text-left text-sm text-white font-white font-white font-white font-white font-white font-white font-white font-white font-white"><thead className="bg-white/5 text-[10px] font-black uppercase text-neutral-500 text-white font-white font-white"><tr><th className="p-6">Data</th><th className="p-6">Descrição</th><th className="p-6 text-right font-white">Valor</th><th className="p-6"></th></tr></thead><tbody className="divide-y divide-white/5 text-white font-white font-white">{filtradas.map((t:any) => (<tr key={t.id} className="hover:bg-white/5 text-white font-white"><td className="p-6 text-xs font-mono text-neutral-500 font-white font-white">{formatarDataSimples(t.data)}</td><td className="p-6 font-bold uppercase text-white font-white font-white font-white font-white">{t.descricao}</td><td className={`p-6 text-right font-black ${t.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>{Number(t.valor).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td><td className="p-6 text-right"><button onClick={async () => { if(confirm("Deletar?")){ await supabase.from('financeiro').delete().eq('id', t.id); refresh(); } }} className="text-neutral-600 hover:text-red-500 transition-all font-white"><Trash2 size={16}/></button></td></tr>))}</tbody></table></div>
      </div>
    );
}

function PropostasView({ propostas, clientes, refresh, session, onPrint }: any) {
    const [editing, setEditing] = useState<any>(null);
    const [filtroAno, setFiltroAno] = useState<string>(new Date().getFullYear().toString());
    const [filtroMes, setFiltroMes] = useState<string>("todos");
    const filtradas = useMemo(() => propostas.filter((p: any) => { const [ano, mes] = p.data.split('-'); return (filtroAno === "todos" || ano === filtroAno) && (filtroMes === "todos" || mes === filtroMes); }), [propostas, filtroAno, filtroMes]);
    async function handleSave() { if (!editing.cliente || !editing.projeto) return alert("Faltam dados"); 
        const { id, ...dataToSave } = editing;
        const res = editing.id === 'new' ? await supabase.from('propostas').insert([{ ...dataToSave, user_id: session.user.id }]) : await supabase.from('propostas').update(dataToSave).eq('id', editing.id);
        if (res.error) alert(res.error.message); else { setEditing(null); refresh(); } 
    }
    if (editing) {
      const cliSel = clientes.find((c: any) => c.nome_fantasia === editing.cliente);
      return (
        <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-8 h-full animate-in slide-in-from-right duration-500 text-white font-white font-white font-white font-white font-white"><div className="space-y-6 overflow-y-auto pr-4 pb-20 custom-scrollbar text-white font-white font-white font-white"><button onClick={() => setEditing(null)} className="text-neutral-500 flex items-center gap-2 transition-all hover:text-white font-white font-white"><ChevronLeft size={16}/> Voltar</button>
            <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl text-white font-white font-white"><label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest text-white font-white font-white">Vincular Cliente</label><select value={editing.cliente} onChange={e => setEditing({...editing, cliente: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-purple-500"><option value="">Selecione um Cliente (CRM)</option>{clientes.map((c: any) => (<option key={c.id} value={c.nome_fantasia}>{c.nome_fantasia}</option>))}</select><input value={editing.projeto} onChange={e => setEditing({...editing, projeto: e.target.value})} placeholder="Título do Projeto" className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-purple-500" /><div className="grid grid-cols-2 gap-2 text-white font-white"><input type="date" value={editing.data} onChange={e => setEditing({...editing, data: e.target.value})} className="bg-black border border-white/10 rounded-xl p-4 text-sm text-white" /><select value={editing.status} onChange={e => setEditing({...editing, status: e.target.value})} className="bg-black border border-white/10 rounded-xl p-4 text-sm text-white"><option value="rascunho">Rascunho</option><option value="aprovada">Aprovada</option></select></div></div>
            <textarea rows={4} value={editing.introducao || ""} onChange={e => setEditing({...editing, introducao: e.target.value})} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl p-4 text-sm text-white resize-none outline-none focus:border-purple-500" placeholder="Intro estratégica..." />
            <textarea rows={6} value={editing.entregaveis || ""} onChange={e => setEditing({...editing, entregaveis: e.target.value})} className="w-full bg-[#0f0f0f] border border-white/10 rounded-xl p-4 text-sm text-white outline-none font-mono focus:border-purple-500" placeholder="Deliverables..." />
            <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl text-white font-white font-white font-white"><div className="flex justify-between items-center text-white font-white font-white"><label className="text-[10px] font-black text-neutral-500 uppercase font-white font-white">Orçamento</label><button onClick={() => setEditing({...editing, itens: [...(editing.itens || []), {id: Date.now().toString(), descricao: '', qtd: 1, valor: 0}]})} className="text-purple-400 text-xs font-bold transition-all hover:scale-105 active:scale-95 font-white font-white font-white font-white">+ Item</button></div>{editing.itens?.map((item: any, idx: number) => (<div key={item.id} className="grid grid-cols-[1fr_50px_90px_30px] gap-2 items-center text-white font-white font-white"><input value={item.descricao} onChange={e => { const ni = [...editing.itens]; ni[idx].descricao = e.target.value; setEditing({...editing, itens: ni}) }} className="bg-black border border-white/10 rounded-lg p-2 text-white text-[10px] outline-none" /><input type="number" value={item.qtd} onChange={e => { const ni = [...editing.itens]; ni[idx].qtd = Number(e.target.value); setEditing({...editing, itens: ni}) }} className="bg-black border border-white/10 rounded-lg p-2 text-white text-[10px] text-center outline-none" /><input type="number" value={item.valor} onChange={e => { const ni = [...editing.itens]; ni[idx].valor = Number(e.target.value); setEditing({...editing, itens: ni}) }} className="bg-black border border-white/10 rounded-lg p-2 text-white text-[10px] text-right outline-none" /><button onClick={() => setEditing({...editing, itens: editing.itens.filter((_:any, i:any) => i !== idx)})} className="text-red-500 transition-all hover:scale-110 active:scale-95"><Trash2 size={14}/></button></div>))}</div>
            <button onClick={handleSave} className="w-full bg-purple-600 text-white font-black py-5 rounded-3xl shadow-xl transition-all uppercase tracking-widest text-xs active:scale-95 shadow-purple-500/10">Salvar Proposta</button>
          </div>
          <div className="bg-[#0f0f0f] rounded-[48px] border border-white/5 p-12 flex justify-center overflow-hidden font-white font-white"><div className="w-[210mm] min-h-[297mm] bg-white text-black p-[60px] shadow-2xl origin-top scale-[0.6] lg:scale-[0.75] relative overflow-hidden flex flex-col justify-between text-black text-black font-white font-white"><div className="absolute top-0 left-0 w-full h-[6px] bg-purple-600 font-white font-white" /><img src="/bg-home.jpg" className="absolute inset-0 w-full h-full object-cover opacity-[0.04] grayscale pointer-events-none font-white font-white" /><div className="relative z-10 text-black text-black text-black font-black text-black text-black text-black font-white font-white font-white"><div className="flex justify-between items-center mb-8 font-white font-white"><div className="w-32 font-white font-white"><img src="/logo-lampejo.png" className="w-full filter invert font-white font-white font-white" /></div><div className="text-right text-black text-black text-black font-white font-white">{cliSel?.logo_url && <img src={cliSel.logo_url} className="h-10 object-contain font-white font-white" />}<p className="text-[8px] font-black text-neutral-400 mt-2 uppercase font-white font-white">Ref: LP-{new Date().getFullYear()}-001</p></div></div><div className="mb-4 text-black text-black text-black font-white font-white"><h1 className="text-xl font-black uppercase tracking-tighter text-black leading-tight text-black text-black font-white font-white">{editing.projeto || "TÍTULO"}</h1></div><div className="grid grid-cols-2 gap-8 border-y border-neutral-100 py-3 mb-4 text-black text-black text-black font-white font-white"><div><p className="text-[7px] font-black text-neutral-400 uppercase font-white font-white">Data</p><p className="text-xs font-bold text-black font-white font-white">{formatarDataSimples(editing.data)}</p></div><div><p className="text-[7px] font-black text-neutral-400 uppercase text-black font-white font-white">Cliente</p><p className="text-xs font-bold text-black uppercase font-white font-white">{editing.cliente || '--'}</p></div></div><div className="text-xs leading-relaxed text-black whitespace-pre-wrap mb-4 font-medium text-neutral-700 text-justify text-black text-black font-white font-white">{editing.introducao || "..."}</div><div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 mb-4 text-black text-black text-black font-white font-white"><h4 className="text-[8px] font-black text-neutral-400 uppercase mb-2 tracking-widest text-black font-white font-white font-white">Deliverables</h4><p className="whitespace-pre-wrap text-xs font-bold text-neutral-800 leading-tight text-black font-white font-white">{editing.entregaveis || "..."}</p></div><table className="w-full text-left text-xs mb-4 text-black text-black text-black font-white font-white font-white font-white"><thead><tr className="text-[8px] font-black text-neutral-400 uppercase border-b border-neutral-100 text-black font-white font-white"><th>Serviço</th><th className="text-center">Qtd</th><th className="text-right">Total</th></tr></thead><tbody className="divide-y divide-neutral-50 text-black text-black text-black text-black font-white font-white">{editing.itens?.map((i: any, idx: number) => (<tr key={idx} className="text-black font-white font-white"><td className="py-2 font-bold text-[10px] text-black font-white font-white">{i.descricao}</td><td className="py-2 text-center text-neutral-500 text-[10px] text-black font-white font-white">{i.qtd}x</td><td className="py-2 text-right font-black text-[10px] text-black font-white font-white">{(Number(i.qtd) * Number(i.valor)).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td></tr>))}</tbody></table><div className="text-right border-t border-black pt-2 text-black text-black text-black font-white font-white font-white font-white font-white font-white font-white"><p className="text-[8px] font-black text-neutral-400 uppercase text-black font-white font-white">Investimento Total</p><p className="text-3xl font-black tracking-tighter text-black text-black font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white">{(editing.itens?.reduce((a:any, b:any) => a + (Number(b.qtd) * Number(b.valor)), 0) || 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div></div><div className="relative z-10 border-t border-neutral-100 pt-6 mt-4 flex justify-between items-end opacity-60 text-black text-black text-black font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white"><div className="text-left text-black text-black text-black font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white"><p className="text-[8px] font-black uppercase mb-1 text-black font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white">Lampejo Audiovisual</p><p className="text-[7px]">Brasília-DF • {cliSel?.endereco || "Brasília Shopping Sala 1221"}</p></div><div className="text-right text-black text-black text-black font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white"><p className="text-[7px]">CNPJ: 63.030.132/0001-86</p></div></div></div></div>
        </div>
      );
    }
    return (
      <div className="space-y-6 text-white text-white font-white font-white font-white font-white font-white"><div className="flex justify-between items-center font-white text-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white"><h1 className="text-4xl font-black tracking-tighter uppercase font-white text-white font-white font-white font-white font-white font-white font-white font-white font-white font-white font-white">Propostas</h1><button onClick={() => setEditing({id:'new', cliente:'', projeto:'', introducao:'', entregaveis:'', itens:[], status:'rascunho', data: new Date().toISOString().slice(0, 10)})} className="bg-white text-black px-8 py-4 rounded-3xl font-black flex items-center gap-2 transition-all uppercase text-[10px] active:scale-95 shadow-xl shadow-white/5 active:bg-neutral-200">Nova Proposta</button></div>
        <div className="flex flex-wrap gap-4 bg-[#0f0f0f] p-4 rounded-[32px] border border-white/5 items-center text-white font-white font-white"><select value={filtroAno} onChange={e => setFiltroAno(e.target.value)} className="bg-black border border-white/10 rounded-2xl px-5 py-3 text-xs font-black uppercase text-white outline-none focus:border-purple-500 transition-all font-white font-white font-white"><option value="2025">2025</option><option value="2026">2026</option></select><div className="flex gap-1 overflow-x-auto pb-1 max-w-full custom-scrollbar text-white font-white font-white"><button onClick={() => setFiltroMes("todos")} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${filtroMes === 'todos' ? 'bg-purple-600' : 'text-neutral-500 border border-white/5 hover:text-white'}`}>Todos</button>{MESES_FULL.map((m, i) => (<button key={m} onClick={() => setFiltroMes((i+1).toString().padStart(2, '0'))} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${filtroMes === (i+1).toString().padStart(2, '0') ? 'bg-purple-600 shadow-lg shadow-purple-500/20' : 'text-neutral-500 border border-white/5 hover:text-white transition-all'}`}>{m}</button>))}</div></div>
        <div className="grid grid-cols-1 gap-3 font-white font-white font-white">{filtradas.map((p:any) => (<div key={p.id} className="bg-[#0f0f0f] border border-white/5 p-8 rounded-[40px] flex justify-between items-center group hover:border-purple-500/40 transition-all text-white font-white font-white"><div className="flex items-center gap-8 font-white font-white"><div className={`w-1.5 h-12 rounded-full ${p.status === 'aprovada' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-neutral-800'} font-white font-white`} /><div><h3 className="font-black text-2xl uppercase tracking-tighter mb-1 text-white font-white font-white font-white">{p.projeto}</h3><p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-white font-white">{p.cliente} • {formatarDataSimples(p.data)}</p></div></div><div className="flex gap-3 font-white font-white"><button onClick={() => onPrint(p)} className="p-4 bg-white/5 rounded-2xl text-purple-400 hover:bg-purple-400/10 font-white font-white"><Printer size={20}/></button><button onClick={() => setEditing(p)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-white/10 transition-all font-white font-white"><Settings size={20}/></button><button onClick={async () => { if(confirm("Deletar?")){ await supabase.from('propostas').delete().eq('id', p.id); refresh(); } }} className="p-4 bg-white/5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-white font-white"><Trash2 size={20}/></button></div></div>))}</div>
      </div>
    );
}

// ============================================================================
// 4. SISTEMA PRINCIPAL (EXPORT DEFAULT)
// ============================================================================
export default function LampejoEnterpriseSystem() {
  const [session, setSession] = useState<any>(null);
  const [view, setView] = useState<'dashboard' | 'propostas' | 'financeiro' | 'clientes' | 'projetos' | 'equipe' | 'documentos' | 'equipamentos'>('dashboard');
  const [propostas, setPropostas] = useState<any[]>([]);
  const [financeiro, setFinanceiro] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [projetos, setProjetos] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [equipamentos, setEquipamentos] = useState<any[]>([]);
  const [printData, setPrintData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAfterPrint = () => setPrintData(null);
    window.addEventListener('afterprint', handleAfterPrint);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      else setLoading(false);
    });
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: prop } = await supabase.from('propostas').select('*').order('data', { ascending: false });
    const { data: fin } = await supabase.from('financeiro').select('*').order('data', { ascending: false });
    const { data: cli } = await supabase.from('clientes').select('*').order('nome_fantasia', { ascending: true });
    const { data: proj } = await supabase.from('projetos').select('*, clientes(nome_fantasia, logo_url, endereco, cnpj)').order('created_at', { ascending: false });
    const { data: eq } = await supabase.from('equipe').select('*').order('nome', { ascending: true });
    const { data: doc } = await supabase.from('documentos').select('*, clientes(nome_fantasia), projetos(nome)').order('created_at', { ascending: false });
    const { data: equip } = await supabase.from('equipamentos').select('*').order('nome', { ascending: true });
    
    if (prop) setPropostas(prop);
    if (fin) setFinanceiro(fin);
    if (cli) setClientes(cli);
    if (proj) setProjetos(proj);
    if (eq) setEquipe(eq);
    if (doc) setDocumentos(doc);
    if (equip) setEquipamentos(equip);
    setLoading(false);
  }

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-black text-white animate-pulse tracking-[0.5em]">LAMPEJO ENTERPRISE...</div>;
  if (!session) return <LoginView />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30 font-sans">
      <Navbar />
      <div className="flex pt-20 h-screen overflow-hidden print:hidden text-white">
        <aside className="w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col p-4 gap-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6 px-4 pt-4 text-white">
            <h2 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em]">Enterprise Hub</h2>
            <div className="mt-1 text-[9px] text-neutral-500 truncate">{session.user.email}</div>
          </div>
          <NavButton icon={<LayoutDashboard size={18}/>} label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
          <NavButton icon={<Users size={18}/>} label="CRM Clientes" active={view === 'clientes'} onClick={() => setView('clientes')} />
          <NavButton icon={<Briefcase size={18}/>} label="Projetos" active={view === 'projetos'} onClick={() => setView('projetos')} />
          <NavButton icon={<FileCheck size={18}/>} label="Contratos/Docs" active={view === 'documentos'} onClick={() => setView('documentos')} />
          <NavButton icon={<FileText size={18}/>} label="Propostas" active={view === 'propostas'} onClick={() => setView('propostas')} />
          <NavButton icon={<Camera size={18}/>} label="Equipamentos" active={view === 'equipamentos'} onClick={() => setView('equipamentos')} />
          <NavButton icon={<Star size={18}/>} label="Equipe" active={view === 'equipe'} onClick={() => setView('equipe')} />
          <NavButton icon={<DollarSign size={18}/>} label="Financeiro" active={view === 'financeiro'} onClick={() => setView('financeiro')} />
          <button onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="mt-8 flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"><LogOut size={18}/> Sair</button>
        </aside>

        <main className="flex-1 overflow-y-auto bg-[#050505] p-8 custom-scrollbar">
          {view === 'dashboard' && <DashboardView propostas={propostas} financeiro={financeiro} clientes={clientes} projetos={projetos} equipamentos={equipamentos} />}
          {view === 'clientes' && <ClientesView clientes={clientes} refresh={fetchData} session={session} />}
          {view === 'equipe' && <EquipeView equipe={equipe} refresh={fetchData} session={session} />}
          {view === 'projetos' && <ProjetosView projetos={projetos} clientes={clientes} refresh={fetchData} session={session} />}
          {view === 'equipamentos' && <EquipamentosView equipamentos={equipamentos} refresh={fetchData} session={session} />}
          {view === 'documentos' && <DocumentosView documentos={documentos} clientes={clientes} projetos={projetos} refresh={fetchData} session={session} onPrint={(d: any) => { setPrintData({type:'documento', data:d}); setTimeout(()=>window.print(), 300); }} />}
          {view === 'propostas' && <PropostasView propostas={propostas} clientes={clientes} refresh={fetchData} session={session} onPrint={(p: any) => { setPrintData({type:'proposta', data:p}); setTimeout(()=>window.print(), 300); }} />}
          {view === 'financeiro' && <FinanceiroView financeiro={financeiro} refresh={fetchData} session={session} onPrint={(f: any) => { setPrintData({type:'relatorio', data:f}); setTimeout(()=>window.print(), 300); }} equipamentos={equipamentos} />}
        </main>
      </div>

      {printData && <PrintLayer data={printData} clientes={clientes} />}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        @media print {
          body * { visibility: hidden; }
          #print-layer, #print-layer * { visibility: visible; }
          #print-layer { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 210mm; 
            min-height: 297mm;
            background: white !important; 
            display: block !important; 
            color: black !important;
          }
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// 5. CAMADA DE IMPRESSÃO (PDF)
// ============================================================================

function PrintLayer({ data, clientes }: any) {
    if (!data) return null;
    const margemLucro = data.type === 'relatorio' && data.data.entradas > 0 ? (((data.data.entradas - data.data.saidas) / data.data.entradas) * 100).toFixed(1) : "0";
    const cliSel = (data.type === 'proposta' || data.type === 'documento') ? clientes.find((c: any) => c.id === data.data.cliente_id || c.nome_fantasia === data.data.cliente) : null;
    
    return (
      <div id="print-layer" style={{ width: '210mm', minHeight: '297mm', padding: '30pt 40pt', fontFamily: 'sans-serif', color: 'black', background: 'white', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
        <style>{`@page { margin: 0; size: A4; } @media print { html, body { background: white !important; } }`}</style>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04, zIndex: 0 }}><img src="/bg-home.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
        
        {data.type === 'documento' && (
            <div style={{ position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2pt solid black', paddingBottom: '20pt', marginBottom: '40pt' }}><img src="/logo-lampejo.png" style={{ width: '140pt', filter: 'invert(1)' }} /><p style={{ fontSize: '10pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2pt' }}>{data.data.tipo}</p></div>
                <div style={{ fontSize: '11pt', lineHeight: '1.8', textAlign: 'justify', whiteSpace: 'pre-wrap' }}>{data.data.conteudo}</div>
                <div style={{ marginTop: '100pt', borderTop: '1pt solid #eee', paddingTop: '20pt', textAlign: 'center', fontSize: '8pt', color: '#999', textTransform: 'uppercase' }}>Emitido via Lampejo Enterprise System</div>
            </div>
        )}

        {data.type === 'proposta' && (
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '270mm', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: '-30pt', left: '-40pt', width: '210mm', height: '6pt', background: '#9333ea' }} />
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20pt' }}><img src="/logo-lampejo.png" style={{ width: '120pt', filter: 'invert(1)' }} /><div style={{ textAlign: 'right' }}>{cliSel?.logo_url && <img src={cliSel.logo_url} style={{ height: '30pt' }} />}<p style={{ fontSize: '7pt', fontWeight: 900, textTransform: 'uppercase', color: '#bbb', marginTop: '5pt' }}>REF: LP-{new Date().getFullYear()}-001</p></div></div>
                <div style={{ marginBottom: '15pt' }}><p style={{ fontSize: '7pt', fontWeight: 900, color: '#9333ea', textTransform: 'uppercase', marginBottom: '2pt' }}>Proposta Comercial</p><h1 style={{ fontSize: '18pt', fontWeight: 900, textTransform: 'uppercase', lineHeight: '1.2' }}>{data.data.projeto}</h1></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20pt', borderTop: '1pt solid #eee', borderBottom: '1pt solid #eee', padding: '10pt 0', marginBottom: '15pt' }}><div><p style={{ fontSize: '6pt', fontWeight: 900, color: '#aaa', textTransform: 'uppercase' }}>Emitido em</p><p style={{ fontSize: '9pt', fontWeight: 'bold' }}>{formatarDataSimples(data.data.data)}</p></div><div><p style={{ fontSize: '6pt', fontWeight: 900, color: '#aaa', textTransform: 'uppercase' }}>Cliente</p><p style={{ fontSize: '9pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{data.data.cliente}</p></div></div>
                <div style={{ fontSize: '10pt', lineHeight: '1.5', marginBottom: '15pt', whiteSpace: 'pre-wrap', textAlign: 'justify' }}>{data.data.introducao}</div>
                <div style={{ background: '#fcfcfc', padding: '15pt', borderRadius: '15pt', border: '1pt solid #f0f0f0', marginBottom: '15pt' }}><h4 style={{ fontSize: '7pt', fontWeight: 900, color: '#aaa', textTransform: 'uppercase', marginBottom: '8pt' }}>Escopo de Produção</h4><p style={{ fontSize: '11pt', fontWeight: 'bold', margin: 0 }}>{data.data.entregaveis}</p></div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ fontSize: '6pt', fontWeight: 900, color: '#999', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1pt solid #eee' }}><th style={{ padding: '5pt 0' }}>Serviço</th><th style={{ textAlign: 'center' }}>Qtd</th><th style={{ textAlign: 'right' }}>Valor</th></tr></thead><tbody>{data.data.itens?.map((item: any, i: number) => (<tr key={i} style={{ borderBottom: '0.5pt solid #f5f5f5' }}><td style={{ padding: '8pt 0', fontSize: '10pt', fontWeight: 'bold' }}>{item.descricao}</td><td style={{ textAlign: 'center', fontSize: '9pt', color: '#666' }}>{item.qtd}x</td><td style={{ textAlign: 'right', fontSize: '11pt', fontWeight: 900 }}>{(Number(item.qtd) * Number(item.valor)).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td></tr>))}</tbody></table>
            </div>
            <div style={{ marginTop: 'auto' }}><div style={{ textAlign: 'right', borderTop: '2pt solid black', paddingTop: '10pt', marginBottom: '20pt' }}><p style={{ fontSize: '7pt', fontWeight: 900, color: '#aaa', textTransform: 'uppercase' }}>Investimento Total</p><p style={{ fontSize: '36pt', fontWeight: 900 }}>{(data.data.itens?.reduce((a:any, b:any) => a + (Number(b.qtd) * Number(b.valor)), 0) || 0).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div><div style={{ paddingTop: '15pt', borderTop: '1pt solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '7pt', color: '#888', textTransform: 'uppercase' }}><div><strong>LAMPEJO AUDIOVISUAL</strong><br/>Brasília Shopping Sala 1221</div><div>CNPJ: 63.030.132/0001-86<br/>lampejo.video</div></div></div>
          </div>
        )}

        {data.type === 'relatorio' && (
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '4pt solid black', paddingBottom: '10pt', marginBottom: '20pt' }}><div><p style={{ fontSize: '8pt', fontWeight: 900, color: '#9333ea', textTransform: 'uppercase', letterSpacing: '2pt' }}>Relatório Executivo</p><h1 style={{ fontSize: '26pt', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Fluxo de Caixa</h1><p style={{ fontSize: '11pt', fontWeight: 'bold', color: '#888' }}>Competência: {data.data.mes}</p></div><img src="/logo-lampejo.png" style={{ width: '100pt', filter: 'invert(1)' }} /></div><div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '15pt', marginBottom: '30pt' }}><div style={{ padding: '20pt', background: 'black', color: 'white', borderRadius: '20pt' }}><p style={{ fontSize: '7pt', fontWeight: 900, opacity: 0.5, marginBottom: '10pt', textTransform: 'uppercase' }}>Saldo Líquido</p><p style={{ fontSize: '24pt', fontWeight: 900, margin: 0 }}>{(data.data.entradas - data.data.saidas).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div><div style={{ padding: '20pt', background: '#f5f5f5', borderRadius: '20pt', border: '1pt solid #eee' }}><p style={{ fontSize: '7pt', fontWeight: 900, color: '#999', marginBottom: '10pt', textTransform: 'uppercase' }}>Receita Bruta</p><p style={{ fontSize: '18pt', fontWeight: 900, color: 'green', margin: 0 }}>{data.data.entradas.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div><div style={{ padding: '20pt', background: '#f5f5f5', borderRadius: '20pt', border: '1pt solid #eee' }}><p style={{ fontSize: '7pt', fontWeight: 900, color: '#999', marginBottom: '10pt', textTransform: 'uppercase' }}>Saída Total</p><p style={{ fontSize: '18pt', fontWeight: 900, color: 'red', margin: 0 }}>{data.data.saidas.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div></div><div style={{ marginBottom: '30pt', background: '#fafafa', padding: '20pt', borderRadius: '20pt', border: '1pt solid #eee' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10pt' }}><h4 style={{ fontSize: '8pt', fontWeight: 900, textTransform: 'uppercase' }}>Performance de Margem</h4><span style={{ fontSize: '12pt', fontWeight: 900 }}>{margemLucro}% de Lucro</span></div><div style={{ width: '100%', height: '10pt', background: '#eee', borderRadius: '5pt', overflow: 'hidden' }}><div style={{ width: `${margemLucro}%`, height: '100%', background: '#9333ea' }}></div></div></div><div style={{ flexGrow: 1 }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9pt' }}><thead><tr style={{ background: '#f0f0f0', textAlign: 'left', fontSize: '7pt', textTransform: 'uppercase', fontWeight: 900 }}><th style={{ padding: '8pt' }}>Data</th><th style={{ padding: '8pt' }}>Descrição</th><th style={{ padding: '8pt', textAlign: 'right' }}>Valor</th></tr></thead><tbody>{data.data.itens.map((t: any) => (<tr key={t.id} style={{ borderBottom: '0.5pt solid #eee' }}><td style={{ padding: '8pt', color: '#999', fontFamily: 'monospace' }}>{formatarDataSimples(t.data)}</td><td style={{ padding: '8pt', fontWeight: 'bold', textTransform: 'uppercase' }}>{t.descricao}</td><td style={{ padding: '8pt', textAlign: 'right', fontWeight: 900, color: t.tipo === 'entrada' ? 'green' : 'red' }}>{t.tipo === 'entrada' ? '+' : '-'} {Number(t.valor).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td></tr>))}</tbody></table></div><div style={{ marginTop: '30pt', paddingTop: '15pt', borderTop: '1pt solid #eee', display: 'flex', justifyContent: 'space-between', fontSize: '7pt', color: '#aaa', fontWeight: 900 }}><span>Lampejo Enterprise System</span><span>Gerado em {new Date().toLocaleDateString('pt-BR')}</span></div></div>
        )}
      </div>
    );
}