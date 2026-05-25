import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  History, 
  LayoutDashboard, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  Loader2,
  TrendingUp,
  LogOut,
  Camera,
  CheckCircle2,
  AlertCircle,
  Upload,
  Scan,
  X,
  Globe,
  DollarSign,
  TrendingDown,
  ChevronRight,
  Bitcoin,
  Flame,
  Globe2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Gift,
  ShieldAlert,
  Bot,
  LockKeyhole,
  Heart,
  Trees,
  Users,
  GraduationCap,
  ArrowLeft,
  Menu,
  User as UserIcon,
  Share2,
  Clock,
  PieChart,
  Activity,
  MousePointerClick,
  Info,
  ChevronLeft,
  Banknote,
  UserCheck,
  TrendingUpDown,
  ArrowBigUp,
  ArrowBigDown,
  BadgeCheck,
  Building2,
  Landmark,
  ShieldQuestion,
  Verified,
  KeyRound,
  WifiOff,
  SignalHigh,
  Headset,
  Gavel,
  Scale,
  Award,
  Zap
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockBackend, User, Transaction, TRON_DEPOSIT_ADDRESS } from "./services/mockBackend";
import { cn } from "@/lib/utils";

/**
 * Vesta Pro - Phone-First Quantitative Terminal v5.6
 * Features: Regulatory Official Splash Screen, 100% Daily ROI, 1000% Cap.
 */

const MIN_INVESTMENT_USD = 200;

const MARKET_ASSETS = [
  { id: 'vesta', name: 'VESTA PRO COMPANY LIMITED', type: 'stock', rise: '+3000%', icon: <BadgeCheck className="text-amber-500" /> },
  { id: 'btc', name: 'Bitcoin', type: 'crypto', rise: '+12.4%', icon: <Bitcoin className="text-orange-400" /> },
  { id: 'eth', name: 'Ethereum', type: 'crypto', rise: '+8.2%', icon: <div className="text-blue-400 font-bold text-[10px]">ETH</div> },
  { id: 'sol', name: 'Solana', type: 'crypto', rise: '+15.1%', icon: <div className="text-purple-400 font-bold text-[10px]">SOL</div> },
  { id: 'doge', name: 'Dogecoin', type: 'crypto', rise: '+24.5%', icon: <div className="text-yellow-500 font-bold text-[10px]">DGE</div> },
  { id: 'aapl', name: 'Apple Inc.', type: 'stock', rise: '+1.5%', icon: <div className="text-slate-400 font-bold text-[10px]">AAPL</div> },
  { id: 'tsla', name: 'Tesla Inc.', type: 'stock', rise: '+5.2%', icon: <div className="text-red-500 font-bold text-[10px]">TSLA</div> },
  { id: 'nvda', name: 'NVIDIA', type: 'stock', rise: '+8.4%', icon: <div className="text-emerald-500 font-bold text-[10px]">NVDA</div> },
  { id: 'meta', name: 'Meta Platforms', type: 'stock', rise: '+2.1%', icon: <div className="text-blue-500 font-bold text-[10px]">META</div> },
];

const LOCATIONS = ["London", "New York", "Dubai", "Tokyo", "Singapore", "Paris", "Mumbai", "Sydney", "Berlin", "Toronto"];

