const axios = require('axios');

// ============ SIMPLE PING FUNCTION (BACKWARD COMPATIBLE) ============
async function pingEarnX(customUrl = null) {
  const apiUrl = customUrl || 'https://earnx.onrender.com/verification';
  try {
    const startTime = Date.now();
    const response = await axios.get(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'EarnX-BackendPing/1.0'
      },
      timeout: 10000 // 10 seconds
    });
    const responseTime = Date.now() - startTime;
    return {
      success: true,
      status: response.status,
      responseTime,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status || 0
    };
  }
}

// ============ ENHANCED MONITORING CLASS ============
class EarnXMonitor {
  constructor(baseUrl = 'https://earnx.onrender.com') {
    this.baseUrl = baseUrl;
    this.healthEndpoints = [
      '/health',
      '/verification',
      '/verification/test'
    ];
  }

  async pingEndpoint(endpoint) {
    try {
      const startTime = Date.now();
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'EarnX-HealthMonitor/1.0'
        },
        timeout: 10000
      });
      
      const responseTime = Date.now() - startTime;
      
      return {
        endpoint,
        success: true,
        status: response.status,
        responseTime,
        timestamp: new Date().toISOString(),
        data: typeof response.data === 'object' ? 'JSON Response' : response.data.substring(0, 100)
      };
    } catch (error) {
      return {
        endpoint,
        success: false,
        status: error.response?.status || 0,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async healthCheck(verbose = true) {
    if (verbose) {
      console.log('🔍 EarnX API Health Check', new Date().toISOString());
      console.log('='.repeat(50));
    }
    
    const results = await Promise.all(
      this.healthEndpoints.map(endpoint => this.pingEndpoint(endpoint))
    );
    
    if (verbose) {
      results.forEach(result => {
        const status = result.success ? '✅' : '❌';
        console.log(`${status} ${result.endpoint}: ${result.status} (${result.responseTime || 'N/A'}ms)`);
        if (!result.success) {
          console.log(`   Error: ${result.error}`);
        }
      });
    }
    
    const healthyEndpoints = results.filter(r => r.success).length;
    const totalEndpoints = results.length;
    
    if (verbose) {
      console.log(`\n📊 Health Summary: ${healthyEndpoints}/${totalEndpoints} endpoints healthy`);
    }
    
    return {
      healthy: healthyEndpoints === totalEndpoints,
      results,
      summary: {
        total: totalEndpoints,
        healthy: healthyEndpoints,
        unhealthy: totalEndpoints - healthyEndpoints
      }
    };
  }

  async chainlinkTest(verbose = true) {
    if (verbose) console.log('\n🔗 Testing Chainlink Integration...');
    
    const testData = {
      invoiceId: `health-check-${Date.now()}`,
      supplier: { name: "Test Supplier", country: "Kenya" },
      buyer: { name: "Test Buyer", country: "Germany" },
      amount: 1000,
      commodity: "Coffee"
    };
    
    try {
      const response = await axios.post(`${this.baseUrl}/verification/verify-documents`, testData, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Chainlink-Functions/1.0'
        },
        timeout: 30000
      });
      
      if (verbose) {
        console.log('✅ Chainlink verification test successful');
        console.log(`   Risk Score: ${response.data.riskScore}`);
        console.log(`   Valid: ${response.data.isValid}`);
      }
      
      return { success: true, data: response.data };
    } catch (error) {
      if (verbose) {
        console.log('❌ Chainlink verification test failed');
        console.log(`   Error: ${error.message}`);
      }
      return { success: false, error: error.message };
    }
  }

  async quickCheck() {
    // Silent health check for programmatic use
    const health = await this.healthCheck(false);
    const chainlink = await this.chainlinkTest(false);
    
    return {
      healthy: health.healthy,
      chainlinkWorking: chainlink.success,
      timestamp: new Date().toISOString(),
      summary: health.summary
    };
  }
}

// ============ USAGE EXAMPLES & EXPORTS ============

// For backward compatibility
async function runBasicPing() {
  const result = await pingEarnX();
  console.log('Basic Ping Result:', result);
  return result;
}

// For enhanced monitoring
async function runFullHealthCheck() {
  const monitor = new EarnXMonitor();
  const health = await monitor.healthCheck();
  await monitor.chainlinkTest();
  return health;
}

// Export everything for module use
module.exports = {
  pingEarnX,           // Original simple function
  EarnXMonitor,        // Enhanced monitoring class
  runBasicPing,        // Simple ping wrapper
  runFullHealthCheck   // Full health check wrapper
};

// ============ CLI EXECUTION ============
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0] || 'basic';
  
  if (mode === 'basic') {
    // Original behavior: simple ping
    runBasicPing()
      .then(result => {
        console.log('✨ Basic ping completed');
        process.exit(result.success ? 0 : 1);
      })
      .catch(error => {
        console.error('💥 Basic ping failed:', error.message);
        process.exit(1);
      });
  } else if (mode === 'full') {
    // Enhanced behavior: full health check
    runFullHealthCheck()
      .then(result => {
        console.log('\n✨ Full health check completed');
        console.log(`🎯 Overall Status: ${result.healthy ? 'HEALTHY' : 'UNHEALTHY'}`);
        process.exit(result.healthy ? 0 : 1);
      })
      .catch(error => {
        console.error('💥 Full health check failed:', error.message);
        process.exit(1);
      });
  } else if (mode === 'quick') {
    // Quick silent check
    const monitor = new EarnXMonitor();
    monitor.quickCheck()
      .then(result => {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.healthy ? 0 : 1);
      })
      .catch(error => {
        console.error('Error:', error.message);
        process.exit(1);
      });
  } else {
    console.log('Usage: node pingEarnX.js [basic|full|quick]');
    console.log('  basic - Simple ping (default)');
    console.log('  full  - Complete health check');
    console.log('  quick - Silent quick check (JSON output)');
    process.exit(1);
  }
} 