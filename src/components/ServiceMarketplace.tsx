import React, { useState } from 'react';
import { Cpu, Zap, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, Activity, Search, Filter } from 'lucide-react';
import type { AIService } from '../utils/servicesData';
import { FEATURED_SERVICES } from '../utils/servicesData';

interface ServiceMarketplaceProps {
  isLightMode: boolean;
  isConnected: boolean;
  onPayForService: (service: AIService) => Promise<void>;
  isProcessing: boolean;
  activeServiceId: string | null;
}

export const ServiceMarketplace: React.FC<ServiceMarketplaceProps> = ({
  isLightMode,
  isConnected,
  onPayForService,
  isProcessing,
  activeServiceId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'LLM & Reasoning', 'Image & Media', 'Search & Scraping', 'Security & Audit', 'Agent Memory'];

  const filteredServices = FEATURED_SERVICES.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl border p-8 sm:p-12 transition-all ${
        isLightMode
          ? 'bg-gradient-to-br from-orange-500/10 via-white to-orange-500/5 border-orange-200'
          : 'bg-gradient-to-br from-orange-500/15 via-[#0f1726] to-[#080c14] border-slate-800'
      }`}>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-500 text-xs font-mono font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            THE MACHINE-TO-MACHINE ECONOMY
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Instant Micro-Payments for <span className="text-orange-500 glow-text">Autonomous AI Agents</span>
          </h1>
          <p className={`text-base sm:text-lg leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
            SpherePay is the decentralized payment rail enabling AI agents and developers to monetize APIs, datasets, and reasoning loops with zero human mediation. Pay-per-call, stream micro-settlements, and eliminate chargebacks.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono ${
              isLightMode ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-orange-950/40 text-orange-300 border border-orange-800/60'
            }`}>
              <Zap className="w-4 h-4 text-orange-500" />
              <span>&lt; 50ms Instant Settlement on Unicity</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono ${
              isLightMode ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-800/60 text-slate-300 border border-slate-700'
            }`}>
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>100% Non-Custodial &amp; Agentic</span>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className={`relative w-full sm:w-80 flex items-center rounded-2xl border transition-all ${
          isLightMode ? 'bg-white border-orange-200 text-slate-800' : 'bg-[#0f1726] border-slate-800 text-white'
        }`}>
          <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
          <input
            type="text"
            placeholder="Search models, scrapers, APIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : isLightMode
                    ? 'bg-white border border-orange-200 text-slate-600 hover:text-orange-600'
                    : 'bg-[#0f1726] border border-slate-800 text-slate-300 hover:text-orange-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const isCurrentActive = isProcessing && activeServiceId === service.id;
          return (
            <div
              key={service.id}
              className={`flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.01] ${
                isLightMode
                  ? 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10'
                  : 'bg-[#0f1726] border-slate-800 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5'
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-orange-500">
                      {service.category}
                    </span>
                    <h3 className={`text-lg font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                      {service.name}
                    </h3>
                  </div>
                  <div className={`p-2 rounded-xl border ${
                    isLightMode ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  }`}>
                    <Cpu className="w-5 h-5" />
                  </div>
                </div>

                <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                  {service.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-dashed border-slate-700/30 text-center font-mono">
                  <div>
                    <span className={`text-[10px] block ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>RATE</span>
                    <span className="text-xs font-bold text-orange-500">{service.pricePerCall} UCT</span>
                  </div>
                  <div>
                    <span className={`text-[10px] block ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>LATENCY</span>
                    <span className="text-xs font-bold text-emerald-500">{service.latencyMs}ms</span>
                  </div>
                  <div>
                    <span className={`text-[10px] block ${isLightMode ? 'text-slate-400' : 'text-slate-500'}`}>UPTIME</span>
                    <span className="text-xs font-bold text-sky-500">{service.uptimePercent}%</span>
                  </div>
                </div>

                {/* Provider info */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Provider:</span>
                  <span className="font-bold text-orange-400">{service.providerNametag}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        isLightMode ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/60 text-slate-400'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  onClick={() => onPayForService(service)}
                  disabled={isProcessing}
                  className={`w-full py-3 px-4 rounded-xl font-bold font-mono text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                    isCurrentActive
                      ? 'bg-orange-400 text-black animate-pulse cursor-wait'
                      : 'bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/20 active:scale-[0.98]'
                  }`}
                >
                  {isCurrentActive ? (
                    <span>Settling via Unicity Network...</span>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      <span>Execute &amp; Pay {service.pricePerCall} UCT</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
