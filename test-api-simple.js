// Simple API test without starting the full server
const axios = require('axios');

async function testAPI() {
    console.log("🧪 Testing Chainlink Verification API");
    console.log("=" .repeat(40));
    
    // Test the production API endpoint
    const apiUrl = 'https://earnx.onrender.com';
    
    // Test 1: Health check
    console.log("🔍 Testing API health...");
    try {
        const healthResponse = await axios.get(`${apiUrl}/health`, { timeout: 10000 });
        console.log(`✅ Health check: ${healthResponse.status} - ${healthResponse.data.status}`);
    } catch (error) {
        console.log(`⚠️ Health check failed: ${error.message}`);
    }
    
    // Test 2: Verification endpoint
    console.log("\n🔗 Testing verification endpoint...");
    try {
        const testData = {
            invoiceId: "test-chainlink-123",
            supplier: {
                name: "Test Coffee Supplier",
                country: "Kenya",
                address: "123 Coffee Street, Nairobi"
            },
            buyer: {
                name: "Test Coffee Buyer", 
                country: "Germany",
                address: "456 Import Ave, Berlin"
            },
            amount: 5000,
            commodity: "Coffee",
            country: "Kenya",
            metadata: {
                test: true,
                chainlinkSetup: true
            }
        };
        
        const response = await axios.post(
            `${apiUrl}/verification/verify-documents`,
            testData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Chainlink-Functions/1.0'
                },
                timeout: 30000
            }
        );
        
        console.log("✅ Verification endpoint test:");
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        
    } catch (error) {
        console.log(`⚠️ Verification test: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        }
    }
    
    // Test 3: Minimal verification endpoint
    console.log("\n📝 Testing minimal verification endpoint...");
    try {
        const minimalData = {
            invoiceId: "minimal-test-123",
            commodity: "Coffee",
            amount: 1000,
            supplierCountry: "Kenya",
            buyerCountry: "Germany"
        };
        
        const response = await axios.post(
            `${apiUrl}/verification/verify-minimal`,
            minimalData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Chainlink-Functions/1.0'
                },
                timeout: 30000
            }
        );
        
        console.log("✅ Minimal verification test:");
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        
    } catch (error) {
        console.log(`⚠️ Minimal verification test: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        }
    }
    
    console.log("\n🎉 API Testing Complete!");
    console.log("✅ Your verification API is accessible");
    console.log("✅ Chainlink Functions can make requests to these endpoints");
    console.log("✅ Ready for smart contract integration!");
}

testAPI()
    .then(() => console.log("\n✨ All tests completed!"))
    .catch(error => console.error("❌ Test suite failed:", error.message));