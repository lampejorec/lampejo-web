"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, Plus, Printer, Lock, DollarSign, Layout, PieChart, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownRight, Clock, Tag, List, Type, ArrowRight, X, Edit, CheckCircle2,
  Calendar, User, FileText, Package, Home, AlertCircle, TrendingUp
} from "lucide-react";
import Image from "next/image";

// --- CONFIGURAÇÃO ---
const USERS = {
  "eduardo@lampejo.rec.br": { name: "Eduardo", role: "admin", pass: "lampejo2025", avatar: "E" },
  "rafael@lampejo.rec.br":  { name: "Rafael", role: "admin", pass: "lampejo2025", avatar: "R" },
  "time@lampejo.rec.br":    { name: "Time", role: "editor", pass: "lampejo2025", avatar: "T" },
};

const CLIENT_LOGOS: Record<string, string> = {
  "nic.br": "/nicbr.png", "cgi.br": "/cgibr.png", "safernet": "/safernet.png",
  "caadf": "/caadf.png", "oab": "/oabdf.png", "oab/df": "/oabdf.png",
  "estadão": "/estadao.png", "estadao": "/estadao.png", "sem rótulo": "/semrotulo.png",
  "sem rotulo": "/semrotulo.png", "sinicon": "/sinicon.png", "hy": "/hy.png"
};

const IMPOSTO_REAL = 0.06;
const IMPOSTO_PROVISAO = 0.10;

// --- TIPOS ---
interface Transaction {
  id: number; description: string; deliveryDetails?: string; category: string; amount: number;
  type: "income" | "expense"; date: string; hasInvoice: boolean;
}

type BlockType = "header" | "text" | "deliverables" | "items" | "total";
interface ProposalBlock { id: string; type: BlockType; content: any; }

interface Task {
  id: number; title: string; client: string; status: "todo" | "doing" | "review" | "done";
  priority: "low" | "medium" | "high"; dueDate: string; assignee: string; tag: string;
}

