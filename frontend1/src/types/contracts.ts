export interface ContractConfig {
  address: string;
  abi: any[];
}

export interface ChainlinkFeeds {
  ETH_USD: string;
  USDC_USD: string;
}

export const CHAIN_CONFIG = {
  MORPH_TESTNET: {
    chainId: 2810,
    name: 'Morph Testnet',
    rpcUrl: 'https://rpc-quicknode-holesky.morphl2.io',
  }
};
