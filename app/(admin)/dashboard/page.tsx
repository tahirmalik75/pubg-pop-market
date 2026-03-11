"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    ShoppingBag,
    CheckCircle,
    Clock,
    ArrowUpRight,
    Loader2
} from 'lucide-react';

interface Stats {
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `PKR ${stats?.totalRevenue.toLocaleString() || 0}`,
            icon: TrendingUp,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20'
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Confirmed Orders',
            value: stats?.confirmedOrders || 0,
            icon: CheckCircle,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
        {
            title: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        }
    ];

    return (
        <div className="space-y-8 p-4 lg:p-8">
            <header>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">
                    Admin <span className="text-blue-500">Analytics</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                    Real-time performance overview
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-3xl bg-gray-900 border ${card.border} border-t-2 relative overflow-hidden group hover:scale-[1.02] transition-all`}
                    >
                        <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            <card.icon size={120} />
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg} ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-black uppercase text-gray-500 tracking-widest">
                                {card.title}
                            </p>
                            <h3 className="text-2xl font-black italic tracking-tighter text-white">
                                {card.value}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions or Welcome Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[40px] p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-blue-500/20"
            >
                <div className="absolute right-0 bottom-0 opacity-10 rotate-12 translate-x-10 translate-y-10">
                    <TrendingUp size={300} />
                </div>

                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">
                        Elite <span className="text-white">Management</span>
                    </h2>
                    <p className="text-blue-100 font-medium mb-8 leading-relaxed">
                        Welcome back, Admin. Your market is currently processing orders. Check the
                        <span className="font-black underline mx-1 underline-offset-4">Orders</span> tab to verify
                        new payments and boost your total revenue.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
