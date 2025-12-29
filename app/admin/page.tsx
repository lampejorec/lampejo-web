"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, Plus, Printer, Lock, DollarSign, Layout, PieChart, ChevronLeft, ChevronRight,
  ArrowUpRight, ArrowDownRight, Clock, Tag, List, Type, ArrowRight, X, Edit, CheckCircle2,
  Calendar, User, FileText, Package, Home, AlertCircle, TrendingUp, CreditCard, RefreshCw, Menu
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

interface RecurringExpense {
  id: number; description: string; amount: number; frequency: "monthly" | "yearly";
  dueDay: number; dueMonth?: number;
}

type BlockType = "header" | "text" | "deliverables" | "items" | "total";
interface ProposalBlock { id: string; type: BlockType; content: any; }

interface Task {
  id: number; title: string; client: string; status: "todo" | "doing" | "review" | "done";
  priority: "low" | "medium" | "high"; dueDate: string; assignee: string; tag: string;
}

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "projects" | "finance" | "proposal">("dashboard");
  
  // ESTADO DO MENU MOBILE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FINANCEIRO
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showReport, setShowReport] = useState(false);
  
  const [newTransDesc, setNewTransDesc] = useState("");
  const [newTransDelivery, setNewTransDelivery] = useState("");
  const [newTransAmount, setNewTransAmount] = useState("");
  const [newTransType, setNewTransType] = useState<"income" | "expense">("income");
  const [newTransDate, setNewTransDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTransInvoice, setNewTransInvoice] = useState(false);
  const [newRecDesc, setNewRecDesc] = useState("");
  const [newRecAmount, setNewRecAmount] = useState("");
  const [newRecFreq, setNewRecFreq] = useState<"monthly" | "yearly">("monthly");
  const [newRecDay, setNewRecDay] = useState("5");
  const [newRecMonth, setNewRecMonth] = useState("0");

  // PROJETOS
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectFilterClient, setProjectFilterClient] = useState("ALL");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskClient, setNewTaskClient] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // PROPOSTA
  const [clientName, setClientName] = useState("");
  const [blocks, setBlocks] = useState<ProposalBlock[]>([
    { id: "1", type: "header", content: { title: "Projeto Institucional", subtitle: "Narrativa Visual" } },
    { id: "2", type: "text", content: "A Lampejo propõe uma abordagem cinematográfica..." },
    { id: "3", type: "deliverables", content: "- 1 Vídeo Manifesto (30s)\n- 5 Pílulas para Reels\n- Cobertura Fotográfica" },
    { id: "4", type: "items", content: [{ name: "Diária de Captação", price: 2500 }] },
    { id: "5", type: "total", content: { obs: "Validade de 10 dias" } }
  ]);

  useEffect(() => {
    const savedFin = localStorage.getItem("lampejo_finances_v3");
    if (savedFin) setTransactions(JSON.parse(savedFin));
    const savedRec = localStorage.getItem("lampejo_recurring_v1");
    if (savedRec) setRecurringExpenses(JSON.parse(savedRec));
    const savedTasks = localStorage.getItem("lampejo_tasks_v2");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else setTasks([{ id: 1, title: "Vídeo Institucional", client: "NIC.br", status: "doing", priority: "high", dueDate: "2025-12-20", assignee: "Edu", tag: "Edição" }]);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem("lampejo_finances_v3", JSON.stringify(transactions));
    if (recurringExpenses.length > 0) localStorage.setItem("lampejo_recurring_v1", JSON.stringify(recurringExpenses));
    if (tasks.length > 0) localStorage.setItem("lampejo_tasks_v2", JSON.stringify(tasks));
  }, [transactions, recurringExpenses, tasks]);

  const handleLogin = () => {
    const user = USERS[email as keyof typeof USERS];
    if (user && user.pass === password) {
      setCurrentUser(user);
      if (user.role !== "admin" && activeTab === "finance") setActiveTab("dashboard");
    } else alert("Dados incorretos.");
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const getMonthData = (date: Date) => transactions.filter(t => {
    const [y, m] = t.date.split('-').map(Number);
    return `${y}-${m}` === `${date.getFullYear()}-${date.getMonth() + 1}`;
  });
  
  const getMonthlyFixedCosts = (date: Date) => recurringExpenses.filter(r => 
    r.frequency === "monthly" || (r.frequency === "yearly" && r.dueMonth === date.getMonth())
  );

  const currentMonthTrans = getMonthData(selectedDate);
  const currentFixedCosts = getMonthlyFixedCosts(selectedDate);
  const prevDate = new Date(selectedDate); prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonthTrans = getMonthData(prevDate);
  const prevFixedCosts = getMonthlyFixedCosts(prevDate);

  const calcMetrics = (trans: Transaction[], fixed: RecurringExpense[]) => {
    const gross = trans.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0);
    const variableExpenses = trans.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0);
    const fixedExpensesTotal = fixed.reduce((a, b) => a + b.amount, 0);
    const totalExpenses = variableExpenses + fixedExpensesTotal;
    const invoiceInc = trans.filter(t => t.type === "income" && t.hasInvoice).reduce((a, b) => a + b.amount, 0);
    const realTax = invoiceInc * IMPOSTO_REAL; 
    const provTax = invoiceInc * IMPOSTO_PROVISAO;
    const safeProfit = gross - totalExpenses - provTax;
    return { gross, totalExpenses, realTax, provTax, safeProfit, fixedExpensesTotal };
  };

  const currM = calcMetrics(currentMonthTrans, currentFixedCosts);
  const prevM = calcMetrics(prevMonthTrans, prevFixedCosts);
  const growth = prevM.gross === 0 ? 100 : ((currM.gross - prevM.gross) / prevM.gross) * 100;

  const addTrans = () => {
    if(!newTransDesc || !newTransAmount) return;
    setTransactions([...transactions, { id: Date.now(), description: newTransDesc, deliveryDetails: newTransDelivery, amount: Number(newTransAmount), type: newTransType, date: newTransDate, hasInvoice: newTransInvoice, category: "Geral" }]);
    setNewTransDesc(""); setNewTransDelivery(""); setNewTransAmount("");
  };

  const addRecurring = () => {
    if(!newRecDesc || !newRecAmount) return;
    setRecurringExpenses([...recurringExpenses, { id: Date.now(), description: newRecDesc, amount: Number(newRecAmount), frequency: newRecFreq, dueDay: Number(newRecDay), dueMonth: newRecFreq === 'yearly' ? Number(newRecMonth) : undefined }]);
    setNewRecDesc(""); setNewRecAmount(""); setShowRecurringModal(false);
  };

  const uniqueClients = Array.from(new Set(tasks.map(t => t.client)));
  const filteredTasks = projectFilterClient === "ALL" ? tasks : tasks.filter(t => t.client === projectFilterClient);
  const addTask = () => { setTasks([...tasks, { id: Date.now(), title: newTaskTitle || "Nova Tarefa", client: newTaskClient || "Geral", status: "todo", priority: "medium", dueDate: new Date().toISOString().split('T')[0], assignee: "Time", tag: "Geral" }]); setNewTaskTitle(""); setNewTaskClient(""); };
  const updateTask = (updatedTask: Task) => { setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t)); setEditingTask(null); };
  const moveTask = (id: number, status: Task["status"]) => { const task = tasks.find(t => t.id === id); if(task) { setTasks(tasks.map(t => t.id === id ? {...task, status} : t)); setEditingTask(null); }};

  const getLogo = (name: string) => CLIENT_LOGOS[name.toLowerCase().trim()] || null;
  const updateBlock = (id: string, content: any) => setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  const addBlock = (type: BlockType) => { let content: any = ""; if (type === "items") content = [{name:"", price:0}]; if (type === "header") content = { title: "Título", subtitle: "Subtítulo" }; if (type === "total") content = { obs: "" }; if (type === "deliverables") content = "- Item 1\n- Item 2"; setBlocks([...blocks, { id: Date.now().toString(), type, content }]); };

  if (!currentUser) return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-6">
      <Image src="/bg-home.jpg" alt="bg" fill className="object-cover opacity-30 blur-sm" />
      <div className="bg-neutral-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 w-full max-w-sm relative z-10 text-center text-white shadow-2xl">
        <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30"><Lock className="text-purple-400" /></div>
        <h1 className="text-3xl font-bold tracking-tighter mb-2">LAMPEJO OS</h1>
        <input type="email" placeholder="E-mail" className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Senha" className="w-full bg-black/50 border border-white/20 rounded-lg p-3 text-white mb-4" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-lg font-bold transition-all">ENTRAR</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row overflow-x-hidden">
      
      {/* --- HEADER MOBILE (SÓ APARECE NO CELULAR) --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/10 sticky top-0 z-[60]">
        <span className="font-bold text-lg tracking-tighter">LAMPEJO <span className="text-purple-500 text-xs">OS</span></span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24}/>}
        </button>
      </div>

      {/* --- SIDEBAR / MENU --- */}
      <aside 
        className={`
          bg-black border-r border-white/5 flex flex-col z-[50]
          /* Desktop Styles */
          md:flex md:w-64 md:h-screen md:sticky md:top-0
          /* Mobile Styles (Full Screen Overlay) */
          ${mobileMenuOpen ? "fixed inset-0 pt-20" : "hidden"} 
        `}
      >
        <div className="p-6 h-full flex flex-col">
          <h1 className="hidden md:block font-bold text-xl tracking-tighter mb-8">LAMPEJO <span className="text-purple-500 text-xs">OS</span></h1>
          
          <div className="flex items-center gap-3 mb-8 bg-neutral-900 p-3 rounded-lg border border-white/5">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm">{currentUser.avatar}</div>
            <div><p className="text-sm font-bold">{currentUser.name}</p><p className="text-[10px] text-neutral-500 uppercase font-bold">{currentUser.role}</p></div>
          </div>
          
          <nav className="space-y-2 flex-1">
            {[
              { id: "dashboard", label: "Visão Geral", icon: Home },
              { id: "projects", label: "Projetos", icon: Layout },
              { id: "proposal", label: "Propostas", icon: FileText },
              ...(currentUser.role === "admin" ? [{ id: "finance", label: "Financeiro", icon: PieChart }] : [])
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-4 md:py-3 rounded-lg text-lg md:text-sm font-medium transition-all ${activeTab === item.id ? "bg-white text-black" : "text-neutral-400 hover:bg-white/5"}`}
              >
                <item.icon size={20}/> {item.label}
              </button>
            ))}
          </nav>

          {/* Botão Sair no Mobile */}
          {mobileMenuOpen && (
             <button onClick={() => setCurrentUser(null)} className="md:hidden mt-auto w-full bg-red-900/20 text-red-500 py-4 rounded-lg font-bold">SAIR DO SISTEMA</button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative custom-scrollbar h-[calc(100vh-60px)] md:h-screen">
        
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">Bom dia, {currentUser.name}.</h2>
            <p className="text-neutral-400 mb-8 md:mb-12">Resumo da operação hoje.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
              <div onClick={() => setActiveTab("projects")} className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden cursor-pointer hover:border-red-500/50 transition-all group hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4"><div className="p-3 bg-red-500/10 rounded-lg text-red-500"><AlertCircle size={24}/></div><span className="text-4xl font-bold">{tasks.filter(t => t.priority === 'high' && t.status !== 'done').length}</span></div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-red-400">Alta Prioridade</h3>
                <p className="text-sm text-neutral-500">Pendências urgentes</p>
              </div>
              <div onClick={() => setActiveTab("projects")} className="bg-neutral-900 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-blue-500/50 transition-all group hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4"><div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Layout size={24}/></div><span className="text-4xl font-bold">{tasks.filter(t => t.status === 'doing').length}</span></div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400">Em Produção</h3>
                <p className="text-sm text-neutral-500">Projetos ativos</p>
              </div>
              {currentUser.role === "admin" && (
                <div onClick={() => setActiveTab("finance")} className="bg-neutral-900 border border-white/10 p-6 rounded-2xl cursor-pointer hover:border-green-500/50 transition-all group hover:scale-[1.02] relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-green-500/10 rounded-lg text-green-500"><TrendingUp size={24}/></div>
                      <div className="text-right"><span className="text-2xl font-bold text-green-500 block">R$ {currM.gross.toLocaleString('pt-BR', {compactDisplay: "short", notation: "compact"})}</span><span className="text-[10px] text-green-400 font-bold bg-green-900/30 px-2 py-1 rounded-full">{growth > 0 ? "+" : ""}{growth.toFixed(0)}% este mês</span></div>
                    </div>
                    <h3 className="font-bold text-lg mb-1 group-hover:text-green-400">Faturamento</h3>
                    <p className="text-sm text-neutral-500">Performance mensal</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-6 opacity-20 group-hover:opacity-40 transition-opacity gap-2">
                     <div className="w-full bg-green-500 rounded-t-sm h-[30%]"></div><div className="w-full bg-green-500 rounded-t-sm h-[50%]"></div><div className="w-full bg-green-500 rounded-t-sm h-[40%]"></div><div className="w-full bg-green-500 rounded-t-sm h-[70%]"></div><div className="w-full bg-green-500 rounded-t-sm h-[55%]"></div><div className="w-full bg-green-500 rounded-t-sm h-[90%]"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FINANCEIRO */}
        {activeTab === "finance" && currentUser.role === "admin" && !showReport && (
           <div className="p-4 md:p-8 max-w-7xl mx-auto">
             <header className="flex flex-col xl:flex-row justify-between items-end mb-8 gap-6">
               <div className="w-full xl:w-auto">
                  <p className="text-xs uppercase text-purple-400 font-bold mb-2">Fluxo de Caixa</p>
                  <div className="flex items-center justify-between xl:justify-start gap-4 bg-neutral-900 p-2 rounded-full xl:bg-transparent xl:p-0">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-full"><ChevronLeft/></button>
                    <h2 className="text-xl md:text-3xl font-bold w-full text-center capitalize">{selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-full"><ChevronRight/></button>
                  </div>
               </div>
               <div className="flex gap-2 w-full xl:w-auto overflow-x-auto pb-2">
                 <button onClick={() => setShowRecurringModal(true)} className="bg-neutral-800 text-white border border-white/10 px-4 py-3 rounded-full font-bold text-xs md:text-sm flex items-center gap-2 hover:bg-neutral-700 whitespace-nowrap"><RefreshCw size={16}/> FIXOS</button>
                 <button onClick={() => setShowReport(true)} className="bg-white text-black px-6 py-3 rounded-full font-bold text-xs md:text-sm whitespace-nowrap">MODO APRESENTAÇÃO</button>
               </div>
             </header>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               <Kpi label="Faturamento" val={currM.gross} growth={growth} />
               <Kpi label="Imposto (10%)" val={currM.provTax} sub={currM.realTax} color="text-neutral-400" />
               <Kpi label="Despesas" val={currM.totalExpenses} sub={currM.fixedExpensesTotal} subLabel="Fixos" color="text-white" />
               <Kpi label="Lucro Caixa" val={currM.safeProfit} color="text-green-400" highlight />
             </div>

             <div className="bg-neutral-900/50 border border-white/5 p-4 md:p-6 rounded-2xl mb-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-2"><input type="date" value={newTransDate} onChange={e => setNewTransDate(e.target.value)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" /></div>
                  <div className="md:col-span-3"><input value={newTransDesc} onChange={e => setNewTransDesc(e.target.value)} placeholder="Cliente / Descrição" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" /></div>
                  <div className="md:col-span-3"><input value={newTransDelivery} onChange={e => setNewTransDelivery(e.target.value)} placeholder="Detalhes (Ex: Vídeo Reels)" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" /></div>
                  <div className="md:col-span-2"><select value={newTransType} onChange={e => setNewTransType(e.target.value as any)} className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-neutral-400"><option value="income">Entrada (+)</option><option value="expense">Saída (-)</option></select></div>
                  <div className="md:col-span-2"><input type="number" value={newTransAmount} onChange={e => setNewTransAmount(e.target.value)} placeholder="R$ Valor" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white text-sm" /></div>
                </div>
                <button onClick={addTrans} className="mt-4 w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2"><Plus size={16}/> Lançar Movimentação</button>
             </div>

             <div className="space-y-2 pb-20">
               {currentMonthTrans.map(t => (
                 <div key={t.id} className="flex flex-col md:flex-row justify-between p-4 bg-neutral-900/30 border border-white/5 rounded-xl gap-2 md:gap-0">
                    <div className="flex gap-4 items-center">
                      <div className={`w-2 h-2 rounded-full ${t.type === "income" ? "bg-green-500" : "bg-red-500"}`}/>
                      <div className="flex flex-col"><span className="font-bold text-sm">{t.description}</span><span className="text-xs text-neutral-500">{new Date(t.date).toLocaleDateString('pt-BR')}</span></div>
                    </div>
                    <div className="flex justify-between items-center gap-4 pl-6 md:pl-0">
                      <span className={`font-bold ${t.type === "income" ? "text-green-500" : "text-white"}`}>R$ {t.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      <button onClick={() => setTransactions(transactions.filter(x => x.id !== t.id))} className="text-neutral-600 hover:text-red-500"><Trash2 size={16}/></button>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        )}

        {/* PROJETOS */}
        {activeTab === "projects" && (
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-64 bg-neutral-900 border-b md:border-r border-white/5 p-4">
              <h3 className="text-xs font-bold uppercase text-neutral-500 mb-2">Filtro</h3>
              <div className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                <button onClick={() => setProjectFilterClient("ALL")} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium ${projectFilterClient === "ALL" ? "bg-purple-600 text-white" : "text-neutral-400 border border-white/10"}`}>Todos</button>
                {uniqueClients.map(c => (
                  <button key={c} onClick={() => setProjectFilterClient(c)} className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium ${projectFilterClient === c ? "bg-white/10 text-white" : "text-neutral-400 border border-white/10"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 p-4 md:p-8 overflow-x-auto">
              <div className="flex gap-2 mb-4">
                <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} placeholder="Nova Tarefa" className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white" />
                <button onClick={addTask} className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm">+ Add</button>
              </div>
              <div className="flex gap-4 min-w-[1000px] md:min-w-0 md:w-full overflow-x-auto pb-4">
                {["todo", "doing", "review", "done"].map(status => (
                  <KanbanColumn key={status} status={status} tasks={filteredTasks} onMove={moveTask} onEdit={setEditingTask}/>
                ))}
              </div>
            </div>
            {editingTask && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4"><h3 className="text-xl font-bold flex items-center gap-2"><Edit size={18} className="text-purple-500"/> Editar Demanda</h3><button onClick={() => setEditingTask(null)}><X size={20}/></button></div>
                  <div className="space-y-4">
                    <div><label className="text-xs uppercase text-neutral-500 font-bold">Título</label><input value={editingTask.title} onChange={e => setEditingTask({...editingTask, title: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" /></div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs uppercase text-neutral-500 font-bold">Cliente</label><input value={editingTask.client} onChange={e => setEditingTask({...editingTask, client: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" /></div>
                       <div><label className="text-xs uppercase text-neutral-500 font-bold">Tag</label><input value={editingTask.tag} onChange={e => setEditingTask({...editingTask, tag: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-xs uppercase text-neutral-500 font-bold">Prazo</label><input type="date" value={editingTask.dueDate} onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1" /></div>
                       <div><label className="text-xs uppercase text-neutral-500 font-bold">Responsável</label><select value={editingTask.assignee} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} className="w-full bg-black border border-white/20 rounded p-3 text-white mt-1"><option value="Edu">Edu</option><option value="Rafa">Rafa</option><option value="Time">Time</option></select></div>
                    </div>
                    <div><label className="text-xs uppercase text-neutral-500 font-bold">Prioridade</label><div className="flex gap-2 mt-1">{["low", "medium", "high"].map(p => (<button key={p} onClick={() => setEditingTask({...editingTask, priority: p as any})} className={`flex-1 py-2 rounded text-xs font-bold uppercase border ${editingTask.priority === p ? "bg-white text-black border-white" : "border-white/20 hover:bg-white/5"}`}>{p}</button>))}</div></div>
                    <div className="pt-6 flex gap-3"><button onClick={() => { setTasks(tasks.filter(t => t.id !== editingTask.id)); setEditingTask(null); }} className="px-4 py-3 rounded-lg font-bold border border-red-500/20 text-red-500 hover:bg-red-900/20">Excluir</button><button onClick={() => updateTask(editingTask)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold">Salvar</button></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PROPOSTA */}
        {activeTab === "proposal" && (
          <div className="flex flex-col lg:flex-row h-auto lg:h-screen">
            <div className="w-full lg:w-96 bg-neutral-900 border-r border-white/5 flex flex-col order-2 lg:order-1 h-auto lg:h-full">
              <div className="p-6 border-b border-white/5">
                <h3 className="font-bold text-lg mb-4">Construtor</h3>
                <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome do Cliente" className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white mb-4" />
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => addBlock('text')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5"><Type size={16} /> Texto</button>
                   <button onClick={() => addBlock('deliverables')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5"><Package size={16} /> Entregas</button>
                   <button onClick={() => addBlock('items')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5"><List size={16} /> Preços</button>
                   <button onClick={() => addBlock('total')} className="bg-white/5 p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 border border-white/5"><DollarSign size={16} /> Total</button>
                   <button onClick={() => window.print()} className="bg-purple-600 text-white p-3 rounded-lg text-xs font-bold flex flex-col items-center gap-1 col-span-2 mt-2"><Printer size={16} /> GERAR PDF</button>
                </div>
              </div>
              <div className="flex-1 p-4 space-y-4 max-h-[400px] lg:max-h-full overflow-y-auto">
                 {blocks.map((b) => (
                   <div key={b.id} className="bg-black border border-white/10 p-4 rounded-xl relative group">
                      <div className="absolute top-2 right-2"><button onClick={() => setBlocks(blocks.filter(x => x.id !== b.id))} className="text-red-500"><Trash2 size={14}/></button></div>
                      <span className="text-[10px] uppercase text-neutral-500 font-bold mb-2 block">{b.type}</span>
                      {b.type === 'header' && (<><input value={b.content.title} onChange={e => updateBlock(b.id, {...b.content, title: e.target.value})} className="bg-transparent w-full border-b border-white/20 text-sm mb-2"/><input value={b.content.subtitle} onChange={e => updateBlock(b.id, {...b.content, subtitle: e.target.value})} className="bg-transparent w-full border-b border-white/20 text-xs"/></>)}
                      {b.type === 'text' && <textarea value={b.content} onChange={e => updateBlock(b.id, e.target.value)} className="bg-transparent w-full border border-white/10 rounded p-2 text-sm text-neutral-300"/>}
                      {b.type === 'deliverables' && (<textarea value={b.content} rows={5} onChange={e => updateBlock(b.id, e.target.value)} className="bg-transparent w-full border border-white/10 rounded p-2 text-sm text-neutral-300 mt-1 font-mono text-xs"/>)}
                      {b.type === 'items' && <div>{b.content.map((it:any, i:number) => <div key={i} className="flex gap-2 mb-1"><input value={it.name} onChange={e=>{const n=[...b.content];n[i].name=e.target.value;updateBlock(b.id,n)}} className="flex-1 bg-transparent border-b border-white/20 text-xs"/><input value={it.price} type="number" onChange={e=>{const n=[...b.content];n[i].price=e.target.value;updateBlock(b.id,n)}} className="w-16 bg-transparent border-b border-white/20 text-xs text-right"/></div>)}<button onClick={()=>updateBlock(b.id,[...b.content,{name:"",price:0}])} className="text-xs text-purple-400 font-bold mt-2">+ Item</button></div>}
                   </div>
                 ))}
              </div>
            </div>
            <div className="flex-1 bg-neutral-800 flex justify-center overflow-y-auto p-4 lg:p-12 order-1 lg:order-2 overflow-x-auto">
               <div id="printable-area" className="min-w-[210mm] w-[210mm] min-h-[297mm] relative bg-white text-black shadow-2xl overflow-hidden print:m-0 print:shadow-none scale-[0.4] origin-top-left md:scale-100 md:origin-center transform">
                  <div className="absolute inset-0 z-0"><Image src="/bg-home.jpg" alt="bg" fill className="object-cover" priority /><div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div></div>
                  <div className="relative z-10 p-[15mm] h-full flex flex-col">
                    <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-12"><div><h1 className="text-4xl font-bold tracking-tighter uppercase mb-1">Lampejo</h1><p className="text-xs font-bold tracking-[0.3em] uppercase text-neutral-500">Audiovisual</p></div>{getLogo(clientName) ? <div className="relative w-32 h-16"><img src={getLogo(clientName)!} className="w-full h-full object-contain" alt="logo"/></div> : <div className="text-right"><h2 className="text-2xl font-bold uppercase text-neutral-400">{clientName || "CLIENTE"}</h2></div>}</div>
                    <div className="flex-1 space-y-10">
                      {blocks.map(b => (
                        <div key={b.id}>
                           {b.type === 'header' && <div className="mb-8"><h2 className="text-5xl font-bold leading-tight mb-2">{b.content.title}</h2><p className="text-xl text-neutral-500 font-serif italic">{b.content.subtitle}</p></div>}
                           {b.type === 'text' && <div className="text-lg leading-relaxed text-justify whitespace-pre-wrap font-serif text-neutral-800">{b.content}</div>}
                           {b.type === 'deliverables' && (<div className="mb-8"><h4 className="text-sm font-bold uppercase tracking-widest text-black mb-4">Entregáveis</h4><div className="text-base leading-relaxed text-neutral-700 whitespace-pre-wrap font-medium">{b.content}</div></div>)}
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

        {/* MODAL FIXOS */}
        {showRecurringModal && (
           <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
               <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold flex items-center gap-2"><CreditCard size={18}/> Custos Fixos</h3><button onClick={() => setShowRecurringModal(false)}><X size={20}/></button></div>
               <div className="bg-black/50 p-4 rounded-xl mb-6 border border-white/10">
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
                   <div className="md:col-span-4"><input value={newRecDesc} onChange={e => setNewRecDesc(e.target.value)} placeholder="Nome" className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-sm text-white"/></div>
                   <div className="md:col-span-3"><input type="number" value={newRecAmount} onChange={e => setNewRecAmount(e.target.value)} placeholder="R$" className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-sm text-white"/></div>
                   <div className="md:col-span-3"><select value={newRecFreq} onChange={e => setNewRecFreq(e.target.value as any)} className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-sm text-neutral-400"><option value="monthly">Mensal</option><option value="yearly">Anual</option></select></div>
                   <div className="md:col-span-2">{newRecFreq === 'monthly' ? (<input type="number" min="1" max="31" value={newRecDay} onChange={e => setNewRecDay(e.target.value)} placeholder="Dia" className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-sm text-white"/>) : (<select value={newRecMonth} onChange={e => setNewRecMonth(e.target.value)} className="w-full bg-neutral-900 border border-white/10 rounded p-2 text-sm text-neutral-400">{["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"].map((m,i)=><option key={i} value={i}>{m}</option>)}</select>)}</div>
                 </div>
                 <button onClick={addRecurring} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded font-bold text-sm">Adicionar</button>
               </div>
               <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                 {recurringExpenses.map(rec => (<div key={rec.id} className="flex justify-between items-center p-3 bg-black/30 border border-white/5 rounded-lg"><div><p className="font-bold text-sm">{rec.description}</p></div><div className="flex items-center gap-4"><span className="font-bold text-white">R$ {rec.amount}</span><button onClick={() => setRecurringExpenses(recurringExpenses.filter(r => r.id !== rec.id))} className="text-neutral-600 hover:text-red-500"><Trash2 size={14}/></button></div></div>))}
               </div>
             </div>
           </div>
        )}

        {/* RELATÓRIO (FIXED) */}
        {showReport && (
           <div className="fixed inset-0 z-[200] bg-white overflow-y-auto flex justify-center p-0 text-black">
             <div id="printable-area" className="min-w-[210mm] w-[210mm] min-h-[297mm] p-[10mm] relative bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-end border-b-4 border-black pb-4 mb-8">
                    <div><h1 className="text-5xl font-bold tracking-tighter mb-1">RELATÓRIO<br/>MENSAL</h1><p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p></div>
                    <div className="text-right"><div className="text-3xl font-bold mb-1">{growth > 0 ? "+" : ""}{growth.toFixed(0)}%</div><p className="text-[10px] uppercase font-bold text-neutral-500">Crescimento</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 mb-8">
                     <div className="text-sm leading-relaxed text-justify"><h3 className="font-bold uppercase mb-2">Análise</h3>{currM.gross > prevM.gross ? "Resultado positivo com aumento de faturamento." : "Retração de faturamento."} {currM.safeProfit > 0 ? " Operação lucrativa." : " Atenção aos custos."}</div>
                     <div className="bg-neutral-100 p-4 rounded-xl text-xs space-y-2"><h3 className="font-bold uppercase mb-2">Raio-X</h3><div className="flex justify-between border-b pb-1"><span>Imposto Real</span><b>R$ {currM.realTax.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div><div className="flex justify-between border-b pb-1"><span>Provisão (10%)</span><b>R$ {currM.provTax.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div><div className="flex justify-between pt-1 text-green-600 font-bold"><span>Líquido</span><b>R$ {currM.safeProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</b></div></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8"><div className="border border-black p-3"><span className="text-[10px] uppercase text-neutral-500">Faturamento</span><p className="text-xl font-bold">R$ {currM.gross.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div><div className="border border-black p-3 bg-black text-white"><span className="text-[10px] uppercase text-neutral-400">Caixa</span><p className="text-xl font-bold">R$ {currM.safeProfit.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div><div className="border border-black p-3"><span className="text-[10px] uppercase text-neutral-500">Despesas</span><p className="text-xl font-bold text-red-600">R$ {currM.totalExpenses.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div></div>
                </div>
                <div className="text-center text-[10px] uppercase tracking-widest text-neutral-400 pt-6 border-t border-neutral-300 mt-auto">Lampejo Audiovisual • CNPJ 06.303.013/0001-86</div>
                <div className="fixed bottom-10 right-10 flex gap-4 no-print print:hidden">
                  <button onClick={() => setShowReport(false)} className="bg-neutral-200 text-black px-6 py-3 rounded-full font-bold shadow-lg">Voltar</button>
                  <button onClick={() => window.print()} className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg">Imprimir PDF</button>
                </div>
             </div>
           </div>
        )}
      </main>
    </div>
  );
}

function Kpi({ label, val, growth, highlight, color, sub, subLabel }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${highlight ? "bg-white text-black border-white" : "bg-neutral-900 border-white/10"}`}>
      <p className="text-xs font-bold uppercase mb-2 opacity-60">{label}</p>
      <div className="flex items-end gap-3"><p className={`text-2xl md:text-3xl font-bold tracking-tighter ${color || "text-white"}`}>R$ {val?.toLocaleString('pt-BR',{minimumFractionDigits:2})}</p>{growth !== undefined && <span className={growth>=0?"text-green-500 text-xs font-bold":"text-red-500 text-xs font-bold"}>{growth.toFixed(0)}%</span>}</div>
      {sub && <p className="text-xs mt-1 opacity-50">R$ {sub.toLocaleString('pt-BR',{minimumFractionDigits:2})} ({subLabel || "Real"})</p>}
    </div>
  )
}

function KanbanColumn({ status, tasks, onMove, onEdit }: any) {
  const colTasks = tasks.filter((t:Task) => t.status === status);
  const titles = { todo: "A Fazer", doing: "Em Produção", review: "Revisão", done: "Finalizado" };
  const colors = { todo: "border-neutral-500", doing: "border-blue-500", review: "border-purple-500", done: "border-green-500" };
  return (
    <div className={`min-w-[280px] md:min-w-[320px] bg-neutral-900/50 rounded-xl flex flex-col h-full border border-white/5 ${status === 'done' ? 'opacity-80' : ''}`}>
      <div className={`p-4 border-t-4 ${colors[status as keyof typeof colors]} bg-white/5 flex justify-between`}>
        <h3 className="font-bold text-sm uppercase">{titles[status as keyof typeof titles]}</h3>
        <span className="text-xs bg-black px-2 py-1 rounded">{colTasks.length}</span>
      </div>
      <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
        {colTasks.map((t:Task) => (
          <div key={t.id} onClick={() => onEdit(t)} className={`bg-[#111] p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer group relative`}>
             <div className="flex justify-between items-start mb-2"><span className="text-[10px] font-bold uppercase text-neutral-500">{t.client}</span></div>
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