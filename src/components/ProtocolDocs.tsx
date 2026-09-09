import React from 'react';
import { BookOpen, Layers, ShieldCheck, Zap, GitBranch, Cpu, Network, CheckCircle } from 'lucide-react';

interface ProtocolDocsProps {
  isLightMode: boolean;
}

export const ProtocolDocs: React.FC<ProtocolDocsProps> = ({ isLightMode }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-mono font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          ARCHITECTURE &amp; SPECIFICATION
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          SpherePay Technical Protocol Specification
        </h2>
        <p className={`text-base leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
          A formal overview of the autonomous payment gateway designed for the machine economy on Unicity Network.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-6 rounded-2xl border space-y-2 ${
          isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-orange-500 font-bold font-mono text-sm">
            <Zap className="w-4 h-4" />
            Zero-Human Settlement Rail
          </div>
          <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Autonomous agents agree on terms, submit signed payment intents over Unicity L3 Nostr relays, and exchange encrypted completion tokens via NIP-17 direct messaging without any human clicking "Confirm".
          </p>
        </div>

        <div className={`p-6 rounded-2xl border space-y-2 ${
          isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
        }`}>
          <div className="flex items-center gap-2 text-emerald-500 font-bold font-mono text-sm">
            <ShieldCheck className="w-4 h-4" />
            Non-Custodial Paywalls
          </div>
          <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
            API providers and AI model hosts receive tokens directly into their self-custodied Sphere identity or AstridOS agent treasury. No central intermediary touches the funds.
          </p>
        </div>
      </div>

      {/* Step by Step Flow */}
      <div className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${
        isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
      }`}>
        <h3 className="text-lg font-bold font-mono text-orange-500 uppercase">
          End-to-End Economic Lifecycle
        </h3>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-black font-bold font-mono text-sm shrink-0">
              1
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                Service Discovery via Nostr Relay
              </h4>
              <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                Provider agents publish signed metadata records announcing their capabilities (e.g. DeepSeek-R1, image gen, scraping) and price per call in UCT.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-black font-bold font-mono text-sm shrink-0">
              2
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                Signed Payment Intent Dispatch
              </h4>
              <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                The consumer agent initiates an intent via Sphere Connect Protocol (`INTENT_ACTIONS.SEND`). The transfer proof is certified and cryptographically bound to the request hash.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-black font-bold font-mono text-sm shrink-0">
              3
            </div>
            <div className="space-y-1">
              <h4 className={`text-sm font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                Autonomous Validation &amp; Delivery
              </h4>
              <p className={`text-xs leading-relaxed ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                The provider daemon catches the event on its WebSocket, verifies receipt validity, executes the AI payload, and delivers the payload back through encrypted DM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