export default function AdminPage() {
  // --- AUTH & TABS ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "finance" | "proposal">("dashboard");

  // --- FINANCEIRO ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showReport, setShowReport] = useState(false);
  const [newTransDesc, setNewTransDesc] = useState("");
  const [newTransDelivery, setNewTransDelivery] = useState("");
  const [newTransAmount, setNewTransAmount] = useState("");
  const [newTransType, setNewTransType] = useState<"income" | "expense">("income");
  const [newTransDate, setNewTransDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTransInvoice, setNewTransInvoice] = useState(false);

  // --- PROJETOS (KANBAN) ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectFilterClient, setProjectFilterClient] = useState("ALL");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskClient, setNewTaskClient] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- PROPOSTA ---
  const [clientName, setClientName] = useState("");
  const [blocks, setBlocks] = useState<ProposalBlock[]>([
    { id: "1", type: "header", content: { title: "Projeto Institucional", subtitle: "Narrativa Visual" } },
    { id: "2", type: "text", content: "A Lampejo propõe uma abordagem cinematográfica..." },
    { id: "3", type: "deliverables", content: "- 1 Vídeo Manifesto (30s)\n- 5 Pílulas para Reels\n- Cobertura Fotográfica" },
    { id: "4", type: "items", content: [{ name: "Diária de Captação", price: 2500 }] },
    { id: "5", type: "total", content: { obs: "Validade de 10 dias" } }
  ]);

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    const savedFin = localStorage.getItem("lampejo_finances_v3");
    if (savedFin) setTransactions(JSON.parse(savedFin));
    const savedTasks = localStorage.getItem("lampejo_tasks_v2");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else {
      setTasks([
        { id: 1, title: "Vídeo Institucional", client: "NIC.br", status: "doing", priority: "high", dueDate: "2025-12-20", assignee: "Edu", tag: "Edição" },
      ]);
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem("lampejo_finances_v3", JSON.stringify(transactions));
    if (tasks.length > 0) localStorage.setItem("lampejo_tasks_v2", JSON.stringify(tasks));
  }, [transactions, tasks]);

  // --- LÓGICA ---
  const handleLogin = () => {
    const user = USERS[email as keyof typeof USERS];
    if (user && user.pass === password) {
      setCurrentUser(user);
      // Se for time, vai pro dashboard (ou projects)
      if (user.role !== "admin" && activeTab === "finance") setActiveTab("dashboard");
    } else alert("Dados incorretos.");
  };

  // FINANCEIRO
  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
    const today = new Date();
    let day = today.getDate();
    const safeDay = day > 28 ? 28 : day; 
    const newFormDate = new Date(newDate.getFullYear(), newDate.getMonth(), safeDay);
    const offsetDate = new Date(newFormDate.getTime() - (newFormDate.getTimezoneOffset() * 60000));
    setNewTransDate(offsetDate.toISOString().split('T')[0]);
  };

  const getMonthData = (date: Date) => transactions.filter(t => {
    const [y, m, d] = t.date.split('-').map(Number);
    const tMonth = `${y}-${String(m).padStart(2, '0')}`;
    const sMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return tMonth === sMonth;
  });
  
  const currentMonthTrans = getMonthData(selectedDate);
  const prevDate = new Date(selectedDate); prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonthTrans = getMonthData(prevDate);

  const calcMetrics = (trans: Transaction[]) => {
    const gross = trans.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const exp = trans.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    const invoiceInc = trans.filter(t => t.type === "income" && t.hasInvoice).reduce((a, b) => a + b.amount, 0);
    return { gross, exp, realTax: invoiceInc * IMPOSTO_REAL, provTax: invoiceInc * IMPOSTO_PROVISAO, safeProfit: gross - exp - (invoiceInc * IMPOSTO_PROVISAO) };
  };
  const currM = calcMetrics(currentMonthTrans);
  const prevM = calcMetrics(prevMonthTrans);
  const growth = prevM.gross === 0 ? 100 : ((currM.gross - prevM.gross) / prevM.gross) * 100;

  const addTrans = () => {
    if(!newTransDesc || !newTransAmount) return;
    setTransactions([...transactions, {
      id: Date.now(), description: newTransDesc, deliveryDetails: newTransDelivery,
      amount: Number(newTransAmount), type: newTransType, date: newTransDate, hasInvoice: newTransInvoice, category: "Geral"
    }]);
    setNewTransDesc(""); setNewTransDelivery(""); setNewTransAmount("");
  };

  // KANBAN
  const uniqueClients = Array.from(new Set(tasks.map(t => t.client)));
  const filteredTasks = projectFilterClient === "ALL" ? tasks : tasks.filter(t => t.client === projectFilterClient);

  const addTask = () => {
    setTasks([...tasks, {
      id: Date.now(), title: newTaskTitle || "Nova Tarefa", client: newTaskClient || "Geral",
      status: "todo", priority: "medium", dueDate: new Date().toISOString().split('T')[0], assignee: "Time", tag: "Geral"
    }]);
    setNewTaskTitle(""); setNewTaskClient("");
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
  };

  const moveTask = (id: number, status: Task["status"]) => {
    const task = tasks.find(t => t.id === id);
    if(task) updateTask({...task, status});
  };

  // PROPOSTA
  const getLogo = (name: string) => CLIENT_LOGOS[name.toLowerCase().trim()] || null;
  const updateBlock = (id: string, content: any) => setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  const addBlock = (type: BlockType) => {
    let content: any = "";
    if (type === "items") content = [{name:"", price:0}];
    if (type === "header") content = { title: "Título", subtitle: "Subtítulo" };
    if (type === "total") content = { obs: "" };
    if (type === "deliverables") content = "- Item 1\n- Item 2"; 
    setBlocks([...blocks, { id: Date.now().toString(), type, content }]);
  };

  // --- RENDER ---
  if (!currentUser) return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      <Image src="/bg-home.jpg" alt="bg" fill className="object-cover opacity-30 blur-sm" />
      <div className="bg-neutral-900/80 backdrop-blur-xl p-10 rounded-2xl border border-white/10 w-full max-w-sm relative z-10 text-center text-white shadow-2xl">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30"><Lock className="text-purple-400" /></div>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">LAMPEJO OS</h1>
        <input type="email" placeholder="E-mail" className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white mb-4" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold transition-all">ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-black border-r border-white/5 flex flex-col z-20 shrink-0 print:hidden">
        <div className="p-6">
          <h1 className="font-bold text-xl tracking-tighter mb-8">LAMPEJO <span className="text-purple-500 text-xs">OS</span></h1>
          <div className="flex items-center gap-3 mb-8 bg-neutral-900 p-3 rounded-lg border border-white/5">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm">{currentUser.avatar}</div>
            <div><p className="text-sm font-bold">{currentUser.name}</p><p className="text-[10px] text-neutral-500 uppercase font-bold">{currentUser.role}</p></div>
          </div>
          <nav className="space-y-2">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-white text-black" : "text-neutral-400 hover:bg-white/5"}`}><Home size={18}/> Visão Geral</button>
            <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "projects" ? "bg-white text-black" : "text-neutral-400 hover:bg-white/5"}`}><Layout size={18}/> Projetos</button>
            <button onClick={() => setActiveTab("proposal")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "proposal" ? "bg-white text-black" : "text-neutral-400 hover:bg-white/5"}`}><FileText size={18}/> Propostas</button>
            {currentUser.role === "admin" && (
              <button onClick={() => setActiveTab("finance")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === "finance" ? "bg-white text-black" : "text-neutral-400 hover:bg-white/5"}`}><PieChart size={18}/> Financeiro</button>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        
        {/* --- DASHBOARD (COMMAND CENTER) --- */}
        {activeTab === "dashboard" && (
          <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tighter mb-2">Bom dia, {currentUser.name}.</h2>
            <p className="text-neutral-400 mb-12">Aqui está o resumo da operação Lampejo hoje.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Card 1: Tarefas Urgentes */}
              <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-red-500/10 rounded-lg text-red-500"><AlertCircle size={24}/></div>
                  <span className="text-4xl font-bold">{tasks.filter(t => t.priority === 'high' && t.status !== 'done').length}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Alta Prioridade</h3>
                <p className="text-sm text-neutral-500">Tarefas urgentes pendentes</p>
              </div>

              {/* Card 2: Em Produção */}
              <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Layout size={24}/></div>
                  <span className="text-4xl font-bold">{tasks.filter(t => t.status === 'doing').length}</span>
                </div>
                <h3 className="font-bold text-lg mb-1">Em Produção</h3>
                <p className="text-sm text-neutral-500">Projetos ativos no momento</p>
              </div>

              {/* Card 3: Financeiro Rápido (Só Admin) */}
              {currentUser.role === "admin" ? (
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><TrendingUp size={24}/></div>
                    <span className="text-xl font-bold text-green-500">R$ {currM.gross.toLocaleString('pt-BR', {compactDisplay: "short", notation: "compact"})}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">Faturamento</h3>
                  <p className="text-sm text-neutral-500">Acumulado deste mês</p>
                </div>
              ) : (
                <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl flex items-center justify-center text-neutral-600">
                  <span className="text-sm">Acesso Financeiro Restrito</span>
                </div>
              )}
            </div>

            {/* Lista Rápida de Tarefas */}
            <h3 className="text-sm font-bold uppercase text-neutral-500 mb-4 tracking-widest">Minhas Atividades Recentes</h3>
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                    <span className="font-bold text-sm">{task.title}</span>
                    <span className="text-xs text-neutral-500 bg-black px-2 py-1 rounded">{task.client}</span>
                  </div>
                  <span className="text-xs text-neutral-500 uppercase">{task.status}</span>
                </div>
              ))}
              {tasks.length === 0 && <div className="p-6 text-center text-neutral-500">Nenhuma tarefa encontrada.</div>}
            </div>
          </div>
        )}

        {/* --- PROJETOS (KANBAN) --- */}
        {activeTab === "projects" && (
          <div className="flex h-full">
            <div className="w-64 bg-neutral-900 border-r border-white/5 p-6 hidden lg:block">
              <h3 className="text-xs font-bold uppercase text-neutral-500 mb-4 tracking-widest">Clientes</h3>
              <button onClick={() => setProjectFilterClient("ALL")} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 ${projectFilterClient === "ALL" ? "bg-purple-600 text-white" : "text-neutral-400 hover:bg-white/5"}`}>Todos</button>
              {uniqueClients.map(c => (
                <button key={c} onClick={() => setProjectFilterClient(c)} className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium mb-1 ${projectFilterClient === c ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5"}`}>{c}</button>
              ))}
            </div>

            <div className="flex-1 p-8 overflow-x-auto">
              <header className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">{projectFilterClient === "ALL" ? "Visão Geral" : projectFilterClient}</h2>
                <div className="flex gap-2">
                  <input value={newTaskClient} onChange={e => setNewTaskClient(e.target.value)} placeholder="Novo Cliente" className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                  <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Nova Tarefa" className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none w-64" />
                  <button onClick={addTask} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Add</button>
                </div>
              </header>

              <div className="flex gap-6 h-[calc(100vh-200px)] min-w-[1000px]">
                {["todo", "doing", "review", "done"].map(status => (
                  <KanbanColumn 
                    key={status} 
                    status={status} 
                    tasks={filteredTasks} 
                    onMove={moveTask} 
                    onEdit={setEditingTask}
                  />
                ))}
              </div>
            </div>

            {/* MODAL DE EDIÇÃO DE TAREFA */}
            {editingTask && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Edit size={18} className="text-purple-500"/> Editar Demanda</h3>
                    <button onClick={() => setEditingTask(null)} className="hover:bg-white/10 p-2 rounded-full"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs uppercase text-neutral-500 font-bold">Título da Tarefa</label>
                      <input value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs uppercase text-neutral-500 font-bold">Cliente</label>
                          <input value={editingTask.client} onChange={e => setEditingTask({...editingTask, client: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" />
                       </div>
                       <div>
                          <label className="text-xs uppercase text-neutral-500 font-bold">Tag (ex: Edição)</label>
                          <input value={editingTask.tag} onChange={e => setEditingTask({...editingTask, tag: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-xs uppercase text-neutral-500 font-bold">Prazo</label>
                          <input type="date" value={editingTask.dueDate} onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" />
                       </div>
                       <div>
                          <label className="text-xs uppercase text-neutral-500 font-bold">Responsável</label>
                          <select value={editingTask.assignee} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1">
                            <option value="Edu">Edu</option>
                            <option value="Rafa">Rafa</option>
                            <option value="Time">Time</option>
                          </select>
                       </div>
                    </div>
                    <div>
                       <label className="text-xs uppercase text-neutral-500 font-bold">Prioridade</label>
                       <div className="flex gap-2 mt-1">
                          {["low", "medium", "high"].map(p => (
                            <button key={p} onClick={() => setEditingTask({...editingTask, priority: p as any})} className={`flex-1 py-2 rounded text-xs font-bold uppercase border ${editingTask.priority === p ? "bg-white text-black border-white" : "border-white/20 hover:bg-white/5"}`}>
                              {p === "low" ? "Baixa" : p === "medium" ? "Média" : "Alta"}
                            </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="pt-6 flex gap-3">
                      <button onClick={() => { setTasks(tasks.filter(t => t.id !== editingTask.id)); setEditingTask(null); }} className="px-4 py-3 rounded-lg font-bold border border-red-500/20 text-red-500 hover:bg-red-900/20 transition-colors">Excluir</button>
                      <button onClick={() => updateTask(editingTask)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-colors">Salvar Alterações</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- FINANCEIRO --- */}
        {activeTab === "finance" && currentUser.role === "admin" && (
           <div className={`p-8 max-w-7xl mx-auto ${showReport ? "hidden" : "block"}`}>
             <header className="flex justify-between items-end mb-12">
               <div>
                  <p className="text-xs uppercase text-purple-400 font-bold mb-2">Fluxo de Caixa</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft/></button>
                    <h2 className="text-3xl font-bold w-64 text-center capitalize">{selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight/></button>
                  </div>
               </div>
               <button onClick={() => setShowReport(true)} className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm">MODO APRESENTAÇÃO</button>
             </header>

             <div className="grid grid-cols-4 gap-4 mb-8">
               <Kpi label="Faturamento Bruto" val={currM.gross} growth={growth} />
               <Kpi label="Imposto (10% Prov.)" val={currM.provTax} sub={currM.realTax} color="text-neutral-400" />
               <Kpi label="Despesas" val={currM.exp} color="text-red-500" />
               <Kpi label="Lucro Caixa" val={currM.safeProfit} color="text-green-400" highlight />
             </div>

             {/* FORMULÁRIO FINANCEIRO COM CAMPO DE ENTREGA */}
             <div className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2">
                    <input type="date" value={newTransDate} onChange={e => setNewTransDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" />
                  </div>
                  <div className="md:col-span-3">
                    <input value={newTransDesc} onChange={e => setNewTransDesc(e.target.value)} placeholder="Cliente / Descrição" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" />
                  </div>
                  <div className="md:col-span-3">
                    <input value={newTransDelivery} onChange={e => setNewTransDelivery(e.target.value)} placeholder="O que foi entregue?" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <select value={newTransType} onChange={e => setNewTransType(e.target.value as any)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-neutral-400">
                      <option value="income">Entrada (+)</option>
                      <option value="expense">Saída (-)</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input type="number" value={newTransAmount} onChange={e => setNewTransAmount(e.target.value)} placeholder="R$ Valor" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                   {newTransType === "income" && (
                     <label className="flex items-center gap-2 cursor-pointer ml-1">
                       <input type="checkbox" checked={newTransInvoice} onChange={e => setNewTransInvoice(e.target.checked)} className="hidden"/>
                       <div className={`w-5 h-5 border rounded flex items-center justify-center ${newTransInvoice ? "bg-purple-600 border-purple-600" : "border-white/20"}`}>
                         {newTransInvoice && <CheckCircle2 size={12} className="text-white"/>}
                       </div>
                       <span className="text-xs text-neutral-400">Emitiu NF?</span>
                     </label>
                   )}
                   <button onClick={addTrans} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg font-bold text-sm ml-auto flex items-center gap-2">
                     <Plus size={16}/> Lançar
                   </button>
                </div>
             </div>

             <div className="space-y-1">
               {currentMonthTrans.map(t => (
                 <div key={t.id} className="flex justify-between p-4 bg-neutral-900/30 border border-white/5 rounded-xl group hover:border-white/20 transition-all">
                    <div className="flex gap-4 items-center">
                      <div className={`w-2 h-2 rounded-full ${t.type === "income" ? "bg-green-500" : "bg-red-500"}`}/>
                      <span className="text-neutral-500 text-sm font-mono w-12">{new Date(t.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'})}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{t.description}</span>
                        {t.deliveryDetails && <span className="text-xs text-neutral-500">{t.deliveryDetails}</span>}
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className={`font-bold ${t.type === "income" ? "text-green-500" : "text-white"}`}>R$ {t.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      <button onClick={() => setTransactions(transactions.filter(x => x.id !== t.id))} className="text-neutral-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* --- RELATÓRIO FINANCEIRO (PDF) --- */}
        {showReport && (
           <div className="absolute inset-0 bg-white z-50 overflow-auto flex justify-center p-12 text-black">
             <div id="printable-area" className="w-[210mm] min-h-[297mm] p-[15mm] relative bg-white">
                <div className="flex justify-between items-end border-b-4 border-black pb-6 mb-12">
                  <div><h1 className="text-6xl font-bold tracking-tighter mb-2">RELATÓRIO<br/>MENSAL</h1><p className="text-sm font-bold uppercase tracking-widest text-neutral-500">{selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p></div>
                  <div className="text-right"><div className="text-4xl font-bold mb-1">{growth > 0 ? "+" : ""}{growth.toFixed(0)}%</div><p className="text-[10px] uppercase font-bold text-neutral-500">Crescimento vs. Mês Anterior</p></div>
                </div>
                <div className="grid grid-cols-2 gap-12 mb-16">
                   <div className="text-lg leading-relaxed text-justify"><h3 className="font-bold uppercase mb-2">Análise</h3>{currM.gross > prevM.gross ? "Resultado positivo com aumento de faturamento." : "Retração de faturamento. Atenção necessária."} {currM.safeProfit > 0 ? " Operação lucrativa com caixa positivo." : " Prejuízo no período. Rever custos."}</div>
                   <div className="bg-neutral-100 p-6 rounded-xl text-sm space-y-2"><h3 className="font-bold uppercase mb-4">Raio-X</h3><div className="flex justify-between border-b pb-1"><span>Imposto Real</span><b>R$ {currM.realTax.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div><div className="flex justify-between border-b pb-1"><span>Provisão (10%)</span><b>R$ {currM.provTax.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div><div className="flex justify-between pt-2 text-green-600 font-bold"><span>Líquido</span><b>R$ {currM.safeProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div></div>
                </div>
                <div className="grid grid-cols-3 gap-6"><div className="border border-black p-4"><span className="text-xs uppercase text-neutral-500">Faturamento</span><p className="text-2xl font-bold">R$ {currM.gross.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div><div className="border border-black p-4 bg-black text-white"><span className="text-xs uppercase text-neutral-400">Caixa</span><p className="text-2xl font-bold">R$ {currM.safeProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div><div className="border border-black p-4"><span className="text-xs uppercase text-neutral-500">Despesas</span><p className="text-2xl font-bold text-red-600">R$ {currM.exp.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div></div>
                <div className="fixed bottom-10 right-10 flex gap-4 no-print"><button onClick={() => setShowReport(false)} className="bg-neutral-200 text-black px-6 py-3 rounded-full font-bold">Voltar</button><button onClick={() => window.print()} className="bg-black text-white px-6 py-3 rounded-full font-bold">Imprimir PDF</button></div>
             </div>
           </div>
        )}

        {/* --- PROPOSTA --- */}
        {activeTab === "proposal" && (
          <div className="flex h-screen overflow-hidden">
            <div className="w-96 bg-neutral-900 border-r border-white/5 flex flex-col h-full print:hidden z-20">
              <div className="p-6 border-b border-white/5">
                <h3 className="font-bold text-lg mb-4">Construtor</h3>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome do Cliente (ex: NIC.br)" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white mb-4" />
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => addBlock('text')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5 hover:bg-white/10"><Type size={16} /> Texto</button>
                   <button onClick={() => addBlock('deliverables')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5 hover:bg-white/10"><Package size={16} /> Entregas</button>
                   <button onClick={() => addBlock('items')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5 hover:bg-white/10"><List size={16} /> Preços</button>
                   <button onClick={() => addBlock('total')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5 hover:bg-white/10"><DollarSign size={16} /> Total</button>
                   <button onClick={() => window.print()} className="bg-purple-600 text-white p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 col-span-2 mt-2"><Printer size={16} /> GERAR PDF</button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {blocks.map((b) => (
                   <div key={b.id} className="bg-black border border-white/10 p-4 rounded-xl relative group">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"><button onClick={() => setBlocks(blocks.filter(x => x.id !== b.id))} className="text-red-500"><Trash2 size={14}/></button></div>
                      <span className="text-[10px] uppercase text-neutral-500 font-bold mb-2 block">{b.type}</span>
                      {b.type === 'header' && (<><input value={b.content.title} onChange={e => updateBlock(b.id, {...b.content, title: e.target.value})} className="bg-transparent w-full border-b border-white/20 text-sm mb-2"/><input value={b.content.subtitle} onChange={e => updateBlock(b.id, {...b.content, subtitle: e.target.value})} className="bg-transparent w-full border-b border-white/20 text-xs"/></>)}
                      {b.type === 'text' && <textarea value={b.content} onChange={e => updateBlock(b.id, e.target.value)} className="bg-transparent w-full border border-white/10 rounded p-2 text-sm text-neutral-300"/>}
                      {b.type === 'deliverables' && (<><label className="text-xs text-neutral-500">Lista de Entregas:</label><textarea value={b.content} rows={5} onChange={e => updateBlock(b.id, e.target.value)} className="bg-transparent w-full border border-white/10 rounded p-2 text-sm text-neutral-300 mt-1 font-mono text-xs"/></>)}
                      {b.type === 'items' && <div>{b.content.map((it:any, i:number) => <div key={i} className="flex gap-2 mb-1"><input value={it.name} onChange={e=>{const n=[...b.content];n[i].name=e.target.value;updateBlock(b.id,n)}} className="flex-1 bg-transparent border-b border-white/20 text-xs"/><input value={it.price} type="number" onChange={e=>{const n=[...b.content];n[i].price=e.target.value;updateBlock(b.id,n)}} className="w-16 bg-transparent border-b border-white/20 text-xs text-right"/></div>)}<button onClick={()=>updateBlock(b.id,[...b.content,{name:"",price:0}])} className="text-xs text-purple-400 font-bold mt-2">+ Item</button></div>}
                   </div>
                 ))}
              </div>
            </div>

            <div className="flex-1 bg-neutral-800 flex justify-center overflow-y-auto p-12">
               <div id="printable-area" className="w-[210mm] min-h-[297mm] relative bg-white text-black shadow-2xl overflow-hidden print:m-0 print:shadow-none">
                  {/* BACKGROUND DE ALTA QUALIDADE */}
                  <div className="absolute inset-0 z-0">
                    <Image src="/bg-home.jpg" alt="bg" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
                  </div>
                  <div className="relative z-10 p-[15mm] h-full flex flex-col">
                    <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-12">
                       <div><h1 className="text-4xl font-bold tracking-tighter uppercase mb-1">Lampejo</h1><p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500">Audiovisual</p></div>
                       {getLogo(clientName) ? <div className="relative w-32 h-16"><img src={getLogo(clientName)!} className="w-full h-full object-contain" alt="logo"/></div> : <div className="text-right"><h2 className="text-2xl font-bold uppercase text-neutral-400">{clientName || "CLIENTE"}</h2></div>}
                    </div>
                    <div className="flex-1 space-y-10">
                      {blocks.map(b => (
                        <div key={b.id}>
                           {b.type === 'header' && <div className="mb-8"><h2 className="text-5xl font-bold leading-tight mb-2">{b.content.title}</h2><p className="text-xl text-neutral-500 font-serif italic">{b.content.subtitle}</p></div>}
                           {b.type === 'text' && <div className="text-lg leading-relaxed text-justify whitespace-pre-wrap font-serif text-neutral-800">{b.content}</div>}
                           
                           {/* BLOCO DE ENTREGAS ESTILO MAJOR */}
                           {b.type === 'deliverables' && (
                             <div className="mb-8">
                               <h4 className="text-sm font-bold uppercase tracking-widest text-black mb-4">Entregáveis</h4>
                               <div className="text-base leading-relaxed text-neutral-700 whitespace-pre-wrap font-medium">
                                 {b.content}
                               </div>
                             </div>
                           )}

                           {b.type === 'items' && <div className="my-8 border-t border-black pt-4"><table className="w-full text-sm"><thead><tr className="text-left uppercase text-xs font-bold text-neutral-400 border-b border-neutral-300"><th className="pb-2">Item</th><th className="pb-2 text-right">Valor</th></tr></thead><tbody className="divide-y divide-neutral-200">{b.content.map((it:any,i:number)=><tr key={i}><td className="py-3 font-medium">{it.name}</td><td className="py-3 text-right">R$ {Number(it.price).toLocaleString('pt-BR',{minimumFractionDigits:2})}</td></tr>)}</tbody></table></div>}
                           {b.type === 'total' && <div className="bg-black text-white p-8 mt-12 rounded-sm shadow-2xl"><div className="flex justify-between items-end"><div><p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">Investimento</p><p className="text-xs text-neutral-500">{b.content.obs}</p></div><div className="text-5xl font-bold tracking-tighter">R$ {blocks.filter(x=>x.type==='items').reduce((acc,curr)=>acc+curr.content.reduce((a:any,c:any)=>a+Number(c.price),0),0).toLocaleString('pt-BR',{minimumFractionDigits:2})}</div></div></div>}
                        </div>
                      ))}
                    </div>
                    <div className="text-center text-[10px] uppercase tracking-widest text-neutral-400 mt-12 pt-6 border-t border-neutral-300">Lampejo Audiovisual • CNPJ 06.303.013/0001-86 • Brasília-DF</div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function Kpi({ label, val, growth, highlight, color, sub }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? "bg-white text-black border-white" : "bg-neutral-900 border-white/10"}`}>
      <p className="text-xs font-bold uppercase mb-2 opacity-60">{label}</p>
      <div className="flex items-end gap-3"><p className={`text-3xl font-bold tracking-tighter ${color || "text-white"}`}>R$ {val?.toLocaleString('pt-BR',{minimumFractionDigits:2})}</p>{growth !== undefined && <span className={growth>=0?"text-green-500 text-xs font-bold":"text-red-500 text-xs font-bold"}>{growth.toFixed(0)}%</span>}</div>
      {sub && <p className="text-xs mt-1 opacity-50">R$ {sub.toLocaleString('pt-BR',{minimumFractionDigits:2})} (Real)</p>}
    </div>
  )
}

function KanbanColumn({ status, tasks, onMove, onEdit }: any) {
  const colTasks = tasks.filter((t:Task) => t.status === status);
  const titles = { todo: "A Fazer", doing: "Em Produção", review: "Revisão", done: "Finalizado" };
  const colors = { todo: "border-neutral-500", doing: "border-blue-500", review: "border-purple-500", done: "border-green-500" };
  
  return (
    <div className={`min-w-[320px] bg-neutral-900/50 rounded-xl flex flex-col h-full border border-white/5 ${status === 'done' ? 'opacity-80' : ''}`}>
      <div className={`p-4 border-t-4 ${colors[status as keyof typeof colors]} bg-white/5 flex justify-between`}>
        <h3 className="font-bold text-sm uppercase">{titles[status as keyof typeof titles]}</h3>
        <span className="text-xs bg-black px-2 py-1 rounded">{colTasks.length}</span>
      </div>
      <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {colTasks.map((t:Task) => (
          <div key={t.id} onClick={() => onEdit(t)} className={`bg-[#111] p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer group relative ${status === 'done' ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}>
             <div className="flex justify-between items-start mb-2"><span className="text-[10px] font-bold uppercase text-neutral-500">{t.client}</span>{status === 'done' && <CheckCircle2 size={16} className="text-green-500"/>}</div>
             <p className="font-bold text-sm mb-3">{t.title}</p>
             <div className="flex justify-between items-center border-t border-white/5 pt-3">
               <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold">{t.assignee[0]}</div><span className="text-[10px] text-neutral-500 flex gap-1"><Clock size={10}/> {new Date(t.dueDate).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</span></div>
               <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                 {status !== 'todo' && <button onClick={() => onMove(t.id, status === 'done' ? 'review' : status === 'review' ? 'doing' : 'todo')} className="p-1 hover:bg-white/10 rounded"><ArrowRight size={14} className="rotate-180"/></button>}
                 {status !== 'done' && <button onClick={() => onMove(t.id, status === 'todo' ? 'doing' : status === 'doing' ? 'review' : 'done')} className="p-1 hover:bg-white/10 rounded"><ArrowRight size={14}/></button>}
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}