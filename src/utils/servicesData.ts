export interface AIService {
  id: string;
  name: string;
  category: 'LLM & Reasoning' | 'Image & Media' | 'Search & Scraping' | 'Security & Audit' | 'Agent Memory';
  description: string;
  pricePerCall: number; // in UCT
  unit: string;
  providerNametag: string;
  providerAddress: string;
  endpoint: string;
  latencyMs: number;
  uptimePercent: number;
  sampleInput: string;
  sampleOutput: string;
  tags: string[];
}

export const FEATURED_SERVICES: AIService[] = [
  {
    id: 'deepseek-r1-unfiltered',
    name: 'DeepSeek-R1 Autonomous Reasoning',
    category: 'LLM & Reasoning',
    description: 'Ultra-fast chain-of-thought LLM execution for autonomous agent decision making and complex mathematical/symbolic deduction.',
    pricePerCall: 0.5,
    unit: 'call',
    providerNametag: '@r1_oracle',
    providerAddress: '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604',
    endpoint: 'https://api.spherepay.network/v1/reasoning',
    latencyMs: 340,
    uptimePercent: 99.98,
    sampleInput: '{"prompt": "Analyze arbitrage opportunity between Unicity Nostr Orderbook and L1 Fulcrum", "temperature": 0.2}',
    sampleOutput: '{"status": "success", "recommendation": "EXECUTE_SWAP", "confidence": 0.984, "expected_yield_pct": 3.42}',
    tags: ['CoT', 'Reasoning', 'Low-Latency']
  },
  {
    id: 'flux-cyber-gen',
    name: 'FLUX.1 Pro Visual Generator',
    category: 'Image & Media',
    description: 'Next-gen photorealistic image synthesis for agent avatar creation, dynamic UI elements, and marketing asset generation.',
    pricePerCall: 2.0,
    unit: 'image',
    providerNametag: '@flux_station',
    providerAddress: '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604',
    endpoint: 'https://api.spherepay.network/v1/generate-image',
    latencyMs: 1200,
    uptimePercent: 99.95,
    sampleInput: '{"prompt": "Cybernetic autonomous banking terminal with glowing neon orange circuits", "aspect_ratio": "1:1"}',
    sampleOutput: '{"status": "rendered", "image_ipfs": "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi"}',
    tags: ['Image', 'FLUX', 'Creative']
  },
  {
    id: 'agent-web-crawler',
    name: 'Stealth Web Scraper & Real-time SERP',
    category: 'Search & Scraping',
    description: 'Bypass Cloudflare and extract clean markdown text from any web page or live search engine query with residential proxy routing.',
    pricePerCall: 0.25,
    unit: 'scrape',
    providerNametag: '@crawler_agent',
    providerAddress: '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604',
    endpoint: 'https://api.spherepay.network/v1/scrape',
    latencyMs: 480,
    uptimePercent: 99.92,
    sampleInput: '{"url": "https://news.ycombinator.com", "format": "markdown", "render_js": true}',
    sampleOutput: '{"markdown": "# Hacker News\n1. Autonomous Economy Takes Off on Unicity (unicity.ai)..."}',
    tags: ['Web', 'Extraction', 'Fast']
  },
  {
    id: 'smart-contract-auditor',
    name: 'Agentic Code Security & Bytecode Audit',
    category: 'Security & Audit',
    description: 'Automated vulnerability scanner for Unicity token state transitions, predicates, and agent signing verification rules.',
    pricePerCall: 5.0,
    unit: 'audit',
    providerNametag: '@shield_guard',
    providerAddress: '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604',
    endpoint: 'https://api.spherepay.network/v1/audit-code',
    latencyMs: 1850,
    uptimePercent: 100.0,
    sampleInput: '{"code": "async function transfer() { await sphere.send(to, amount); }", "check_reentrancy": true}',
    sampleOutput: '{"vulnerabilities_found": 0, "security_score": 100, "certified_hash": "0x8f23...a9b"}',
    tags: ['Security', 'Formal Verification']
  },
  {
    id: 'vector-memory-store',
    name: 'Hierarchical Agent Vector Memory',
    category: 'Agent Memory',
    description: 'Persistent encrypted semantic memory for autonomous agents with cosine similarity search and automatic knowledge condensation.',
    pricePerCall: 0.1,
    unit: 'query',
    providerNametag: '@cortex_db',
    providerAddress: '038aa8b43b8b62032dd21d5fa74632e5bcd52763d75689a70d090bb6e7c8ad0604',
    endpoint: 'https://api.spherepay.network/v1/memory',
    latencyMs: 110,
    uptimePercent: 99.99,
    sampleInput: '{"query": "What was the previous agreement reached with @alice regarding API bandwidth?", "top_k": 3}',
    sampleOutput: '{"matches": [{"similarity": 0.94, "memory": "Agreed on 10,000 requests @ 0.05 UCT/req on 2026-09-02"}]}',
    tags: ['Embeddings', 'Nostr-Encrypted']
  }
];

export interface PaymentInvoice {
  invoiceId: string;
  serviceId: string;
  serviceName: string;
  amountUCT: number;
  recipientAddress: string;
  recipientNametag: string;
  status: 'PENDING' | 'SETTLING' | 'SETTLED' | 'DELIVERED';
  createdAt: number;
  paidAt?: number;
  apiKey?: string;
  executionResult?: string;
}
