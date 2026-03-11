'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Smartphone, Lock, UserPlus, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Neon Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]" />

            {/* Back to Home */}
            <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors group">
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-widest">Home</span>
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-block p-3 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4 shadow-lg shadow-blue-500/5">
                        <UserPlus className="text-blue-500" size={32} />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                        Join the <span className="text-blue-500">Market</span>
                    </h1>
                    <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Create your player account</p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl relative z-10">
                    {success ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-12 text-center space-y-4"
                        >
                            <div className="flex justify-center text-green-500">
                                <CheckCircle2 size={64} className="animate-bounce" />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Account Created!</h2>
                            <p className="text-gray-400">Redirecting you to login page...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-medium"
                                >
                                    <AlertCircle size={18} />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-950/50 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        required
                                        type="text"
                                        placeholder="03XX XXXXXXX"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-950/50 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                                    <input
                                        required
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-950/50 border border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3 tracking-widest uppercase border border-blue-400/20 mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        CREATE ACCOUNT <ArrowLeft className="rotate-180" size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center border-t border-gray-800 pt-6">
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-tighter">
                            Already a member? {' '}
                            <Link href="/login" className="text-blue-500 hover:text-blue-400 hover:underline transition-all">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-gray-600 uppercase tracking-[0.2em] font-black">
                    © 2026 PUBG Popularity Market • Elite Hub
                </div>
            </motion.div>
        </div>
    );
}
