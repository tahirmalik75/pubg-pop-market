'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Gamepad2, User, LogOut, ShoppingBag, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
            <Gamepad2 className="text-white" size={24} />
          </div>
          <span className="text-xl font-black uppercase italic tracking-tighter text-white">
            PUBG <span className="text-blue-500">POP</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="https://wa.me/923080367527"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors uppercase font-black text-[10px] tracking-widest"
          >
            <MessageCircle size={18} />
            <span>Support</span>
          </Link>

          {status === 'loading' ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="flex flex-col items-end leading-none hidden sm:flex">
                  <span className="text-[10px] font-black uppercase text-gray-500 mb-1">Authenticated</span>
                  <span className="text-sm font-bold truncate max-w-[100px] text-white">{session.user?.name?.split(' ')[0]}</span>
                </div>
                <Link href="/profile">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white ring-2 ring-blue-500/20 ring-offset-2 ring-offset-black">
                    <User size={20} />
                  </div>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest hover:text-blue-500 text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest px-6 h-11 rounded-xl shadow-lg shadow-blue-600/20">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
