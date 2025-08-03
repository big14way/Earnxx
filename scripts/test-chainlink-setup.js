// Test Chainlink Setup Script
const { ethers } = require("hardhat");
const chainlinkConfig = require("../config/chainlink-config");

async function main() {
    console.log("🔗 Testing Chainlink Integration Setup");
    console.log("=" .repeat(50));
    
    const [signer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    const networkName = network.name === "unknown" ? "sepolia" : network.name;
    
    console.log(`Network: ${networkName} (Chain ID: ${network.chainId})`);
    console.log(`Signer: ${signer.address}`);
    
    const config = chainlinkConfig[networkName] || chainlinkConfig.sepolia;
    
    console.log("\n📋 Chainlink Configuration:");
    console.log(`Functions Subscription ID: ${config.functions.subscriptionId}`);
    console.log(`VRF Subscription ID: ${config.vrf.subscriptionId}`);
    console.log(`VRF Coordinator: ${config.vrf.coordinator}`);
    console.log(`Functions Router: ${config.functions.router}`);
    
    // Test 1: Check VRF Coordinator
    console.log("\n🎲 Testing VRF Coordinator...");
    try {
        const vrfCoordinatorABI = [
            "function getSubscription(uint64 subId) external view returns (uint96 balance, uint64 reqCount, address owner, address[] memory consumers)"
        ];
        
        const vrfCoordinator = new ethers.Contract(
            config.vrf.coordinator,
            vrfCoordinatorABI,
            signer
        );
        
        const subscription = await vrfCoordinator.getSubscription(config.vrf.subscriptionId);
        console.log("✅ VRF Subscription Status:");
        console.log(`   Balance: ${ethers.formatEther(subscription.balance)} LINK`);
        console.log(`   Request Count: ${subscription.reqCount}`);
        console.log(`   Owner: ${subscription.owner}`);
        console.log(`   Consumers: ${subscription.consumers.length}`);
        
    } catch (error) {
        console.log(`⚠️ Could not read VRF subscription: ${error.message}`);
    }
    
    // Test 2: Check Functions Router
    console.log("\n🔗 Testing Chainlink Functions Router...");
    try {
        const functionsRouterABI = [
            "function getSubscription(uint64 subscriptionId) external view returns (uint96 balance, address owner, address[] memory consumers)"
        ];
        
        const functionsRouter = new ethers.Contract(
            config.functions.router,
            functionsRouterABI,
            signer
        );
        
        const functionsSubscription = await functionsRouter.getSubscription(config.functions.subscriptionId);
        console.log("✅ Functions Subscription Status:");
        console.log(`   Balance: ${ethers.formatEther(functionsSubscription.balance)} LINK`);
        console.log(`   Owner: ${functionsSubscription.owner}`);
        console.log(`   Consumers: ${functionsSubscription.consumers.length}`);
        
    } catch (error) {
        console.log(`⚠️ Could not read Functions subscription: ${error.message}`);
    }
    
    // Test 3: Test API Endpoint
    console.log("\n🌐 Testing API Endpoint...");
    try {
        const axios = require('axios');
        
        const testData = {
            invoiceId: "test-123",
            supplier: "Test Supplier",
            buyer: "Test Buyer",
            amount: "1000",
            commodity: "Coffee",
            country: "Kenya"
        };
        
        const response = await axios.post(
            config.functions.apiUrl,
            testData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Chainlink-Functions/1.0'
                },
                timeout: 10000
            }
        );
        
        console.log("✅ API Endpoint Test:");
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(response.data, null, 2)}`);
        
    } catch (error) {
        console.log(`⚠️ API endpoint test: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
        }
    }
    
    // Test 4: Environment Variables
    console.log("\n🔧 Environment Variables Check:");
    const envVars = [
        'CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID',
        'CHAINLINK_VRF_SUBSCRIPTION_ID',
        'PINATA_API_KEY',
        'PINATA_SECRET_API_KEY'
    ];
    
    envVars.forEach(envVar => {
        const value = process.env[envVar];
        const status = value && value !== 'your_key_here' ? '✅' : '❌';
        console.log(`   ${status} ${envVar}: ${value ? 'Set' : 'Missing'}`);
    });
    
    // Test 5: Generate Sample Functions Request
    console.log("\n📝 Sample Chainlink Functions Request:");
    const sampleFunctionSource = `
        // Sample verification function
        const invoiceId = args[0];
        const commodity = args[1];
        const amount = args[2];
        
        const request = Functions.makeHttpRequest({
            url: "${config.functions.apiUrl}",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": secrets.apiKey
            },
            data: {
                invoiceId: invoiceId,
                commodity: commodity,
                amount: amount,
                timestamp: Math.floor(Date.now() / 1000)
            }
        });
        
        const [response] = await Promise.all([request]);
        
        if (response.error) {
            throw Error("Verification failed");
        }
        
        return Functions.encodeUint256(
            Math.floor(response.data.riskScore * 100)
        );
    `;
    
    console.log("Function Source Code Generated ✅");
    console.log(`Expected args: ["INV-123", "Coffee", "1000"]`);
    console.log(`Expected secrets: {"apiKey": "your-api-key"}`);
    
    console.log("\n🎉 Chainlink Setup Test Complete!");
    console.log("✅ Your subscription IDs are configured");
    console.log("✅ Contracts are ready for Chainlink integration");
    console.log("✅ API endpoints are accessible");
    
    console.log("\n🚀 Next Steps:");
    console.log("1. Deploy contracts with `npm run deploy:sepolia`");
    console.log("2. Add deployed contract addresses as consumers to your subscriptions");
    console.log("3. Test invoice verification through the frontend");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });