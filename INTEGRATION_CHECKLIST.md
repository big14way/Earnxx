# EarnX Integration Checklist

## ✅ Completed Updates

### 1. Backend YieldX → EarnX Migration
- ✅ Updated verification controller service name to "EarnX Document Verification API"
- ✅ Updated quick test message to "EarnX Verification API is working"  
- ✅ Updated ping service URL from `yieldx.onrender.com` to `earnx.onrender.com`
- ✅ Updated frontend ping service URLs and user agents

### 2. Backend Architecture Review
- ✅ Comprehensive NestJS verification API ready
- ✅ Chainlink Functions optimization implemented  
- ✅ MongoDB integration configured
- ✅ Security features (rate limiting, CORS, validation) in place

## 🔧 Integration Requirements

### 3. Environment Variables Needed

#### Backend (.env in earnx-verification-api/)
```bash
# Server Configuration
PORT=3001
NODE_ENV=production
API_BASE_URL=https://earnx.onrender.com

# MongoDB Atlas (REQUIRED)
MONGODB_URI=mongodb+srv://earnx-user:<password>@cluster.mongodb.net/earnx_verification?retryWrites=true&w=majority
DB_NAME=earnx_verification

# Security (REQUIRED)
API_KEY=your-secure-api-key-here
CORS_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# Rate Limiting
THROTTLE_TTL=60000
THROTTLE_LIMIT=10

# Optional External APIs
SANCTIONS_API_KEY=your-sanctions-api-key
FRAUD_API_KEY=your-fraud-api-key
CHAINLINK_API_KEY=your-chainlink-api-key
```

#### Frontend (.env in frontend1/)
```bash
# Backend API Connection
REACT_APP_API_BASE_URL=https://earnx.onrender.com

# Wallet Integration
REACT_APP_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# IPFS/Pinata
REACT_APP_PINATA_API_KEY=your_pinata_api_key

# Smart Contract Addresses (UPDATE TO ACTUAL DEPLOYED ADDRESSES)
REACT_APP_EARNX_PROTOCOL_ADDRESS=0x...
REACT_APP_EARNX_VERIFICATION_ADDRESS=0x...
```

## 🔗 Integration Flow

### 4. Frontend → Backend Flow

#### A. Document Verification Flow (SubmitInvoice page)
```typescript
// 1. Frontend submits invoice with documents
const verificationRequest = {
  invoiceId: "INV-001",
  documentHash: ipfsHash,
  invoiceDetails: {
    commodity: "Coffee",
    amount: "50000",
    supplierCountry: "Ethiopia", 
    buyerCountry: "USA",
    exporterName: "Ethiopian Coffee Co",
    buyerName: "US Importers Inc"
  }
};

// 2. Call backend verification API
const response = await fetch('https://earnx.onrender.com/verification/verify-documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.REACT_APP_API_KEY
  },
  body: JSON.stringify(verificationRequest)
});

// 3. Backend returns verification result
const result = await response.json();
// {
//   "isValid": true,
//   "riskScore": 25,
//   "creditRating": "A",
//   "verificationId": "vrf_1234567890"
// }
```

#### B. Smart Contract Integration Flow
```typescript
// 4. Frontend calls smart contract with verification result
const contract = useWriteContract();
await contract.writeContract({
  address: EARNX_PROTOCOL_ADDRESS,
  abi: EarnXProtocolABI,
  functionName: 'submitInvoice',
  args: [
    invoiceId,
    documentHash,
    parseUnits(amount.toString(), 6), // USDC decimals
    result.verificationId,
    result.riskScore,
    result.creditRating
  ]
});
```

### 5. Smart Contract → Backend Flow (Chainlink Functions)

#### A. Verification Module Integration
```solidity
// Smart contract calls Chainlink Functions
function verifyInvoice(
    string memory invoiceId,
    string memory documentHash,
    string memory commodity,
    uint256 amount,
    string memory supplierCountry,
    string memory buyerCountry
) external returns (bytes32 requestId) {
    
    // Chainlink Functions calls: 
    // POST https://earnx.onrender.com/verification/verify-minimal
    
    bytes memory args = abi.encode(
        invoiceId, documentHash, commodity, 
        amount, supplierCountry, buyerCountry
    );
    
    return _sendRequest(verificationSource, encryptedSecretsUrls, args);
}

// Backend returns compact response for Chainlink
// Response: { "result": "1,25,A" } (isValid,riskScore,creditRating)
```

## 📋 Deployment Checklist

