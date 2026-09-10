import { useState, useRef, useCallback, useEffect } from 'react';
import { ConnectClient, HOST_READY_TYPE, HOST_READY_TIMEOUT, WALLET_EVENTS, SPHERE_NETWORKS, INTENT_ACTIONS } from '@unicitylabs/sphere-sdk/connect';
import { PostMessageTransport, ExtensionTransport } from '@unicitylabs/sphere-sdk/connect/browser';
import type { ConnectTransport, PublicIdentity } from '@unicitylabs/sphere-sdk/connect';
import { isInIframe, hasExtension } from '../lib/detection';
import { describeConnectFailure } from '../lib/connectErrors';
import { supportsGracefulLock } from '../lib/walletProtocol';

export const SPHEREPAY_AGENT_ADDRESS = '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604';
export const UCT_COIN_ID = '7fc5d3a3c480c8606d25b381ed64e9c79560ec0243628691c978f40226d06c86';

const WALLET_URL = 'https://sphere.unicity.network';
const SESSION_KEY_POPUP = 'spherepay-connect-popup-session';
const POPUP_NAME = 'sphere-wallet';
const POPUP_FEATURES = 'width=420,height=650';

function walletConnectUrl(): string {
  return WALLET_URL + '/connect?origin=' + encodeURIComponent(window.location.origin);
}

function popupSessionId(): string | null {
  return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(SESSION_KEY_POPUP);
}

const DAPP_META = {
  name: 'SpherePay Protocol',
  description: 'Autonomous AI Agent Payment Gateway on Unicity Network',
  url: typeof window !== 'undefined' ? window.location.origin : '',
} as const;

function waitForHostReady(timeoutMs = HOST_READY_TIMEOUT): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
      reject(new Error('Wallet popup timed out. Please keep the popup open and unlock your Sphere account.'));
    }, timeoutMs);

    function handler(event: MessageEvent) {
      if (event.data?.type === HOST_READY_TYPE) {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        resolve();
      }
    }
    window.addEventListener('message', handler);
  });
}

export interface WalletConnectState {
  isConnected: boolean;
  isConnecting: boolean;
  isWalletLocked: boolean;
  walletChanged: boolean;
  unlockEpoch: number;
  walletProtocol: string | null;
  identity: PublicIdentity | null;
  error: string | null;
}

const DISCONNECTED: WalletConnectState = {
  isConnected: false,
  isConnecting: false,
  isWalletLocked: false,
  walletChanged: false,
  unlockEpoch: 0,
  walletProtocol: null,
  identity: null,
  error: null,
};

