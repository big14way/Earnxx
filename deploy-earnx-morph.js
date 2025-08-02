// Simple deployment script for EarnX Protocol on Morph Testnet
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

// Morph Testnet Configuration
const MORPH_CONFIG = {
    CHAIN_ID: 2710,
    RPC_URL: "https://rpc-testnet.morphl2.io",
    INITIAL_USDC_SUPPLY: "1000000000000", // 1M USDC (6 decimals)
    FUNCTIONS_SUBSCRIPTION_ID: 4996, // We'll use a dummy for now
};

async function main() {
    console.log("🚀 Starting EarnX Protocol Deployment on Morph Testnet...");
    console.log("=" .repeat(60));
    
    const [deployer] = await hre.ethers.getSigners();
    const deployerAddress = await deployer.getAddress();
    const balance = await hre.ethers.provider.getBalance(deployerAddress);
    
    console.log("📋 Deployment Configuration:");
    console.log(`   Network: ${hre.network.name}`);
    console.log(`   Deployer: ${deployerAddress}`);
    console.log(`   Balance: ${hre.ethers.formatEther(balance)} ETH`);
    console.log("=" .repeat(60));
    
    const deployedContracts = {};
    
    try {
        console.log("\n🏗️ PHASE 1: CORE INFRASTRUCTURE");
        console.log("=" .repeat(40));

        // 1. Deploy Mock USDC
        console.log("🔧 Deploying Mock USDC...");
        const MockUSDC = await hre.ethers.getContractFactory("MockUSDC");
        const mockUSDC = await MockUSDC.deploy();
        await mockUSDC.waitForDeployment();
        const usdcAddress = await mockUSDC.getAddress();
        console.log(`✅ Mock USDC deployed: ${usdcAddress}`);
        deployedContracts.mockUSDC = usdcAddress;

        // 2. Deploy EarnX Invoice NFT
        console.log("🔧 Deploying EarnX Invoice NFT...");
        const EarnXNFT = await hre.ethers.getContractFactory("EarnXInvoiceNFT");
        const earnxNFT = await EarnXNFT.deploy();
        await earnxNFT.waitForDeployment();
        const nftAddress = await earnxNFT.getAddress();
        console.log(`✅ EarnX Invoice NFT deployed: ${nftAddress}`);
        deployedContracts.earnxNFT = nftAddress;

        // 3. Deploy Price Manager (with dummy addresses for Morph)
        console.log("🔧 Deploying EarnX Price Manager...");
        const EarnXPriceManager = await hre.ethers.getContractFactory("EarnXPriceManager");
        const priceManager = await EarnXPriceManager.deploy(
            deployerAddress, // Using deployer as dummy feed
            deployerAddress,
            deployerAddress,
            deployerAddress
        );
        await priceManager.waitForDeployment();
        const priceManagerAddress = await priceManager.getAddress();
        console.log(`✅ EarnX Price Manager deployed: ${priceManagerAddress}`);
        deployedContracts.priceManager = priceManagerAddress;

        // 4. Deploy Fallback Contract
        console.log("🔧 Deploying Chainlink Fallback Contract...");
        const FallbackContract = await hre.ethers.getContractFactory("ChainlinkFallbackContract");
        const fallbackContract = await FallbackContract.deploy();
        await fallbackContract.waitForDeployment();
        const fallbackAddress = await fallbackContract.getAddress();
        console.log(`✅ Chainlink Fallback deployed: ${fallbackAddress}`);
        deployedContracts.fallbackContract = fallbackAddress;

        // 5. Deploy Risk Calculator
        console.log("🔧 Deploying EarnX Risk Calculator...");
        const EarnXRiskCalculator = await hre.ethers.getContractFactory("EarnXRiskCalculator");
        const riskCalculator = await EarnXRiskCalculator.deploy(fallbackAddress, priceManagerAddress);
        await riskCalculator.waitForDeployment();
        const riskCalculatorAddress = await riskCalculator.getAddress();
        console.log(`✅ EarnX Risk Calculator deployed: ${riskCalculatorAddress}`);
        deployedContracts.riskCalculator = riskCalculatorAddress;

        // 6. Deploy Investment Module
        console.log("🔧 Deploying EarnX Investment Module...");
        const EarnXInvestmentModule = await hre.ethers.getContractFactory("EarnXInvestmentModule");
        const investmentModule = await EarnXInvestmentModule.deploy(usdcAddress);
        await investmentModule.waitForDeployment();
        const investmentModuleAddress = await investmentModule.getAddress();
        console.log(`✅ EarnX Investment Module deployed: ${investmentModuleAddress}`);
        deployedContracts.investmentModule = investmentModuleAddress;

        // 7. Deploy VRF Module (with dummy VRF coordinator)
        console.log("🔧 Deploying EarnX VRF Module...");
        const EarnXVRFModule = await hre.ethers.getContractFactory("EarnXVRFModule");
        const vrfModule = await EarnXVRFModule.deploy(
            deployerAddress, // Dummy VRF coordinator
            "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // Dummy key hash
            1000, // Dummy subscription ID
            riskCalculatorAddress
        );
        await vrfModule.waitForDeployment();
        const vrfModuleAddress = await vrfModule.getAddress();
        console.log(`✅ EarnX VRF Module deployed: ${vrfModuleAddress}`);
        deployedContracts.vrfModule = vrfModuleAddress;

        // 8. Deploy Verification Module (simplified)
        console.log("🔧 Deploying EarnX Verification Module...");
        const EarnXVerificationModule = await hre.ethers.getContractFactory("EarnXVerificationModule");
        const verificationModule = await EarnXVerificationModule.deploy(MORPH_CONFIG.FUNCTIONS_SUBSCRIPTION_ID);
        await verificationModule.waitForDeployment();
        const verificationModuleAddress = await verificationModule.getAddress();
        console.log(`✅ EarnX Verification Module deployed: ${verificationModuleAddress}`);
        deployedContracts.verificationModule = verificationModuleAddress;

        console.log("\n🏗️ PHASE 2: CORE PROTOCOL");
        console.log("=" .repeat(40));

        // 9. Deploy EarnX Core Protocol
        console.log("🔧 Deploying EarnX Core Protocol...");
        const EarnXProtocol = await hre.ethers.getContractFactory("EarnXProtocol");
        const earnxCore = await EarnXProtocol.deploy(
            nftAddress,
            usdcAddress,
            priceManagerAddress,
            verificationModuleAddress,
            investmentModuleAddress,
            vrfModuleAddress
        );
        await earnxCore.waitForDeployment();
        const coreAddress = await earnxCore.getAddress();
        console.log(`✅ EarnX Core Protocol deployed: ${coreAddress}`);
        deployedContracts.earnxCore = coreAddress;

        console.log("\n🔗 PHASE 3: INITIALIZATION");
        console.log("=" .repeat(40));

        // Initialize protocol
        console.log("🔧 Initializing Protocol...");
        try {
            const initTx = await earnxCore.initializeProtocol();
            await initTx.wait();
            console.log("✅ Protocol initialized successfully!");
        } catch (error) {
            console.log(`⚠️ Protocol initialization warning: ${error.message}`);
        }

        // Set NFT minter role
        console.log("🔧 Setting NFT minter permissions...");
        try {
            const setMinterTx = await earnxNFT.setProtocolAddress(coreAddress);
            await setMinterTx.wait();
            console.log("✅ EarnX Core granted NFT minting permissions");
        } catch (error) {
            console.log(`⚠️ Could not set minter role: ${error.message}`);
        }

        console.log("\n🎉 DEPLOYMENT SUMMARY");
        console.log("=" .repeat(50));
        
        const summary = {
            network: "morph-testnet",
            chainId: MORPH_CONFIG.CHAIN_ID,
            deployer: deployerAddress,
            deploymentTime: new Date().toISOString(),
            contracts: deployedContracts
        };

        console.log("📋 Deployed Contracts:");
        Object.entries(deployedContracts).forEach(([name, address]) => {
            console.log(`   ${name}: ${address}`);
        });

        // Save deployment info
        const deploymentsDir = path.join(__dirname, "deployments");
        if (!fs.existsSync(deploymentsDir)) {
            fs.mkdirSync(deploymentsDir, { recursive: true });
        }
        
        const deploymentFile = path.join(deploymentsDir, `earnx-morph-testnet-${Date.now()}.json`);
        fs.writeFileSync(deploymentFile, JSON.stringify(summary, null, 2));
        console.log(`\n💾 Deployment info saved: ${deploymentFile}`);

        console.log("\n🏆 EARNX PROTOCOL DEPLOYED TO MORPH TESTNET!");
        console.log("🎊 Your protocol is ready for testing!");

    } catch (error) {
        console.error(`\n❌ Deployment failed: ${error.message}`);
        if (error.reason) {
            console.error(`   Reason: ${error.reason}`);
        }
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });