"use client"

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Calendar,
    User,
    CreditCard,
    ExternalLink,
    ChevronRight,
    ChevronLeft,
    X,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';

interface Order {
    _id: string;
    userId: { name: string; phone: string };
    cardId: { title: string };
    amount: number;
    status: 'pending' | 'paid' | 'confirmed' | 'rejected';
    createdAt: string;
    transactionId: string;
    paymentProof: string;
}

const STATUS_FILTERS = ['All', 'pending', 'paid', 'confirmed', 'rejected'];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/orders');
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                setError('Received invalid data format from server');
            }
        } catch (err: any) {
            console.error('Fetch orders error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        return orders.filter(order => {
            const matchesSearch =
                order?._id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                order?.userId?.phone?.includes(searchQuery) ||
                order?.userId?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                order?.transactionId?.toLowerCase()?.includes(searchQuery?.toLowerCase());
            const matchesStatus = statusFilter === 'All' || order?.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const handleOpenDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const updateStatus = async (id: string, newStatus: Order['status']) => {
        const action = newStatus === 'confirmed' ? 'confirm' : 'reject';
        if (!confirm(`Are you sure you want to ${action} this order?`)) return;

        setIsUpdating(true);
        try {
            // FIX: Ensure correct API path /api/admin/orders/${id}
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                alert(`Order ${newStatus} successfully!`);
                await fetchOrders();
                if (selectedOrder?._id === id) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            } else {
                const data = await res.json();
                alert(data.error || `Failed to ${action} order`);
            }
        } catch (err: any) {
            console.error('Update status error:', err);
            alert(`Network error: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'confirmed': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders Management</h1>
                    <p className="text-gray-500">Track and verify customer payments</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold flex items-center gap-2">
                    <XCircle size={18} />
                    {error}
                </div>
            )}

            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Phone or Name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
                    <Filter size={16} className="text-gray-500" />
                    {STATUS_FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all border
                ${statusFilter === filter
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20'
                                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:bg-gray-800 hover:text-white'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-950/50 text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-gray-800">
                                <th className="px-6 py-4">Order Info</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Item</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono font-bold text-blue-400">#{order?._id?.slice(-6)?.toUpperCase() || 'N/A'}</span>
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Calendar size={10} /> {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{order.userId?.name}</span>
                                            <span className="text-xs text-gray-500">{order.userId?.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium">{order.cardId?.title}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-white">PKR {order.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-tighter ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleOpenDetails(order)}
                                            className="p-2 bg-gray-950 rounded-lg border border-gray-800 hover:border-blue-500 hover:bg-blue-600 transition-all active:scale-90"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Clock size={40} className="text-gray-700" />
                                            <span className="font-bold">No orders found matching your criteria</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-5xl bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[95vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-black tracking-tight">#{selectedOrder?._id?.slice(-8)?.toUpperCase() || 'ORDER'}</h2>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-tighter ${getStatusColor(selectedOrder?.status)}`}>
                                        {selectedOrder?.status || 'pending'}
                                    </span>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white p-1">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Details */}
                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                                                <User size={14} className="text-blue-500" /> Customer Information
                                            </h3>
                                            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-400">Name</span>
                                                    <span className="text-sm font-bold">{selectedOrder.userId?.name}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-400">Phone Number</span>
                                                    <span className="text-sm font-bold">{selectedOrder.userId?.phone}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                                                <CreditCard size={14} className="text-blue-500" /> Order Details
                                            </h3>
                                            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-400">Package</span>
                                                    <span className="text-sm font-bold">{selectedOrder.cardId?.title}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-400">Total Amount</span>
                                                    <span className="text-sm font-black text-blue-500">PKR {selectedOrder.amount}</span>
                                                </div>
                                                <div className="flex justify-between pt-2 border-t border-gray-800">
                                                    <span className="text-sm text-gray-400">Transaction ID</span>
                                                    <span className="text-sm font-mono text-white bg-gray-800 px-2 py-0.5 rounded">{selectedOrder.transactionId}</span>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Actions */}
                                        <div className="pt-4 space-y-3">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => updateStatus(selectedOrder._id, 'confirmed')}
                                                    disabled={isUpdating || selectedOrder.status === 'confirmed'}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-900/20 active:scale-95 tracking-tighter uppercase"
                                                >
                                                    {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                                    Confirm Order
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => updateStatus(selectedOrder._id, 'rejected')}
                                                disabled={isUpdating || selectedOrder.status === 'rejected'}
                                                className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 font-bold py-3 rounded-2xl transition-all active:scale-95 tracking-tighter uppercase disabled:opacity-50"
                                            >
                                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <XCircle size={18} />}
                                                Reject Order
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Column: Payment Proof */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest flex items-center gap-2">
                                            < ImageIcon size={14} className="text-blue-500" /> Payment Proof
                                        </h3>
                                        <div className="relative group rounded-3xl overflow-hidden border border-gray-800 bg-gray-950 shadow-2xl transition-all hover:border-blue-500/30">
                                            <img
                                                src={selectedOrder.paymentProof}
                                                alt="Proof"
                                                className="w-full h-auto max-h-[500px] object-contain mx-auto block"
                                            />
                                            <a
                                                href={selectedOrder.paymentProof}
                                                target="_blank"
                                                className="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                        </div>
                                        <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
                                            Verify Transaction ID with your bank/provider statement before confirming
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
