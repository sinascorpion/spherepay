import React from 'react';
import { AlertTriangle, Lock, RefreshCw } from 'lucide-react';

interface OutcomeUnknownBannerProps {
  message?: string;
  onAcknowledge: () => void;
  isLightMode?: boolean;
}

export const OutcomeUnknownBanner: React.FC<OutcomeUnknownBannerProps> = ({
  message,
  onAcknowledge,
  isLightMode,
}) => {
  return (
    <div
      className={`p-4 rounded-xl border flex flex-col gap-3 my-4 transition-all ${
        isLightMode
          ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
          : 'bg-amber-950/40 border-amber-600/50 text-amber-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <h4 className="font-bold text-sm sm:text-base">
          Payment Outcome Unknown (Intent Guard Active)
        </h4>
      </div>

      <p className="text-xs leading-relaxed opacity-90">
        The wallet accepted the payment request, but the settlement response did not return in time
        (Protocol <code className="font-mono bg-black/20 px-1 py-0.5 rounded">INTENT_OUTCOME_UNKNOWN (4201)</code>).
        <strong className="block mt-1 text-amber-400">
          ⚠️ Action locked: Do NOT immediately retry the payment! A retry can pay twice.
        </strong>
      </p>

      {message && (
        <div className="text-[11px] font-mono opacity-75 truncate bg-black/20 px-2 py-1 rounded">
          {message}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-amber-500/20">
        <span className="text-[11px] opacity-70 flex items-center gap-1">
          <Lock className="w-3.5 h-3.5" /> Form safely protected
        </span>
        <button
          type="button"
          onClick={onAcknowledge}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          I verified my wallet — Unlock
        </button>
      </div>
    </div>
  );
};
