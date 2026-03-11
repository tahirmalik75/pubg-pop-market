'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Smartphone,
    User,
    Building2,
    Save,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';

export default function PaymentSettingsPage() {
    const [formData, setFormData] = useState({
        jazzcashNumber: '',
        easypaisaNumber: '',
        accountName: '',
        bankDetails: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/payment-settings');
            const data = await res.json();
            if (data && !data.error) {
                setFormData({
                    jazzcashNumber: data.jazzcashNumber || '',
                    easypaisaNumber: data.easypaisaNumber || '',
                    accountName: data.accountName || '',
                    bankDetails: data.bankDetails || '',
                });
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/payment-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Payment settings updated successfully!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payment Settings</h1>
                <p className="text-gray-500">Manage your active payment methods for customer checkouts</p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl"
            >
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`flex items-center gap-3 p-4 rounded-2xl border ${message.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        {/* Account Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                <User size={12} className="text-blue-500" /> Account Holder Name
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Full Name (e.g., Muhammad Ahmed)"
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={formData.accountName}
                                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* JazzCash */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                    <Smartphone size={12} className="text-blue-500" /> JazzCash Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="03XX-XXXXXXX"
                                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.jazzcashNumber}
                                    onChange={(e) => setFormData({ ...formData, jazzcashNumber: e.target.value })}
                                />
                            </div>

                            {/* EasyPaisa */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                    <Smartphone size={12} className="text-green-500" /> EasyPaisa Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="03XX-XXXXXXX"
                                    className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={formData.easypaisaNumber}
                                    onChange={(e) => setFormData({ ...formData, easypaisaNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-2">
                                <Building2 size={12} className="text-blue-500" /> Bank Account Details
                            </label>
                            <textarea
                                rows={4}
                                placeholder="Bank Name, IBAN, Account Number, etc."
                                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                value={formData.bankDetails}
                                onChange={(e) => setFormData({ ...formData, bankDetails: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2 tracking-tighter uppercase"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> SAVING...
                                </>
                            ) : (
                                <>
                                    <Save size={20} /> SAVE PAYMENT SETTINGS
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>

            <div className="text-center">
                <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                    These details will be shown to customers during the checkout process.<br />
                    Make sure your account information is up-to-date.
                </p>
            </div>
        </div>
    );
}
