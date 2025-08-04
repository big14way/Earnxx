# 🚀 EarnX Smart Contract Deployment Guide

## ✅ Integration Status: READY FOR DEPLOYMENT

Your EarnX Protocol is now fully integrated with the live API! Here's what's been updated:

### 🔗 **Live API Integration Complete**

**Backend API**: https://earnx-verification-api.onrender.com ✅ LIVE
**Verification Endpoint**: `/api/v1/verification/verify-minimal` ✅ TESTED
**Response Format**: `"0,75,C"` (isValid,riskScore,creditRating) ✅ FORMAT CONFIRMED

### 📝 **Updated Files**

1. **Smart Contract**: `contracts/EarnXVerificationModule.sol`
   - ✅ Updated Chainlink Functions source to call live API
   - ✅ API URL: `https://earnx-verification-api.onrender.com/api/v1/verification/verify-minimal`
   - ✅ Passes 6 arguments: invoiceId, documentHash, commodity, amount, supplierCountry, buyerCountry

2. **Chainlink Config**: `config/chainlink-config.js` 
   - ✅ Updated API URL to live endpoint
   - ✅ Subscription ID: 15721 (active)

3. **Backend Service**: `earnx-verification-api/src/verification/services/chainlink-functions.service.ts`
   - ✅ Updated to reference live API URL

4. **Frontend**: `frontend1/.env`
   - ✅ Updated to use live backend: `https://earnx-verification-api.onrender.com`

## 🚀 **Deployment Steps**

### **Step 1: Deploy Updated Smart Contracts**

```bash
# Compile contracts
npx hardhat compile

# Deploy to Morph Testnet
npx hardhat run scripts/deploy.ts --network morph

# Or deploy to Sepolia for testing
npx hardhat run scripts/deploy.ts --network sepolia
```

### **Step 2: Configure Chainlink Functions Subscription**

1. **Go to**: https://functions.chain.link/
2. **Select Network**: Sepolia Testnet  
3. **Find Subscription**: ID `15721`
4. **Add Secrets**:
   ```
   apiKey: earnx-secure-api-key-2024-production
   ```
5. **Verify API URL**: `https://earnx-verification-api.onrender.com/api/v1/verification/verify-minimal`

### **Step 3: Update Frontend Contract Addresses**

After deployment, update `frontend1/src/config/constants.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  PROTOCOL: "0x[NEW_PROTOCOL_ADDRESS]",
  VERIFICATION_MODULE: "0x[NEW_VERIFICATION_ADDRESS]", 
  MOCK_USDC: "0x4D7d440a869E5Aadd2b4589bAeaEbff3391a3232",
  INVOICE_NFT: "0x4412F6B9b9e8ccB72405425337c85371A4f5F531",
};
```

### **Step 4: Test End-to-End Flow**

1. **Frontend**: Submit an invoice through the UI
2. **Backend**: Verify API processes the request
3. **Smart Contract**: Call verification function
4. **Chainlink Functions**: Execute API call and return result

## 🧪 **Integration Test Results**

✅ **API Health Check**: `{"status":"healthy","service":"EarnX Document Verification API"}`
✅ **Verification Test**: Returns `"0,75,C"` format as expected
✅ **Chainlink Compatibility**: API responds within 256-byte limit
✅ **Authentication**: API key validation working

## 📋 **Current Configuration**

```javascript
// Chainlink Functions Source (in smart contract)
const request = Functions.makeHttpRequest({
  url: 'https://earnx-verification-api.onrender.com/api/v1/verification/verify-minimal',
  method: 'POST',
  headers: {'Content-Type': 'application/json', 'X-API-Key': secrets.apiKey},
  data: {invoiceId, documentHash, commodity, amount: parseInt(amount), supplierCountry, buyerCountry}
});
```

## 🔑 **Environment Variables Needed**

**Chainlink Functions Secrets**:
```
apiKey = "earnx-secure-api-key-2024-production"
```

**Frontend `.env`**:
```
REACT_APP_API_BASE_URL=https://earnx-verification-api.onrender.com
REACT_APP_EARNX_PROTOCOL_ADDRESS=[DEPLOYED_CONTRACT_ADDRESS]
```

## 🎯 **Final Checklist**

- [x] Backend API deployed and running
- [x] Smart contracts updated with live API integration
- [x] Chainlink Functions source code updated
- [x] Frontend configured for live backend
- [x] API endpoints tested and responding
- [ ] Deploy updated smart contracts
- [ ] Configure Chainlink Functions subscription with secrets
- [ ] Update frontend with new contract addresses
- [ ] Perform end-to-end testing

## 🚀 **Ready for Launch!**

Your EarnX Protocol is now fully integrated and ready for deployment! The complete flow will work as:

1. **User submits invoice** → Frontend
2. **Frontend calls smart contract** → EarnX Protocol
3. **Smart contract triggers Chainlink Functions** → Verification Module  
4. **Chainlink Functions calls your API** → Live Backend
5. **API returns verification result** → Smart Contract
6. **Smart contract processes result** → Invoice tokenized/rejected

**All systems are GO! 🎊**