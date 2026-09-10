import React, { useState, useEffect } from 'react';
import { Cpu, Zap, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, Activity, Search, Filter, PlusCircle, Terminal, Play, X, Key, Send, Copy, Check } from 'lucide-react';
import type { AIService } from '../utils/servicesData';
import { FEATURED_SERVICES } from '../utils/servicesData';

const LOCAL_STORAGE_CUSTOM_SERVICES_KEY = 'spherepay_custom_agent_services';

interface ServiceMarketplaceProps {
  isLightMode: boolean;
  isConnected: boolean;
  onPayForService: (service: AIService) => Promise<void>;
  isProcessing: boolean;
  activeServiceId: string | null;
  userNametag?: string;
  userAddress?: string;
}

export const ServiceMarketplace: React.FC<ServiceMarketplaceProps> = ({
  isLightMode,
  isConnected,
  onPayForService,
  isProcessing,
  activeServiceId,
  userNametag,
  userAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [services, setServices] = useState<AIService[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SERVICES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...FEATURED_SERVICES];
      }
    } catch {}
    return FEATURED_SERVICES;
  });

  // Modal for listing a new agent
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<AIService['category']>('LLM & Reasoning');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('0.5');
  const [newEndpoint, setNewEndpoint] = useState('https://my-agent.example.com/api/run');
  const [newTags, setNewTags] = useState('Autonomous, Agent, Unicity');

  const categories = ['ALL', 'LLM & Reasoning', 'Image & Media', 'Search & Scraping', 'Security & Audit', 'Agent Memory'];

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDescription.trim()) return;

    const customService: AIService = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      description: newDescription.trim(),
      pricePerCall: parseFloat(newPrice) || 0.1,
      unit: 'call',
      providerNametag: userNametag || '@community_agent',
      providerAddress: userAddress || '0353f0fed3674d0cdb831aa36a4c54c3ca0a9ac504182c8bdc2b19ed0b9a14de7f',
      endpoint: newEndpoint.trim(),
      latencyMs: Math.floor(Math.random() * 200) + 120,
      uptimePercent: 99.9,
      sampleInput: '{"prompt": "Query autonomous agent"}',
      sampleOutput: '{"result": "Autonomous response processed and verified on Unicity"}',
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    const updated = [customService, ...services];
    setServices(updated);

    try {
      const customOnly = updated.filter(s => s.id.startsWith('custom-'));
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_SERVICES_KEY, JSON.stringify(customOnly));
    } catch {}

    setIsListingModalOpen(false);
    setNewName('');
    setNewDescription('');
  };

  const filteredServices = services.filter((s) => {
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

        {/* Right side: Categories & Add Agent button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto justify-between">
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

          <button
            onClick={() => setIsListingModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 whitespace-nowrap transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Your Agent</span>
          </button>
        </div>
      </div>

      {/* Modal: List Your Agent Service */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl ${
            isLightMode ? 'bg-white border-orange-200 text-slate-900' : 'bg-[#0f1726] border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-orange-500" />
                <h3 className="text-xl font-bold font-mono">List Your AI Agent API</h3>
              </div>
              <button
                onClick={() => setIsListingModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className={`text-xs ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
              Publish your autonomous agent or API on the SpherePay registry. Start earning UCT directly to your Unicity wallet on every call.
            </p>

            <form onSubmit={handleCreateService} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400">AGENT / SERVICE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous Twitter Sentiment Agent"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-sans text-sm ${
                    isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900' : 'bg-[#080c14] border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400">CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900' : 'bg-[#080c14] border-slate-700 text-white'
                    }`}
                  >
                    <option value="LLM & Reasoning">LLM &amp; Reasoning</option>
                    <option value="Image & Media">Image &amp; Media</option>
                    <option value="Search & Scraping">Search &amp; Scraping</option>
                    <option value="Security & Audit">Security &amp; Audit</option>
                    <option value="Agent Memory">Agent Memory</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-400">PRICE PER CALL (UCT)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900' : 'bg-[#080c14] border-slate-700 text-white'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">ENDPOINT URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://api.my-agent.ai/v1/call"
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900' : 'bg-[#080c14] border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">SHORT DESCRIPTION</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Describe what tasks your agent performs..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none font-sans text-xs ${
                    isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900' : 'bg-[#080c14] border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Twitter, Analysis, Realtime"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border outline-none ${
                    isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900' : 'bg-[#080c14] border-slate-700 text-white'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold uppercase tracking-wider transition-all shadow-md shadow-orange-500/20 mt-2"
              >
                Publish to SpherePay Registry
              </button>
            </form>
          </div>
        </div>
      )}

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
