"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, User, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userSession?: any;
}

export default function SupportModal({ isOpen, onClose, userSession }: SupportModalProps) {
    const [formData, setFormData] = useState({
        name: userSession?.user?.name || '',
        phone: userSession?.user?.phone || '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    onClose();
                    setFormData({ ...formData, subject: '', message: '' });
                }, 3000);
            } else {
                setError(data.error || 'Failed to send message');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#0f0f0f] border border-white/10 rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl relative"
                    >
                        {/* Header */}
                        <div className="p-8 pb-4 flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                                    Support <span className="text-blue-500">& Guide</span>
                                </h2>
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                                    How can we help you today?
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="p-12 flex flex-col items-center text-center space-y-4">
                                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black italic tracking-tighter">Message Sent!</h3>
                                <p className="text-gray-400 font-medium">
                                    We've received your request. Our team will contact you on your provided number soon.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-5">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-sm font-bold">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest flex items-center gap-2 mb-1">
                                            <User size={12} /> Full Name
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500/50 transition-all font-bold text-sm"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest flex items-center gap-2 mb-1">
                                            <Phone size={12} /> Phone Number
                                        </label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500/50 transition-all font-bold text-sm"
                                            placeholder="0300-0000000"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest flex items-center gap-2 mb-1">
                                        <Star size={12} /> Subject / Issue
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500/50 transition-all font-bold text-sm"
                                        placeholder="e.g. UC not received / Payment issue"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest flex items-center gap-2 mb-1">
                                        <MessageSquare size={12} /> Your Message
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500/50 transition-all font-bold text-sm resize-none"
                                        placeholder="Describe your issue in detail..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <button
                                    disabled={isSubmitting}
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase italic py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Send Message
                                            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* Support Number Info */}
                        <div className="p-8 pt-4 bg-white/[0.02] border-t border-white/5 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                Quick Support? WhatsApp us at:
                                <span className="text-blue-500 ml-2 select-all">+92 3080367527</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Dummy Star icon if Star is not imported from lucide-react in previous steps
function Star({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}
