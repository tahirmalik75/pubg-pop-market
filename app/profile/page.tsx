'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Smartphone,
    Settings,
    ShoppingBag,
    LogOut,
    HelpCircle,
    ChevronRight,
    Edit3,
    Check,
    X,
    Package,
    Calendar,
    CreditCard,
    Zap,
    Loader2,
    ArrowLeft,
    LifeBuoy,
    MessageSquare,
    Mail,
    Smartphone as PhoneIcon
} from 'lucide-react';
import Link from 'next/link';
import SupportModal from '@/components/SupportModal';

interface Order {
    _id: string;
    cardId: { title: string } | null;
    amount: number;
    quantity: number;
    status: 'pending' | 'paid' | 'confirmed';
    createdAt: string;
    transactionId: string;
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', phone: '' });
    const [updating, setUpdating] = useState(false);

    // Support Modal State
    const [showSupport, setShowSupport] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (session?.user) {
            setEditData({
                name: session.user.name || '',
                phone: (session.user as any).phone || '',
            });
            fetchOrders();
        }
    }, [status, session]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders');
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const res = await fetch('/api/user/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (res.ok) {
                await update({ ...session, user: { ...session?.user, name: editData.name, phone: editData.phone } });
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Update failed');
        } finally {
            setUpdating(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="text-blue-500 animate-spin" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
            {/* Background Neon */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-1/2 h-1/2 bg-blue-600 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-blue-900 rounded-full blur-[150px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <ArrowLeft size={20} className="text-gray-400 group-hover:-translate-x-1 group-hover:text-blue-500 transition-all" />
                        <span className="text-sm font-black uppercase tracking-widest text-gray-500 group-hover:text-blue-400 transition-all">Back to Market</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Zap className="text-blue-500" fill="currentColor" size={18} />
                        <span className="font-black italic uppercase tracking-tighter">Player <span className="text-blue-500">Hub</span></span>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">

                    {/* Sidebar / Profile Card */}
                    <aside className="space-y-8">
                        <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 p-1 mb-6 rotate-3 group-hover:rotate-0 transition-transform">
                                    <div className="w-full h-full bg-[#111] rounded-[22px] flex items-center justify-center overflow-hidden">
                                        <User size={48} className="text-blue-500" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-center line-clamp-1">{session?.user?.name}</h2>
                                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Verified Player</p>

                                <nav className="w-full space-y-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                    >
                                        <Settings size={18} /> Settings
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-gray-400'}`}
                                    >
                                        <ShoppingBag size={18} /> My Orders
                                    </button>
                                    <button
                                        onClick={() => setShowSupport(true)}
                                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/5 text-gray-400 transition-all border border-dashed border-white/10 mt-4"
                                    >
                                        <LifeBuoy size={18} /> Support
                                    </button>
                                </nav>

                                <div className="w-full pt-8 mt-8 border-t border-white/5">
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] text-red-500 hover:bg-red-500/10 transition-all italic border border-red-500/20"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="space-y-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' ? (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                        <div>
                                            <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Account <span className="text-blue-500 text-glow">Settings</span></h1>
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Manage your identity in the market</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#0f0f0f] border border-white/5 rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-2xl">
                                        <div className="flex justify-between items-center mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                                    <User size={24} />
                                                </div>
                                                <h3 className="text-xl font-black uppercase italic tracking-tight">Basic Information</h3>
                                            </div>
                                            {!isEditing && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                                >
                                                    <Edit3 size={14} /> Edit Profile
                                                </button>
                                            )}
                                        </div>

                                        {isEditing ? (
                                            <form onSubmit={handleUpdateProfile} className="space-y-8 max-w-lg">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Display Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                                                        value={editData.name}
                                                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                                                        value={editData.phone}
                                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex gap-4 pt-4">
                                                    <button
                                                        type="submit"
                                                        disabled={updating}
                                                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20"
                                                    >
                                                        {updating ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Keep Changes</>}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsEditing(false);
                                                            setEditData({ name: session?.user?.name || '', phone: (session?.user as any).phone || '' });
                                                        }}
                                                        className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Full Name</p>
                                                    <p className="text-lg font-black uppercase italic">{session?.user?.name}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Phone Number</p>
                                                    <p className="text-lg font-black italic">{(session?.user as any).phone || 'N/A'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Account ID</p>
                                                    <p className="text-xs font-mono text-blue-500">{(session?.user as any).id}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Member Since</p>
                                                    <p className="text-lg font-black italic">March 2026</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats / Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-[30px] p-6 space-y-4">
                                            <Package size={24} className="text-blue-500" />
                                            <div>
                                                <p className="text-3xl font-black italic">{orders.length}</p>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Orders</p>
                                            </div>
                                        </div>
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-[30px] p-6 space-y-4">
                                            <CreditCard size={24} className="text-green-500" />
                                            <div>
                                                <p className="text-3xl font-black italic">PKR {orders.reduce((acc, o) => acc + o.amount, 0).toLocaleString()}</p>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Spent</p>
                                            </div>
                                        </div>
                                        <div className="bg-[#0f0f0f] border border-white/5 rounded-[30px] p-6 space-y-4">
                                            <LifeBuoy size={24} className="text-purple-500" />
                                            <div>
                                                <p className="text-3xl font-black italic">Elite</p>
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Player Status</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter">Order <span className="text-blue-500 text-glow">History</span></h1>
                                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Track your popularity powerups</p>
                                    </div>

                                    <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-white/5">
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Order & Date</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Item</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Amount</th>
                                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {loadingOrders ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                                <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" />
                                                                <p className="text-xs font-black uppercase tracking-widest text-gray-600">Loading your history...</p>
                                                            </td>
                                                        </tr>
                                                    ) : orders.length === 0 ? (
                                                        <tr>
                                                            <td colSpan={4} className="px-8 py-20 text-center">
                                                                <ShoppingBag size={32} className="text-gray-800 mx-auto mb-4" />
                                                                <p className="text-xs font-black uppercase tracking-widest text-gray-600">No orders found yet</p>
                                                                <Link href="/" className="inline-block mt-4 text-blue-500 text-[10px] font-black uppercase italic underline underline-offset-4">Browse Deals</Link>
                                                            </td>
                                                        </tr>
                                                    ) : orders.map(order => (
                                                        <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                                            <td className="px-8 py-6">
                                                                <div className="flex flex-col">
                                                                    <span className="text-xs font-mono text-gray-400 group-hover:text-blue-500 transition-colors uppercase">#{order.transactionId.slice(-8)}</span>
                                                                    <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1 mt-1">
                                                                        <Calendar size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <span className="text-sm font-black uppercase italic tracking-tight">{order.cardId?.title || 'Unknown Item'}</span>
                                                                {order.quantity > 1 && <span className="ml-2 text-[10px] bg-blue-600/10 text-blue-500 px-1.5 py-0.5 rounded font-black">X{order.quantity}</span>}
                                                            </td>
                                                            <td className="px-8 py-6 text-center">
                                                                <span className="text-sm font-black italic">PKR {order.amount.toLocaleString()}</span>
                                                            </td>
                                                            <td className="px-8 py-6 text-right">
                                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${order.status === 'confirmed' ? 'bg-green-600/10 text-green-500 border-green-500/20 shadow-lg shadow-green-500/5' :
                                                                    order.status === 'paid' ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' :
                                                                        'bg-yellow-600/10 text-yellow-500 border-yellow-500/20'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Support Modal */}
            <SupportModal
                isOpen={showSupport}
                onClose={() => setShowSupport(false)}
                userSession={session}
            />

            <style jsx global>{`
        .text-glow { text-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
      `}</style>
        </div>
    );
}
