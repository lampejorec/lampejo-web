"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Plus, Trash2, Printer, List, FileText, 
  LayoutDashboard, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign, Calendar, PieChart, BarChart3
} from "lucide-react";
import Navbar from "../components/Navbar";
import Image from "next/image";

// ============================================================================
// 1. BANCO DE DADOS MOCK (Simulação para o Front-end)
// ============================================================================

const CLIENT_DB: Record<string, string> = {
  "nic": "/nicbr.png",
  "cgi": "/nicbr.png",
  "estadão": "/estadao.png",
  "estadao": "/estadao.png",
  "threads": "/threads.png",
  "sem rótulo": "/semrotulo.png",
  "sem rotulo": "/semrotulo.png",
  "hy": "/hy.png",
  "sinicon": "/sinicon.png",
  "safernet": "/safernet.png",
  "oab": "/oabdf.png",
  "caadf": "/caadf.png",
};

// ============================================================================
// 2. TIPOS
// ============================================================================

interface OrcamentoItem {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  data: string;
  status: 'pago' | 'pendente';
}

// ============================================================================
// 3. COMPONENTE: GERADOR DE PROPOSTAS (PDF CORRIGIDO)
// ============================================================================
function GeradorPropostas({ setPrintMode }: { setPrintMode: (mode: 'proposta' | 'financeiro_mes' | 'financeiro_geral' | null) => void }) {
  const [cliente, setCliente] = useState("");
  const [logoCliente, setLogoCliente] = useState<string | null>(null);
  const [projeto, setProjeto] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [validade, setValidade] = useState("10 dias");
  const [introducao, setIntroducao] = useState(`A Lampejo irá cuidar de todos os vídeos do evento com entrega real-time, garantindo agilidade e qualidade cinematográfica.`);
  const [entregaveis, setEntregaveis] = useState(`- 1 Vídeo resumo do dia por dia de evento (até 3 minutos)\n- 1 Vídeo de abertura do evento\n- 1 Corte viral das palestras por dia\n- 1 Entrevista com especialista por dia`);
  const [modoDetalhado, setModoDetalhado] = useState(true);
  const [itens, setItens] = useState<OrcamentoItem[]>([
    { id: "1", descricao: "Diárias de Captação e Edição", quantidade: 3, valorUnitario: 2500 },
  ]);

  useEffect(() => {
    const termo = cliente.toLowerCase();
    const key = Object.keys(CLIENT_DB).find(k => termo.includes(k));
    if (key) setLogoCliente(CLIENT_DB[key]);
    else setLogoCliente(null);
  }, [cliente]);

  const adicionarItem = () => setItens([...itens, { id: Date.now().toString(), descricao: "", quantidade: 1, valorUnitario: 0 }]);
  const removerItem = (id: string) => setItens(itens.filter(i => i.id !== id));
  const atualizarItem = (id: string, campo: keyof OrcamentoItem, valor: any) => setItens(itens.map(i => i.id === id ? { ...i, [campo]: valor } : i));
  const calcularTotal = () => itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 h-full items-start">
      
      {/* --- EDITOR (COLUNA ESQUERDA) --- */}
      <div className="space-y-6 animate-in slide-in-from-left-4 duration-500 print:hidden pb-20 overflow-y-auto max-h-[calc(100vh-150px)] custom-scrollbar pr-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tighter">Editor</h1>
          <button 
            onClick={() => setModoDetalhado(!modoDetalhado)}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded-lg text-[10px] font-medium hover:bg-neutral-700 transition-colors border border-white/10"
          >
            {modoDetalhado ? <List size={12} /> : <FileText size={12} />}
            {modoDetalhado ? "Modo Tabela" : "Modo Global"}
          </button>
        </div>

        <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Cabeçalho</h2>
          <input value={cliente} onChange={(e) => setCliente(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-purple-500 outline-none" placeholder="Cliente (Digite para logo)" />
          <input value={projeto} onChange={(e) => setProjeto(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-purple-500 outline-none" placeholder="Título do Projeto" />
          <input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs focus:border-purple-500 outline-none" placeholder="Subtítulo" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-xs text-white/70" />
            <input value={validade} onChange={(e) => setValidade(e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-xs" placeholder="Validade" />
          </div>
        </div>

        <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 space-y-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Conteúdo</h2>
          <textarea value={introducao} onChange={(e) => setIntroducao(e.target.value)} rows={4} className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs resize-none" placeholder="Descrição..." />
          <textarea value={entregaveis} onChange={(e) => setEntregaveis(e.target.value)} rows={6} className="w-full bg-black border border-white/10 rounded-lg p-2 text-xs resize-none" placeholder="Lista de entregáveis..." />
        </div>

        <div className="bg-neutral-900/50 p-4 rounded-xl border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Investimento</h2>
            <button onClick={adicionarItem} className="text-[10px] flex items-center gap-1 text-purple-400 hover:text-purple-300"><Plus size={12} /> Add</button>
          </div>
          <div className="space-y-2">
            {itens.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_40px_70px_20px] gap-2 items-start">
                <input value={item.descricao} onChange={(e) => atualizarItem(item.id, 'descricao', e.target.value)} className="bg-black border border-white/10 rounded-lg p-2 text-xs" placeholder="Item" />
                <input type="number" value={item.quantidade} onChange={(e) => atualizarItem(item.id, 'quantidade', Number(e.target.value))} className="bg-black border border-white/10 rounded-lg p-2 text-xs text-center" />
                <input type="number" value={item.valorUnitario} onChange={(e) => atualizarItem(item.id, 'valorUnitario', Number(e.target.value))} className="bg-black border border-white/10 rounded-lg p-2 text-xs text-right" />
                <button onClick={() => removerItem(item.id)} className="text-red-500 hover:text-red-400 p-1 flex justify-center"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handlePrint} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all text-sm uppercase tracking-widest"><Printer size={16} /> Imprimir PDF</button>
      </div>

      {/* --- PREVIEW A4 (COLUNA DIREITA) --- */}
      <div className="bg-neutral-900 rounded-xl p-8 flex items-start justify-center overflow-auto min-h-screen">
        
        {/* O ID 'printable-content' é o segredo para imprimir só isso */}
        <div id="printable-content" className="bg-white text-black shadow-2xl w-[210mm] min-h-[297mm] relative flex flex-col overflow-hidden origin-top scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.85] xl:scale-100 transition-transform duration-300">
          
          {/* Marca D'água */}
          <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none">
             <img src="/bg-home.jpg" className="w-full h-full object-cover grayscale" alt="" />
          </div>

          <div className="relative z-10 p-[40px] flex flex-col h-full min-h-[297mm] justify-between">
            
            <div>
                {/* Cabeçalho Logos */}
                <div className="flex justify-between items-center border-b-2 border-black/5 pb-8 mb-8">
                  <div className="w-40">
                    <img src="/logo-lampejo.png" alt="Lampejo" className="w-full object-contain filter invert" />
                  </div>
                  {logoCliente && (
                    <div className="flex items-center gap-6">
                      <div className="h-10 w-[1px] bg-neutral-300"></div>
                      <div className="w-32 h-16 relative flex items-center justify-end">
                        <img src={logoCliente} alt="Cliente" className={`max-h-full max-w-full object-contain ${cliente.toLowerCase().includes('threads') ? 'invert' : ''}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Título */}
                <div className="mb-10">
                  <h1 className="text-3xl font-extrabold text-black uppercase tracking-tight leading-none mb-2">{projeto || "TÍTULO DO PROJETO"}</h1>
                  <h2 className="text-lg text-neutral-600 font-medium mb-6">{subtitulo || "Descrição ou Local do Evento"}</h2>
                  <div className="flex gap-12 text-xs font-bold text-neutral-500 uppercase tracking-widest border-y border-neutral-100 py-3">
                    <p>DATA: <span className="text-black">{new Date(data).toLocaleDateString('pt-BR')}</span></p>
                    <p>VALIDADE: <span className="text-black">{validade}</span></p>
                    <p>CLIENTE: <span className="text-black">{cliente}</span></p>
                  </div>
                </div>

                {/* Texto */}
                <div className="space-y-10">
                  <div className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap text-justify">{introducao}</div>
                  {entregaveis && (
                    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100">
                      <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4">Entregáveis</h3>
                      <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-7 font-medium">{entregaveis}</div>
                    </div>
                  )}
                </div>

                {/* Tabela */}
                <div className="mt-10 mb-8">
                  <h3 className="text-xs font-bold text-black uppercase tracking-widest mb-4 border-b border-black pb-2">Investimento</h3>
                  {modoDetalhado ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-neutral-400 uppercase tracking-wider">
                          <th className="py-2 font-medium w-1/2">Item</th>
                          <th className="py-2 font-medium text-center">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {itens.map((item) => (
                          <tr key={item.id} className="text-sm text-neutral-800">
                            <td className="py-3 font-medium"><span className="text-neutral-400 mr-2">{item.quantidade}x</span>{item.descricao || "Item"}</td>
                            <td className="py-3 text-right font-bold">{(item.quantidade * item.valorUnitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-sm text-neutral-600 italic py-2">Valor global para o escopo acima.</div>
                  )}
                  <div className="flex justify-end items-center mt-6 pt-4 border-t-2 border-black/10">
                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Total da Proposta</span>
                      <span className="text-3xl font-extrabold text-black tracking-tight">{calcularTotal().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                    </div>
                  </div>
                </div>
            </div>

            {/* Rodapé */}
            <div className="text-center pt-6 border-t border-neutral-200 mt-auto">
              <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-1">Lampejo Audiovisual</p>
              <p className="text-[10px] text-neutral-500">CNPJ: 63.030.132/0001-86 • BRASÍLIA-DF</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
// ============================================================================
// 3. COMPONENTE: FINANCEIRO AVANÇADO (COM GRÁFICOS E SELETOR)
// ============================================================================
function PainelFinanceiro({ setPrintMode }: { setPrintMode: (mode: 'proposta' | 'financeiro_mes' | 'financeiro_geral' | null) => void }) {
  // Estado para Mês Selecionado (Padrão: Mês atual)
  const [mesSelecionado, setMesSelecionado] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // Mock de dados estendido para teste de meses
  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: '1', descricao: 'Pagamento NIC.br', valor: 15000, tipo: 'entrada', categoria: 'Projeto', data: '2026-02-10', status: 'pago' },
    { id: '2', descricao: 'Aluguel Equipamento', valor: 2500, tipo: 'saida', categoria: 'Operacional', data: '2026-02-12', status: 'pago' },
    { id: '3', descricao: 'Sinal Estadão', valor: 8000, tipo: 'entrada', categoria: 'Projeto', data: '2026-02-15', status: 'pendente' },
    { id: '4', descricao: 'Freelancer Editor', valor: 1200, tipo: 'saida', categoria: 'Equipe', data: '2026-01-20', status: 'pago' },
    { id: '5', descricao: 'Projeto OAB/DF', valor: 5000, tipo: 'entrada', categoria: 'Projeto', data: '2026-01-15', status: 'pago' },
  ]);

  const [novoItem, setNovoItem] = useState({ descricao: '', valor: '', tipo: 'saida' as 'entrada' | 'saida', categoria: 'Geral', data: new Date().toISOString().slice(0, 10) });

  // --- LÓGICA DE FILTROS ---
  const transacoesFiltradasMes = transacoes.filter(t => t.data.startsWith(mesSelecionado));
  
  // Cálculos do Mês
  const entradasMes = transacoesFiltradasMes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const saidasMes = transacoesFiltradasMes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const saldoMes = entradasMes - saidasMes;

  // Cálculos Gerais (Acumulado)
  const entradasGeral = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const saidasGeral = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const saldoGeral = entradasGeral - saidasGeral;

  // Salvar dados no localStorage para impressão
  useEffect(() => {
    const financeiroData = { 
      mesSelecionado, 
      transacoes, // Passa tudo para o modo geral calcular lá também se precisar
      transacoesFiltradasMes, 
      resumoMes: { entradas: entradasMes, saidas: saidasMes, saldo: saldoMes },
      resumoGeral: { entradas: entradasGeral, saidas: saidasGeral, saldo: saldoGeral }
    };
    localStorage.setItem('tempFinanceiro', JSON.stringify(financeiroData));
  }, [mesSelecionado, transacoes, entradasMes, saidasMes, saldoMes, entradasGeral, saidasGeral, saldoGeral]);

  const adicionarTransacao = () => {
    if (!novoItem.descricao || !novoItem.valor) return;
    const nova: Transacao = {
      id: Date.now().toString(),
      descricao: novoItem.descricao,
      valor: Number(novoItem.valor),
      tipo: novoItem.tipo,
      categoria: novoItem.categoria,
      data: novoItem.data,
      status: 'pendente'
    };
    setTransacoes([nova, ...transacoes]);
    setNovoItem({ ...novoItem, descricao: '', valor: '' });
  };

  const handlePrintMes = () => {
    setPrintMode('financeiro_mes');
    setTimeout(() => window.print(), 100);
  };

  const handlePrintGeral = () => {
    setPrintMode('financeiro_geral');
    setTimeout(() => window.print(), 100);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      {/* HEADER E CONTROLES AVANÇADOS */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">Fluxo de Caixa <span className="text-sm font-normal text-neutral-500 bg-neutral-900 px-2 py-1 rounded-md border border-white/10">Admin Pro</span></h1>
           <p className="text-sm text-neutral-500">Gestão Financeira & Relatórios</p>
        </div>
        <div className="flex gap-3 flex-wrap justify-end">
            <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-xl border border-white/10">
                <Calendar size={16} className="text-purple-500" />
                <input 
                    type="month" 
                    value={mesSelecionado}
                    onChange={(e) => setMesSelecionado(e.target.value)}
                    className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer"
                />
            </div>
            <button onClick={handlePrintMes} className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold border border-white/10 transition-colors">
              <FileSpreadsheet size={16} /> Relatório Mensal (PDF)
            </button>
            <button onClick={handlePrintGeral} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-lg transition-colors">
              <PieChart size={16} /> Relatório Geral (PDF)
            </button>
        </div>
      </div>

      {/* DASHBOARD VISUAL (GRÁFICOS CSS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entradas */}
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingUp size={80} /></div>
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><TrendingUp size={20} /></div>
               <span className="text-xs font-bold uppercase text-neutral-400">Receita {mesSelecionado.split('-').reverse().join('/')}</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight mb-2">{entradasMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            {/* Barra de Progresso Visual */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: '100%' }}></div>
            </div>
        </div>

        {/* Saídas */}
        <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><TrendingDown size={80} /></div>
            <div className="flex items-center gap-2 mb-4">
               <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><TrendingDown size={20} /></div>
               <span className="text-xs font-bold uppercase text-neutral-400">Despesas {mesSelecionado.split('-').reverse().join('/')}</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight mb-2">{saidasMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            {/* Barra de Progresso Visual (Proporcional à entrada para noção de margem) */}
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${entradasMes > 0 ? Math.min((saidasMes/entradasMes)*100, 100) : 0}%` }}></div>
            </div>
        </div>

        {/* Saldo Líquido */}
        <div className={`bg-neutral-900/50 p-6 rounded-2xl border relative overflow-hidden ${saldoMes >= 0 ? 'border-purple-500/30' : 'border-red-500/30'}`}>
            <div className="absolute top-0 right-0 p-4 opacity-5"><DollarSign size={80} /></div>
            <div className="flex items-center gap-2 mb-4">
               <div className={`p-2 rounded-lg ${saldoMes >= 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-red-500/10 text-red-400'}`}><DollarSign size={20} /></div>
               <span className="text-xs font-bold uppercase text-neutral-400">Resultado Líquido</span>
            </div>
            <p className="text-3xl font-bold text-white tracking-tight mb-2">{saldoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            <span className="text-xs text-neutral-500">
               {saldoMes >= 0 ? "Operação Lucrativa 🚀" : "Atenção ao Caixa ⚠️"}
            </span>
        </div>
      </div>

      {/* ADICIONAR NOVA */}
      <div className="bg-neutral-900/50 p-6 rounded-2xl border border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4 flex items-center gap-2"><Plus size={14} /> Novo Lançamento</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <input type="date" value={novoItem.data} onChange={e => setNovoItem({...novoItem, data: e.target.value})} className="bg-black border border-white/10 rounded-lg p-3 text-sm text-white/70" />
          <div className="md:col-span-2"><input value={novoItem.descricao} onChange={e => setNovoItem({...novoItem, descricao: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" placeholder="Descrição" /></div>
          <div><input type="number" value={novoItem.valor} onChange={e => setNovoItem({...novoItem, valor: e.target.value})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm" placeholder="R$ 0,00" /></div>
          <div>
            <select value={novoItem.tipo} onChange={e => setNovoItem({...novoItem, tipo: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm">
              <option value="entrada">Entrada (+)</option>
              <option value="saida">Saída (-)</option>
            </select>
          </div>
          <button onClick={adicionarTransacao} className="h-[46px] bg-green-600 hover:bg-green-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2"><Plus size={18} /> Salvar</button>
        </div>
      </div>

      {/* TABELA MENSAL */}
      <div className="bg-neutral-900/50 rounded-2xl border border-white/5 overflow-hidden">
         <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Extrato: {mesSelecionado}</h3>
         </div>
         <table className="w-full text-left text-sm text-neutral-400">
            <thead className="bg-white/5 text-neutral-300 font-bold uppercase text-[10px] tracking-wider">
              <tr><th className="p-4">Data</th><th className="p-4">Descrição</th><th className="p-4">Categoria</th><th className="p-4 text-right">Valor</th><th className="p-4 text-center">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transacoesFiltradasMes.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-xs font-mono">{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                  <td className="p-4 text-white font-medium">{t.descricao}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase">{t.categoria}</span></td>
                  <td className={`p-4 text-right font-bold ${t.tipo === 'entrada' ? 'text-green-400' : 'text-red-400'}`}>{t.tipo === 'entrada' ? '+' : '-'} {t.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="p-4 text-center"><button onClick={() => setTransacoes(transacoes.filter(x => x.id !== t.id))} className="text-neutral-600 hover:text-red-500"><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
         </table>
         {transacoesFiltradasMes.length === 0 && <div className="p-12 text-center text-neutral-600 flex flex-col items-center gap-2"><BarChart3 size={24} opacity={0.5} /><span className="italic">Nenhum lançamento neste mês.</span></div>}
      </div>
    </div>
  );
}

// ============================================================================
// 4. ÁREA DE IMPRESSÃO (O SEGREDO DA PÁGINA NÃO SAIR EM BRANCO)
// ============================================================================
function PrintableArea({ mode }: { mode: 'proposta' | 'financeiro_mes' | 'financeiro_geral' | null }) {
  const [dataProposta, setDataProposta] = useState<any>(null);
  const [dataFinanceiro, setDataFinanceiro] = useState<any>(null);

  useEffect(() => {
    if (mode === 'proposta') {
        const d = localStorage.getItem('tempProposta');
        if (d) setDataProposta(JSON.parse(d));
    }
    if (mode === 'financeiro_mes' || mode === 'financeiro_geral') {
        const d = localStorage.getItem('tempFinanceiro');
        if (d) setDataFinanceiro(JSON.parse(d));
    }
  }, [mode]);

  if (!mode) return null;

  return (
    // CAMADA DE IMPRESSÃO ISOLADA
    // Usamos 'fixed' com z-index altíssimo e fundo branco para sobrepor tudo
    <div id="print-layer" className="fixed top-0 left-0 w-full h-full bg-white z-[9999] hidden print:block text-black">
      
      {/* --- MODO 1: PROPOSTA COMERCIAL (A4) --- */}
      {mode === 'proposta' && dataProposta && (
         <div className="w-[210mm] min-h-[297mm] mx-auto p-[40px] flex flex-col justify-between relative bg-white">
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"><img src="/bg-home.jpg" className="w-full h-full object-cover grayscale" alt="" /></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center border-b-2 border-black/5 pb-8 mb-8">
                        <div className="w-40"><img src="/logo-lampejo.png" alt="Lampejo" className="w-full object-contain filter invert" /></div>
                        {dataProposta.logoCliente && <div className="w-32 h-16 relative"><img src={dataProposta.logoCliente} alt="Cliente" className={`max-h-full max-w-full object-contain object-right ${dataProposta.cliente.toLowerCase().includes('threads') ? 'invert' : ''}`} /></div>}
                    </div>
                    <div className="mb-10">
                        <h1 className="text-4xl font-extrabold uppercase mb-2">{dataProposta.projeto || "PROJETO"}</h1>
                        <h2 className="text-xl text-neutral-600 font-medium mb-6">{dataProposta.subtitulo || "Detalhes"}</h2>
                        <div className="flex gap-12 text-xs font-bold text-neutral-500 uppercase tracking-widest border-y border-neutral-100 py-3">
                            <p>DATA: <span className="text-black">{new Date(dataProposta.data).toLocaleDateString('pt-BR')}</span></p>
                            <p>VALIDADE: <span className="text-black">{dataProposta.validade}</span></p>
                        </div>
                    </div>
                    <div className="space-y-10 text-sm leading-relaxed text-justify">
                        <div className="whitespace-pre-wrap">{dataProposta.introducao}</div>
                        {dataProposta.entregaveis && <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-100 whitespace-pre-wrap">{dataProposta.entregaveis}</div>}
                    </div>
                    <div className="mt-12">
                        <h3 className="text-xs font-bold uppercase border-b border-black pb-2 mb-4">Investimento</h3>
                        <table className="w-full text-left text-sm">
                            <tbody>
                                {dataProposta.itens.map((item: any) => (
                                    <tr key={item.id} className="border-b border-neutral-100"><td className="py-3">{item.quantidade}x {item.descricao}</td><td className="py-3 text-right font-bold">{(item.quantidade * item.valorUnitario).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td></tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-right mt-6 text-3xl font-extrabold">{(dataProposta.itens.reduce((acc: number, i: any) => acc + (i.quantidade * i.valorUnitario), 0)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</div>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-black/10 mt-auto"><p className="text-[10px] font-bold uppercase tracking-widest">Lampejo Audiovisual • CNPJ 63.030.132/0001-86</p></div>
            </div>
         </div>
      )}

      {/* --- MODO 2: RELATÓRIO MENSAL --- */}
      {mode === 'financeiro_mes' && dataFinanceiro && (
         <div className="w-[210mm] min-h-[297mm] mx-auto p-[40px] bg-white text-black">
             <div className="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
                <div><h1 className="text-4xl font-extrabold uppercase tracking-tight">Relatório Mensal</h1><p className="text-neutral-500 uppercase text-xs tracking-widest mt-1">Período: {dataFinanceiro.mesSelecionado}</p></div>
                <div className="w-32"><img src="/logo-lampejo.png" className="w-full filter invert" /></div>
             </div>
             
             <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mb-8">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">Resumo Executivo</h2>
                <div className="grid grid-cols-3 gap-8">
                    <div><p className="text-[10px] uppercase text-neutral-500 font-bold">Faturamento</p><p className="text-2xl font-bold text-green-700">{dataFinanceiro.resumoMes.entradas.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div>
                    <div><p className="text-[10px] uppercase text-neutral-500 font-bold">Despesas</p><p className="text-2xl font-bold text-red-700">{dataFinanceiro.resumoMes.saidas.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div>
                    <div><p className="text-[10px] uppercase text-neutral-500 font-bold">Resultado Líquido</p><p className={`text-2xl font-bold ${dataFinanceiro.resumoMes.saldo >= 0 ? 'text-black' : 'text-red-600'}`}>{dataFinanceiro.resumoMes.saldo.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p></div>
                </div>
             </div>

             <h3 className="text-xs font-bold uppercase border-b border-black mb-4 pb-2">Detalhamento de Transações</h3>
             <table className="w-full text-left text-xs">
                <thead><tr className="border-b-2 border-black bg-neutral-100"><th className="py-2 pl-2">Data</th><th className="py-2">Descrição</th><th className="py-2">Categ.</th><th className="py-2 pr-2 text-right">Valor</th></tr></thead>
                <tbody>
                    {dataFinanceiro.transacoesFiltradasMes.map((t: any) => (
                        <tr key={t.id} className="border-b border-neutral-100">
                            <td className="py-3 pl-2 font-mono text-neutral-500">{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                            <td className="py-3 font-bold">{t.descricao}</td>
                            <td className="py-3 uppercase text-[10px]">{t.categoria}</td>
                            <td className={`py-3 pr-2 text-right font-bold ${t.tipo === 'entrada' ? 'text-green-700' : 'text-red-700'}`}>{t.tipo === 'entrada' ? '+' : '-'} {t.valor.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
         </div>
      )}

      {/* --- MODO 3: RELATÓRIO GERAL (ANUAL/TOTAL) --- */}
      {mode === 'financeiro_geral' && dataFinanceiro && (
         <div className="w-[210mm] min-h-[297mm] mx-auto p-[40px] bg-white text-black">
             <div className="mb-8 border-b-2 border-black pb-4 flex justify-between items-end">
                <div><h1 className="text-4xl font-extrabold uppercase tracking-tight">Relatório Geral</h1><p className="text-neutral-500 uppercase text-xs tracking-widest mt-1">Visão Acumulada da Operação</p></div>
                <div className="w-32"><img src="/logo-lampejo.png" className="w-full filter invert" /></div>
             </div>
             
             <div className="grid grid-cols-2 gap-6 mb-8">
                 <div className="p-8 bg-neutral-100 rounded-xl border border-neutral-200">
                    <p className="text-sm font-bold uppercase text-neutral-500 mb-2">Saldo Acumulado em Caixa</p>
                    <p className={`text-5xl font-extrabold ${dataFinanceiro.resumoGeral.saldo >= 0 ? 'text-purple-900' : 'text-red-700'}`}>{dataFinanceiro.resumoGeral.saldo.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</p>
                 </div>
                 <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-xl flex justify-between items-center"><span className="text-xs font-bold uppercase text-green-800">Total Recebido</span><span className="text-xl font-bold text-green-700">{dataFinanceiro.resumoGeral.entradas.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</span></div>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-xl flex justify-between items-center"><span className="text-xs font-bold uppercase text-red-800">Total Pago</span><span className="text-xl font-bold text-red-700">{dataFinanceiro.resumoGeral.saidas.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</span></div>
                 </div>
             </div>

             <h3 className="text-xs font-bold uppercase border-b border-black mb-4 pb-2">Histórico Completo</h3>
             <table className="w-full text-left text-xs">
                <thead><tr className="border-b-2 border-black bg-neutral-100"><th className="py-2 pl-2">Data</th><th className="py-2">Descrição</th><th className="py-2">Categ.</th><th className="py-2 pr-2 text-right">Valor</th></tr></thead>
                <tbody>
                    {dataFinanceiro.transacoes.slice(0, 30).map((t: any) => (
                        <tr key={t.id} className="border-b border-neutral-100">
                            <td className="py-3 pl-2 font-mono text-neutral-500">{new Date(t.data).toLocaleDateString('pt-BR')}</td>
                            <td className="py-3 font-bold">{t.descricao}</td>
                            <td className="py-3 uppercase text-[10px]">{t.categoria}</td>
                            <td className={`py-3 pr-2 text-right font-bold ${t.tipo === 'entrada' ? 'text-green-700' : 'text-red-700'}`}>{t.tipo === 'entrada' ? '+' : '-'} {t.valor.toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
         </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. PÁGINA PRINCIPAL
// ============================================================================
export default function Admin() {
  const [activeTab, setActiveTab] = useState<'propostas' | 'financeiro'>('propostas');
  const [printMode, setPrintMode] = useState<'proposta' | 'financeiro_mes' | 'financeiro_geral' | null>(null);

  useEffect(() => {
    const handleAfterPrint = () => setPrintMode(null);
    window.addEventListener("afterprint", handleAfterPrint);
    return () => window.removeEventListener("afterprint", handleAfterPrint);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30 font-sans flex flex-col">
      <Navbar />
      
      {/* SEGREDO DO CSS: Esconde tudo que não é o print-layer na hora da impressão */}
      <main className="flex-grow pt-32 px-6 max-w-[1600px] mx-auto w-full pb-12 flex gap-8 print:hidden">
        <aside className="w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-32 space-y-2">
            <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest px-4 mb-4">Gestão</p>
            <button onClick={() => setActiveTab('propostas')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'propostas' ? 'bg-purple-600 text-white shadow-lg font-bold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}><FileSpreadsheet size={18} /> Propostas</button>
            <button onClick={() => setActiveTab('financeiro')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'financeiro' ? 'bg-purple-600 text-white shadow-lg font-bold' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}><LayoutDashboard size={18} /> Financeiro</button>
          </div>
        </aside>

        <div className="lg:hidden flex gap-2 mb-8 overflow-x-auto pb-2 absolute top-24 left-6 right-6 z-10 bg-neutral-950 print:hidden">
           <button onClick={() => setActiveTab('propostas')} className={`px-4 py-2 rounded-full text-xs font-bold border ${activeTab === 'propostas' ? 'bg-purple-600 border-purple-600' : 'border-white/10'}`}>Propostas</button>
           <button onClick={() => setActiveTab('financeiro')} className={`px-4 py-2 rounded-full text-xs font-bold border ${activeTab === 'financeiro' ? 'bg-purple-600 border-purple-600' : 'border-white/10'}`}>Financeiro</button>
        </div>

        <div className="flex-grow min-w-0">
          {activeTab === 'propostas' ? <GeradorPropostas setPrintMode={setPrintMode} /> : <PainelFinanceiro setPrintMode={setPrintMode} />}
        </div>
      </main>

      <PrintableArea mode={printMode} />

      {/* CSS GLOBAL CRÍTICO - NÃO REMOVA OU ALTERE */}
      <style jsx global>{`
        @media print {
          /* Reseta o fundo para branco */
          html, body {
            background-color: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Esconde a UI do App */
          nav, aside, main, .print\\:hidden {
            display: none !important;
          }
        
          /* Mostra a camada de impressão */
          #print-layer {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: auto !important;
            background-color: white !important;
            z-index: 9999 !important;
          }
          
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </div>
  );
}