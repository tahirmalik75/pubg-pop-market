'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingBag,
    Settings,
    MessageSquare,
    LogOut,
    Menu,
    X,
    User,
    Package,
    ShieldCheck
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const navLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Manage Cards', href: '/dashboard/cards', icon: Package },
        { name: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
        { name: 'Payment Settings', href: '/dashboard/payment-settings', icon: Settings },
        { name: 'Support Tickets', href: '/dashboard/support', icon: MessageSquare },
    ];

    return (
        <div className="flex h-screen bg-black text-white font-sans selection:bg-blue-600/30">
            {/* Sidebar Mobile Toggle */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-[100] p-4 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-600/40 text-white"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-[120] w-72 bg-gray-950 border-r border-white/5 transition-transform duration-500 ease-out transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:static lg:inset-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <Link
                        href="https://www.instagram.com/dream.devx?igsh=ZDdsOXM2emMyM2Ux"
                        target="_blank"
                        className="flex items-center gap-3 px-8 h-20 border-b border-white/5 bg-black/20 group hover:bg-black/40 transition-all duration-500"
                    >
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
                            <ShieldCheck size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-black uppercase italic tracking-tighter text-blue-500 group-hover:text-white transition-colors duration-300">
                            DREAM.<span className="text-white group-hover:text-blue-500 transition-colors duration-300">DEVX</span>
                        </span>
                        <div className="lg:hidden ml-auto text-gray-500">
                            <X size={20} onClick={(e) => { e.preventDefault(); setIsSidebarOpen(false); }} />
                        </div>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
                        <p className="px-4 text-[10px] font-black uppercase text-gray-600 tracking-widest mb-4">Management</p>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                                        ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Icon size={20} className={isActive ? 'text-white' : 'group-hover:text-blue-500 transition-colors'} />
                                    <span className="font-bold text-sm tracking-tight">{link.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer / User */}
                    <div className="p-4 bg-black/20 border-t border-white/5">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                                <User size={20} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold truncate">{session?.user?.name || 'Admin'}</span>
                                <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Super Admin</span>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
                        >
                            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-bold text-sm uppercase tracking-widest">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-gray-950">
                {/* Top Desktop Bar */}
                <header className="hidden lg:flex items-center justify-between h-20 px-10 bg-black/20 border-b border-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">Admin Ahmad Malik</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-xs font-bold uppercase tracking-widest">System Live</span>
                            </div>
                            <span className="text-[10px] font-medium text-gray-600">Latency: 24ms</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-10 custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.5); }
            `}</style>
        </div>
    );
}
