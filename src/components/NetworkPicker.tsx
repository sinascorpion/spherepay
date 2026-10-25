import React from 'react';
import { networkOptions } from '../lib/networks';
import type { NetworkInfo } from '@unicitylabs/sphere-sdk/connect';
import { Globe } from 'lucide-react';

interface NetworkPickerProps {
  currentNetwork: NetworkInfo;
  onSelectNetwork: (network: NetworkInfo) => void;
  disabled?: boolean;
  isLightMode?: boolean;
}

export const NetworkPicker: React.FC<NetworkPickerProps> = ({
  currentNetwork,
  onSelectNetwork,
  disabled = false,
  isLightMode = false,
}) => {
  const options = networkOptions();

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Globe className={`w-3.5 h-3.5 ${isLightMode ? 'text-gray-500' : 'text-gray-400'}`} />
      <select
        value={currentNetwork.id}
        disabled={disabled}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const option = options.find((opt) => opt.network.id === selectedId);
          if (option) {
            onSelectNetwork(option.network);
          }
        }}
        className={`px-2 py-1 rounded border text-xs font-mono font-medium outline-none transition-all cursor-pointer ${
          disabled
            ? 'opacity-60 cursor-not-allowed bg-transparent'
            : isLightMode
            ? 'bg-white border-orange-200 text-gray-800 hover:border-orange-400 shadow-sm'
            : 'bg-black/40 border-white/10 text-orange-400 hover:border-orange-500/50'
        }`}
        title={disabled ? 'Disconnect wallet to switch networks' : 'Select target Unicity network'}
      >
        {options.map((opt) => (
          <option key={opt.key} value={opt.network.id} className="bg-neutral-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
