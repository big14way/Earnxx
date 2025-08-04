import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class ChainlinkFunctionsService {
  private readonly logger = new Logger(ChainlinkFunctionsService.name);
  private readonly subscriptionId: string;
  private readonly vrfSubscriptionId: string;

  constructor(private configService: ConfigService) {
    this.subscriptionId = this.configService.get<string>('CHAINLINK_FUNCTIONS_SUBSCRIPTION_ID') || '15721';
    this.vrfSubscriptionId = this.configService.get<string>('CHAINLINK_VRF_SUBSCRIPTION_ID') || '70683346938964543134051941086398146463176953067130935661041094624628466133908';
  }

  /**
   * Create Chainlink Functions JavaScript source code for invoice verification
   */
  createVerificationFunction(): string {
    return `
      // Chainlink Functions JavaScript code for invoice verification
      const invoiceId = args[0];
      const supplierData = args[1];
      const buyerData = args[2];
      const amount = args[3];
      const commodity = args[4];
      const country = args[5];

      // API request to EarnX verification service
      const earnxRequest = Functions.makeHttpRequest({
        url: "https://earnx-verification-api.onrender.com/api/v1/verification/verify-minimal",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": secrets.apiKey
        },
        data: {
          invoiceId: invoiceId,
          supplier: supplierData,
          buyer: buyerData,
          amount: amount,
          commodity: commodity,
          country: country,
          timestamp: Math.floor(Date.now() / 1000)
        }
      });

      const [earnxResponse] = await Promise.all([earnxRequest]);

      if (earnxResponse.error) {
        throw Error("Verification service error");
      }

      const verification = earnxResponse.data;
      
      // Return encoded verification result
      return Functions.encodeUint256(
        Math.floor(verification.riskScore * 100) // Convert to basis points
      );
    `;
  }

  /**
   * Create price feed function for commodity pricing
   */
  createPriceFeedFunction(): string {
    return `
      // Chainlink Functions for commodity price fetching
      const commodity = args[0];
      const quantity = args[1];

      // Multiple price sources for reliability
      const requests = [
        Functions.makeHttpRequest({
          url: \`https://api.commodityapi.com/v1/\${commodity}?access_key=\${secrets.commodityApiKey}\`,
          method: "GET"
        }),
        Functions.makeHttpRequest({
          url: \`https://api.marketdata.app/v1/stocks/quotes/\${commodity}/\`,
          method: "GET",
          headers: { "Authorization": \`Bearer \${secrets.marketDataKey}\` }
        })
      ];

      const [commodityResponse, marketResponse] = await Promise.all(requests);

      let price = 0;
      
      if (!commodityResponse.error && commodityResponse.data.rates) {
        price = commodityResponse.data.rates[commodity] || 0;
      } else if (!marketResponse.error && marketResponse.data.last) {
        price = marketResponse.data.last;
      } else {
        // Fallback to hardcoded prices (same as fallback contract)
        const fallbackPrices = {
          "COFFEE": 8500,
          "COCOA": 4200,
          "TEA": 15000,
          "COTTON": 1800,
          "RICE": 1200,
          "WHEAT": 800,
          "GOLD": 65000,
          "SILVER": 800
        };
        price = fallbackPrices[commodity.toUpperCase()] || 5000;
      }

      // Return price in cents (multiply by 100)
      return Functions.encodeUint256(Math.floor(price * 100));
    `;
  }

  /**
   * Generate Chainlink Functions request parameters
   */
  generateFunctionRequest(
    functionType: 'verification' | 'pricing',
    args: string[],
    secrets: Record<string, string> = {}
  ) {
    const source = functionType === 'verification' 
      ? this.createVerificationFunction()
      : this.createPriceFeedFunction();

    return {
      source,
      args,
      secrets,
      subscriptionId: this.subscriptionId,
      gasLimit: 300000,
      donId: "fun-ethereum-sepolia-1" // Sepolia testnet DON ID
    };
  }

  /**
   * Process verification result from Chainlink Functions
   */
  async processVerificationResult(
    invoiceId: string,
    chainlinkResult: string
  ): Promise<{
    riskScore: number;
    isValid: boolean;
    creditRating: string;
  }> {
    try {
      // Decode the uint256 result from Chainlink Functions
      const riskScoreBasisPoints = parseInt(chainlinkResult);
      const riskScore = riskScoreBasisPoints / 100; // Convert from basis points

      const isValid = riskScore < 70;
      const creditRating = this.calculateCreditRating(riskScore);

      this.logger.log(`Processed Chainlink result for invoice ${invoiceId}: Risk=${riskScore}%, Valid=${isValid}`);

      return {
        riskScore,
        isValid,
        creditRating
      };
    } catch (error) {
      this.logger.error(`Error processing Chainlink result: ${error.message}`);
      throw error;
    }
  }

  /**
   * Calculate credit rating based on risk score
   */
  private calculateCreditRating(riskScore: number): string {
    if (riskScore < 10) return 'AAA';
    if (riskScore < 20) return 'AA';
    if (riskScore < 30) return 'A';
    if (riskScore < 40) return 'BBB';
    if (riskScore < 50) return 'BB';
    if (riskScore < 60) return 'B';
    if (riskScore < 70) return 'CCC';
    return 'D';
  }

  /**
   * Get VRF configuration for random APR calculation
   */
  getVRFConfig() {
    return {
      subscriptionId: this.vrfSubscriptionId,
      keyHash: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // Sepolia key hash
      callbackGasLimit: 100000,
      requestConfirmations: 3,
      numWords: 1
    };
  }

  /**
   * Validate Chainlink subscription status
   */
  async validateSubscriptions(): Promise<{
    functionsValid: boolean;
    vrfValid: boolean;
    details: any;
  }> {
    this.logger.log('Validating Chainlink subscriptions...');
    
    return {
      functionsValid: !!this.subscriptionId && this.subscriptionId !== 'your_functions_subscription_id',
      vrfValid: !!this.vrfSubscriptionId && this.vrfSubscriptionId !== 'your_vrf_subscription_id',
      details: {
        functionsSubscriptionId: this.subscriptionId,
        vrfSubscriptionId: this.vrfSubscriptionId
      }
    };
  }

  /**
   * Generate secrets for Chainlink Functions
   */
  generateSecrets(): Record<string, string> {
    return {
      apiKey: this.configService.get<string>('API_KEY') || 'earnx-api-key',
      commodityApiKey: this.configService.get<string>('COMMODITY_API_KEY') || '',
      marketDataKey: this.configService.get<string>('MARKET_DATA_KEY') || ''
    };
  }
}