export function useWalletConnect() {
  const willSilentCheck = typeof window !== 'undefined' && (isInIframe() || hasExtension() || !!sessionStorage.getItem(SESSION_KEY_POPUP));
  const [isAutoConnecting, setIsAutoConnecting] = useState(willSilentCheck);
  const [state, setState] = useState<WalletConnectState>(DISCONNECTED);

  const clientRef = useRef<ConnectClient | null>(null);
  const transportRef = useRef<ConnectTransport | null>(null);
  const popupRef = useRef<Window | null>(null);
  const popupMode = useRef(false);

  const identityRef = useRef<PublicIdentity | null>(null);
  useEffect(() => {
    identityRef.current = state.identity;
  }, [state.identity]);

  const isConnectedRef = useRef(false);
  useEffect(() => {
    isConnectedRef.current = state.isConnected;
  }, [state.isConnected]);

  const attemptInFlightRef = useRef(false);

  const makeClient = useCallback(
    (transport: ConnectTransport, extra: { resumeSessionId?: string; silent?: boolean } = {}): ConnectClient =>
      new ConnectClient({
        transport,
        dapp: DAPP_META,
        network: SPHERE_NETWORKS.testnet2,
        ...extra,
      }),
    [],
  );

  const handshake = useCallback(
    async (transport: ConnectTransport, extra: { resumeSessionId?: string; silent?: boolean } = {}) => {
      const client = makeClient(transport, extra);
      clientRef.current = client;
      const result = await client.connect();
      if (popupMode.current && result.sessionId) {
        sessionStorage.setItem(SESSION_KEY_POPUP, result.sessionId);
      }
      setState({
        ...DISCONNECTED,
        isConnected: true,
        isWalletLocked: result.locked === true,
        identity: result.identity,
        walletProtocol: client.walletProtocol,
      });
      return result;
    },
    [makeClient],
  );

  const rehandshaking = useRef(false);

  const rehandshake = useCallback(async () => {
    if (rehandshaking.current) return;
    rehandshaking.current = true;
    try {
      const wasPopup = popupMode.current;
      if (!wasPopup && !isInIframe()) return;
      if (wasPopup && (!popupRef.current || popupRef.current.closed)) return;

      transportRef.current?.destroy();
      const transport = wasPopup
        ? PostMessageTransport.forClient({ target: popupRef.current!, targetOrigin: WALLET_URL })
        : PostMessageTransport.forClient();
      transportRef.current = transport;

      const resumeSessionId = wasPopup ? sessionStorage.getItem(SESSION_KEY_POPUP) ?? undefined : undefined;
      await handshake(transport, { resumeSessionId, silent: true });
    } catch {
      // Background re-handshake fails silently
    } finally {
      rehandshaking.current = false;
    }
  }, [handshake]);

  const retryAfterUnlock = useCallback(async () => {
    if (rehandshaking.current) return;
    rehandshaking.current = true;
    try {
      const popup = popupRef.current;
      if (!popup || popup.closed) return;
      transportRef.current?.destroy();
      const transport = PostMessageTransport.forClient({ target: popup, targetOrigin: WALLET_URL });
      transportRef.current = transport;
      const resumeSessionId = sessionStorage.getItem(SESSION_KEY_POPUP) ?? undefined;
      await handshake(transport, { resumeSessionId });
    } catch {
      // Will be retried on next announcement
    } finally {
      rehandshaking.current = false;
    }
  }, [handshake]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== HOST_READY_TYPE) return;
      if (attemptInFlightRef.current) return;
      if (isConnectedRef.current) {
        void rehandshake();
        return;
      }
      if (!popupMode.current || !popupRef.current || popupRef.current.closed) return;
      void retryAfterUnlock();
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [rehandshake, retryAfterUnlock]);

  const openPopupAndConnect = useCallback(async (): Promise<ConnectClient> => {
    attemptInFlightRef.current = true;
    try {
      let openedFreshWindow = false;
      if (!popupRef.current || popupRef.current.closed) {
        const existing = window.open('', POPUP_NAME, POPUP_FEATURES);
        const looksReusable = !!existing && !existing.closed && !!popupSessionId();
        if (looksReusable) {
          popupRef.current = existing;
        } else {
          const popup = window.open(walletConnectUrl(), POPUP_NAME, POPUP_FEATURES);
          if (!popup) {
            throw new Error('Popup blocked. Please allow popups for spherepay in your browser settings.');
          }
          popupRef.current = popup;
          openedFreshWindow = true;
        }
      } else {
        popupRef.current.focus();
      }

      transportRef.current?.destroy();
      const transport = PostMessageTransport.forClient({
        target: popupRef.current,
        targetOrigin: WALLET_URL,
      });
      transportRef.current = transport;

      if (openedFreshWindow) {
        await waitForHostReady();
      }

      const resumeSessionId = sessionStorage.getItem(SESSION_KEY_POPUP) ?? undefined;
      await handshake(transport, { resumeSessionId });
      return clientRef.current!;
    } finally {
      attemptInFlightRef.current = false;
    }
  }, [handshake]);

  const connectViaExtension = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      popupMode.current = false;
      const transport = ExtensionTransport.forClient();
      transportRef.current = transport;
      await handshake(transport);
    } catch (err) {
      const msg = describeConnectFailure(err);
      setState((s) => ({ ...s, isConnecting: false, error: msg }));
      alert(msg);
    }
  }, [handshake]);

  const connectViaPopup = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      if (isInIframe()) {
        popupMode.current = false;
        const transport = PostMessageTransport.forClient();
        transportRef.current = transport;
        await handshake(transport);
      } else {
        popupMode.current = true;
        await openPopupAndConnect();
      }
    } catch (err) {
      const msg = describeConnectFailure(err);
      setState((s) => ({ ...s, isConnecting: false, error: msg }));
      alert(msg);
    }
  }, [openPopupAndConnect, handshake]);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      if (isInIframe()) {
        popupMode.current = false;
        const transport = PostMessageTransport.forClient();
        transportRef.current = transport;
        await handshake(transport);
      } else if (hasExtension()) {
        await connectViaExtension();
      } else {
        await connectViaPopup();
      }
    } catch (err) {
      const msg = describeConnectFailure(err);
      setState((s) => ({ ...s, isConnecting: false, error: msg }));
      alert(msg);
    }
  }, [connectViaExtension, connectViaPopup, handshake]);

  const disconnect = useCallback(async () => {
    try {
      await clientRef.current?.disconnect();
    } catch {}
    transportRef.current?.destroy();
    clientRef.current = null;
    transportRef.current = null;
    popupRef.current?.close();
    popupRef.current = null;
    popupMode.current = false;
    sessionStorage.removeItem(SESSION_KEY_POPUP);
    setState(DISCONNECTED);
  }, []);

  const resetSession = useCallback(() => {
    sessionStorage.clear();
    clientRef.current = null;
    transportRef.current = null;
    popupRef.current = null;
    popupMode.current = false;
    setState(DISCONNECTED);
    window.location.reload();
  }, []);

  // Poll for popup window closure
  useEffect(() => {
    if (!state.isConnected || !popupMode.current) return;

    const interval = setInterval(() => {
      if (popupRef.current && popupRef.current.closed) {
        clearInterval(interval);
        transportRef.current?.destroy();
        clientRef.current = null;
        transportRef.current = null;
        popupRef.current = null;
        popupMode.current = false;
        sessionStorage.removeItem(SESSION_KEY_POPUP);
        setState(DISCONNECTED);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isConnected]);

  // Wallet event subscriptions
  useEffect(() => {
    if (!state.isConnected || !clientRef.current) return;
    const client = clientRef.current;

    const unsubLocked = client.on(WALLET_EVENTS.LOCKED, () => {
      if (!supportsGracefulLock(client.walletProtocol)) {
        transportRef.current?.destroy();
        clientRef.current = null;
        transportRef.current = null;
        popupRef.current = null;
        popupMode.current = false;
        sessionStorage.removeItem(SESSION_KEY_POPUP);
        setState(DISCONNECTED);
        return;
      }
      setState((s) => ({ ...s, isWalletLocked: true }));
    });

    const unsubUnlocked = client.on(WALLET_EVENTS.UNLOCKED, (data) => {
      const next = (data as { identity?: PublicIdentity } | undefined)?.identity ?? null;
      const previous = identityRef.current;
      const sameWallet = !!next && !!previous && next.chainPubkey === previous.chainPubkey;

      if (!sameWallet) {
        setState((s) => ({ ...s, isWalletLocked: false, walletChanged: true, identity: next ?? s.identity }));
        return;
      }

      setState((s) => ({ ...s, isWalletLocked: false, walletChanged: false, unlockEpoch: s.unlockEpoch + 1 }));
    });

    const unsubDisconnected = client.on(WALLET_EVENTS.DISCONNECTED, () => {
      transportRef.current?.destroy();
      clientRef.current = null;
      transportRef.current = null;
      popupRef.current = null;
      popupMode.current = false;
      sessionStorage.removeItem(SESSION_KEY_POPUP);
      setState(DISCONNECTED);
    });

    const unsubIdentity = client.on(WALLET_EVENTS.IDENTITY_CHANGED, (data) => {
      setState((s) => ({ ...s, isWalletLocked: false, walletChanged: false, identity: data as PublicIdentity }));
    });

    return () => {
      unsubLocked();
      unsubUnlocked();
      unsubDisconnected();
      unsubIdentity();
    };
  }, [state.isConnected]);

  // Auto-connect on mount
  useEffect(() => {
    if (isInIframe()) {
      const silentCheck = async () => {
        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            window.removeEventListener('message', readyHandler);
            reject(new Error('Host not ready'));
          }, 5000);
          function readyHandler(e: MessageEvent) {
            if (e.data?.type === HOST_READY_TYPE) {
              clearTimeout(timer);
              window.removeEventListener('message', readyHandler);
              resolve();
            }
          }
          window.addEventListener('message', readyHandler);
        });

        popupMode.current = false;
        const transport = PostMessageTransport.forClient();
        transportRef.current = transport;
        try {
          await handshake(transport, { silent: true });
        } catch {
          transportRef.current?.destroy();
          clientRef.current = null;
          transportRef.current = null;
        }
      };
      silentCheck().finally(() => setIsAutoConnecting(false));
      return;
    }

    if (hasExtension()) {
      const silentCheck = async () => {
        popupMode.current = false;
        const transport = ExtensionTransport.forClient();
        transportRef.current = transport;

        try {
          await handshake(transport, { silent: true });
        } catch {
          transportRef.current?.destroy();
          clientRef.current = null;
          transportRef.current = null;
        }
      };
      silentCheck().finally(() => setIsAutoConnecting(false));
    } else {
      const savedSession = sessionStorage.getItem(SESSION_KEY_POPUP);
      if (savedSession) {
        popupMode.current = true;
        const resumePopup = async () => {
          const existing =
            popupRef.current && !popupRef.current.closed
              ? popupRef.current
              : window.open('', POPUP_NAME, POPUP_FEATURES);

          if (existing && !existing.closed) {
            popupRef.current = existing;
            transportRef.current?.destroy();
            const transport = PostMessageTransport.forClient({
              target: existing,
              targetOrigin: WALLET_URL,
            });
            transportRef.current = transport;
            try {
              await handshake(transport, { resumeSessionId: savedSession, silent: true });
              return;
            } catch {}
          }

          const popup = window.open(walletConnectUrl(), POPUP_NAME, POPUP_FEATURES);
          if (!popup) throw new Error('Popup blocked');
          popupRef.current = popup;

          transportRef.current?.destroy();
          const transport = PostMessageTransport.forClient({
            target: popup,
            targetOrigin: WALLET_URL,
          });
          transportRef.current = transport;

          await waitForHostReady(5000);
          await handshake(transport, { resumeSessionId: savedSession, silent: true });
        };
        resumePopup()
          .catch(() => {
            sessionStorage.removeItem(SESSION_KEY_POPUP);
            transportRef.current?.destroy();
            clientRef.current = null;
            transportRef.current = null;
            popupRef.current = null;
            popupMode.current = false;
          })
          .finally(() => setIsAutoConnecting(false));
      } else {
        setIsAutoConnecting(false);
      }
    }
  }, [handshake]);

  const getClient = () => clientRef.current;

  /**
   * Pay for an AI Service / API Endpoint via Unicity Payment Intent
   */
  const payForService = async (amount: number, recipient: string = SPHEREPAY_AGENT_ADDRESS): Promise<boolean> => {
    if (!clientRef.current) return false;
    try {
      await clientRef.current.intent(INTENT_ACTIONS.SEND, {
        to: recipient,
        amount: String(amount),
        coinId: UCT_COIN_ID,
      });
      return true;
    } catch (e) {
      console.error('SpherePay: Payment intent failed', e);
      return false;
    }
  };

  /**
   * Self-Mint test tokens for testing the gateway
   */
  const mintTestUCT = async (amount: number = 100): Promise<boolean> => {
    if (!clientRef.current) return false;
    try {
      await clientRef.current.intent(INTENT_ACTIONS.MINT, {
        coinId: UCT_COIN_ID,
        amount: String(amount),
      });
      return true;
    } catch (e) {
      console.error('SpherePay: Mint intent failed', e);
      return false;
    }
  };

  return {
    ...state,
    isAutoConnecting,
    connect,
    connectViaExtension,
    connectViaPopup,
    disconnect,
    resetSession,
    getClient,
    payForService,
    mintTestUCT,
  };
}
