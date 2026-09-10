import React, { useState } from 'react';
import { ShieldCheck, Copy, Check, Code, Terminal, Key, Zap, Lock, QrCode } from 'lucide-react';

interface PaywallGeneratorProps {
  isLightMode: boolean;
  userAddress: string | null;
  userNametag: string | null;
}

export const PaywallGenerator: React.FC<PaywallGeneratorProps> = ({
  isLightMode,
  userAddress,
  userNametag,
}) => {
  const [apiName, setApiName] = useState('My Custom AI Agent API');
  const [targetEndpoint, setTargetEndpoint] = useState('https://my-agent.example.com/api/predict');
  const [priceUCT, setPriceUCT] = useState('1.0');
  const [pricingModel, setPricingModel] = useState<'PER_REQUEST' | 'MONTHLY_PASS'>('PER_REQUEST');
  const [copiedCode, setCopiedCode] = useState(false);

  const effectiveAddress = userAddress || '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604';
  const effectiveNametag = userNametag || '@my_agent';

  // Generated Node.js Middleware snippet
  const generatedMiddlewareCode = `// ⚡ SpherePay Autonomous Paywall Middleware
import express from 'express';
import { SpherePayGate } from '@spherepay/sdk';

const app = express();
const gate = new SpherePayGate({
  recipient: '${effectiveNametag}', // or '${effectiveAddress.slice(0, 14)}...'
  priceUCT: ${priceUCT},
  network: 'testnet2',
  pricingModel: '${pricingModel}'
});

// Protect your agent endpoint with SpherePay
app.post('/api/predict', gate.protect(), (req, res) => {
  // Only executed after verified Unicity payment receipt!
  const buyer = req.spherePay.buyerPubkey;
  const paymentProof = req.spherePay.receiptHash;
  
  res.json({
    status: 'success',
    data: { response: 'Autonomous reasoning output delivered' },
    settlement: { buyer, paymentProof }
  });
});

app.listen(3000, () => console.log('SpherePay Gate active on :3000'));`;

  // Generated Client SDK Call snippet
  const generatedClientCode = `// 🤖 Client Agent Calling the SpherePay Endpoint
import { ConnectClient } from '@unicitylabs/sphere-sdk/connect';
import { SpherePayClient } from '@spherepay/client';

const sphere = new ConnectClient({ /* ... */ });
const spherePay = new SpherePayClient({ client: sphere });

// Seamlessly pays ${priceUCT} UCT and receives output in < 50ms
const result = await spherePay.call('${targetEndpoint}', {
  prompt: 'Autonomous analysis query'
});

console.log('Result received:', result);`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-mono font-bold">
          <Key className="w-3.5 h-3.5" />
          DEVELOPER TOOLKIT
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">
          SpherePay Paywall &amp; Gateway Generator
        </h2>
        <p className={`text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
          Monetize your AI APIs, Nostr bots, or autonomous agent services. Configure your pricing and copy the production-ready middleware.
        </p>
      </div>

      {/* Grid: Form & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs */}
        <div className={`lg:col-span-5 rounded-2xl border p-6 space-y-5 ${
          isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
        }`}>
          <h3 className="text-base font-bold flex items-center gap-2 text-orange-500 font-mono uppercase">
            <Lock className="w-4 h-4" />
            Paywall Configuration
          </h3>

          <div className="space-y-1.5">
            <label className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
              API Service Name
            </label>
            <input
              type="text"
              value={apiName}
              onChange={(e) => setApiName(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm font-medium outline-none transition-all ${
                isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900 focus:border-orange-500' : 'bg-[#080c14] border-slate-700 text-white focus:border-orange-500'
              }`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
              Target Endpoint URL
            </label>
            <input
              type="text"
              value={targetEndpoint}
              onChange={(e) => setTargetEndpoint(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none transition-all ${
                isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900 focus:border-orange-500' : 'bg-[#080c14] border-slate-700 text-white focus:border-orange-500'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                Price (UCT)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.01"
                value={priceUCT}
                onChange={(e) => setPriceUCT(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none transition-all ${
                  isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900 focus:border-orange-500' : 'bg-[#080c14] border-slate-700 text-white focus:border-orange-500'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
                Pricing Model
              </label>
              <select
                value={pricingModel}
                onChange={(e) => setPricingModel(e.target.value as any)}
                className={`w-full px-3 py-2 rounded-xl border text-sm font-mono outline-none transition-all ${
                  isLightMode ? 'bg-slate-50 border-orange-200 text-slate-900 focus:border-orange-500' : 'bg-[#080c14] border-slate-700 text-white focus:border-orange-500'
                }`}
              >
                <option value="PER_REQUEST">Per Request</option>
                <option value="MONTHLY_PASS">Monthly Pass</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>
              Settlement Recipient Address / Nametag
            </label>
            <div className={`px-3 py-2 rounded-xl border text-xs font-mono break-all ${
              isLightMode ? 'bg-orange-50/50 border-orange-200 text-orange-950' : 'bg-orange-950/20 border-orange-900/50 text-orange-400'
            }`}>
              {effectiveNametag} ({effectiveAddress.slice(0, 18)}...)
            </div>
          </div>

          <div className="pt-2">
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              isLightMode ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-400'
            }`}>
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <p className="text-xs font-medium">
                100% of incoming UCT goes straight to your key. Zero intermediary custody.
              </p>
            </div>
          </div>
        </div>

        {/* Code Previews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Server Middleware */}
          <div className={`rounded-2xl border overflow-hidden ${
            isLightMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-[#080c14] border-slate-800 text-slate-200'
          }`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-black/40">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-mono font-bold text-orange-400">
                  server-paywall.js (Express / Fastify)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedMiddlewareCode)}
                className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-all"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-orange-300/90">
              <code>{generatedMiddlewareCode}</code>
            </pre>
          </div>

          {/* Client SDK Call */}
          <div className={`rounded-2xl border overflow-hidden ${
            isLightMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-[#080c14] border-slate-800 text-slate-200'
          }`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-black/40">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-mono font-bold text-emerald-400">
                  agent-caller.ts (Client Agent Integration)
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(generatedClientCode)}
                className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300/90">
              <code>{generatedClientCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
