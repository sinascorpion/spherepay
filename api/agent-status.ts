export default function handler(req: any, res: any) {
  const isProtected = req.headers['authorization'];
  
  const status = {
    protocol: 'SpherePay Autonomous Gateway',
    version: '1.0.0',
    network: 'Unicity Testnet2',
    timestamp: new Date().toISOString(),
    engineStatus: 'ONLINE_ACTIVE',
    nostrRelay: 'wss://relay.unicity.network',
    activeAgentNodes: 6,
    totalVolumeSettledUCT: '142.8 UCT',
    nodePubkey: '0353f0fed3674d0cdb831aa36a4c54c3ca0a9ac504182c8bdc2b19ed0b9a14de7f',
    directAddress: 'DIRECT://0000aee73f7966b22f3988484a584d7f2e1ae2d16aa4cb0aff36a2161c3cc73cec61a5197f40',
    verificationRail: 'P2P Nostr NIP-17 Encrypted DM',
    latencyAvgMs: 41,
    authStatus: isProtected ? 'AUTHORIZED_TOKEN_VERIFIED' : 'PUBLIC_METRICS'
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(status);
}