### 6. Backend Deployment (earnx-verification-api)

#### Required Services:
- [ ] **MongoDB Atlas Database**
  - Create cluster: `earnx-verification-cluster`
  - Database: `earnx_verification`
  - User: `earnx-api-user` with read/write access

- [ ] **Render.com Deployment**
  - Deploy from GitHub: `earnx-verification-api/`
  - Environment variables configured
  - Custom domain: `earnx.onrender.com`

- [ ] **API Key Generation**
  - Generate secure API key for frontend access
  - Configure CORS for frontend domain

#### Optional Enhancements:
- [ ] **External API Keys**
  - Sanctions screening API
  - Fraud detection API
  - Enhanced risk assessment services

### 7. Frontend Integration

#### Required Updates:
- [ ] **Environment Variables**
  - Update API_BASE_URL to production backend
  - Configure wallet connect project ID
  - Set Pinata API key for IPFS uploads

- [ ] **Smart Contract Addresses**
  - Update constants.ts with deployed contract addresses
  - Update ABI files if contracts were modified

- [ ] **API Integration**
  - Test verification flow end-to-end
  - Verify error handling and loading states

### 8. Smart Contract Integration

#### Required Configuration:
- [ ] **Chainlink Functions Subscription**
  - Create Functions subscription on Morph testnet
  - Fund subscription with LINK tokens
  - Configure secrets for API authentication

- [ ] **Backend URL Configuration**
  - Update Chainlink Functions source code
  - Set API endpoint: `https://earnx.onrender.com/verification/verify-minimal`
  - Configure API key in Chainlink secrets

#### Functions Source Code:
```javascript
// Chainlink Functions source for verification
const apiUrl = "https://earnx.onrender.com/verification/verify-minimal";
const apiKey = secrets.apiKey;

const request = {
  invoiceId: args[0],
  documentHash: args[1], 
  commodity: args[2],
  amount: parseInt(args[3]),
  supplierCountry: args[4],
  buyerCountry: args[5]
};

const response = await Functions.makeHttpRequest({
  url: apiUrl,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": apiKey
  },
  data: request
});

return Functions.encodeString(response.data.result);
```

## 🧪 Testing Checklist

### 9. End-to-End Testing Flow

#### A. Local Development Testing:
- [ ] Start backend: `cd earnx-verification-api && npm run start:dev`
- [ ] Start frontend: `cd frontend1 && npm start`  
- [ ] Test verification API: `curl https://earnx.onrender.com/verification/test`
- [ ] Test document upload and verification flow

#### B. Production Testing:
- [ ] Test API health: `https://earnx.onrender.com/verification`
- [ ] Test minimal verification: `POST /verification/verify-minimal`
- [ ] Test frontend → backend integration
- [ ] Test smart contract → backend via Chainlink Functions

### 10. Monitoring & Maintenance

#### Health Checks:
- [ ] Backend self-ping service configured
- [ ] Frontend ping service pointing to correct API
- [ ] Database connection monitoring
- [ ] API response time monitoring

## 🚀 Go-Live Steps

1. **Deploy Backend** to Render.com with production environment variables
2. **Configure MongoDB Atlas** with production database and user
3. **Deploy Smart Contracts** to Morph mainnet with Chainlink Functions
4. **Update Frontend** environment variables for production
5. **Test Complete Flow** from frontend → backend → smart contracts
6. **Enable Monitoring** and health checks
7. **Go Live** 🎉

## 🔧 Immediate Next Steps

To make everything work right now:

1. **Set up MongoDB Atlas**:
   ```bash
   # Create cluster and get connection string
   MONGODB_URI=mongodb+srv://earnx-user:password@cluster.mongodb.net/earnx_verification
   ```

2. **Deploy Backend to Render.com**:
   ```bash
   # Connect GitHub repo: earnx-verification-api/
   # Set environment variables from .env.example
   # Deploy and get URL: https://earnx.onrender.com
   ```

3. **Update Frontend Environment**:
   ```bash
   # In frontend1/.env
   REACT_APP_API_BASE_URL=https://earnx.onrender.com
   ```

4. **Test Integration**:
   ```bash
   # Test API health
   curl https://earnx.onrender.com/verification
   
   # Test verification
   curl -X POST https://earnx.onrender.com/verification/verify-minimal \
     -H "Content-Type: application/json" \
     -d '{"invoiceId":"TEST-001","commodity":"Coffee","amount":50000}'
   ```

All the code is ready - we just need to deploy the backend and configure the environment variables! 🚀