'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  User,
  LogOut,
  ShoppingBag,
  MessageCircle,
  Lock,
  Zap,
  ChevronRight,
  TrendingUp,
  Shield,
  Star,
  LayoutDashboard,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PurchaseModal from '@/components/PurchaseModal';
import SupportModal from '@/components/SupportModal';

interface Package {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/cards');
        const data = await res.json();
        if (Array.isArray(data)) setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBuyNow = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsPurchaseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-[100] bg-black/80 backdrop-blur-2xl border-b border-white/5 px-6 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Gamepad2 className="text-white" size={24} />
            </div>
            <span className="text-xl font-black uppercase italic tracking-tighter">
              PUBG <span className="text-blue-500">POP</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-8 mr-6">
              <button onClick={() => setIsSupportModalOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">Support</button>
              <button onClick={() => setIsSupportModalOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">Guide</button>
            </nav>

            {status === 'authenticated' ? (
              <div className="flex items-center gap-4">
                {session?.user?.role === 'admin' && (
                  <Link href="/dashboard">
                    <Button variant="ghost" className="hidden md:flex items-center gap-2 text-xs font-black uppercase border border-white/5 hover:bg-white/5 rounded-xl">
                      <LayoutDashboard size={14} /> Admin
                    </Button>
                  </Link>
                )}
                <Link href="/profile" className="flex items-center gap-3 pl-3 border-l border-white/10 group">
                  <div className="flex flex-col items-end leading-none hidden sm:flex">
                    <span className="text-[10px] font-black uppercase text-gray-500 mb-1">Elite Account</span>
                    <span className="text-sm font-bold truncate max-w-[100px] group-hover:text-blue-400 transition-colors">{session?.user?.name}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-2 ring-blue-500/20 ring-offset-2 ring-offset-black group-hover:scale-110 transition-transform">
                    <User size={20} />
                  </div>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest hover:text-blue-500">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-6 h-10 rounded-xl shadow-lg shadow-blue-600/20">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-8 lg:pt-12 pb-24 overflow-hidden border-b border-white/5">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full opacity-50" />
              <div className="relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl group">
                <img
                  src="/hero-gaming.png"
                  alt="Gaming Setup"
                  className="w-full h-auto object-cover transform transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-blue-500">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-white font-black italic uppercase tracking-tighter">Elite Marketplace</p>
                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">Premium Service</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <Zap className="text-blue-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Boost Your Popularity Instantly</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                Boost Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-white to-blue-400">
                  Popularity
                </span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed uppercase tracking-wide">
                Unleash the ultimate power with the #1 Marketplace for PUBG Popularity. Instant delivery, elite support, and 100% secure payments.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  onClick={() => document.getElementById('market')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase italic px-10 h-16 rounded-2xl shadow-2xl shadow-blue-600/30 active:scale-95 text-lg"
                >
                  Get Started <ArrowRight className="ml-2" />
                </Button>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="px-10 h-16 rounded-2xl border border-white/10 hover:bg-white/5 font-black uppercase italic tracking-widest text-xs transition-all"
                >
                  How it works
                </button>
              </div>

              {/* Stats Line */}
              <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5">
                <div>
                  <p className="text-4xl font-black italic tracking-tighter">50+</p>
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">Trusted Players</p>
                </div>
                <div>
                  <p className="text-4xl font-black italic tracking-tighter">10K+</p>
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">Global Orders</p>
                </div>
                <div>
                  <p className="text-4xl font-black italic tracking-tighter">24/7</p>
                  <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">Elite Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Shield, title: '100% Secure', desc: 'Secure payment gateways and privacy protection.' },
              { icon: Zap, title: 'Instant Delivery', desc: 'Your popularity boosts are processed immediately.' },
              { icon: Star, title: 'Quality Assurance', desc: 'Elite level service with verified popularity items.' }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-8 rounded-[40px] bg-[#0f0f0f] border border-white/5 shadow-xl hover:border-blue-500/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-[22px] bg-blue-600/10 flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform ring-1 ring-blue-500/20">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main id="market" className="py-24 container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">
              Popularity <span className="text-blue-500">Market</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Elite Inventory Available Now</p>
          </div>
          <div className="hidden lg:flex gap-6 pb-2">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase text-blue-500 tracking-[0.2em]">Verified Secure</span>
              <span className="text-sm font-black italic">PKR {packages.length > 0 ? Math.min(...packages.map(p => p.price)) : 0}+ STARTING</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-[32px] bg-gray-900/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="absolute inset-x-8 top-1/2 bottom-0 bg-blue-600/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0f0f0f] border border-white/5 rounded-[32px] overflow-hidden hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-2xl">
                  <div className="aspect-square relative overflow-hidden bg-gray-950">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{pkg.category}</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-blue-500 transition-colors">
                      {pkg.title}
                    </h3>

                    <div className="flex items-center gap-4 mt-auto pt-8 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Investment</span>
                        <span className="text-2xl font-black text-white italic tracking-tighter">PKR {pkg.price}</span>
                      </div>
                      <Button
                        onClick={() => handleBuyNow(pkg)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 font-black uppercase italic tracking-tighter text-sm h-14 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/30"
                      >
                        Unleash <ChevronRight size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {selectedPackage && isPurchaseModalOpen && (
          <PurchaseModal
            card={selectedPackage}
            onClose={() => setIsPurchaseModalOpen(false)}
            paymentSettings={{}} // To be handled by API inside modal if needed
          />
        )}
      </AnimatePresence>

      <SupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        userSession={session}
      />

      {/* Footer */}
      <footer className="py-24 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-2 bg-blue-600 rounded-xl">
                  <Gamepad2 className="text-white" size={24} />
                </div>
                <span className="text-3xl font-black uppercase italic tracking-tighter">
                  PUBG <span className="text-blue-500 text-glow">POP</span>
                </span>
              </Link>
              <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-sm uppercase tracking-wide">
                Elevating gaming presence through premium popularity markets.
              </p>
              <div className="flex items-center gap-4">
                {/* Contact box removed as requested */}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Navigation</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Marketplace</button></li>
                <li><button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Global Stats</button></li>
                <li><button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Elite Program</button></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Support</h4>
              <ul className="space-y-4">
                <li><button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Client Support</button></li>
                <li><button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">User Guide</button></li>
                <li><button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Reliability Hub</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic flex flex-wrap items-center justify-center gap-1">
              <span>© 2026</span>
              <Link
                href="https://www.instagram.com/dream.devx?igsh=ZDdsOXM2emMyM2Ux"
                target="_blank"
                className="text-blue-500 hover:text-white transition-all duration-300 not-italic mx-1 hover:scale-110 transform inline-block text-glow font-black"
              >
                DREAM.DEVX
              </Link>
              <span>• ALL RIGHTS RESERVED</span>
            </div>
            <div className="flex items-center gap-6 opacity-30">
              <Shield size={20} />
              <Lock size={20} />
              <TrendingUp size={20} />
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
                .text-glow {
                    text-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
                }
                #market {
                    scroll-margin-top: 100px;
                }
                .whatsapp-glow {
                    filter: drop-shadow(0 0 10px rgba(37, 211, 102, 0.4));
                }
                .whatsapp-glow:hover {
                    filter: drop-shadow(0 0 20px rgba(37, 211, 102, 0.6));
                }
            `}</style>

      {/* Floating WhatsApp Contact */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-8 right-8 z-[1000]"
      >
        <Link
          href="https://wa.me/923156347304"
          target="_blank"
          className="relative group block"
        >
          <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-[#0f0f0f] border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-2xl group-hover:border-green-500/50 transition-all group-hover:-translate-y-2">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 whatsapp-glow">
              <MessageCircle size={24} fill="currentColor" />
            </div>
            <div className="flex flex-col pr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-green-500 transition-colors">Chat With Us</span>
              <span className="text-sm font-black italic text-white">Online Support</span>
            </div>

            {/* Notification Dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border-2 border-[#0f0f0f] rounded-full animate-pulse" />
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
