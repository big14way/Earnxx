# {PROJECT_NAME} - Complete Build Guide

**Build Your Own RWA Trade Finance Protocol from Scratch**

This comprehensive guide will help you recreate the entire YieldX Protocol architecture with your own project name and deploy to Morph Testnet.

## 🎯 Project Overview

{PROJECT_NAME} is a sophisticated Real-World Asset (RWA) tokenization platform for trade finance that integrates:
- **Smart Contract Architecture**: 8 modular Solidity contracts
- **Chainlink Integration**: 6 oracle services (Functions, Price Feeds, VRF, Automation, CCIP, PoR)
- **React Frontend**: Modern Web3 interface with wagmi/RainbowKit
- **NestJS API**: Document verification and risk assessment service
- **IPFS Integration**: Decentralized document storage
- **Multi-Network Deployment**: Focus on Morph Testnet

---

## 📋 Table of Contents

1. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
2. [Project Structure Creation](#project-structure-creation)
3. [Smart Contract Development](#smart-contract-development)
4. [Frontend Development](#frontend-development)
5. [Backend API Development](#backend-api-development)
6. [Morph Testnet Configuration](#morph-testnet-configuration)
7. [Chainlink Integration Setup](#chainlink-integration-setup)
8. [Deployment Process](#deployment-process)
9. [Testing & Verification](#testing--verification)
10. [Production Deployment](#production-deployment)

---

## 1. Prerequisites & Environment Setup

### Required Software
```bash
# Node.js 18+ and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Git
git --version

# VS Code (recommended)
code --version
```

### Required Accounts & API Keys
- **MetaMask Wallet** with test ETH
- **Infura Account** (for RPC endpoints)
- **Pinata Account** (for IPFS)
- **Etherscan API Keys** (for contract verification)
- **Chainlink Subscription IDs** (Functions & VRF)
- **MongoDB Atlas** (for API database)

### Environment Variables Template
Create a `.env` file in your project root:

```bash
# Network Configuration
INFURA_API_KEY=your_infura_api_key_here
SEPOLIA_PRIVATE_KEY=your_wallet_private_key_here
MORPH_TESTNET_PRIVATE_KEY=your_wallet_private_key_here

# API Keys for Block Explorers
ETHERSCAN_API_KEY=your_etherscan_api_key
MORPH_EXPLORER_API_KEY=your_morph_explorer_api_key

# Chainlink Configuration
CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID=your_functions_subscription_id
CHAINLINK_VRF_SUBSCRIPTION_ID=your_vrf_subscription_id

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# API Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEST_JWT_SECRET=your_jwt_secret_here
API_BASE_URL=https://your-api-domain.com

# Frontend Configuration
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

---

## 2. Project Structure Creation

### Initialize the Project
```bash
# Create project directory
mkdir {project_name}
cd {project_name}

# Initialize Node.js project
npm init -y

# Create directory structure
mkdir -p contracts scripts test deployments
mkdir -p frontend/src/{components,hooks,services,utils,types,pages}
mkdir -p api/src/{verification,health,analytics,config,database}
mkdir -p backend
```

### Root Package.json Configuration
```json
{
  "name": "{project_name}",
  "version": "1.0.0",
  "description": "Tokenized Trade Receivables with Chainlink Integration",
  "main": "index.js",
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "deploy:morph": "hardhat run scripts/deploy.ts --network morph-testnet",
    "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
    "verify:morph": "hardhat verify --network morph-testnet",
    "node": "hardhat node",
    "clean": "hardhat clean",
    "frontend:dev": "cd frontend && npm run dev",
    "frontend:build": "cd frontend && npm run build",
    "api:dev": "cd api && npm run start:dev",
    "api:build": "cd api && npm run build",
    "lint": "solhint 'contracts/**/*.sol'",
    "size:check": "hardhat compile && hardhat size-contracts"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-chai-matchers": "^2.0.8",
    "@nomicfoundation/hardhat-ethers": "^3.0.8",
    "@nomicfoundation/hardhat-ignition": "^0.15.11",
    "@nomicfoundation/hardhat-network-helpers": "^1.0.12",
    "@nomicfoundation/hardhat-toolbox": "^3.0.0",
    "@nomicfoundation/hardhat-verify": "^1.1.0",
    "@typechain/ethers-v6": "^0.4.3",
    "@typechain/hardhat": "^9.1.0",
    "@types/chai": "^4.3.20",
    "@types/mocha": "^10.0.10",
    "@types/node": "^20.4.2",
    "dotenv": "^16.3.1",
    "hardhat": "^2.19.0",
    "hardhat-contract-sizer": "^2.10.0",
    "hardhat-gas-reporter": "^1.0.10",
    "solidity-coverage": "^0.8.16",
    "ts-node": "^10.9.1",
    "typechain": "^8.3.2",
    "typescript": "^5.1.6"
  },
  "dependencies": {
    "@chainlink/contracts": "^1.4.0",
    "@openzeppelin/contracts": "^4.9.6",
    "ethers": "^6.14.3"
  }
}
```

---

## 3. Smart Contract Development

### Hardhat Configuration
Create `hardhat.config.ts`:

```typescript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Critical for stack-safe functions
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 12000000,
      blockGasLimit: 12000000,
      allowUnlimitedContractSize: true,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      gas: 6000000,
      gasPrice: 20000000000,
    },
    'morph-testnet': {
      url: 'https://rpc-quicknode-holesky.morphl2.io',
      accounts: [process.env.MORPH_TESTNET_PRIVATE_KEY],
      chainId: 2810,
      gas: 8000000,
      gasPrice: 2000000000, // 2 gwei
      timeout: 60000,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY,
      'morph-testnet': process.env.MORPH_EXPLORER_API_KEY,
    },
    customChains: [
      {
        network: "morph-testnet",
        chainId: 2810,
        urls: {
          apiURL: "https://explorer-api-holesky.morphl2.io/api",
          browserURL: "https://explorer-holesky.morphl2.io"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
    gasPrice: 20,
  },
  mocha: {
    timeout: 40000
  }
};
```

### Core Smart Contracts

#### 1. Main Protocol Contract (`contracts/{ProjectName}Core.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @title {ProjectName}Core
 * @dev Main protocol contract for tokenized trade receivables
 */
contract {ProjectName}Core is ReentrancyGuard, Pausable, Ownable {
    // Protocol version
    string public constant version = "1.0.0";
    
    // Contract interfaces
    IERC721 public immutable invoiceNFT;
    IERC20 public immutable usdcToken;
    
    // Module addresses
    address public priceManager;
    address public verificationModule;
    address public investmentModule;
    address public vrfModule;
    
    // Protocol configuration
    uint256 public constant MIN_INVESTMENT = 100 * 10**6; // 100 USDC
    uint256 public constant MAX_INVESTMENT = 1000000 * 10**6; // 1M USDC
    uint256 public constant PROTOCOL_FEE = 200; // 2%
    uint256 public constant BASIS_POINTS = 10000;
    
    // Invoice structure
    struct Invoice {
        uint256 id;
        address supplier;
        uint256 amount;
        uint256 maturityDate;
        uint256 yieldRate;
        string commodity;
        string supplierCountry;
        string buyerCountry;
        InvoiceStatus status;
        uint256 totalInvestment;
        uint256 riskScore;
        string creditRating;
        bytes32 documentHash;
        uint256 createdAt;
    }
    
    enum InvoiceStatus {
        Pending,
        Verified,
        Active,
        Matured,
        Defaulted
    }
    
    // Storage
    mapping(uint256 => Invoice) public invoices;
    mapping(uint256 => mapping(address => uint256)) public investments;
    mapping(address => uint256[]) public userInvoices;
    
    uint256 public totalInvoices;
    uint256 public totalFundsRaised;
    
    // Events
    event InvoiceSubmitted(uint256 indexed invoiceId, address indexed supplier, uint256 amount);
    event InvoiceVerified(uint256 indexed invoiceId, uint256 riskScore, string creditRating);
    event InvestmentMade(uint256 indexed invoiceId, address indexed investor, uint256 amount);
    event YieldDistributed(uint256 indexed invoiceId, uint256 totalYield);
    
    constructor(
        address _invoiceNFT,
        address _usdcToken,
        address _priceManager,
        address _verificationModule,
        address _investmentModule,
        address _vrfModule
    ) {
        invoiceNFT = IERC721(_invoiceNFT);
        usdcToken = IERC20(_usdcToken);
        priceManager = _priceManager;
        verificationModule = _verificationModule;
        investmentModule = _investmentModule;
        vrfModule = _vrfModule;
    }
    
    /**
     * @dev Submit new invoice for verification
     */
    function submitInvoice(
        uint256 _amount,
        uint256 _maturityDate,
        string calldata _commodity,
        string calldata _supplierCountry,
        string calldata _buyerCountry,
        string calldata _buyerName,
        bytes32 _documentHash
    ) external whenNotPaused returns (uint256) {
        require(_amount >= MIN_INVESTMENT, "Amount too small");
        require(_maturityDate > block.timestamp, "Invalid maturity date");
        require(bytes(_commodity).length > 0, "Commodity required");
        
        totalInvoices++;
        uint256 invoiceId = totalInvoices;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            supplier: msg.sender,
            amount: _amount,
            maturityDate: _maturityDate,
            yieldRate: 0, // Set after verification
            commodity: _commodity,
            supplierCountry: _supplierCountry,
            buyerCountry: _buyerCountry,
            status: InvoiceStatus.Pending,
            totalInvestment: 0,
            riskScore: 0,
            creditRating: "",
            documentHash: _documentHash,
            createdAt: block.timestamp
        });
        
        userInvoices[msg.sender].push(invoiceId);
        
        // Trigger Chainlink Functions verification
        _requestVerification(invoiceId, _documentHash, _commodity, _amount, _supplierCountry, _buyerCountry, _buyerName);
        
        emit InvoiceSubmitted(invoiceId, msg.sender, _amount);
        return invoiceId;
    }
    
    /**
     * @dev Internal function to request verification
     */
    function _requestVerification(
        uint256 _invoiceId,
        bytes32 _documentHash,
        string memory _commodity,
        uint256 _amount,
        string memory _supplierCountry,
        string memory _buyerCountry,
        string memory _buyerName
    ) internal {
        // Call verification module
        (bool success,) = verificationModule.call(
            abi.encodeWithSignature(
                "startDocumentVerification(uint256,string,string,uint256,string,string,string,string)",
                _invoiceId,
                string(abi.encodePacked(_documentHash)),
                _commodity,
                _amount,
                _supplierCountry,
                _buyerCountry,
                msg.sender,
                _buyerName
            )
        );
        require(success, "Verification request failed");
    }
    
    /**
     * @dev Called by verification module after verification
     */
    function updateVerificationResult(
        uint256 _invoiceId,
        uint256 _riskScore,
        string calldata _creditRating,
        uint256 _yieldRate
    ) external {
        require(msg.sender == verificationModule, "Only verification module");
        require(invoices[_invoiceId].status == InvoiceStatus.Pending, "Invalid status");
        
        invoices[_invoiceId].status = InvoiceStatus.Verified;
        invoices[_invoiceId].riskScore = _riskScore;
        invoices[_invoiceId].creditRating = _creditRating;
        invoices[_invoiceId].yieldRate = _yieldRate;
        
        emit InvoiceVerified(_invoiceId, _riskScore, _creditRating);
    }
    
    /**
     * @dev Invest in verified invoice
     */
    function investInInvoice(uint256 _invoiceId, uint256 _amount) external nonReentrant whenNotPaused {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.status == InvoiceStatus.Verified, "Invoice not verified");
        require(_amount >= MIN_INVESTMENT, "Investment too small");
        require(invoice.totalInvestment + _amount <= invoice.amount, "Over-investment");
        
        // Transfer USDC from investor
        require(usdcToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        // Update investment records
        investments[_invoiceId][msg.sender] += _amount;
        invoice.totalInvestment += _amount;
        totalFundsRaised += _amount;
        
        // If fully funded, activate invoice
        if (invoice.totalInvestment == invoice.amount) {
            invoice.status = InvoiceStatus.Active;
            
            // Transfer funds to supplier (minus protocol fee)
            uint256 protocolFee = (_amount * PROTOCOL_FEE) / BASIS_POINTS;
            uint256 supplierAmount = _amount - protocolFee;
            
            require(usdcToken.transfer(invoice.supplier, supplierAmount), "Supplier transfer failed");
        }
        
        emit InvestmentMade(_invoiceId, msg.sender, _amount);
    }
    
    /**
     * @dev Get invoice details
     */
    function getInvoice(uint256 _invoiceId) external view returns (Invoice memory) {
        return invoices[_invoiceId];
    }
    
    /**
     * @dev Get protocol statistics
     */
    function getProtocolStats() external view returns (uint256, uint256, uint256) {
        return (totalInvoices, totalFundsRaised, address(this).balance);
    }
    
    /**
     * @dev Get user's invoices
     */
    function getUserInvoices(address _user) external view returns (uint256[] memory) {
        return userInvoices[_user];
    }
    
    /**
     * @dev Initialize protocol (one-time setup)
     */
    function initializeProtocol() external onlyOwner {
        // Protocol initialization logic
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause protocol
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract information
     */
    function getContractInfo() external view returns (address, string memory, address, bool) {
        return (address(this), version, owner(), paused());
    }
}
```

#### 2. Verification Module (`contracts/{ProjectName}VerificationModule.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title {ProjectName}VerificationModule
 * @dev Chainlink Functions integration for document verification
 */
contract {ProjectName}VerificationModule is FunctionsClient, Ownable {
    using FunctionsRequest for FunctionsRequest.Request;
    
    // Chainlink Functions configuration
    bytes32 public constant donID = 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;
    uint64 public immutable i_functionsSubscriptionId;
    uint32 public gasLimit = 300000;
    
    // Core contract reference
    address public coreContract;
    
    // Verification storage
    struct VerificationData {
        bool verified;
        bool valid;
        uint256 riskScore;
        string creditRating;
        string details;
        uint256 timestamp;
    }
    
    mapping(uint256 => VerificationData) public verifications;
    mapping(bytes32 => uint256) public requestToInvoiceId;
    
    // Latest response tracking
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    
    // Events
    event DocumentVerificationRequested(bytes32 indexed requestId, uint256 indexed invoiceId);
    event DocumentVerified(uint256 indexed invoiceId, bool valid, uint256 riskScore, string creditRating);
    
    // JavaScript source code for Chainlink Functions
    string private constant SOURCE_CODE = 
        "const invoiceId = args[0];"
        "const documentHash = args[1];"
        "const commodity = args[2];"
        "const amount = args[3];"
        "const supplierCountry = args[4];"
        "const buyerCountry = args[5];"
        "const exporterName = args[6];"
        "const buyerName = args[7];"
        ""
        "// Simulate verification API call"
        "const apiResponse = {"
        "  verified: true,"
        "  valid: Math.random() > 0.15," // 85% success rate
        "  riskScore: Math.floor(Math.random() * 50) + 10," // 10-60% risk
        "  creditRating: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC'][Math.floor(Math.random() * 7)],"
        "  yieldRate: Math.floor(Math.random() * 500) + 800" // 8-13% yield
        "};"
        ""
        "return Functions.encodeString(JSON.stringify(apiResponse));";
    
    constructor(
        address router,
        uint64 functionsSubscriptionId
    ) FunctionsClient(router) {
        i_functionsSubscriptionId = functionsSubscriptionId;
    }
    
    /**
     * @dev Set core contract address
     */
    function setCoreContract(address _coreContract) external onlyOwner {
        coreContract = _coreContract;
    }
    
    /**
     * @dev Get core contract address
     */
    function getCoreContract() external view returns (address) {
        return coreContract;
    }
    
    /**
     * @dev Start document verification process
     */
    function startDocumentVerification(
        uint256 invoiceId,
        string memory documentHash,
        string memory commodity,
        uint256 amount,
        string memory supplierCountry,
        string memory buyerCountry,
        string memory exporterName,
        string memory buyerName
    ) external returns (bytes32) {
        require(msg.sender == coreContract, "Only core contract");
        
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(SOURCE_CODE);
        
        string[] memory args = new string[](8);
        args[0] = toString(invoiceId);
        args[1] = documentHash;
        args[2] = commodity;
        args[3] = toString(amount);
        args[4] = supplierCountry;
        args[5] = buyerCountry;
        args[6] = exporterName;
        args[7] = buyerName;
        
        req.setArgs(args);
        
        bytes32 requestId = _sendRequest(req.encodeCBOR(), i_functionsSubscriptionId, gasLimit, donID);
        requestToInvoiceId[requestId] = invoiceId;
        s_lastRequestId = requestId;
        
        emit DocumentVerificationRequested(requestId, invoiceId);
        return requestId;
    }
    
    /**
     * @dev Callback function for Chainlink Functions
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err) internal override {
        s_lastResponse = response;
        s_lastError = err;
        
        uint256 invoiceId = requestToInvoiceId[requestId];
        
        if (err.length > 0) {
            // Handle error case
            verifications[invoiceId] = VerificationData({
                verified: true,
                valid: false,
                riskScore: 100, // Max risk on error
                creditRating: "D",
                details: "Verification failed",
                timestamp: block.timestamp
            });
            
            emit DocumentVerified(invoiceId, false, 100, "D");
            return;
        }
        
        // Parse response
        string memory responseString = string(response);
        
        // Simple JSON parsing simulation (in production, use proper JSON parsing)
        bool valid = true; // Default to valid for demo
        uint256 riskScore = 25; // Default risk score
        string memory creditRating = "B+"; // Default rating
        uint256 yieldRate = 1200; // 12% default yield
        
        // Store verification result
        verifications[invoiceId] = VerificationData({
            verified: true,
            valid: valid,
            riskScore: riskScore,
            creditRating: creditRating,
            details: responseString,
            timestamp: block.timestamp
        });
        
        // Update core contract
        if (valid && coreContract != address(0)) {
            (bool success,) = coreContract.call(
                abi.encodeWithSignature(
                    "updateVerificationResult(uint256,uint256,string,uint256)",
                    invoiceId,
                    riskScore,
                    creditRating,
                    yieldRate
                )
            );
            require(success, "Core contract update failed");
        }
        
        emit DocumentVerified(invoiceId, valid, riskScore, creditRating);
    }
    
    /**
     * @dev Get verification data for invoice
     */
    function getDocumentVerification(uint256 invoiceId) external view returns (
        bool verified,
        bool valid,
        string memory details,
        uint256 risk,
        string memory rating,
        uint256 timestamp
    ) {
        VerificationData memory data = verifications[invoiceId];
        return (data.verified, data.valid, data.details, data.riskScore, data.creditRating, data.timestamp);
    }
    
    /**
     * @dev Get API endpoint for frontend
     */
    function getApiEndpoint() external pure returns (string memory) {
        return "https://your-verification-api.com/api/v1/verify";
    }
    
    /**
     * @dev Test direct request function
     */
    function testDirectRequest() external returns (bytes32) {
        return startDocumentVerification(
            999, // Test invoice ID
            "test-hash",
            "Coffee",
            50000,
            "Kenya",
            "Germany",
            "Test Exporter",
            "Test Buyer"
        );
    }
    
    /**
     * @dev Get last response data
     */
    function getLastFunctionsResponse() external view returns (
        bytes32 lastRequestId,
        bytes memory lastResponse,
        bytes memory lastError
    ) {
        return (s_lastRequestId, s_lastResponse, s_lastError);
    }
    
    /**
     * @dev Convert uint to string
     */
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }
}
```

#### 3. Price Manager (`contracts/{ProjectName}PriceManager.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title {ProjectName}PriceManager
 * @dev Chainlink Data Feeds integration for real-time pricing
 */
contract {ProjectName}PriceManager is Ownable {
    
    // Price feed interfaces
    AggregatorV3Interface internal ethUsdPriceFeed;
    AggregatorV3Interface internal usdcUsdPriceFeed;
    AggregatorV3Interface internal btcUsdPriceFeed;
    AggregatorV3Interface internal linkUsdPriceFeed;
    
    // Events
    event PriceFeedUpdated(string indexed feedName, address indexed feedAddress);
    
    constructor(
        address _ethUsdFeed,
        address _usdcUsdFeed,
        address _btcUsdFeed,
        address _linkUsdFeed
    ) {
        ethUsdPriceFeed = AggregatorV3Interface(_ethUsdFeed);
        usdcUsdPriceFeed = AggregatorV3Interface(_usdcUsdFeed);
        btcUsdPriceFeed = AggregatorV3Interface(_btcUsdFeed);
        linkUsdPriceFeed = AggregatorV3Interface(_linkUsdFeed);
    }
    
    /**
     * @dev Get ETH/USD price
     */
    function getEthUsdPrice() public view returns (int256, uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = ethUsdPriceFeed.latestRoundData();
        
        return (price, timeStamp);
    }
    
    /**
     * @dev Get USDC/USD price
     */
    function getUsdcUsdPrice() public view returns (int256, uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = usdcUsdPriceFeed.latestRoundData();
        
        return (price, timeStamp);
    }
    
    /**
     * @dev Get BTC/USD price
     */
    function getBtcUsdPrice() public view returns (int256, uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = btcUsdPriceFeed.latestRoundData();
        
        return (price, timeStamp);
    }
    
    /**
     * @dev Get LINK/USD price
     */
    function getLinkUsdPrice() public view returns (int256, uint256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = linkUsdPriceFeed.latestRoundData();
        
        return (price, timeStamp);
    }
    
    /**
     * @dev Get all prices in one call
     */
    function getAllPrices() external view returns (
        int256 ethPrice,
        int256 usdcPrice,
        int256 btcPrice,
        int256 linkPrice,
        uint256 lastUpdate
    ) {
        (ethPrice, lastUpdate) = getEthUsdPrice();
        (usdcPrice,) = getUsdcUsdPrice();
        (btcPrice,) = getBtcUsdPrice();
        (linkPrice,) = getLinkUsdPrice();
    }
    
    /**
     * @dev Convert amount using price feed
     */
    function convertToUsd(uint256 amount, string memory asset) external view returns (uint256) {
        int256 price;
        uint8 decimals;
        
        if (keccak256(bytes(asset)) == keccak256(bytes("ETH"))) {
            (price,) = getEthUsdPrice();
            decimals = ethUsdPriceFeed.decimals();
        } else if (keccak256(bytes(asset)) == keccak256(bytes("BTC"))) {
            (price,) = getBtcUsdPrice();
            decimals = btcUsdPriceFeed.decimals();
        } else if (keccak256(bytes(asset)) == keccak256(bytes("LINK"))) {
            (price,) = getLinkUsdPrice();
            decimals = linkUsdPriceFeed.decimals();
        } else {
            return amount; // Default to 1:1 for USD assets
        }
        
        require(price > 0, "Invalid price");
        return (amount * uint256(price)) / (10 ** decimals);
    }
}
```

#### 4. NFT Contract (`contracts/{ProjectName}InvoiceNFT.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title {ProjectName}InvoiceNFT
 * @dev NFT representation of tokenized invoices
 */
contract {ProjectName}InvoiceNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Protocol address for minting permissions
    address public protocolAddress;
    
    // NFT metadata structure
    struct InvoiceMetadata {
        uint256 invoiceId;
        uint256 amount;
        string commodity;
        string supplierCountry;
        string creditRating;
        uint256 riskScore;
        uint256 createdAt;
    }
    
    mapping(uint256 => InvoiceMetadata) public nftMetadata;
    
    // Events
    event InvoiceNFTMinted(uint256 indexed tokenId, uint256 indexed invoiceId, address indexed recipient);
    
    constructor() ERC721("{ProjectName} Invoice", "PROJ_INV") {}
    
    /**
     * @dev Set protocol address for minting permissions
     */
    function setProtocolAddress(address _protocolAddress) external onlyOwner {
        protocolAddress = _protocolAddress;
    }
    
    /**
     * @dev Mint NFT for verified invoice
     */
    function mintInvoiceNFT(
        address to,
        uint256 invoiceId,
        uint256 amount,
        string memory commodity,
        string memory supplierCountry,
        string memory creditRating,
        uint256 riskScore,
        string memory tokenURI
    ) external returns (uint256) {
        require(msg.sender == protocolAddress, "Only protocol can mint");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Store metadata
        nftMetadata[tokenId] = InvoiceMetadata({
            invoiceId: invoiceId,
            amount: amount,
            commodity: commodity,
            supplierCountry: supplierCountry,
            creditRating: creditRating,
            riskScore: riskScore,
            createdAt: block.timestamp
        });
        
        emit InvoiceNFTMinted(tokenId, invoiceId, to);
        return tokenId;
    }
    
    /**
     * @dev Get NFT metadata
     */
    function getInvoiceMetadata(uint256 tokenId) external view returns (InvoiceMetadata memory) {
        require(_exists(tokenId), "Token does not exist");
        return nftMetadata[tokenId];
    }
    
    /**
     * @dev Override required functions
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
```

#### 5. Mock USDC Contract (`contracts/MockUSDC.sol`)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals = 6;
    
    constructor() ERC20("Mock USD Coin", "USDC") {
        _mint(msg.sender, 1000000 * 10**_decimals); // 1M initial supply
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Mint tokens for testing
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    /**
     * @dev Faucet function for easy testing
     */
    function faucet() external {
        _mint(msg.sender, 10000 * 10**_decimals); // 10,000 USDC
    }
}
```

---

## 4. Frontend Development

### Frontend Package.json Configuration
Create `frontend/package.json`:

```json
{
  "name": "{project_name}-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@rainbow-me/rainbowkit": "^2.2.6",
    "@tanstack/react-query": "^5.59.16",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.126",
    "@types/react": "^19.1.6",
    "@types/react-dom": "^19.1.6",
    "@wagmi/connectors": "^5.1.15",
    "@wagmi/core": "^2.13.5",
    "ethers": "^5.7.2",
    "lucide-react": "^0.513.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-scripts": "5.0.1",
    "viem": "^2.21.19",
    "wagmi": "^2.15.6",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@craco/craco": "^7.1.0",
    "@tailwindcss/forms": "^0.5.10",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.8.3"
  }
}
```

### Wagmi Configuration (`frontend/src/config/wagmi.ts`)
```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, morphHolesky } from 'wagmi/chains';

// Define Morph Testnet
export const morphTestnet = {
  id: 2810,
  name: 'Morph Holesky',
  network: 'morph-holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'],
    },
    public: {
      http: ['https://rpc-quicknode-holesky.morphl2.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Morph Explorer',
      url: 'https://explorer-holesky.morphl2.io',
    },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: '{ProjectName}',
  projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID!,
  chains: [morphTestnet, sepolia],
  ssr: false,
});
```

### Main App Component (`frontend/src/App.tsx`)
```tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { config } from './config/wagmi';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';
import InvestPage from './components/pages/InvestPage';
import SubmitInvoice from './components/pages/SubmitInvoice';

import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navigation />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invest" element={<InvestPage />} />
                  <Route path="/submit" element={<SubmitInvoice />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
```

### Contract Interaction Hook (`frontend/src/hooks/use{ProjectName}.ts`)
```typescript
import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';

// Import your contract ABIs
import {ProjectName}CoreABI from '../abis/{ProjectName}Core.json';
import MockUSDCABI from '../abis/MockUSDC.json';

// Contract addresses (update for your deployment)
const CONTRACTS = {
  // Morph Testnet addresses
  2810: {
    core: '0x...', // Your deployed core contract address
    usdc: '0x...', // Your deployed USDC address
    nft: '0x...',  // Your deployed NFT address
  },
  // Sepolia addresses
  11155111: {
    core: '0x...',
    usdc: '0x...',
    nft: '0x...',
  }
};

export function use{ProjectName}() {
  const { address, chainId } = useAccount();
  const { writeContract, isPending: isWritePending } = useWriteContract();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current chain contracts
  const currentContracts = CONTRACTS[chainId as keyof typeof CONTRACTS] || CONTRACTS[2810];

  // Read protocol stats
  const { data: protocolStats } = useReadContract({
    address: currentContracts.core as `0x${string}`,
    abi: {ProjectName}CoreABI,
    functionName: 'getProtocolStats',
  });

  // Read user's USDC balance
  const { data: usdcBalance } = useReadContract({
    address: currentContracts.usdc as `0x${string}`,
    abi: MockUSDCABI,
    functionName: 'balanceOf',
    args: [address],
  });

  // Submit invoice function
  const submitInvoice = useCallback(async (invoiceData: {
    amount: string;
    maturityDate: Date;
    commodity: string;
    supplierCountry: string;
    buyerCountry: string;
    buyerName: string;
    documentHash: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const maturityTimestamp = Math.floor(invoiceData.maturityDate.getTime() / 1000);
      const amountWei = parseUnits(invoiceData.amount, 6); // USDC has 6 decimals

      await writeContract({
        address: currentContracts.core as `0x${string}`,
        abi: {ProjectName}CoreABI,
        functionName: 'submitInvoice',
        args: [
          amountWei,
          BigInt(maturityTimestamp),
          invoiceData.commodity,
          invoiceData.supplierCountry,
          invoiceData.buyerCountry,
          invoiceData.buyerName,
          invoiceData.documentHash,
        ],
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to submit invoice');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [writeContract, currentContracts.core]);

  // Invest in invoice function
  const investInInvoice = useCallback(async (invoiceId: number, amount: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const amountWei = parseUnits(amount, 6);

      // First approve USDC spending
      await writeContract({
        address: currentContracts.usdc as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'approve',
        args: [currentContracts.core, amountWei],
      });

      // Then invest
      await writeContract({
        address: currentContracts.core as `0x${string}`,
        abi: {ProjectName}CoreABI,
        functionName: 'investInInvoice',
        args: [BigInt(invoiceId), amountWei],
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to invest');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [writeContract, currentContracts]);

  // Mint test USDC function
  const mintTestUSDC = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await writeContract({
        address: currentContracts.usdc as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'faucet',
        args: [],
      });

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to mint USDC');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [writeContract, currentContracts.usdc]);

  return {
    // State
    isLoading: isLoading || isWritePending,
    error,
    
    // Data
    protocolStats,
    usdcBalance: usdcBalance ? formatUnits(usdcBalance as bigint, 6) : '0',
    currentContracts,
    
    // Functions
    submitInvoice,
    investInInvoice,
    mintTestUSDC,
    
    // Utils
    clearError: () => setError(null),
  };
}
```

### Submit Invoice Component (`frontend/src/components/pages/SubmitInvoice.tsx`)
```tsx
import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { use{ProjectName} } from '../../hooks/use{ProjectName}';

export default function SubmitInvoice() {
  const { isConnected } = useAccount();
  const { submitInvoice, isLoading, error } = use{ProjectName}();

  const [formData, setFormData] = useState({
    amount: '',
    maturityDate: '',
    commodity: '',
    supplierCountry: '',
    buyerCountry: '',
    buyerName: '',
    description: '',
  });

  const [document, setDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) {
      alert('Please upload a document');
      return;
    }

    // In a real implementation, upload to IPFS first
    const documentHash = 'ipfs-hash-placeholder';

    const success = await submitInvoice({
      ...formData,
      maturityDate: new Date(formData.maturityDate),
      documentHash,
    });

    if (success) {
      alert('Invoice submitted successfully!');
      // Reset form
      setFormData({
        amount: '',
        maturityDate: '',
        commodity: '',
        supplierCountry: '',
        buyerCountry: '',
        buyerName: '',
        description: '',
      });
      setDocument(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Submit Invoice</h1>
        <p className="mb-4">Connect your wallet to submit an invoice for verification.</p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Submit Invoice for Tokenization</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invoice Amount (USDC)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maturity Date
            </label>
            <input
              type="date"
              value={formData.maturityDate}
              onChange={(e) => setFormData({ ...formData, maturityDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commodity
            </label>
            <select
              value={formData.commodity}
              onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select commodity</option>
              <option value="Coffee">Coffee</option>
              <option value="Cocoa">Cocoa</option>
              <option value="Gold">Gold</option>
              <option value="Cotton">Cotton</option>
              <option value="Tea">Tea</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Country
            </label>
            <select
              value={formData.supplierCountry}
              onChange={(e) => setFormData({ ...formData, supplierCountry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Tanzania">Tanzania</option>
              <option value="Uganda">Uganda</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buyer Country
            </label>
            <input
              type="text"
              value={formData.buyerCountry}
              onChange={(e) => setFormData({ ...formData, buyerCountry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Germany"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buyer Name
            </label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ABC Trading Company"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional details about the invoice..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Document
          </label>
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            accept=".pdf,.jpg,.jpeg,.png"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload invoice, bill of lading, or certificate of origin (PDF, JPG, PNG)
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Invoice'}
        </button>
      </form>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Next Steps</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Your invoice will be verified using Chainlink Functions</li>
          <li>Document authenticity and supplier credentials will be checked</li>
          <li>A risk score and credit rating will be assigned</li>
          <li>If approved, your invoice will be available for investment</li>
          <li>You'll receive funds immediately upon full funding</li>
        </ol>
      </div>
    </div>
  );
}
```

---

## 5. Backend API Development

### API Package.json Configuration
Create `api/package.json`:

```json
{
  "name": "{project_name}-api",
  "version": "1.0.0",
  "description": "{ProjectName} Document Verification API",
  "main": "dist/main.js",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  },
  "dependencies": {
    "@nestjs/axios": "^3.0.0",
    "@nestjs/cache-manager": "^2.1.0",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/mongoose": "^10.0.1",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/schedule": "^6.0.0",
    "@nestjs/swagger": "^7.1.8",
    "@nestjs/terminus": "^10.0.1",
    "@nestjs/throttler": "^4.2.1",
    "axios": "^1.4.0",
    "cache-manager": "^5.2.3",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "compression": "^1.7.4",
    "helmet": "^7.0.0",
    "mongoose": "^7.4.0",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/compression": "^1.7.2",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^2.0.12",
    "@types/uuid": "^9.0.2",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  }
}
```

### Main Application Module (`api/src/app.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { TerminusModule } from '@nestjs/terminus';

import { VerificationModule } from './verification/verification.module';
import { HealthModule } from './health/health.module';
import { AnalyticsModule } from './analytics/analytics.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URI,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
    }),
    TerminusModule,
    VerificationModule,
    HealthModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
```

### Verification Service (`api/src/verification/verification.service.ts`)
```typescript
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { VerificationRecord, VerificationRecordDocument } from './schemas/verification-record.schema';
import { VerificationRequestDto } from './dto/verification-request.dto';
import { VerificationResponseDto } from './dto/verification-response.dto';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectModel(VerificationRecord.name)
    private verificationModel: Model<VerificationRecordDocument>,
    private httpService: HttpService,
  ) {}

  async verifyDocument(request: VerificationRequestDto): Promise<VerificationResponseDto> {
    this.logger.log(`Starting verification for invoice ${request.invoiceId}`);

    try {
      // Step 1: Document integrity check
      const documentCheck = await this.verifyDocumentIntegrity(request.documentHash);
      
      // Step 2: Supplier verification
      const supplierCheck = await this.verifySupplier(
        request.exporterName,
        request.supplierCountry
      );
      
      // Step 3: Sanctions screening
      const sanctionsCheck = await this.checkSanctions(
        request.exporterName,
        request.buyerName
      );
      
      // Step 4: Risk assessment
      const riskAssessment = await this.calculateRisk(request);
      
      // Step 5: Credit rating
      const creditRating = this.calculateCreditRating(riskAssessment.riskScore);

      // Create verification record
      const verificationRecord = new this.verificationModel({
        invoiceId: request.invoiceId,
        documentHash: request.documentHash,
        supplierCountry: request.supplierCountry,
        buyerCountry: request.buyerCountry,
        commodity: request.commodity,
        amount: request.amount,
        exporterName: request.exporterName,
        buyerName: request.buyerName,
        verificationStatus: 'completed',
        isValid: documentCheck.valid && supplierCheck.valid && !sanctionsCheck.flagged,
        riskScore: riskAssessment.riskScore,
        creditRating: creditRating,
        verificationDetails: {
          documentIntegrity: documentCheck,
          supplierVerification: supplierCheck,
          sanctionsScreening: sanctionsCheck,
          riskAssessment: riskAssessment,
        },
        createdAt: new Date(),
      });

      await verificationRecord.save();

      const response: VerificationResponseDto = {
        requestId: verificationRecord._id.toString(),
        invoiceId: request.invoiceId,
        verified: true,
        valid: verificationRecord.isValid,
        riskScore: riskAssessment.riskScore,
        creditRating: creditRating,
        yieldRate: this.calculateYieldRate(riskAssessment.riskScore),
        details: 'Verification completed successfully',
        timestamp: new Date(),
      };

      this.logger.log(`Verification completed for invoice ${request.invoiceId}`);
      return response;

    } catch (error) {
      this.logger.error(`Verification failed for invoice ${request.invoiceId}:`, error);
      
      // Save failed verification record
      const failedRecord = new this.verificationModel({
        invoiceId: request.invoiceId,
        documentHash: request.documentHash,
        verificationStatus: 'failed',
        isValid: false,
        riskScore: 100,
        creditRating: 'D',
        errorMessage: error.message,
        createdAt: new Date(),
      });

      await failedRecord.save();

      return {
        requestId: failedRecord._id.toString(),
        invoiceId: request.invoiceId,
        verified: true,
        valid: false,
        riskScore: 100,
        creditRating: 'D',
        yieldRate: 0,
        details: `Verification failed: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  private async verifyDocumentIntegrity(documentHash: string): Promise<any> {
    // Simulate document integrity check
    return {
      valid: Math.random() > 0.05, // 95% pass rate
      confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
      details: 'Document integrity verified via hash comparison',
    };
  }

  private async verifySupplier(exporterName: string, country: string): Promise<any> {
    try {
      // In production, call actual trade verification APIs
      // For now, simulate based on country risk profiles
      const countryRisk = this.getCountryRisk(country);
      
      return {
        valid: Math.random() > countryRisk / 100,
        registered: true,
        creditHistory: Math.random() > 0.3 ? 'good' : 'fair',
        details: `Supplier verification for ${country}`,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  private async checkSanctions(exporterName: string, buyerName: string): Promise<any> {
    // Simulate sanctions screening
    const suspiciousNames = ['OFAC', 'SANCTIONS', 'BLOCKED'];
    const flagged = suspiciousNames.some(name => 
      exporterName.toUpperCase().includes(name) || 
      buyerName.toUpperCase().includes(name)
    );

    return {
      flagged,
      exporterStatus: flagged ? 'flagged' : 'clear',
      buyerStatus: flagged ? 'flagged' : 'clear',
      details: flagged ? 'Sanctions screening flagged' : 'All parties cleared',
    };
  }

  private async calculateRisk(request: VerificationRequestDto): Promise<any> {
    // Risk calculation based on multiple factors
    let riskScore = 0;

    // Country risk (0-30 points)
    const countryRisk = this.getCountryRisk(request.supplierCountry);
    riskScore += countryRisk * 0.3;

    // Commodity risk (0-20 points)
    const commodityRisk = this.getCommodityRisk(request.commodity);
    riskScore += commodityRisk;

    // Amount risk (0-10 points)
    const amountRisk = request.amount > 100000 ? 10 : (request.amount / 100000) * 10;
    riskScore += amountRisk;

    // Random factor (0-10 points)
    riskScore += Math.random() * 10;

    return {
      riskScore: Math.min(Math.round(riskScore), 100),
      factors: {
        countryRisk: countryRisk,
        commodityRisk: commodityRisk,
        amountRisk: amountRisk,
      },
    };
  }

  private getCountryRisk(country: string): number {
    const riskProfiles: { [key: string]: number } = {
      'Nigeria': 25,
      'Kenya': 20,
      'Ghana': 18,
      'Ethiopia': 30,
      'Tanzania': 22,
      'Uganda': 25,
      'South Africa': 15,
      'Morocco': 12,
      'Egypt': 28,
    };

    return riskProfiles[country] || 35; // Default high risk for unknown countries
  }

  private getCommodityRisk(commodity: string): number {
    const commodityRisks: { [key: string]: number } = {
      'Coffee': 8,
      'Cocoa': 10,
      'Gold': 15,
      'Cotton': 12,
      'Tea': 6,
      'Oil': 20,
      'Minerals': 18,
    };

    return commodityRisks[commodity] || 15; // Default risk
  }

  private calculateCreditRating(riskScore: number): string {
    if (riskScore <= 10) return 'AAA';
    if (riskScore <= 20) return 'AA+';
    if (riskScore <= 30) return 'AA';
    if (riskScore <= 40) return 'A+';
    if (riskScore <= 50) return 'A';
    if (riskScore <= 60) return 'BBB';
    if (riskScore <= 70) return 'BB';
    if (riskScore <= 80) return 'B';
    if (riskScore <= 90) return 'CCC';
    return 'D';
  }

  private calculateYieldRate(riskScore: number): number {
    // Base yield: 8%, risk premium: up to 7%
    const baseYield = 800; // 8% in basis points
    const riskPremium = Math.floor((riskScore / 100) * 700); // Up to 7% risk premium
    return baseYield + riskPremium;
  }

  async getVerificationStatus(requestId: string): Promise<VerificationRecord | null> {
    return this.verificationModel.findById(requestId).exec();
  }

  async getVerificationsByInvoiceId(invoiceId: number): Promise<VerificationRecord[]> {
    return this.verificationModel.find({ invoiceId }).sort({ createdAt: -1 }).exec();
  }
}
```

---

## 6. Morph Testnet Configuration

### Morph Testnet Details
```typescript
// Network Configuration for Morph Testnet
export const morphTestnetConfig = {
  chainId: 2810,
  chainName: 'Morph Holesky',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [
    'https://rpc-quicknode-holesky.morphl2.io',
    'https://rpc-holesky.morphl2.io',
  ],
  blockExplorerUrls: [
    'https://explorer-holesky.morphl2.io',
  ],
  faucetUrls: [
    'https://bridge-holesky.morphl2.io',
  ],
  testnet: true,
};
```

### Deployment Script for Morph (`scripts/deploy-morph.ts`)
```typescript
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

// Morph Testnet Configuration
const MORPH_CONFIG = {
  // Note: Morph testnet may not have all Chainlink services yet
  // Use fallback addresses or mock contracts for testing
  PRICE_FEEDS: {
    ETH_USD: "0x0000000000000000000000000000000000000000", // Placeholder
    USDC_USD: "0x0000000000000000000000000000000000000000", // Placeholder
  },
  FUNCTIONS_ROUTER: "0x0000000000000000000000000000000000000000", // Placeholder
  VRF_COORDINATOR: "0x0000000000000000000000000000000000000000", // Placeholder
};

async function main() {
  console.log("🚀 Deploying {ProjectName} to Morph Testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("Deployer:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(balance), "ETH");
  
  if (balance < hre.ethers.parseEther("0.1")) {
    throw new Error("Insufficient ETH for deployment. Get test ETH from Morph faucet.");
  }

  const deployedContracts: {[key: string]: string} = {};

  // 1. Deploy Mock USDC
  console.log("\n📄 Deploying Mock USDC...");
  const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy();
  await mockUSDC.waitForDeployment();
  deployedContracts.mockUSDC = await mockUSDC.getAddress();
  console.log("Mock USDC deployed to:", deployedContracts.mockUSDC);

  // 2. Deploy NFT Contract
  console.log("\n🎨 Deploying Invoice NFT...");
  const InvoiceNFT = await hre.ethers.getContractFactory("{ProjectName}InvoiceNFT");
  const invoiceNFT = await InvoiceNFT.deploy();
  await invoiceNFT.waitForDeployment();
  deployedContracts.invoiceNFT = await invoiceNFT.getAddress();
  console.log("Invoice NFT deployed to:", deployedContracts.invoiceNFT);

  // 3. Deploy Price Manager (with fallback for missing oracles)
  console.log("\n📊 Deploying Price Manager...");
  const PriceManager = await hre.ethers.getContractFactory("{ProjectName}PriceManager");
  
  // Use mock addresses for Morph testnet (update when oracles are available)
  const priceManager = await PriceManager.deploy(
    MORPH_CONFIG.PRICE_FEEDS.ETH_USD || deployedContracts.mockUSDC, // Fallback
    MORPH_CONFIG.PRICE_FEEDS.USDC_USD || deployedContracts.mockUSDC, // Fallback
    MORPH_CONFIG.PRICE_FEEDS.ETH_USD || deployedContracts.mockUSDC, // Fallback for BTC
    MORPH_CONFIG.PRICE_FEEDS.ETH_USD || deployedContracts.mockUSDC  // Fallback for LINK
  );
  await priceManager.waitForDeployment();
  deployedContracts.priceManager = await priceManager.getAddress();
  console.log("Price Manager deployed to:", deployedContracts.priceManager);

  // 4. Deploy Verification Module (simplified for Morph)
  console.log("\n🔍 Deploying Verification Module...");
  const VerificationModule = await hre.ethers.getContractFactory("{ProjectName}VerificationModule");
  
  // Use placeholder router address for Morph (update when available)
  const verificationModule = await VerificationModule.deploy(
    MORPH_CONFIG.FUNCTIONS_ROUTER || deployedContracts.mockUSDC, // Fallback
    1 // Placeholder subscription ID
  );
  await verificationModule.waitForDeployment();
  deployedContracts.verificationModule = await verificationModule.getAddress();
  console.log("Verification Module deployed to:", deployedContracts.verificationModule);

  // 5. Deploy Core Contract
  console.log("\n🏛️ Deploying Core Protocol...");
  const CoreContract = await hre.ethers.getContractFactory("{ProjectName}Core");
  const coreContract = await CoreContract.deploy(
    deployedContracts.invoiceNFT,
    deployedContracts.mockUSDC,
    deployedContracts.priceManager,
    deployedContracts.verificationModule,
    deployedContracts.mockUSDC, // Placeholder for investment module
    deployedContracts.mockUSDC  // Placeholder for VRF module
  );
  await coreContract.waitForDeployment();
  deployedContracts.coreContract = await coreContract.getAddress();
  console.log("Core Contract deployed to:", deployedContracts.coreContract);

  // 6. Setup permissions
  console.log("\n🔧 Setting up permissions...");
  
  // Set protocol address on NFT contract
  const nftContract = await hre.ethers.getContractAt("{ProjectName}InvoiceNFT", deployedContracts.invoiceNFT);
  await nftContract.setProtocolAddress(deployedContracts.coreContract);
  console.log("✅ NFT contract permissions set");

  // Set core contract on verification module
  const verificationContract = await hre.ethers.getContractAt("{ProjectName}VerificationModule", deployedContracts.verificationModule);
  await verificationContract.setCoreContract(deployedContracts.coreContract);
  console.log("✅ Verification module permissions set");

  // 7. Save deployment info
  const deploymentInfo = {
    network: "morph-testnet",
    chainId: 2810,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: deployedContracts,
    blockExplorer: "https://explorer-holesky.morphl2.io",
    faucet: "https://bridge-holesky.morphl2.io",
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `{project_name-morph-${Date.now()}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\n🎉 Deployment Complete!");
  console.log("=" .repeat(50));
  console.log("📋 Contract Addresses:");
  Object.entries(deployedContracts).forEach(([name, address]) => {
    console.log(`   ${name}: ${address}`);
  });
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);
  console.log(`🔍 View on Morph Explorer: https://explorer-holesky.morphl2.io`);
  console.log(`💧 Get test ETH: https://bridge-holesky.morphl2.io`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 7. Chainlink Integration Setup

### Chainlink Functions Configuration
```javascript
// Chainlink Functions Source Code for Document Verification
const sourceCode = `
// Arguments: [invoiceId, documentHash, commodity, amount, supplierCountry, buyerCountry, exporterName, buyerName]
const invoiceId = args[0];
const documentHash = args[1];
const commodity = args[2];
const amount = args[3];
const supplierCountry = args[4];
const buyerCountry = args[5];
const exporterName = args[6];
const buyerName = args[7];

// API endpoints for verification
const API_BASE_URL = secrets.apiBaseUrl || "https://your-api-domain.com";

try {
  // Call your verification API
  const verificationRequest = Functions.makeHttpRequest({
    url: \`\${API_BASE_URL}/api/v1/verification/verify-minimal\`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": \`Bearer \${secrets.apiKey}\`
    },
    data: {
      invoiceId: parseInt(invoiceId),
      documentHash,
      commodity,
      amount: parseInt(amount),
      supplierCountry,
      buyerCountry,
      exporterName,
      buyerName
    }
  });

  const response = await verificationRequest;
  
  if (response.error) {
    throw new Error(\`API Error: \${response.error}\`);
  }

  // Return verification result
  const result = {
    verified: true,
    valid: response.data.valid,
    riskScore: response.data.riskScore,
    creditRating: response.data.creditRating,
    yieldRate: response.data.yieldRate,
    timestamp: Math.floor(Date.now() / 1000)
  };

  return Functions.encodeString(JSON.stringify(result));

} catch (error) {
  // Return error result
  const errorResult = {
    verified: true,
    valid: false,
    riskScore: 100,
    creditRating: "D",
    yieldRate: 0,
    error: error.message
  };

  return Functions.encodeString(JSON.stringify(errorResult));
}
`;
```

### Chainlink Subscription Setup Script
```typescript
// scripts/setup-chainlink.ts
import hre from "hardhat";

async function setupChainlinkSubscriptions() {
  console.log("🔗 Setting up Chainlink subscriptions...");

  // Functions Subscription Setup
  console.log("1. Setting up Chainlink Functions:");
  console.log("   - Go to https://functions.chain.link");
  console.log("   - Create a new subscription");
  console.log("   - Fund with LINK tokens");
  console.log("   - Add your contract as a consumer");
  console.log("   - Update CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID in .env");

  // VRF Subscription Setup
  console.log("\n2. Setting up Chainlink VRF:");
  console.log("   - Go to https://vrf.chain.link");
  console.log("   - Create a new subscription");
  console.log("   - Fund with LINK tokens");
  console.log("   - Add your contract as a consumer");
  console.log("   - Update CHAINLINK_VRF_SUBSCRIPTION_ID in .env");

  // Price Feeds (no setup required)
  console.log("\n3. Chainlink Price Feeds:");
  console.log("   ✅ No setup required - using public feeds");

  console.log("\n🎯 Next steps:");
  console.log("   1. Update .env with subscription IDs");
  console.log("   2. Deploy contracts with updated configuration");
  console.log("   3. Test Functions and VRF integration");
}

setupChainlinkSubscriptions();
```

---

## 8. Deployment Process

### Complete Deployment Script
```bash
#!/bin/bash

# {project_name} Deployment Script
echo "🚀 Starting {ProjectName} deployment process..."

# Step 1: Environment setup
echo "📋 Step 1: Environment setup"
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one using the template."
    exit 1
fi

source .env

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies"
npm install
cd frontend && npm install && cd ..
cd api && npm install && cd ..

# Step 3: Compile contracts
echo "🔨 Step 3: Compiling smart contracts"
npx hardhat compile

# Step 4: Run tests
echo "🧪 Step 4: Running tests"
npm run test

# Step 5: Deploy to Morph Testnet
echo "🌍 Step 5: Deploying to Morph Testnet"
npx hardhat run scripts/deploy-morph.ts --network morph-testnet

# Step 6: Verify contracts
echo "✅ Step 6: Verifying contracts"
# Update with actual addresses from deployment
# npx hardhat verify --network morph-testnet DEPLOYED_ADDRESS

# Step 7: Deploy frontend
echo "🎨 Step 7: Building and deploying frontend"
cd frontend
npm run build

# Deploy to Vercel (requires Vercel CLI)
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "⚠️ Vercel CLI not found. Please deploy frontend manually."
fi

cd ..

# Step 8: Deploy API
echo "🔧 Step 8: Deploying API"
cd api
npm run build

# Deploy to Render or similar service
echo "📤 API built. Deploy manually to your hosting service."

cd ..

echo "🎉 Deployment process complete!"
echo "📋 Next steps:"
echo "   1. Update frontend with deployed contract addresses"
echo "   2. Configure Chainlink subscriptions"
echo "   3. Test the complete workflow"
```

### Environment Variables for Production
```bash
# Production Environment Variables

# Network Configuration (Morph Testnet)
MORPH_TESTNET_RPC_URL=https://rpc-quicknode-holesky.morphl2.io
MORPH_TESTNET_PRIVATE_KEY=your_private_key_here
MORPH_EXPLORER_API_KEY=your_morph_explorer_api_key

# Contract Addresses (Update after deployment)
REACT_APP_CORE_CONTRACT_ADDRESS=0x...
REACT_APP_USDC_CONTRACT_ADDRESS=0x...
REACT_APP_NFT_CONTRACT_ADDRESS=0x...

# API Configuration
REACT_APP_API_BASE_URL=https://your-api-domain.render.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Chainlink Configuration
CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID=your_subscription_id
CHAINLINK_VRF_SUBSCRIPTION_ID=your_vrf_subscription_id

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# Frontend Configuration
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
REACT_APP_CHAIN_ID=2810
REACT_APP_CHAIN_NAME=Morph Holesky
```

---

## 9. Testing & Verification

### Test Suite
```typescript
// test/{ProjectName}Core.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";

describe("{ProjectName}Core", function () {
  let core: any;
  let usdc: any;
  let nft: any;
  let owner: Signer;
  let supplier: Signer;
  let investor: Signer;

  beforeEach(async function () {
    [owner, supplier, investor] = await ethers.getSigners();

    // Deploy mock contracts
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    usdc = await MockUSDC.deploy();

    const InvoiceNFT = await ethers.getContractFactory("{ProjectName}InvoiceNFT");
    nft = await InvoiceNFT.deploy();

    // Deploy core contract
    const CoreContract = await ethers.getContractFactory("{ProjectName}Core");
    core = await CoreContract.deploy(
      await nft.getAddress(),
      await usdc.getAddress(),
      ethers.ZeroAddress, // placeholder for price manager
      ethers.ZeroAddress, // placeholder for verification
      ethers.ZeroAddress, // placeholder for investment
      ethers.ZeroAddress  // placeholder for VRF
    );

    // Setup permissions
    await nft.setProtocolAddress(await core.getAddress());
  });

  describe("Invoice Submission", function () {
    it("Should submit invoice successfully", async function () {
      const amount = ethers.parseUnits("50000", 6); // 50,000 USDC
      const maturityDate = Math.floor(Date.now() / 1000) + 86400 * 60; // 60 days
      
      await expect(
        core.connect(supplier).submitInvoice(
          amount,
          maturityDate,
          "Coffee",
          "Kenya",
          "Germany",
          "Test Buyer",
          ethers.keccak256(ethers.toUtf8Bytes("test-document"))
        )
      ).to.emit(core, "InvoiceSubmitted");

      const invoice = await core.getInvoice(1);
      expect(invoice.amount).to.equal(amount);
      expect(invoice.commodity).to.equal("Coffee");
    });

    it("Should reject invoice with invalid amount", async function () {
      const amount = ethers.parseUnits("50", 6); // Too small
      const maturityDate = Math.floor(Date.now() / 1000) + 86400 * 60;
      
      await expect(
        core.connect(supplier).submitInvoice(
          amount,
          maturityDate,
          "Coffee",
          "Kenya",
          "Germany",
          "Test Buyer",
          ethers.keccak256(ethers.toUtf8Bytes("test-document"))
        )
      ).to.be.revertedWith("Amount too small");
    });
  });

  describe("Protocol Statistics", function () {
    it("Should return correct protocol stats", async function () {
      const stats = await core.getProtocolStats();
      expect(stats[0]).to.equal(0); // totalInvoices
      expect(stats[1]).to.equal(0); // totalFundsRaised
    });
  });
});
```

### Integration Tests
```typescript
// test/integration.test.ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Full Integration Test", function () {
  it("Should complete full invoice lifecycle", async function () {
    // This test would simulate:
    // 1. Invoice submission
    // 2. Verification process
    // 3. Investment
    // 4. Yield distribution
    
    // Implementation depends on your specific contracts
    expect(true).to.be.true; // Placeholder
  });
});
```

---

## 10. Production Deployment

### Frontend Deployment (Vercel)
```json
// vercel.json
{
  "framework": "create-react-app",
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm start",
  "env": {
    "REACT_APP_CHAIN_ID": "2810",
    "REACT_APP_CHAIN_NAME": "Morph Holesky",
    "REACT_APP_CORE_CONTRACT_ADDRESS": "@core_contract_address",
    "REACT_APP_USDC_CONTRACT_ADDRESS": "@usdc_contract_address",
    "REACT_APP_API_BASE_URL": "@api_base_url"
  }
}
```

### API Deployment (Render)
```dockerfile
# Dockerfile for API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

### Final Checklist
- [ ] Smart contracts deployed to Morph Testnet
- [ ] Contract verification completed
- [ ] Frontend deployed and configured
- [ ] API deployed with database connection
- [ ] Chainlink subscriptions funded and configured
- [ ] IPFS service configured
- [ ] All environment variables set
- [ ] End-to-end testing completed
- [ ] Documentation updated with live addresses

---

## 📚 Additional Resources

### Morph Testnet Resources
- **Bridge**: https://bridge-holesky.morphl2.io
- **Explorer**: https://explorer-holesky.morphl2.io
- **Faucet**: Available through bridge
- **Documentation**: https://docs.morphl2.io

### Chainlink Resources
- **Functions**: https://functions.chain.link
- **VRF**: https://vrf.chain.link
- **Price Feeds**: https://data.chain.link
- **Documentation**: https://docs.chain.link

### Development Tools
- **Hardhat**: https://hardhat.org
- **Wagmi**: https://wagmi.sh
- **RainbowKit**: https://rainbowkit.com
- **NestJS**: https://nestjs.com

---

**🎉 Congratulations!** You now have a complete guide to build your own RWA trade finance protocol. Replace `{PROJECT_NAME}` and `{project_name}` throughout this guide with your actual project name, and follow the steps to deploy your protocol to Morph Testnet.

**Remember to:**
1. Test thoroughly on testnet before any mainnet deployment
2. Get proper security audits for production use
3. Comply with relevant regulations in your jurisdiction
4. Keep private keys and API keys secure
5. Monitor your deployed contracts and services

**Good luck building the future of trade finance! 🚀**