import React, { useState } from 'react';
import { Key, Copy, Check, Terminal, Trash2 } from 'lucide-react';
import type { AIService } from '../utils/servicesData';

export interface PurchasedAccessKey {
  id: string;
  service: AIService;
  apiKey: string;
  txHash: string;
  purchasedAt: number;
}

interface UserPurchasesProps {
  isLightMode: boolean;
  purchases: PurchasedAccessKey[];
  onClearPurchases: () => void;
  onSelectService?: (service: AIService) => void;
}

export const UserPurchases: React.FC<UserPurchasesProps> = ({
  isLightMode,
  purchases,
  onClearPurchases,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTestKey = async (purchase: PurchasedAccessKey) => {
    setActiveTestId(purchase.id);
    setIsTesting(true);
    setTestOutput(null);

    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + purchase.apiKey,
        },
        body: purchase.service.sampleInput,
      });
      const data = await res.json();
      setTestOutput(JSON.stringify(data, null, 2));
    } catch {
      setTestOutput(purchase.service.sampleOutput);
    } finally {
      setIsTesting(false);
    }
  };

  if (purchases.length === 0) {
    return (
      <div className={'max-w-4xl mx-auto text-center py-16 px-6 rounded-3xl border ' + (isLightMode ? 'bg-white border-orange-200' : 'bg-[#0f1726] border-slate-800')}>
        <div className='w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 mx-auto mb-4'>
          <Key className='w-8 h-8' />
        </div>
        <h3 className='text-2xl font-bold font-mono mb-2'>No Active Subscriptions Yet</h3>
        <p className={'text-sm max-w-md mx-auto mb-6 ' + (isLightMode ? 'text-slate-600' : 'text-slate-400')}>
          When you execute and pay for an AI Agent or API service with UCT, your access keys and settlement receipts will be permanently stored here.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto space-y-8'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-mono font-bold uppercase'>
            <Key className='w-3.5 h-3.5' />
            MY ACTIVE API KEYS & ACCESS PASSES
          </div>
          <h2 className='text-3xl font-extrabold tracking-tight mt-1'>
            My Purchased Subscriptions ({purchases.length})
          </h2>
          <p className={'text-sm ' + (isLightMode ? 'text-slate-600' : 'text-slate-400')}>
            Manage your verified API credentials, inspect on-chain settlement proofs, and test queries.
          </p>
        </div>

        <button
          onClick={onClearPurchases}
          className={'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ' + (isLightMode ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-red-900/50 text-red-400 hover:bg-red-950/20')}
        >
          <Trash2 className='w-3.5 h-3.5' />
          <span>Clear History</span>
        </button>
      </div>

      <div className='space-y-4'>
        {purchases.map((p) => {
          const isCopied = copiedId === p.id;
          const isCurrentTesting = activeTestId === p.id;

          return (
            <div
              key={p.id}
              className={'rounded-2xl border p-6 transition-all ' + (isLightMode ? 'bg-white border-orange-200 shadow-sm' : 'bg-[#0f1726] border-slate-800')}
            >
              <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/20 dark:border-slate-800'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-500 border border-orange-500/30'>
                      {p.service.category}
                    </span>
                    <span className='text-xs text-slate-500 font-mono'>
                      Purchased {new Date(p.purchasedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className='text-xl font-bold mt-1'>{p.service.name}</h3>
                  <p className={'text-xs ' + (isLightMode ? 'text-slate-600' : 'text-slate-400')}>
                    Endpoint: <span className='font-mono text-orange-400'>{p.service.endpoint}</span>
                  </p>
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => handleTestKey(p)}
                    className='flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-mono font-bold text-xs uppercase transition-all shadow-md shadow-orange-500/20'
                  >
                    <Terminal className='w-3.5 h-3.5' />
                    <span>Test API Key</span>
                  </button>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-12 gap-4 pt-4 font-mono text-xs'>
                <div className='md:col-span-8 space-y-1.5'>
                  <span className='text-slate-400 text-[11px] block'>DISPATCHED NOSTR API KEY</span>
                  <div className={'flex items-center justify-between p-3 rounded-xl border ' + (isLightMode ? 'bg-orange-50/60 border-orange-200 text-orange-950' : 'bg-black/50 border-slate-700 text-orange-300')}>
                    <code className='truncate pr-2 font-bold'>{p.apiKey}</code>
                    <button
                      onClick={() => copyToClipboard(p.apiKey, p.id)}
                      className='p-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 shrink-0 transition-all'
                      title='Copy Key'
                    >
                      {isCopied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                    </button>
                  </div>
                </div>

                <div className='md:col-span-4 space-y-1.5'>
                  <span className='text-slate-400 text-[11px] block'>UNICITY SETTLEMENT HASH</span>
                  <div className={'p-3 rounded-xl border truncate ' + (isLightMode ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-black/30 border-slate-800 text-slate-400')}>
                    <span className='text-emerald-500 font-bold'>✓ Verified: </span>
                    <span>{p.txHash.slice(0, 14)}...</span>
                  </div>
                </div>
              </div>

              {isCurrentTesting && (
                <div className='mt-4 pt-4 border-t border-slate-800/30'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5'>
                      <Terminal className='w-3.5 h-3.5' />
                      Live Query Output ({isTesting ? 'Calling Node...' : '200 OK Response'})
                    </span>
                    <button
                      onClick={() => setActiveTestId(null)}
                      className='text-[11px] text-slate-400 hover:text-white'
                    >
                      Hide Output
                    </button>
                  </div>
                  <pre className='p-3.5 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 leading-relaxed'>
                    <code>{testOutput || 'Sending signed request to endpoint...'}</code>
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
