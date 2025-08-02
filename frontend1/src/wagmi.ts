// src/wagmi.ts - Wagmi v2.9+ Config
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Morph testnet chain
export const morphTestnet = defineChain({
  id: 2810,
  name: 'Morph Testnet',
  network: 'morph-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc-quicknode-holesky.morphl2.io'] },
    default: { http: ['https://rpc-quicknode-holesky.morphl2.io'] },
  },
  blockExplorers: {
    default: { name: 'Morph Explorer', url: 'https://explorer-holesky.morphl2.io' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'EarnX Protocol',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '2f05a7cde2bb14fabf75a97db2e9023f',
  chains: [morphTestnet],
  ssr: false,
});