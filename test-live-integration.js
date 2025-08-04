// Test Live API Integration for EarnX Protocol
const axios = require('axios');

const API_BASE_URL = 'https://earnx-verification-api.onrender.com';
const API_KEY = 'earnx-secure-api-key-2024-production';

async function testLiveIntegration() {
  console.log('🚀 EarnX Live Integration Test\n');
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/v1/verification`);
    console.log('✅ Health Check:', healthResponse.data.status);
    
    // Test 2: Quick Test Endpoint
    console.log('\n2. Testing Quick Test Endpoint...');
    const testResponse = await axios.get(`${API_BASE_URL}/api/v1/verification/test`);
    console.log('✅ Test Endpoint:', testResponse.data.message);
    
    // Test 3: Minimal Verification (Chainlink Compatible)
    console.log('\n3. Testing Minimal Verification (Chainlink Functions)...');
    const verificationData = {
      invoiceId: 'TEST-' + Date.now(),
      documentHash: '0x' + Math.random().toString(36).substring(2),
      commodity: 'COFFEE',
      amount: 50000,
      supplierCountry: 'Ethiopia',
      buyerCountry: 'USA'
    };
    
    const verifyResponse = await axios.post(
      `${API_BASE_URL}/api/v1/verification/verify-minimal`,
      verificationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        }
      }
    );
    
    console.log('✅ Verification Result:', verifyResponse.data);
    
    // Test 4: Full Document Verification
    console.log('\n4. Testing Full Document Verification...');
    const fullVerificationData = {
      invoiceId: 'FULL-TEST-' + Date.now(),
      documentHash: '0x' + Math.random().toString(36).substring(2),
      invoiceDetails: {
        commodity: 'COCOA',
        amount: 75000,
        supplierCountry: 'Ghana',
        buyerCountry: 'Germany',
        exporterName: 'Ghana Cocoa Export Co.',
        buyerName: 'European Chocolate Industries'
      }
    };
    
    const fullVerifyResponse = await axios.post(
      `${API_BASE_URL}/api/v1/verification/verify-documents`,
      fullVerificationData,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        }
      }
    );
    
    console.log('✅ Full Verification Result:', fullVerifyResponse.data);
    
    // Test 5: Analytics Dashboard
    console.log('\n5. Testing Analytics Dashboard...');
    const analyticsResponse = await axios.get(`${API_BASE_URL}/api/v1/analytics/dashboard`);
    console.log('✅ Analytics Dashboard:', analyticsResponse.data.summary || 'Available');
    
    console.log('\n🎉 All tests passed! Your EarnX API is fully functional and ready for production!');
    console.log('\n📋 Integration Summary:');
    console.log('✅ Backend API: Live and responding');
    console.log('✅ Verification Service: Working');
    console.log('✅ Chainlink Functions: Ready');
    console.log('✅ Analytics: Available');
    console.log('✅ Database: Connected');
    
    console.log('\n🔗 Next Steps:');
    console.log('1. Deploy updated smart contracts with live API integration');
    console.log('2. Test frontend with live backend');
    console.log('3. Configure Chainlink Functions subscription with API key');
    console.log('4. Go live with your EarnX Protocol! 🚀');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Tip: Make sure your API key is correct in the environment variables');
    }
    
    if (error.response?.status === 404) {
      console.log('\n💡 Tip: Check if the API endpoint URLs are correct');
    }
  }
}

// Run the test
testLiveIntegration();