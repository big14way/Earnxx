# EarnX Protocol Deployment Checklist 🚀

## 📋 **Pre-Deployment Setup**

### **1. Environment Variables Setup**
- [ ] Copy `.env.example` to `.env`
- [ ] Set `SEPOLIA_PRIVATE_KEY` or `MORPH_TESTNET_PRIVATE_KEY`
- [ ] Configure `MORPH_EXPLORER_API_KEY` for contract verification
- [ ] Update `API_BASE_URL` to use EarnX domain

### **2. API Keys to Update/Create**

#### **🌐 Hosting & Domain Services**
- [ ] **Render.com**: Update deployment URL from `yieldx` to `earnx`
- [ ] **Vercel**: Update project name from `yieldx-frontend` to `earnx-frontend`
- [ ] **Domain**: Purchase/configure `earnx.com` domain (optional)

#### **🗄️ Database Services**
- [ ] **MongoDB Atlas**: Create new database `earnx_verification`
- [ ] Update connection string in environment variables
- [ ] Migrate existing data if needed

#### **⛓️ Blockchain Services**
- [ ] **Morph Testnet Explorer**: Get API key for contract verification
- [ ] **Chainlink Functions**: Update subscription consumer to new EarnX contracts
- [ ] **Chainlink VRF**: Update subscription consumer to new EarnX contracts

#### **📁 IPFS Services**
- [ ] **Pinata**: Update pin names from YieldX to EarnX
- [ ] Update NFT metadata templates to use EarnX branding

#### **🔗 Third-Party Services**
- [ ] **WalletConnect**: Update project metadata to EarnX
- [ ] **CoinMarketCap**: Update project listing (if applicable)

## 🚀 **Deployment Steps**

### **Phase 1: Compile Contracts**
```bash
# Fix dependencies first
npm install --legacy-peer-deps
# or
yarn install

# Compile contracts
npm run compile
```

### **Phase 2: Deploy to Morph Testnet**
```bash
# Deploy EarnX Protocol
npx hardhat run scripts/deploy.ts --network morph-testnet

# Or use our custom script
node deploy-earnx-morph.js --network morph-testnet
```

### **Phase 3: Verify Contracts**
```bash
# Verify on Morph Explorer
npx hardhat verify --network morph-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### **Phase 4: Update Frontend**
- [ ] Update contract addresses in `frontend1/config/contracts.json`
- [ ] Update network configuration to Morph Testnet
- [ ] Test all frontend functionality

### **Phase 5: Deploy Backend Services**
- [ ] Deploy `earnx-verification-api` to Render with new name
- [ ] Update all API endpoints to use EarnX branding
- [ ] Test API connectivity

## 🔧 **Post-Deployment Configuration**

### **Frontend Updates**
```javascript
// Update contract addresses after deployment
const CONTRACT_ADDRESSES = {
  EARNX_PROTOCOL: "0x...", // New deployed address
  EARNX_INVOICE_NFT: "0x...", // New deployed address
  MOCK_USDC: "0x...", // New deployed address
  // ... other contracts
};
```

### **API Configuration**
```javascript
// Update API base URLs
const API_BASE_URL = "https://earnx.onrender.com";
const FRONTEND_URL = "https://earnx.vercel.app";
```

## 📊 **Testing Checklist**

### **Smart Contract Testing**
- [ ] Test invoice submission
- [ ] Test document verification
- [ ] Test investment flow
- [ ] Test NFT minting
- [ ] Test yield distribution

### **Frontend Testing**
- [ ] Test wallet connection
- [ ] Test contract interactions
- [ ] Test IPFS uploads
- [ ] Test real-time data
- [ ] Test responsive design

### **API Testing**
- [ ] Test verification endpoints
- [ ] Test analytics endpoints
- [ ] Test health checks
- [ ] Test rate limiting
- [ ] Test error handling

## 🎯 **Go-Live Checklist**

### **Production Readiness**
- [ ] All contracts deployed and verified
- [ ] Frontend deployed with correct contract addresses
- [ ] API deployed with EarnX branding
- [ ] Database migrated and operational
- [ ] All environment variables configured
- [ ] SSL certificates configured
- [ ] Monitoring and logging enabled

### **Documentation Updates**
- [ ] Update README.md with new deployment addresses
- [ ] Update API documentation
- [ ] Update user guides
- [ ] Update technical documentation

### **Community & Marketing**
- [ ] Update social media profiles
- [ ] Update GitHub repository name/description
- [ ] Update project listings
- [ ] Announce rebrand to community

## 🔐 **Security Checklist**

- [ ] Private keys secured and not committed
- [ ] API keys properly configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Database access secured
- [ ] Smart contracts audited (if required)

## 📞 **Support & Maintenance**

- [ ] Set up monitoring alerts
- [ ] Configure backup procedures
- [ ] Document troubleshooting procedures
- [ ] Set up support channels

---

## 🎉 **Launch Commands**

Once everything is set up, launch with:

```bash
# 1. Deploy contracts
npm run deploy:morph

# 2. Update frontend config
# (Update contract addresses manually)

# 3. Deploy frontend
vercel --prod

# 4. Deploy API
# (Push to main branch for Render auto-deploy)

# 5. Test everything
npm run test:integration
```

**Status**: Ready for deployment! 🚀