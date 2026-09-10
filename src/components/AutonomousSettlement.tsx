import React, { useState, useEffect } from 'react';
import { Terminal, Play, Pause, RefreshCw, CheckCircle2, ShieldCheck, Activity, Cpu, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface AgentLog {
  id: string;
  timestamp: string;
  type: 'DISCOVERY' | 'PAYMENT_RECEIVED' | 'FULFILLED' | 'HEARTBEAT';
  message: string;
  meta?: Record<string, any>;
}

interface AutonomousSettlementProps {
  isLightMode: boolean;
  onTriggerSelfMint: () => Promise<void>;
  isMinting: boolean;
}

export const AutonomousSettlement: React.FC<AutonomousSettlementProps> = ({
  isLightMode,
  onTriggerSelfMint,
  isMinting,
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [totalProcessedUCT, setTotalProcessedUCT] = useState(142.8);
  const [activeJobsCount, setActiveJobsCount] = useState(6);
  const [logs, setLogs] = useState<AgentLog[]>([
    {
      id: '1',
      timestamp: '22:15:02',
      type: 'DISCOVERY',
      message: 'Agent node active on Unicity Nostr Relay. Subscribed to direct payment receipts & intents.'
    },
    {
      id: '2',
      timestamp: '22:16:44',
      type: 'PAYMENT_RECEIVED',
      message: 'Received 0.50 UCT from @r1_buyer for DeepSeek-R1 inference.',
      meta: { receipt: '0x3a48...91f', latency: '38ms' }
    },
    {
      id: '3',
      timestamp: '22:16:45',
      type: 'FULFILLED',
      message: 'Dispatched encrypted completion token via Nostr NIP-17 DM to @r1_buyer.',
      meta: { status: 'DELIVERED_INSTANT' }
    },
    {
      id: '4',
      timestamp: '22:19:12',
      type: 'PAYMENT_RECEIVED',
      message: 'Received 2.00 UCT from @creative_bot for FLUX.1 image rendering.',
      meta: { receipt: '0x9b11...e42', latency: '44ms' }
    },
    {
      id: '5',
      timestamp: '22:19:13',
      type: 'FULFILLED',
      message: 'Render token generated and pinned to IPFS gateway. Settlement converged.',
      meta: { ipfs: 'ipfs://bafy...5di' }
    }
  ]);

  // Live Simulated Economic Loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const randomServices = [
        { name: 'DeepSeek-R1', amount: 0.5, buyer: '@agent_bob' },
        { name: 'Stealth Scraper', amount: 0.25, buyer: '@data_harvester' },
        { name: 'Contract Auditor', amount: 5.0, buyer: '@defi_guard' },
        { name: 'Vector Memory', amount: 0.1, buyer: '@cortex_node' }
      ];
      const picked = randomServices[Math.floor(Math.random() * randomServices.length)];
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const newLog: AgentLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: timeStr,
        type: 'PAYMENT_RECEIVED',
        message: `[Autonomous Loop] Payment verified: ${picked.amount} UCT from ${picked.buyer} for ${picked.name}.`,
        meta: { txId: 'DIRECT://' + Math.random().toString(16).substring(2, 14), status: 'CONVERGED' }
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      setTotalProcessedUCT((prev) => +(prev + picked.amount).toFixed(2));
    }, 6500);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            REAL-TIME AUTONOMOUS ENGINE
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1">
            Autonomous Provider Agent Node
          </h2>
          <p className={`text-sm ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
            Running independently with no human in the loop. Listens to transfer notifications, validates payment proofs, and dispatches outputs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold border transition-all flex-1 sm:flex-initial ${
              isRunning
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Loop' : 'Resume Loop'}</span>
          </button>

          <button
            onClick={onTriggerSelfMint}
            disabled={isMinting}
            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-mono font-bold bg-orange-500 hover:bg-orange-400 text-black shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 flex-1 sm:flex-initial"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isMinting ? 'animate-spin' : ''}`} />
            <span>{isMinting ? 'Minting...' : 'Mint 100 Test UCT'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className={`p-5 rounded-2xl border ${
          isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
        }`}>
          <span className="text-xs text-slate-400 block mb-1">TOTAL VOLUME SETTLED</span>
          <div className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <span>{totalProcessedUCT.toLocaleString()} UCT</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Zero chargebacks recorded</span>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
        }`}>
          <span className="text-xs text-slate-400 block mb-1">AVERAGE SETTLEMENT SPEED</span>
          <div className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
            <span>41 ms</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Nostr direct transfer</span>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800'
        }`}>
          <span className="text-xs text-slate-400 block mb-1">AGENT ENGINE STATUS</span>
          <div className="text-2xl font-bold text-sky-400 flex items-center gap-2">
            <span>{isRunning ? 'AUTONOMOUS' : 'IDLE'}</span>
            <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">AstridOS compatible loop</span>
        </div>
      </div>

      {/* Live Console Terminal */}
      <div className={`rounded-2xl border overflow-hidden shadow-2xl ${
        isLightMode ? 'bg-[#080c14] border-slate-800 text-slate-200' : 'bg-[#080c14] border-slate-800 text-slate-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800 bg-black/60">
          <div className="flex items-center gap-2 min-w-0">
            <Terminal className="w-4 h-4 text-orange-500 shrink-0" />
            <span className="text-xs font-mono font-bold text-orange-400 truncate">
              spherepay-agent-daemon.log, live event pipeline
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Nostr Relay: wss://relay.unicity.network</span>
          </div>
        </div>

        <div className="p-4 space-y-3 font-mono text-xs max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 border-b border-slate-800/40 pb-2.5">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                log.type === 'PAYMENT_RECEIVED'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : log.type === 'FULFILLED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}>
                {log.type}
              </span>
              <div className="space-y-1 w-full">
                <p className="text-slate-300 leading-relaxed">{log.message}</p>
                {log.meta && (
                  <div className="text-[11px] text-slate-500 flex flex-wrap gap-3">
                    {Object.entries(log.meta).map(([k, v]) => (
                      <span key={k}>
                        {k}: <span className="text-orange-400 font-bold">{String(v)}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
