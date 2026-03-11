"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    Phone,
    User,
    Calendar,
    Trash2,
    CheckCircle,
    Clock,
    Search,
    Loader2,
    RefreshCw,
    ChevronRight,
    ExternalLink
} from 'lucide-react';

interface Ticket {
    _id: string;
    name: string;
    phone: string;
    subject: string;
    message: string;
    status: 'open' | 'in-progress' | 'resolved' | 'closed';
    createdAt: string;
    userId?: {
        name: string;
        phone: string;
    };
}

export default function AdminSupport() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/support');
            const data = await res.json();
            if (Array.isArray(data)) setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        setUpdatingId(id);
        try {
            const res = await fetch('/api/admin/support', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            const data = await res.json();
            if (data.success) {
                setTickets(tickets.map(t => t._id === id ? { ...t, status: status as any } : t));
            }
        } catch (error) {
            console.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const deleteTicket = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ticket?')) return;

        try {
            const res = await fetch(`/api/admin/support?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setTickets(tickets.filter(t => t._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete ticket');
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch =
            ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.phone.includes(searchTerm) ||
            ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'in-progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-8 p-4 lg:p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                        Support <span className="text-blue-500">Tickets</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Manage customer inquiries and help requests
                    </p>
                </div>

                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl transition-all font-black uppercase italic text-xs tracking-widest"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </header>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, phone or subject..."
                        className="w-full bg-gray-900 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500/50 transition-all font-bold text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 p-1.5 bg-gray-900 border border-white/10 rounded-2xl">
                    {['all', 'open', 'resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${filterStatus === status
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                </div>
            ) : filteredTickets.length === 0 ? (
                <div className="bg-gray-900 border border-dashed border-white/10 rounded-[40px] p-20 text-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                        <MessageSquare size={40} />
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">No tickets found</h3>
                    <p className="text-gray-500 font-medium tracking-tight">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                        {filteredTickets.map((ticket, index) => (
                            <motion.div
                                key={ticket._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-900 border border-white/10 rounded-[32px] overflow-hidden group hover:border-blue-500/30 transition-all"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status}
                                                </span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {new Date(ticket.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black italic tracking-tighter text-white group-hover:text-blue-400 transition-colors">
                                                {ticket.subject}
                                            </h3>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {ticket.status !== 'resolved' && (
                                                <button
                                                    onClick={() => updateStatus(ticket._id, 'resolved')}
                                                    disabled={updatingId === ticket._id}
                                                    className="p-4 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-2xl transition-all shadow-lg shadow-green-500/10 flex items-center gap-2 font-black uppercase italic text-[10px] tracking-widest disabled:opacity-50"
                                                >
                                                    {updatingId === ticket._id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                                    Mark Resolved
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteTicket(ticket._id)}
                                                className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-lg shadow-red-500/10"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-1 space-y-6">
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Customer Info</p>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500">
                                                            <User size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase text-gray-400 leading-none">Name</p>
                                                            <p className="text-sm font-bold text-white mt-1 italic tracking-tight">{ticket.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500">
                                                            <Phone size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black uppercase text-gray-400 leading-none">Phone</p>
                                                            <a href={`tel:${ticket.phone}`} className="text-sm font-bold text-white mt-1 italic tracking-tight hover:text-blue-400 underline decoration-blue-500/30">
                                                                {ticket.phone}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <a
                                                href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-black uppercase italic tracking-widest py-4 rounded-2xl shadow-xl shadow-green-500/10 transition-all font-bold group"
                                            >
                                                Reply on WhatsApp
                                                <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        </div>

                                        <div className="lg:col-span-2">
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 h-full">
                                                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-4">Message Details</p>
                                                <div className="prose prose-invert max-w-none">
                                                    <p className="text-gray-300 font-medium leading-relaxed whitespace-pre-wrap italic tracking-tight">
                                                        "{ticket.message}"
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
