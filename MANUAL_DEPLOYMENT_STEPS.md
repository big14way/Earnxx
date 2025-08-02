# EarnX Manual Deployment Steps 🚀

Since the npm/yarn installations are timing out, here's how to complete the deployment manually:

## 🔧 **Step 1: Fix Dependencies**

Try these approaches in order:

### Option A: Clean Install
```bash
# Remove old files
rm -rf node_modules package-lock.json yarn.lock

# Try npm with different settings
npm cache clean --force
npm install --legacy-peer-deps --timeout=600000

# Or try yarn
yarn install --network-timeout 600000
```

### Option B: Use GitHub Codespaces or Replit
If local installation fails, use a cloud development environment:
- GitHub Codespaces
- Replit
- Gitpod

### Option C: Docker Approach
```bash
# Use a Node.js Docker container with pre-installed tools
docker run -it -v $(pwd):/app node:18 bash
cd /app
npm install --legacy-peer-deps
```

## 🏗️ **Step 2: Compile and Deploy**

Once dependencies are installed:

```bash
# Compile contracts
npx hardhat compile

# Deploy to Morph Testnet
npx hardhat run scripts/deploy.ts --network morph-testnet
```

## 🗝️ **Step 3: Required API Keys & Services**

### **Immediate Actions Needed:**

#### **1. Morph Testnet Setup**
```bash
# Add Morph Testnet to MetaMask:
Network Name: Morph Testnet
RPC URL: https://rpc-testnet.morphl2.io
Chain ID: 2710
Symbol: ETH
Block Explorer: https://explorer-testnet.morphl2.io

# Get testnet ETH:
# Visit Morph testnet faucet and get test ETH for deployment
```

#### **2. Environment Variables**
Create `.env` file with:
```bash
SEPOLIA_PRIVATE_KEY=your_private_key_with_test_eth
MORPH_EXPLORER_API_KEY=get_from_morph_explorer
INFURA=your_infura_project_id
```

#### **3. Update Hosting Services**
```bash
# Render.com:
# 1. Go to render.com dashboard
# 2. Update service name from "yieldx" to "earnx"
# 3. Update environment variables

# Vercel:
# 1. Go to vercel.com dashboard  
# 2. Update project name from "yieldx-frontend" to "earnx-frontend"
# 3. Update environment variables
```

#### **4. Update Database**
```bash
# MongoDB Atlas:
# 1. Create new database: "earnx_verification"
# 2. Update connection string in environment variables
# 3. Optional: Migrate existing data
```

## 📦 **Step 4: Update Frontend After Deployment**

After successful contract deployment, update these files:

### **Contract Configuration**
```javascript
// frontend1/config/contracts.json
{
  "contractAddresses": {
    "MockUSDC": "NEW_DEPLOYED_ADDRESS",
    "EarnXInvoiceNFT": "NEW_DEPLOYED_ADDRESS", 
    "EarnXProtocol": "NEW_DEPLOYED_ADDRESS"
  },
  "network": {
    "name": "morph-testnet",
    "chainId": 2710
  }
}
```

### **Constants File**
```javascript
// frontend1/src/config/constants.ts
export const CONTRACT_ADDRESSES = {
  PROTOCOL: "NEW_EARNX_PROTOCOL_ADDRESS",
  MOCK_USDC: "NEW_MOCK_USDC_ADDRESS", 
  INVOICE_NFT: "NEW_EARNX_NFT_ADDRESS",
};
```

## 🚀 **Step 5: Deploy Updated Services**

### **Backend API**
```bash
# Update earnx-verification-api deployment
cd earnx-verification-api
git add .
git commit -m "Rebrand to EarnX"
git push origin main
# Render will auto-deploy if connected to GitHub
```

### **Frontend**
```bash
cd frontend1
# Update contract addresses first
npm run build
vercel --prod
```

## 🧪 **Step 6: Testing**

### **Test Sequence:**
1. **Connect Wallet** to Morph Testnet
2. **Mint Test USDC** using deployed MockUSDC contract
3. **Submit Test Invoice** to test verification flow
4. **Make Test Investment** to test complete flow
5. **Check NFT Minting** on testnet explorer

### **Verification Commands:**
```bash
# Verify contracts on Morph Explorer
npx hardhat verify --network morph-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 📊 **Step 7: Update Documentation**

After successful deployment:

1. **Update README.md** with new contract addresses
2. **Update API documentation** with new endpoints
3. **Update deployment addresses** in all documentation

## 🎯 **Success Criteria**

✅ All contracts deployed to Morph Testnet  
✅ Frontend updated with new addresses  
✅ API deployed with EarnX branding  
✅ Database updated to EarnX  
✅ Full end-to-end test completed  

## 🆘 **If You Need Help**

If you encounter issues:

1. **Check Node.js Version**: Use Node.js 18 or 20
2. **Clear npm cache**: `npm cache clean --force`
3. **Use different package manager**: Try yarn or pnpm
4. **Check network connectivity**: Ensure stable internet
5. **Use cloud environment**: GitHub Codespaces, etc.

## 🎉 **Current Status**

✅ **COMPLETED:**
- All contracts rebranded to EarnX
- Frontend code updated
- Documentation updated
- Backend services updated
- Environment configuration created

🚧 **PENDING:**
- Contract compilation and deployment
- Update API keys and hosting services
- Test complete flow

**You're 90% complete! Just need to deploy the contracts.** 🚀