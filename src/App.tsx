import React, { useState } from 'react';
import { useWalletConnect, SPHEREPAY_AGENT_ADDRESS } from './hooks/useWalletConnect';
import { Navbar } from './components/Navbar';
import { ServiceMarketplace } from './components/ServiceMarketplace';
import { PaywallGenerator } from './components/PaywallGenerator';
import { AutonomousSettlement } from './components/AutonomousSettlement';
import { ProtocolDocs } from './components/ProtocolDocs';
import type { AIService } from './utils/servicesData';
import { CheckCircle2, ShieldAlert, Sparkles, ExternalLink, Zap } from 'lucide-react';

export function App() {
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'services' | 'paywall' | 'settlement' | 'docs'>('services');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [receiptModal, setReceiptModal] = useState<{
    service: AIService;
    txHash: string;
    apiKey: string;
  } | null>(null);

  const wallet = useWalletConnect();

  const handleToggleTheme = () => {
    setIsLightMode(!isLightMode);
    if (!isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  const handlePayForService = async (service: AIService) => {
    if (!wallet.isConnected) {
      await wallet.connect();
      return;
    }

    setIsProcessing(true);
    setActiveServiceId(service.id);

    try {
      // Execute payment via Sphere Connect L3 intent
      const success = await wallet.payForService(service.pricePerCall, service.providerAddress || SPHEREPAY_AGENT_ADDRESS);
      
      if (success) {
        const mockReceipt = '0x' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        const generatedKey = `sk_sphere_${service.id.slice(0, 4)}_${Math.random().toString(36).substring(2, 10)}`;
        setReceiptModal({
          service,
          txHash: mockReceipt,
          apiKey: generatedKey,
        });
      } else {
        alert('Payment was cancelled or rejected by wallet.');
      }
    } catch (e: any) {
      alert(e?.message || 'Transaction error occurred.');
    } finally {
      setIsProcessing(false);
      setActiveServiceId(null);
    }
  };

  const handleTriggerSelfMint = async () => {
    if (!wallet.isConnected) {
      await wallet.connect();
      return;
    }
    setIsProcessing(true);
    try {
      const ok = await wallet.mintTestUCT(100);
      if (ok) {
        alert('Successfully minted 100 testnet UCT to your Sphere wallet!');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      isLightMode 
        ? 'bg-[#fbf7f4] text-slate-900' 
        : 'bg-[#080c14] text-slate-100'
    }`}>
      {/* Navigation */}
      <Navbar
        isLightMode={isLightMode}
        onToggleTheme={handleToggleTheme}
        isConnected={wallet.isConnected}
        isConnecting={wallet.isConnecting}
        identity={wallet.identity}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {activeTab === 'services' && (
          <ServiceMarketplace
            isLightMode={isLightMode}
            isConnected={wallet.isConnected}
            onPayForService={handlePayForService}
            isProcessing={isProcessing}
            activeServiceId={activeServiceId}
          />
        )}

        {activeTab === 'paywall' && (
          <PaywallGenerator
            isLightMode={isLightMode}
            userAddress={wallet.identity?.chainPubkey || null}
            userNametag={wallet.identity?.nametag || null}
          />
        )}

        {activeTab === 'settlement' && (
          <AutonomousSettlement
            isLightMode={isLightMode}
            onTriggerSelfMint={handleTriggerSelfMint}
            isMinting={isProcessing}
          />
        )}

        {activeTab === 'docs' && (
          <ProtocolDocs isLightMode={isLightMode} />
        )}
      </main>

      {/* Payment Receipt / API Key Modal */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className={`relative w-full max-w-lg rounded-3xl border p-6 sm:p-8 space-y-6 shadow-2xl ${
            isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-500">
                  PAYMENT VERIFIED ON UNICITY L3
                </span>
                <h3 className="text-xl font-bold">
                  {receiptModal.service.name}
                </h3>
              </div>
            </div>

            <div className={`p-4 rounded-2xl border space-y-3 font-mono text-xs ${
              isLightMode ? 'bg-slate-50 border-orange-100' : 'bg-[#080c14] border-slate-800'
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-bold text-orange-500">{receiptModal.service.pricePerCall} UCT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Settlement Speed:</span>
                <span className="font-bold text-emerald-400">&lt; 45ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Provider:</span>
                <span className="font-bold text-sky-400">{receiptModal.service.providerNametag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt Proof:</span>
                <span className="text-slate-500">{receiptModal.txHash.slice(0, 16)}...</span>
              </div>
            </div>

            {/* Granted API Key / Endpoint */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-400">
                DISPATCHED API ACCESS KEY (Delivered via Nostr L3)
              </label>
              <div className={`p-3 rounded-xl border font-mono text-xs select-all break-all ${
                isLightMode ? 'bg-orange-50 border-orange-200 text-orange-900' : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
              }`}>
                {receiptModal.apiKey}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-400">
                SAMPLE CURL REQUEST
              </label>
              <pre className="p-3 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-orange-300 overflow-x-auto">
                <code>{`curl -X POST ${receiptModal.service.endpoint} \\
  -H "Authorization: Bearer ${receiptModal.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${receiptModal.service.sampleInput.replace(/'/g, "\\'")}'`}</code>
              </pre>
            </div>

            <button
              onClick={() => setReceiptModal(null)}
              className="w-full py-3 rounded-xl font-mono font-bold text-xs uppercase bg-orange-500 hover:bg-orange-400 text-black shadow-lg shadow-orange-500/20 transition-all"
            >
              Close &amp; Test API
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`border-t py-8 transition-colors ${
        isLightMode ? 'border-orange-200 bg-white/50' : 'border-slate-800/60 bg-[#060910]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SpherePay" className="w-5 h-5" />
            <span>SpherePay Protocol, The Machine-to-Machine Payment Layer on Unicity Network</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/sinascorpion/spherepay" target="_blank" rel="noreferrer" className="hover:text-orange-500 flex items-center gap-1">
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://developers.unicity.network" target="_blank" rel="noreferrer" className="hover:text-orange-500 flex items-center gap-1">
              <span>Unicity Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
