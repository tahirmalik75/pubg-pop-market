'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    CheckCircle2,
    CreditCard,
    Smartphone,
    Upload,
    Loader2,
    Star,
    Plus,
    Minus,
    AlertCircle
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface PurchaseModalProps {
    card: any;
    paymentSettings: any;
    onClose: () => void;
}

export default function PurchaseModal({ card, paymentSettings, onClose }: PurchaseModalProps) {
    const { data: session } = useSession();
    const [quantity, setQuantity] = useState(1);
    const [transactionId, setTransactionId] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const totalPrice = card.price * quantity;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            window.location.href = '/login';
            return;
        }

        if (!selectedFile) {
            setErrorMessage('Please upload a payment proof screenshot');
            setOrderStatus('error');
            return;
        }

        setOrderStatus('submitting');
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('cardId', card._id || card.id);
            formData.append('amount', totalPrice.toString());
            formData.append('quantity', quantity.toString());
            formData.append('transactionId', transactionId);
            formData.append('paymentProof', selectedFile);

            console.log('--- Order Submission Started ---');
            // Log FormData for debugging (using entries() spread)
            const entries = Array.from(formData.entries());
            entries.forEach(([key, value]) => {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
            });

            // Note: We DO NOT manually set Content-Type header when using FormData.
            // The browser automatically sets it with the correct boundary.
            const res = await fetch('/api/orders', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setOrderStatus('success');
            } else {
                setErrorMessage(data.error || 'Failed to place order. Please try again.');
                setOrderStatus('error');
            }
        } catch (error: any) {
            console.error('Order error:', error);
            setErrorMessage(`Network error: ${error.message || 'Connection failed'}`);
            setOrderStatus('error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[30px] md:rounded-[40px] shadow-[0_35px_100px_-15px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row max-h-screen md:max-h-[90vh]"
            >
                {/* Left Side: Product Showcase */}
                <div className="w-full md:w-5/12 bg-[#111] p-6 md:p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 shrink-0">
                    <div className="relative group w-full aspect-square mb-8 max-w-[300px]">
                        <div className="absolute inset-0 bg-blue-600/30 rounded-[40px] blur-[80px] opacity-20" />
                        <img
                            src={card.image || `https://placehold.co/400x400/111/444?text=${encodeURIComponent(card.title)}`}
                            className="relative z-10 w-full h-full object-cover rounded-[40px] border border-white/10 shadow-2xl"
                        />
                        <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white font-black italic uppercase tracking-tighter px-4 py-2 rounded-xl text-xs z-20 shadow-xl">
                            Official Item
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic text-center leading-tight mb-2">
                        {card.title}
                    </h2>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                        </div>
                        <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">(4.9/5) Verified</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-blue-500 italic uppercase tracking-tighter">PKR {totalPrice}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Total Payable</span>
                    </div>
                </div>

                {/* Right Side: Checkout Logic */}
                <div className="flex-1 p-6 md:p-12 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Secure <span className="text-blue-500">Checkout</span></h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Complete payment to receive item</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-90">
                            <X size={20} />
                        </button>
                    </div>

                    {orderStatus === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-12 flex flex-col items-center space-y-6"
                        >
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 border border-green-500/20 shadow-2xl shadow-green-500/10">
                                <CheckCircle2 size={48} className="animate-bounce" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-black uppercase italic mb-2">Order Placed!</h3>
                                <p className="text-gray-400 font-bold uppercase tracking-tighter leading-snug">
                                    Waiting for admin confirmation.<br />
                                    Items will be delivered to your PUBG ID soon.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="px-10 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all"
                            >
                                CLOSE WINDOW
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {orderStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold"
                                >
                                    <AlertCircle size={20} />
                                    <span>{errorMessage}</span>
                                </motion.div>
                            )}
                            {/* 0. Quantity Selector */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 00. Select Quantity
                                </h3>
                                <div className="flex items-center gap-6 bg-white/5 w-fit p-2 rounded-2xl border border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="text-xl font-black min-w-[30px] text-center">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* 1. Payment Methods Display */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 01. Payment Instructions
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
                                        <div className="flex items-center gap-3 mb-4 text-red-500">
                                            <CreditCard size={18} />
                                            <span className="text-xs font-black uppercase tracking-widest">JazzCash</span>
                                        </div>
                                        <p className="text-xl font-mono font-black text-white tracking-widest">{paymentSettings?.jazzcashNumber || '03XX-XXXXXXX'}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Title: {paymentSettings?.accountName || 'Admin Account'}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-5 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden group">
                                        <div className="flex items-center gap-3 mb-4 text-green-500">
                                            <CreditCard size={18} />
                                            <span className="text-xs font-black uppercase tracking-widest">EasyPaisa</span>
                                        </div>
                                        <p className="text-xl font-mono font-black text-white tracking-widest">{paymentSettings?.easypaisaNumber || '03XX-XXXXXXX'}</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Title: {paymentSettings?.accountName || 'Admin Account'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Verification Form */}
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> 02. Payment Verification
                                </h3>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Transaction ID</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. 5567812349"
                                            className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-bold tracking-tight"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Payment Proof (Screenshot)</label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                            onChange={handleFileChange}
                                        />
                                        <div className="w-full bg-black/40 border-2 border-dashed border-white/5 group-hover:border-blue-500/50 rounded-2xl py-8 flex flex-col items-center justify-center transition-all">
                                            {previewUrl ? (
                                                <div className="flex flex-col items-center">
                                                    <img src={previewUrl} className="w-20 h-20 object-cover rounded-lg mb-3 border border-white/20" />
                                                    <span className="text-sm font-black uppercase tracking-tighter text-blue-500">
                                                        Proof Attached ✓
                                                    </span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-3">
                                                        <Upload size={24} />
                                                    </div>
                                                    <span className="text-sm font-black uppercase tracking-tighter text-gray-400">
                                                        Upload Receipt Screenshot
                                                    </span>
                                                </>
                                            )}
                                            <span className="text-[10px] text-gray-600 font-bold uppercase mt-1 tracking-widest">Supports PNG, JPG</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={orderStatus === 'submitting'}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black rounded-[24px] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-3 tracking-[0.2em] uppercase italic"
                            >
                                {orderStatus === 'submitting' ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> SUBMITTING...
                                    </>
                                ) : (
                                    <>
                                        SUBMIT ORDER <CreditCard size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
