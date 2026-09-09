import React from 'react';
import { Sun, Moon, Wallet, LogOut, ArrowRight, CheckCircle2, ShieldCheck, Terminal, ExternalLink, Cpu } from 'lucide-react';
import type { PublicIdentity } from '@unicitylabs/sphere-sdk/connect';

interface NavbarProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  identity: PublicIdentity | null;
  onConnect: () => void;
  onDisconnect: () => void;
  activeTab: 'services' | 'paywall' | 'settlement' | 'docs';
  setActiveTab: (tab: 'services' | 'paywall' | 'settlement' | 'docs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isLightMode,
  onToggleTheme,
  isConnected,
  isConnecting,
  identity,
  onConnect,
  onDisconnect,
  activeTab,
  setActiveTab,
}) => {
  const shortAddress = identity?.chainPubkey
    ? `${identity.chainPubkey.slice(0, 6)}...${identity.chainPubkey.slice(-4)}`
    : null;

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-md transition-colors ${
      isLightMode 
        ? 'bg-[#fbf7f4]/90 border-orange-200' 
        : 'bg-[#080c14]/90 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('services')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 overflow-hidden group">
              <img src="/logo.png" alt="SpherePay Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-orange-500/10 blur-sm -z-10 group-hover:opacity-100 opacity-0 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight font-mono text-orange-500">
                  SPHERE<span className={isLightMode ? 'text-slate-900' : 'text-white'}>PAY</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500 border border-orange-500/40">
                  Unicity L3
                </span>
              </div>
              <p className={`text-xs ${isLightMode ? 'text-slate-500' : 'text-slate-400'} font-medium hidden sm:block`}>
                Autonomous AI Agent Payment Gateway
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'services'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : isLightMode ? 'text-slate-600 hover:text-orange-600' : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              AI Services
            </button>
            <button
              onClick={() => setActiveTab('paywall')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'paywall'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : isLightMode ? 'text-slate-600 hover:text-orange-600' : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              Paywall Generator
            </button>
            <button
              onClick={() => setActiveTab('settlement')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'settlement'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : isLightMode ? 'text-slate-600 hover:text-orange-600' : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              Autonomous Agent Loop
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'docs'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : isLightMode ? 'text-slate-600 hover:text-orange-600' : 'text-slate-300 hover:text-orange-400'
              }`}
            >
              Protocol Specs
            </button>
          </nav>

          {/* Actions & Wallet */}
          <div className="flex items-center gap-3">
            
            {/* Light / Dark Orange Toggle */}
            <button
              onClick={onToggleTheme}
              title={isLightMode ? "Switch to Cyber Dark Mode" : "Switch to Sunset Light Mode"}
              className={`p-2.5 rounded-xl border transition-all ${
                isLightMode 
                  ? 'bg-white border-orange-300 text-orange-600 hover:bg-orange-50' 
                  : 'bg-[#0f1726] border-slate-800 text-orange-400 hover:bg-slate-800/80 hover:border-orange-500/50'
              }`}
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Wallet Button */}
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-mono text-xs ${
                  isLightMode 
                    ? 'bg-white border-orange-200 text-slate-800 shadow-sm' 
                    : 'bg-[#0f1726] border-slate-800 text-orange-400'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold">
                    {identity?.nametag || shortAddress}
                  </span>
                </div>
                <button
                  onClick={onDisconnect}
                  title="Disconnect Wallet"
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isLightMode 
                      ? 'border-red-200 hover:bg-red-50 text-red-500' 
                      : 'border-red-950/50 hover:bg-red-950/30 text-red-400'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                disabled={isConnecting}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm uppercase transition-all shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden overflow-x-auto gap-2 py-2 border-t border-slate-800/20 scrollbar-none">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'services' ? 'bg-orange-500 text-black' : 'text-slate-400'
            }`}
          >
            AI Services
          </button>
          <button
            onClick={() => setActiveTab('paywall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'paywall' ? 'bg-orange-500 text-black' : 'text-slate-400'
            }`}
          >
            Paywall Generator
          </button>
          <button
            onClick={() => setActiveTab('settlement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'settlement' ? 'bg-orange-500 text-black' : 'text-slate-400'
            }`}
          >
            Agent Loop
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
              activeTab === 'docs' ? 'bg-orange-500 text-black' : 'text-slate-400'
            }`}
          >
            Protocol Specs
          </button>
        </div>

      </div>
    </header>
  );
};