function App() {
  const [view, setView] = useState<'splash' | 'landing' | 'login' | 'signup' | 'dashboard' | 'impact' | 'portfolio' | 'history' | 'trading' | 'loan' | 'agent' | 'forgot-password'>('splash');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  // Reset Password states
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypedPassword, setRetypedPassword] = useState("");

  const [copyCount, setCopyCount] = useState(0);
  const [botCheckInput, setBotCheckInput] = useState("");
  const captcha = useMemo(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { q: `${a} + ${b}`, a: (a + b).toString() };
  }, [view]);

  // Trading State
  const [tradeAmount, setTradeAmount] = useState("");
  const [btcPrice, setBtcPrice] = useState(94200);
  const [isBtcUp, setIsBtcUp] = useState(true);

  const [investingIn, setInvestingIn] = useState<any | null>(null);
  const [investAmount, setInvestAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [showProofModal, setShowProofModal] = useState(false);
  const [depositAmountInput, setDepositAmountInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activePopup, setActivePopup] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Sequence: Splash Screen -> Redirection
    const initApp = async () => {
      // Artificial delay for splash experience
      await new Promise(r => setTimeout(r, 6500));
      
      const savedUserId = localStorage.getItem('current_user_id');
      if (savedUserId) {
        const user = await mockBackend.getUser(savedUserId);
        if (user) {
          setCurrentUser(user);
          refreshTransactions(user.id);
          setView('dashboard');
          processROI(user.id);
        } else {
          setView('signup');
        }
      } else {
        setView('signup');
      }
    };
    initApp();

    const globalInterval = setInterval(() => {
      const type = Math.random() > 0.3 ? 'deposit' : 'withdrawal';
      const amount = Math.floor(Math.random() * 5000) + 200;
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      setActivePopup({ type, amount, location });
      setTimeout(() => setActivePopup(null), 4000);
    }, 12000);

    const roiInterval = setInterval(() => {
      const currentId = localStorage.getItem('current_user_id');
      if (currentId) processROI(currentId);
    }, 30000);

    // BTC Price Simulation
    const btcInterval = setInterval(() => {
      setBtcPrice(prev => {
        const change = (Math.random() * 10) - 5;
        setIsBtcUp(change > 0);
        return prev + change;
      });
    }, 2000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(globalInterval);
      clearInterval(roiInterval);
      clearInterval(btcInterval);
    };
  }, []);

  const processROI = async (userId: string) => {
    try {
      const { added, message } = await mockBackend.processDailyReturns(userId);
      if (added > 0) {
        toast.success(message, { duration: 8000 });
        const updatedUser = await mockBackend.getUser(userId);
        setCurrentUser(updatedUser);
        refreshTransactions(userId);
      }
    } catch (err) {
      console.error("ROI calculation idle", err);
    }
  };

  const refreshTransactions = async (userId: string) => {
    const txs = await mockBackend.getTransactions(userId);
    setTransactions(txs);
  };

  const navigateWithLoading = (targetView: typeof view) => {
    setShowMobileSidebar(false);
    setIsNavigating(true);
    setTimeout(() => {
      setView(targetView);
      setIsNavigating(false);
    }, 1200);
  };

  const copyToClipboard = async (text: string, countCopy = true) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      if (countCopy) setCopyCount(prev => prev + 1);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Copied to clipboard");
        if (countCopy) setCopyCount(prev => prev + 1);
      } catch (e) {
        toast.error("Manual copy required");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await mockBackend.register(email, password, confirmPassword, botCheckInput, captcha.a);
      setCurrentUser(user);
      localStorage.setItem('current_user_id', user.id);
      setView('dashboard');
      toast.success("Security Clearance Granted.");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await mockBackend.login(email, password);
      setCurrentUser(user);
      localStorage.setItem('current_user_id', user.id);
      setView('dashboard');
      toast.success("Terminal re-initialized.");
      processROI(user.id);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { message } = await mockBackend.resetPassword(resetEmail, newPassword, retypedPassword);
      toast.success(message);
      setView('login');
      setResetEmail("");
      setNewPassword("");
      setRetypedPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !investingIn) return;
    setLoading(true);
    try {
      const { message } = await mockBackend.invest(currentUser.id, investingIn.name, investingIn.type, parseFloat(investAmount));
      toast.success(message);
      const updatedUser = await mockBackend.getUser(currentUser.id);
      setCurrentUser(updatedUser);
      refreshTransactions(currentUser.id);
      setInvestingIn(null);
      setInvestAmount("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const { message } = await mockBackend.syncDeposit(currentUser.id);
      toast.info(message);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmProof = async () => {
    if (!currentUser || !selectedFile) return;
    setIsScanning(true);
    try {
      await new Promise(r => setTimeout(r, 2500));
      const { message } = await mockBackend.confirmDepositWithScreenshot(
        currentUser.id, 
        selectedFile, 
        parseFloat(depositAmountInput),
        view === 'agent' // Check if this is for agent status
      );
      toast.success(message);
      const updatedUser = await mockBackend.getUser(currentUser.id);
      setCurrentUser(updatedUser);
      refreshTransactions(currentUser.id);
      setShowProofModal(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setDepositAmountInput("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTrade = async (direction: 'up' | 'down') => {
    if (!currentUser) return;
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount) || amount < 200) return toast.error("Minimum trade is $200");
    
    setLoading(true);
    try {
      const { message } = await mockBackend.placeTrade(currentUser.id, direction, amount);
      toast(message);
      const updatedUser = await mockBackend.getUser(currentUser.id);
      setCurrentUser(updatedUser);
      refreshTransactions(currentUser.id);
      setTradeAmount("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLoan = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const { message } = await mockBackend.requestLoan(currentUser.id);
      toast.success(message);
      const updatedUser = await mockBackend.getUser(currentUser.id);
      setCurrentUser(updatedUser);
      refreshTransactions(currentUser.id);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      await mockBackend.withdraw(currentUser.id, withdrawAddress, parseFloat(withdrawAmount));
      toast.success("Liquidation approved.");
      const updatedUser = await mockBackend.getUser(currentUser.id);
      setCurrentUser(updatedUser);
      refreshTransactions(currentUser.id);
      setShowWithdrawModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current_user_id');
    setView('landing');
    setShowMobileSidebar(false);
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, month: 'short', day: 'numeric' });
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-900">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
         <div className="flex items-center gap-3">
           <div className="bg-amber-500 p-2 rounded-xl"><Wallet className="w-5 h-5 text-slate-900" /></div>
           <span className="font-black text-white text-lg tracking-tight uppercase">Vesta <span className="text-amber-500 italic">Pro</span></span>
         </div>
         <Button variant="ghost" size="icon" onClick={() => setShowMobileSidebar(false)}><X /></Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
         {currentUser && (
            <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 font-black uppercase">
                  {currentUser.email.charAt(0)}
                </div>
                {currentUser.isAgent && (
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-slate-950">
                    <UserCheck className="w-3 h-3" />
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1">
                  {currentUser.email}
                  {currentUser.isAgent && <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1 rounded border border-emerald-500/20">AGENT</span>}
                </div>
                <div className="text-[9px] font-mono text-slate-500">ID: {currentUser.id}</div>
              </div>
            </div>
         )}

         <nav className="space-y-1.5">
            {[
              { v: 'dashboard', i: <LayoutDashboard size={18} />, l: 'Terminal Home' },
              { v: 'trading', i: <TrendingUpDown size={18} />, l: 'Market Trading' },
              { v: 'portfolio', i: <PieChart size={18} />, l: 'Portfolio Details' },
              { v: 'history', i: <History size={18} />, l: 'Terminal Ledger' },
              { v: 'loan', i: <Banknote size={18} />, l: 'Liquidity Loan' },
              { v: 'agent', i: <Users size={18} />, l: 'Become an Agent' },
              { v: 'impact', i: <Heart size={18} />, l: 'Global Impact' },
              { v: 'forgot-password', i: <KeyRound size={18} />, l: 'Forgotten Password' }
            ].map(n => (
              <button 
                key={n.v} 
                onClick={() => navigateWithLoading(n.v as any)} 
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest text-left", 
                  view === n.v 
                    ? "bg-amber-500 text-slate-950" 
                    : "text-slate-500 hover:text-white"
                )}
              >
                {n.i} 
                {n.l}
              </button>
            ))}
            <button 
              onClick={() => { setShowContactModal(true); setShowMobileSidebar(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-widest text-slate-500 hover:text-white text-left"
            >
              <Headset size={18} />
              Contact Us
            </button>
         </nav>

         <section className="space-y-4 pt-4 border-t border-slate-800">
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-2">
              Referral Program ({currentUser?.isAgent ? '600%' : '30%'})
            </div>
            <Card className="bg-slate-950 border-slate-800">
               <CardContent className="p-4 space-y-3">
                  <p className="text-[9px] text-slate-500 uppercase leading-relaxed font-bold">
                    Earn {currentUser?.isAgent ? '600%' : '30%'} instant commissions on all network capital allocations.
                  </p>
                  <Button 
                    onClick={() => copyToClipboard("https://b9438ede.mydala.app", false)} 
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-[10px] gap-2 py-4"
                  >
                    <Copy size={12} /> Copy Link
                  </Button>
               </CardContent>
            </Card>
         </section>
      </div>

      <div className="p-6 border-t border-slate-800">
        <Button onClick={handleLogout} variant="ghost" className="w-full text-rose-500 font-black text-xs gap-3">
          <LogOut size={16} /> LOGOUT
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-amber-500/30 overflow-x-hidden pb-0">
      <Toaster position="top-center" richColors />

      {/* Official Regulatory Splash Screen */}
      <AnimatePresence>
        {view === 'splash' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] bg-[#020617] flex flex-col items-center justify-center p-6 text-center"
          >
             <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.3, 1], 
                    opacity: [0.05, 0.15, 0.05],
                    rotate: [0, 90, 180, 270, 360]
                  }} 
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }} 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-amber-500/10 to-emerald-500/10 rounded-full blur-[150px]"
                />
             </div>
             
             <div className="relative space-y-10 max-w-xl">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "backOut" }}
                  className="flex flex-col items-center gap-6"
                >
                   <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl" 
                      />
                      <div className="relative bg-slate-900 p-6 rounded-[32px] border border-amber-500/30 shadow-2xl shadow-amber-500/10">
                         <ShieldCheck className="w-20 h-20 text-amber-500" />
                      </div>
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 p-2 rounded-full border-4 border-[#020617]"
                      >
                         <Verified size={24} />
                      </motion.div>
                   </div>
                   
                   <div className="flex flex-col items-center">
                      <span className="text-amber-500 font-black tracking-[0.8em] text-[10px] uppercase mb-2">Institutional Clearance</span>
                      <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-30" />
                   </div>
                </motion.div>

                <motion.div
                   initial={{ y: 30, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.8, duration: 1 }}
                   className="space-y-8"
                >
                   <div className="space-y-4">
                      <h1 className="text-white font-black text-2xl uppercase tracking-tighter leading-tight italic drop-shadow-lg">
                        Regulatory Compliance <span className="text-amber-500">Verified</span>
                      </h1>
                      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 p-8 rounded-[40px] shadow-inner relative group">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Official Notice</div>
                        <p className="text-slate-200 font-black text-sm leading-relaxed uppercase tracking-widest">
                           <span className="text-white underline decoration-amber-500 decoration-2 underline-offset-4 font-black">VESTA PRO INVESTMENT</span> is licensed by <span className="text-amber-500">SECURITY AND EXCHANGE COMMISSION</span> and <span className="text-amber-500">FINANCIAL INDUSTRY REGULATORY AUTHORITY</span> and also approved by the <span className="text-emerald-500">government</span>, this is the <span className="text-white italic">only official</span> investment website from <span className="text-amber-500">VESTA PRO COMPANY</span>
                        </p>
                      </div>
                   </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="flex justify-center gap-6"
                >
                   {[Building2, Landmark, Gavel, Award].map((Icon, i) => (
                      <div key={i} className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-slate-600 hover:text-amber-500 transition-colors">
                         <Icon size={28} />
                      </div>
                   ))}
                </motion.div>

                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 4 }}
                   className="flex flex-col items-center gap-4 pt-6"
                >
                   <div className="flex items-center gap-2 bg-slate-900 px-6 py-2 rounded-full border border-slate-800 shadow-xl">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className="text-emerald-500 font-black text-[9px] uppercase tracking-[0.3em]">Secure Tunnel Established</span>
                   </div>
                   <p className="text-slate-600 font-mono text-[8px] uppercase tracking-[0.4em] animate-pulse italic">Synchronizing Capital Nodes...</p>
                </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Mode Overlay */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center p-8 text-center space-y-6"
          >
            <div className="bg-rose-500/10 p-6 rounded-full">
              <WifiOff className="text-rose-500 w-16 h-16 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Terminal Offline</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed">
                Your mobile data connection is disabled. Reconnect to resume high-frequency trade synchronization.
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-rose-600 hover:bg-rose-700 text-white font-black px-10 py-6 rounded-xl uppercase tracking-widest"
            >
              Retry Connection
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Loading Preview */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[5000] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <div className="relative w-32 h-32 flex items-center justify-center">
               <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }} 
                className="absolute inset-0 border-4 border-amber-500/20 border-t-amber-500 rounded-full"
               />
               <Wallet className="text-amber-500 w-10 h-10 animate-pulse" />
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-amber-500 font-black uppercase text-[10px] tracking-[0.5em] mt-8"
            >
              Accessing Quantum Node...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Activity Popups */}
      <AnimatePresence>
        {activePopup && (
          <motion.div initial={{ opacity: 0, y: -50, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0, scale: 0.9 }} className="fixed top-0 left-1/2 z-[300] w-full max-w-[280px]">
            <div className="bg-slate-900/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-3 shadow-2xl flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", activePopup.type === 'deposit' ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500")}>
                {activePopup.type === 'deposit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="overflow-hidden">
                <div className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">Live Node Activity</div>
                <div className="text-[10px] text-white truncate"><span className="font-bold text-amber-500">{activePopup.type}</span> from <span className="font-bold">{activePopup.location}</span></div>
                <div className="text-xs font-mono font-black text-amber-500">${activePopup.amount.toLocaleString()}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-[150] h-14 px-4">
        <div className="h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentUser && <Button variant="ghost" size="icon" onClick={() => setShowMobileSidebar(true)} className="p-0 h-8 w-8"><Menu size={20}/></Button>}
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setView('landing')}>
              <div className="bg-amber-500 p-1 rounded-md"><Wallet className="w-4 h-4 text-slate-900" /></div>
              <span className="text-sm font-black text-white tracking-tighter uppercase">VESTA <span className="text-amber-500 italic">PRO</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!currentUser ? (
              <Button onClick={() => setView('signup')} size="sm" className="bg-amber-500 text-slate-900 font-black text-[10px] h-8 px-4 rounded-lg uppercase">Join</Button>
            ) : (
              <div className="flex items-center gap-2" onClick={() => setShowMobileSidebar(true)}>
                <div className="flex flex-col items-end">
                   <span className="text-[7px] text-slate-500 font-black uppercase">Balance</span>
                   <span className="text-xs font-mono text-emerald-500 font-black">${(currentUser.investmentBalance ?? 0).toFixed(2)}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black uppercase text-xs">
                  {currentUser.email.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Drawer */}
      <AnimatePresence>
        {showMobileSidebar && currentUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileSidebar(false)} className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[200]" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-72 bg-slate-900 z-[210] border-r border-slate-800">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="p-4 sm:p-6 min-h-[calc(100vh-56px)]">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center text-center gap-8 py-10">
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] py-1.5 px-4 rounded-full inline-block">Elite Quantitative Rails</div>
                <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tighter">Scale Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Crypto Future</span></h1>
                <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">Secure <span className="text-white font-bold">100% Daily Yields</span> with high-frequency algorithmic trade execution.</p>
                <div className="flex flex-col gap-3 pt-6">
                  <Button size="lg" onClick={() => setView('signup')} className="w-full py-6 text-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-black rounded-xl shadow-xl shadow-amber-500/10">Initialize Account</Button>
                  <Button size="lg" variant="outline" onClick={() => setView('impact')} className="w-full py-6 text-lg border-slate-800 rounded-xl font-black uppercase tracking-widest text-xs">Learn Mission</Button>
                </div>
              </div>
            </motion.div>
          )}

          {(view === 'login' || view === 'signup') && (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 max-w-md mx-auto">
               <Card className="bg-slate-900 border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                 <div className="h-1 bg-amber-500" />
                 <CardHeader className="text-center pb-4"><CardTitle className="text-2xl font-black text-white uppercase tracking-tight">{view === 'signup' ? 'Registry' : 'Login'}</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                   <form onSubmit={(e) => { e.preventDefault(); if(view === 'signup') handleRegister(e); else handleLogin(e); }} className="space-y-4">
                     <Input type="email" placeholder="Terminal ID (Email)" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-950 border-slate-800 py-6" required />
                     <div className="relative">
                       <Input type={showPass ? 'text' : 'password'} placeholder="Security Key" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-950 border-slate-800 py-6" required />
                       <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                     </div>
                     {view === 'signup' && (
                       <>
                         <Input type={showPass ? 'text' : 'password'} placeholder="Confirm Key" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-slate-950 border-slate-800 py-6" required />
                         <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                           <div className="text-[10px] text-slate-500 font-black uppercase">Verify: {captcha.q}</div>
                           <Input type="number" placeholder="?" value={botCheckInput} onChange={(e) => setBotCheckInput(e.target.value)} className="w-16 bg-slate-900 border-slate-800 text-center font-black h-8" required />
                         </div>
                       </>
                     )}
                     
                     <div className="space-y-3">
                        {!currentUser && view === 'login' && (
                           <Button 
                             type="button" 
                             onClick={() => setView('forgot-password')} 
                             variant="ghost" 
                             className="w-full text-amber-500/70 hover:text-amber-500 text-[10px] font-black uppercase tracking-widest h-auto p-0"
                           >
                             Forgotten Password?
                           </Button>
                        )}
                        <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-6 rounded-xl uppercase tracking-widest text-xs" disabled={loading}>
                          {loading ? <Loader2 className="animate-spin" /> : view === 'signup' ? 'Create Account' : 'Access Terminal'}
                        </Button>
                     </div>
                   </form>
                   <div className="text-center"><button onClick={() => setView(view === 'signup' ? 'login' : 'signup')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest">{view === 'signup' ? 'Login' : "Register"}</button></div>
                 </CardContent>
               </Card>
             </motion.div>
          )}

          {view === 'forgot-password' && (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-6 max-w-md mx-auto">
               <Card className="bg-slate-900 border-slate-800 shadow-2xl rounded-2xl overflow-hidden">
                 <div className="h-1 bg-amber-500" />
                 <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Reset Password</CardTitle>
                    <CardDescription className="text-[10px] text-slate-500 uppercase tracking-widest">Enter credentials to update terminal access</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <form onSubmit={handleResetPassword} className="space-y-4">
                     <Input 
                        type="email" 
                        placeholder="Account Gmail" 
                        value={resetEmail} 
                        onChange={(e) => setResetEmail(e.target.value)} 
                        className="bg-slate-950 border-slate-800 py-6" 
                        required 
                     />
                     <Input 
                        type="password" 
                        placeholder="New Password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="bg-slate-950 border-slate-800 py-6" 
                        required 
                     />
                     <Input 
                        type="password" 
                        placeholder="Retype New Password" 
                        value={retypedPassword} 
                        onChange={(e) => setRetypedPassword(e.target.value)} 
                        className="bg-slate-950 border-slate-800 py-6" 
                        required 
                     />
                     <Button 
                        type="submit" 
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-6 rounded-xl uppercase tracking-widest text-xs" 
                        disabled={loading}
                     >
                        {loading ? <Loader2 className="animate-spin" /> : "Confirm Change"}
                     </Button>
                   </form>
                   <div className="text-center">
                      <button onClick={() => setView('login')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest">Return to Authenticator</button>
                   </div>
                 </CardContent>
               </Card>
             </motion.div>
          )}

          {view === 'dashboard' && currentUser && (            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card className="bg-slate-900 border-slate-800 relative overflow-hidden rounded-2xl border-l-4 border-l-amber-500">
                <CardHeader className="pb-2"><CardTitle className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Available Capital</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                   <div className="text-4xl font-black text-white tracking-tighter">${(currentUser.investmentBalance ?? 0).toFixed(2)}</div>
                   <div className="grid grid-cols-2 gap-2">
                     <Button onClick={handleSync} variant="outline" className="rounded-xl border-amber-500/20 text-amber-500 text-[10px] font-black py-4" disabled={loading}><RefreshCcw size={14} className="mr-2" /> Sync</Button>
                     <Button onClick={() => setShowWithdrawModal(true)} className="rounded-xl bg-slate-100 text-slate-950 text-[10px] font-black py-4">Withdraw</Button>
                   </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800 overflow-hidden border-t-2 border-t-blue-500 rounded-2xl shadow-xl">
                 <CardHeader className="bg-slate-950/50 p-4 border-b border-slate-800"><CardTitle className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><ArrowDownLeft size={14} /> Deposit Gateway (TRC20)</CardTitle></CardHeader>
                 <CardContent className="p-4 space-y-4">
                    {/* HIGH VISIBILITY COPY BUTTON */}
                    <div className="space-y-3">
                       <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-center">
                         <code className="text-amber-500 font-mono text-xs break-all select-all font-black">{TRON_DEPOSIT_ADDRESS}</code>
                       </div>
                       <Button 
                         onClick={() => copyToClipboard(TRON_DEPOSIT_ADDRESS)} 
                         className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-black py-8 rounded-xl shadow-lg shadow-amber-500/20 flex flex-col items-center justify-center gap-1 transition-all"
                       >
                         <Copy className="w-5 h-5" />
                         <span className="text-sm uppercase tracking-tighter">Copy Wallet Address</span>
                       </Button>
                    </div>

                    <div className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/10 flex items-start gap-3">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed italic">Payment receipt photo mandatory for synchronization.</p>
                    </div>

                    <Button onClick={() => setShowProofModal(true)} disabled={copyCount < 7} className={cn("w-full py-4 rounded-xl font-black text-xs transition-all", copyCount >= 7 ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-500 cursor-not-allowed")}>
                      {copyCount < 7 ? <LockKeyhole size={14} className="mr-2" /> : <Camera size={14} className="mr-2" />}
                      {copyCount < 7 ? `Locked: Copy Address (${7 - copyCount})` : "Confirm Deposit Proof"}
                    </Button>
                 </CardContent>
              </Card>

              <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-slate-800 pb-2"><h3 className="text-lg font-black text-white tracking-tight uppercase">Markets</h3><div className="text-[8px] text-emerald-500 font-black uppercase flex items-center gap-1"><Globe2 size={10} /> Active</div></div>
                 <div className="grid grid-cols-1 gap-2">
                   {MARKET_ASSETS.map(a => (
                     <Card key={a.id} className="bg-slate-900 border-slate-800 hover:border-amber-500/20 transition-all group cursor-pointer" onClick={() => setInvestingIn(a)}>
                       <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="bg-slate-950 p-2 rounded-lg">{a.icon}</div>
                             <div><div className="font-black text-white text-xs">{a.name}</div><div className="text-[8px] text-slate-500 uppercase font-black">{a.type}</div></div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div className="text-[10px] font-black text-emerald-500">{a.rise}</div>
                            <Button size="sm" className="bg-slate-950 border border-slate-800 hover:bg-amber-500 hover:text-slate-900 text-[10px] font-black h-8 px-4">Invest</Button>
                          </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
              </div>
            </motion.div>
          )}

          {view === 'trading' && currentUser && (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                   <Button variant="ghost" onClick={() => setView('dashboard')} className="p-0 h-8 w-8"><ChevronLeft /></Button>
                   <h2 className="text-lg font-black text-white uppercase tracking-tighter">BTC Prediction Trading</h2>
                   <div className="w-8 h-8" />
                </div>

                <Card className="bg-slate-950 border-slate-800 overflow-hidden rounded-2xl shadow-inner">
                   <div className="p-8 text-center space-y-4">
                      <div className="flex justify-center mb-2"><div className="bg-orange-500/10 p-4 rounded-full text-orange-400"><Bitcoin size={48} /></div></div>
                      <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">BTC / USDT PRICE</div>
                      <div className={cn("text-4xl font-mono font-black tracking-tighter transition-colors", isBtcUp ? "text-emerald-500" : "text-rose-500")}>
                        ${btcPrice.toFixed(2)}
                      </div>
                      <div className={cn("flex items-center justify-center gap-1 text-[10px] font-bold", isBtcUp ? "text-emerald-500" : "text-rose-500")}>
                         {isBtcUp ? <ArrowBigUp size={14} fill="currentColor"/> : <ArrowBigDown size={14} fill="currentColor"/>}
                         {isBtcUp ? "MARKET BULLISH" : "MARKET BEARISH"}
                      </div>
                   </div>
                </Card>

                <div className="space-y-4 pt-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Trade Stake (USDT)</label>
                      <Input type="number" placeholder="Min $200" value={tradeAmount} onChange={e => setTradeAmount(e.target.value)} className="bg-slate-900 border-slate-800 py-8 text-center text-2xl font-black rounded-2xl" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <Button onClick={() => handleTrade('up')} className="bg-emerald-600 hover:bg-emerald-700 py-10 rounded-2xl shadow-xl shadow-emerald-500/10 font-black flex flex-col gap-1 active:scale-95 transition-all">
                        <ArrowBigUp size={32} fill="white" />
                        <span className="text-sm tracking-widest">UP (LONG)</span>
                      </Button>
                      <Button onClick={() => handleTrade('down')} className="bg-rose-600 hover:bg-rose-700 py-10 rounded-2xl shadow-xl shadow-rose-500/10 font-black flex flex-col gap-1 active:scale-95 transition-all">
                        <ArrowBigDown size={32} fill="white" />
                        <span className="text-sm tracking-widest">DOWN (SHORT)</span>
                      </Button>
                   </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                   <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                   <p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed">System Rule: Correct predictions yield 2x stake. Incorrect predictions result in total stake loss. Required balance: $200+.</p>
                </div>
             </motion.div>
          )}

          {view === 'loan' && currentUser && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4"><Button variant="ghost" onClick={() => setView('dashboard')} className="p-0 h-8 w-8"><ChevronLeft /></Button><h2 className="text-lg font-black text-white uppercase tracking-tighter">Liquidity Loan</h2><div className="w-8 h-8" /></div>
                
                <Card className="bg-slate-900 border-slate-800 overflow-hidden rounded-2xl relative">
                   <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                   <CardHeader className="text-center p-8 space-y-2">
                      <div className="bg-amber-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"><Banknote className="w-8 h-8 text-amber-500" /></div>
                      <CardTitle className="text-4xl font-black text-white tracking-tighter">$87,500.00</CardTitle>
                      <CardDescription className="text-xs font-black text-slate-500 uppercase tracking-widest">Instant Terminal Liquidity</CardDescription>
                   </CardHeader>
                   <CardContent className="p-6 space-y-6 bg-slate-950/50">
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase"><span className="text-slate-500">Eligibility Deposit</span><span className="text-amber-500">$5,000.00</span></div>
                         <div className="flex justify-between items-center text-[10px] font-black uppercase"><span className="text-slate-500">Total Deposited</span><span className="text-white">${currentUser.totalDeposited.toFixed(2)}</span></div>
                         <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div className="h-full bg-amber-500" style={{ width: `${Math.min((currentUser.totalDeposited / 5000) * 100, 100)}%` }} />
                         </div>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase text-center italic">"Deposit a minimum of $5,000 to unlock your $87,500 Liquidity Loan instantly."</p>
                      <Button 
                        onClick={handleRequestLoan} 
                        disabled={currentUser.totalDeposited < 5000 || currentUser.hasActiveLoan}
                        className={cn("w-full py-8 rounded-2xl font-black text-lg uppercase transition-all shadow-xl", (currentUser.totalDeposited >= 5000 && !currentUser.hasActiveLoan) ? "bg-amber-500 text-slate-900" : "bg-slate-800 text-slate-500 grayscale cursor-not-allowed")}
                      >
                         Request Loan Approval
                      </Button>
                   </CardContent>
                </Card>
             </motion.div>
          )}

          {view === 'agent' && currentUser && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4"><Button variant="ghost" onClick={() => setView('dashboard')} className="p-0 h-8 w-8"><ChevronLeft /></Button><h2 className="text-lg font-black text-white uppercase tracking-tighter">Become an Agent</h2><div className="w-8 h-8" /></div>
                
                <Card className="bg-slate-900 border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                   <div className="h-1 bg-emerald-500" />
                   <CardContent className="p-6 space-y-8">
                      <div className="text-center space-y-3">
                         <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto"><BadgeCheck className="w-8 h-8 text-emerald-500" /></div>
                         <h3 className="text-xl font-black text-white uppercase tracking-tighter">ELITE AGENT STATUS</h3>
                         <div className="bg-emerald-500/10 border border-emerald-500/20 py-2 px-4 rounded-xl inline-block">
                           <span className="text-emerald-500 font-black text-lg tracking-widest">600% COMMISSIONS</span>
                         </div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-widest">Receive 600% of any amount of any person you refer directly to the protocol.</p>
                      </div>

                      <div className="space-y-6 border-t border-slate-800 pt-6">
                         <div className="space-y-2">
                           <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-2">AGENT UPGRADE FEE: $700</div>
                           <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                             <code className="text-amber-500 font-mono text-[10px] break-all select-all font-black">{TRON_DEPOSIT_ADDRESS}</code>
                             <Button variant="ghost" size="icon" onClick={() => copyToClipboard(TRON_DEPOSIT_ADDRESS)}><Copy size={16} /></Button>
                           </div>
                         </div>

                         <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                            <p className="text-[9px] text-slate-500 font-black uppercase text-center italic">"Deposit $700 to the wallet address above and upload proof to initialize your Agent Profile."</p>
                            <Button 
                              onClick={() => setShowProofModal(true)} 
                              disabled={currentUser.isAgent}
                              className={cn(
                                "w-full py-6 rounded-xl text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 font-black transition-all",
                                currentUser.isAgent 
                                  ? "bg-slate-800 text-slate-500 cursor-not-allowed grayscale" 
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              )}
                            >
                               {currentUser.isAgent ? "Upgrade Completed" : "Initialize Upgrade"}
                            </Button>
                         </div>
                      </div>
                   </CardContent>
                </Card>
             </motion.div>
          )}

          {view === 'portfolio' && currentUser && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <Button variant="ghost" onClick={() => setView('dashboard')} className="p-0 h-8 w-8"><ChevronLeft /></Button>
                  <h2 className="text-lg font-black text-white uppercase tracking-tighter">Quant Portfolio</h2>
                  <div className="w-8 h-8" />
               </div>
               <div className="grid grid-cols-1 gap-4">
                  {(currentUser.investments ?? []).length === 0 ? (
                    <div className="border-4 border-dashed border-slate-800 rounded-3xl p-16 text-center space-y-4 bg-slate-900/50">
                       <PieChart className="w-12 h-12 text-slate-800 mx-auto" />
                       <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No Active Yield-Generating Allocations.</p>
                       <Button onClick={() => setView('dashboard')} size="sm" className="bg-amber-500 text-slate-900 font-black">Browse Markets</Button>
                    </div>
                  ) : (
                    (currentUser.investments ?? []).map(inv => (
                      <Card key={inv.id} className="bg-slate-900 border-slate-800 overflow-hidden shadow-xl group">
                        <div className="h-1.5 bg-emerald-500" />
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg font-black text-white tracking-tight">{inv.assetName}</CardTitle>
                                <CardDescription className="text-[8px] uppercase font-black text-slate-500 flex items-center gap-1">Secured Node: {inv.id}</CardDescription>
                            </div>
                            <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg"><TrendingUp size={16} /></div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-2">
                            <div className="flex justify-between items-end border-b border-slate-800 pb-4">
                              <div><div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Capital</div><div className="text-2xl font-black text-white tracking-tighter">${inv.amount.toLocaleString()}</div></div>
                              <div className="text-right"><div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Daily</div><div className="text-xl font-black text-emerald-500">+100%</div></div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-500">Goal</span><span className="text-white">${inv.targetReturn.toFixed(2)}</span></div>
                              <div className="flex justify-between text-[10px] font-black uppercase"><span className="text-slate-500">Earned</span><span className="text-emerald-500">${inv.earnedSoFar.toFixed(2)}</span></div>
                              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((inv.earnedSoFar / inv.targetReturn) * 100, 100)}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
                              </div>
                            </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
               </div>
            </motion.div>
          )}

          {view === 'history' && currentUser && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
               <div className="flex items-center justify-between border-b border-slate-800 pb-4"><Button variant="ghost" onClick={() => setView('dashboard')} className="p-0 h-8 w-8"><ChevronLeft /></Button><h2 className="text-lg font-black text-white uppercase tracking-tighter">Terminal Ledger</h2><div className="w-8 h-8" /></div>
               <Card className="bg-slate-900 border-slate-800 overflow-hidden shadow-2xl rounded-2xl">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        {transactions.length === 0 ? (
                           <TableRow><TableCell className="text-center py-20 text-[10px] font-black text-slate-700 uppercase italic">No activity logs found.</TableCell></TableRow>
                        ) : (
                          transactions.map(tx => (
                            <TableRow key={tx.id} className="border-slate-800 h-20">
                              <TableCell className="px-4"><div className="flex items-center gap-3"><div className={cn("w-2 h-2 rounded-full shadow-lg", tx.type === 'deposit' || tx.type === 'roi' || tx.type === 'trade_win' || tx.type === 'loan' ? "bg-emerald-500" : "bg-rose-500")} /><div className="font-black text-white capitalize text-xs">{tx.type.replace('_', ' ')}</div></div></TableCell>
                              <TableCell className={cn("font-mono font-black text-right text-base px-6 tracking-tighter", tx.type === 'withdrawal' || tx.type === 'investment' || tx.type === 'trade_loss' ? "text-rose-500" : "text-emerald-500")}>{tx.type === 'withdrawal' || tx.type === 'investment' || tx.type === 'trade_loss' ? '-' : '+'}${(tx.amount ?? 0).toFixed(2)}</TableCell>
                              <TableCell className="text-right font-mono text-[8px] font-black text-slate-500 px-4 leading-tight">{formatDateTime(tx.timestamp)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
               </Card>
            </motion.div>
          )}

          {view === 'impact' && (
             <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 py-4">
               <div className="flex items-center gap-4"><Button variant="ghost" onClick={() => setView('landing')} className="p-0 h-8 w-8"><ChevronLeft /></Button><h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Global Impact</h2></div>
               <div className="space-y-6">
                 <div className="space-y-4">
                   <h3 className="text-5xl font-black text-white leading-none tracking-tighter">POSITIVE <br/><span className="text-emerald-500">TRANSFORMATION.</span></h3>
                   <p className="text-slate-400 text-sm leading-relaxed">Vesta Pro redefines financial quantitative efficiency by integrating global social responsibility. Investing in VESTA PRO is an investment in global progress.</p>
                 </div>
                 
                 <div className="space-y-4">
                    {[
                      { icon: <Globe className="text-blue-500" />, title: "FINANCIAL INCLUSION", desc: "Providing decentralized banking rails to 15+ emerging economies." },
                      { icon: <Trees className="text-emerald-500" />, title: "CARBON OFFSET", desc: "5% of every transaction automates carbon neutrality projects." },
                      { icon: <GraduationCap className="text-violet-500" />, title: "VESTA ACADEMY", desc: "Free financial education for underserved populations." },
                      { icon: <Heart className="text-rose-500" />, title: "CHARITY PLEDGE", desc: "1% of total profit donated to clean water initiatives." }
                    ].map((item, i) => (
                      <Card key={i} className="bg-slate-900 border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5">{item.icon}</div>
                        <div className="flex items-center gap-4 mb-4">
                           <div className="bg-slate-950 p-2 rounded-lg">{item.icon}</div>
                           <h4 className="font-black text-white text-sm uppercase tracking-widest">{item.title}</h4>
                        </div>
                        <p className="text-slate-500 text-xs font-bold uppercase leading-relaxed tracking-widest italic">{item.desc}</p>
                      </Card>
                    ))}
                 </div>

                 <Card className="bg-amber-500 text-slate-950 p-8 rounded-[32px] shadow-2xl shadow-amber-500/20 text-center space-y-4">
                    <h4 className="text-2xl font-black uppercase tracking-tighter">BECOME THE CATALYST</h4>
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Invite others to join the quantum future and expand our global impact today.</p>
                    <Button onClick={() => copyToClipboard("https://b9438ede.mydala.app", false)} className="w-full bg-slate-950 text-white font-black py-8 rounded-2xl uppercase tracking-widest text-xs border-b-4 border-black active:border-b-0">Copy Referral Invite</Button>
                 </Card>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* INSTITUTIONAL TRUST & REGULATORY SECTION */}
      <section className="bg-slate-900/80 border-t border-slate-800 px-6 py-12 space-y-12"> 
        <div className="max-w-md mx-auto space-y-8">
           <div className="text-center space-y-2">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Strategic Global Partners</div>
             <h4 className="text-white text-lg font-black uppercase tracking-tighter">Supported by Financial Institutions</h4>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-3 group hover:border-amber-500/30 transition-all">
                 <Building2 className="text-slate-500 group-hover:text-amber-500 transition-colors" size={24} />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Global Trust Bank</span>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-3 group hover:border-amber-500/30 transition-all">
                 <Landmark className="text-slate-500 group-hover:text-amber-500 transition-colors" size={24} />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Federal Reserve Network</span>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-3 group hover:border-amber-500/30 transition-all">
                 <Globe className="text-slate-500 group-hover:text-amber-500 transition-colors" size={24} />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">World Quant Org</span>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 flex flex-col items-center gap-3 group hover:border-amber-500/30 transition-all">
                 <Activity className="text-slate-500 group-hover:text-amber-500 transition-colors" size={24} />
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">DeFi Alliance</span>
              </div>
           </div>

           <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20"><ShieldCheck className="text-slate-900" size={20} /></div>
                 <div>
                    <h5 className="text-white text-xs font-black uppercase tracking-widest">Government Approved</h5>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Regulatory Compliance Node Active</p>
                 </div>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed tracking-widest italic">
                VESTA PRO INVESTMENT is a government-authorized algorithmic trading entity. Verified by federal financial conduct authorities for secure retail distribution.
              </p>
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
                   <Verified className="text-blue-500" size={14} />
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Authorized Site v4.2</span>
                </div>
              </div>
           </div>
        </div>
      </section>

      <footer className="py-16 border-t border-slate-800 bg-slate-950/80 px-8"> 
        <div className="max-w-md mx-auto space-y-12">
          <div className="space-y-6 text-center">
             <div className="flex items-center justify-center gap-3 font-black text-2xl text-white tracking-tighter uppercase italic">VESTA <span className="text-amber-500">PRO</span></div>
             <p className="text-[10px] text-slate-600 leading-relaxed font-bold uppercase tracking-[0.2em]">The global standard for quantitative terminal infrastructure. Professional-grade assets for sovereign clients.</p>
             <div className="flex justify-center gap-6 text-[8px] font-black text-slate-700 uppercase tracking-[0.3em]"><span>LATENCY: 14MS</span><span>NODES: 2,048</span></div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-center border-t border-slate-900 pt-8">
             <div className="space-y-4">
               <div className="font-black text-white text-[9px] uppercase tracking-[0.4em] opacity-30">Legal</div>
               <ul className="space-y-2 text-[8px] font-black text-slate-600 uppercase tracking-widest"><li>Terms of Protocol</li><li>Risk Disclosure</li></ul>
             </div>
             <div className="space-y-4">
               <div className="font-black text-white text-[9px] uppercase tracking-[0.4em] opacity-30">Integrity</div>
               <div className="flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">MAINNET_UP</span></div>
             </div>
          </div>
          <p className="text-[8px] text-slate-700 font-bold uppercase tracking-[0.2em] italic text-center">© 2026 VESTA TERMINAL SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Shared Modals with Mobile Enhancements */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl">
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-slate-900 border border-slate-800 rounded-[48px] shadow-2xl w-full max-w-sm overflow-hidden relative border-t-8 border-t-amber-500">
                <div className="p-8 text-center space-y-6">
                   <div className="bg-amber-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                      <Headset className="text-amber-500 w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Contact Support</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Official Terminal Communication Channel</p>
                   </div>
                   <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
                      <div className="flex items-center justify-center gap-3 text-amber-500">
                         <Mail size={18} />
                         <span className="font-mono text-sm font-black break-all">saftdobrasil@gmail.com</span>
                      </div>
                      <Button onClick={() => copyToClipboard("saftdobrasil@gmail.com", false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest border border-slate-800">
                         Copy Email Address
                      </Button>
                   </div>
                   <Button onClick={() => setShowContactModal(false)} variant="ghost" className="text-slate-500 hover:text-white uppercase tracking-[0.3em] text-[10px] font-black">
                      Close Terminal
                   </Button>
                </div>
             </motion.div>
          </div>
        )}

        {showWithdrawModal && (
          <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-[32px] sm:rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative">
               <div className="p-8 border-b border-slate-800 flex justify-between items-center"><div><h3 className="text-xl font-black text-white tracking-tighter uppercase">Liquidation</h3><p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1">Smart Contract Authorization</p></div><Button variant="ghost" size="icon" onClick={() => setShowWithdrawModal(false)}><X /></Button></div>
               <form onSubmit={handleWithdraw} className="p-8 space-y-6">
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Destination Gateway (TRC20)</label><Input placeholder="T-ADDRESS" value={withdrawAddress} onChange={e => setWithdrawAddress(e.target.value)} className="bg-slate-950 border-slate-800 py-6 font-mono text-sm" required /></div>
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Amount (USDT)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" /><Input type="number" placeholder="0.00" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} className="bg-slate-950 border-slate-800 py-6 pl-10 font-mono text-xl font-black" required /></div><p className="text-[8px] font-black text-slate-700 text-right uppercase italic pr-4">Limit: ${(currentUser?.investmentBalance ?? 0).toFixed(2)}</p></div>
                  <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-8 rounded-2xl shadow-xl text-sm uppercase tracking-widest" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Authorize Payout"}</Button>
               </form>
            </motion.div>
          </div>
        )}

        {showProofModal && (
          <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-[32px] sm:rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative">
               <div className="p-8 border-b border-slate-800 flex justify-between items-center"><div><h3 className="text-xl font-black text-white tracking-tighter uppercase">Verify Proof</h3><p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1 italic">Neural Recognition Engine</p></div><Button variant="ghost" size="icon" onClick={() => setShowProofModal(false)}><X /></Button></div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Exact Amount (USDT)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" /><Input type="number" placeholder="Enter amount sent" value={depositAmountInput} onChange={e => setDepositAmountInput(e.target.value)} className="bg-slate-950 border-slate-800 py-6 pl-10 font-mono text-xl font-black" /></div></div>
                  {!previewUrl ? (
                    <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 transition-all cursor-pointer bg-slate-950 relative overflow-hidden">
                       <Upload className="w-8 h-8 text-slate-700 relative z-10" />
                       <div className="text-center relative z-10">
                         <p className="font-black text-white text-sm uppercase">Upload Photo</p>
                         <p className="text-[8px] text-slate-600 uppercase font-black mt-1">Payment Receipt Required</p>
                       </div>
                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => setPreviewUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }} /></div>
                  ) : (
                    <div className="relative h-48 rounded-2xl overflow-hidden border-2 border-slate-800 bg-slate-950 group">
                       <img src={previewUrl} className="w-full h-full object-contain" alt="Proof Preview" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Button variant="ghost" onClick={() => {setPreviewUrl(null); setSelectedFile(null);}} className="text-white text-xs bg-rose-600 px-4 py-2 rounded-lg">REMOVE</Button></div>
                       {isScanning && <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-md flex flex-col items-center justify-center space-y-3"><Scan className="w-10 h-10 text-blue-400 animate-pulse" /><p className="font-black text-blue-400 uppercase text-[8px] tracking-widest animate-pulse">Running Neural Scan...</p></div>}
                    </div>
                  )}
                  <Button onClick={handleConfirmProof} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-2xl shadow-xl text-sm uppercase tracking-widest border-b-4 border-blue-900 active:border-b-0 transition-all" disabled={!selectedFile || isScanning || !depositAmountInput}>{isScanning ? <Loader2 className="animate-spin" /> : "Verify and Allocate"}</Button>
               </div>
            </motion.div>
          </div>
        )}

        {investingIn && (
          <div className="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-slate-900 border-t sm:border border-slate-800 rounded-t-[32px] sm:rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden relative">
               <div className="p-6 border-b border-slate-800 flex items-center gap-4 bg-slate-950/50">
                  <div className="bg-amber-500 p-2 rounded-lg text-slate-900 shadow-lg">{investingIn.icon}</div>
                  <div><h3 className="text-lg font-black text-white tracking-tighter uppercase">Market Entry</h3><p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest italic">Asset: {investingIn.name}</p></div>
               </div>
               <div className="p-8 space-y-6">
                  <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Allocation (USDT)</label><div className="relative"><DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" /><Input type="number" value={investAmount} onChange={e => setInvestAmount(e.target.value)} className="bg-slate-950 border-slate-800 py-6 pl-10 font-mono text-xl font-black text-amber-500" placeholder="Min $200" /></div></div>
                  <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex items-start gap-4">
                    <TrendingUp size={24} className="text-emerald-500 shrink-0 mt-1" />
                    <div><h4 className="text-white text-[10px] font-black uppercase tracking-widest">Aggressive Node</h4><p className="text-[9px] text-slate-500 font-bold uppercase leading-relaxed italic">Engine optimized at 100% daily yield.</p></div>
                  </div>
                  <div className="flex gap-4 pt-2"><Button variant="outline" className="flex-1 rounded-xl font-black py-6 uppercase tracking-widest text-[10px]" onClick={() => setInvestingIn(null)}>Cancel</Button><Button onClick={handleInvest} className="flex-1 bg-amber-500 text-slate-950 font-black py-6 rounded-xl shadow-xl shadow-amber-500/10 text-xs uppercase tracking-widest border-b-4 border-amber-800 active:border-b-0" disabled={loading || !investAmount}>Execute</Button></div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;