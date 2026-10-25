/**
 * Which network this dApp declares in the Connect handshake, and where that choice comes from.
 *
 * The handshake carries the dApp's network and the wallet's compatibility gate compares it with
 * its own by `id`, refusing a mismatch with INCOMPATIBLE_NETWORK (4008).
 */
import { SPHERE_NETWORKS } from '@unicitylabs/sphere-sdk/connect';
import type { NetworkInfo } from '@unicitylabs/sphere-sdk/connect';

export const NETWORK_STORAGE_KEY = 'spherepay-connect-network';

const REGISTRY: Readonly<Record<string, NetworkInfo>> = SPHERE_NETWORKS;

function registryEntry(name: string): NetworkInfo | undefined {
  return Object.hasOwn(REGISTRY, name) ? REGISTRY[name] : undefined;
}

function registryKey(network: NetworkInfo): string | undefined {
  return Object.keys(REGISTRY).find((key) => REGISTRY[key]?.id === network.id);
}

export function formatNetwork(value: unknown): string | null {
  if (typeof value !== 'object' || value === null) return null;
  const { id, name } = value as { id?: unknown; name?: unknown };
  if (typeof id !== 'number') return null;
  const label =
    (typeof name === 'string' && name.length > 0 ? name : null) ??
    Object.values(REGISTRY).find((n) => n.id === id)?.name;
  return label ?? `network ${id}`;
}

export interface NetworkOption {
  readonly key: string;
  readonly network: NetworkInfo;
  readonly label: string;
}

export function networkOptions(): NetworkOption[] {
  return Object.entries(REGISTRY).map(([key, network]) => ({
    key,
    network,
    label: formatNetwork(network) ?? key,
  }));
}

export function envNetwork(name: string | undefined): NetworkInfo {
  if (!name) return SPHERE_NETWORKS.testnet2;
  const network = registryEntry(name);
  if (network) return network;
  return SPHERE_NETWORKS.testnet2;
}

export function readStoredNetwork(): NetworkInfo | null {
  try {
    const key = localStorage.getItem(NETWORK_STORAGE_KEY);
    return key === null ? null : (registryEntry(key) ?? null);
  } catch {
    return null;
  }
}

export function storeNetwork(network: NetworkInfo): void {
  const key = registryKey(network);
  if (!key) return;
  try {
    localStorage.setItem(NETWORK_STORAGE_KEY, key);
  } catch {
    // ignore
  }
}
