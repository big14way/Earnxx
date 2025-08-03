// Chainlink Configuration for EarnX Protocol
module.exports = {
  // Sepolia Testnet Configuration
  sepolia: {
    // Chainlink Functions
    functions: {
      subscriptionId: 15721,
      router: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
      donId: "fun-ethereum-sepolia-1",
      gasLimit: 300000,
      apiUrl: "https://earnx.onrender.com/api/verification/chainlink-verify"
    },
    
    // Chainlink VRF v2
    vrf: {
      subscriptionId: "70683346938964543134051941086398146463176953067130935661041094624628466133908",
      coordinator: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
      keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
      callbackGasLimit: 100000,
      requestConfirmations: 3,
      numWords: 1
    },
    
    // Price Feeds
    priceFeeds: {
      ETH_USD: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
      BTC_USD: "0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43",
      USDC_USD: "0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E",
      LINK_USD: "0xc59E3633BAAC79493d908e63626716e204A45EdF"
    }
  },
  
  // Morph Testnet Configuration (if needed)
  morphTestnet: {
    functions: {
      subscriptionId: 15721, // Same subscription if cross-chain
      gasLimit: 300000,
      apiUrl: "https://earnx.onrender.com/api/verification/chainlink-verify"
    },
    
    vrf: {
      subscriptionId: "70683346938964543134051941086398146463176953067130935661041094624628466133908",
      callbackGasLimit: 100000,
      requestConfirmations: 3,
      numWords: 1
    }
  },
  
  // Common settings
  common: {
    timeout: 30000,
    retries: 3,
    responseThreshold: 256 // bytes - Chainlink Functions response limit
  }
};