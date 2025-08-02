const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testMongoDBConnection() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'earnx_verification';
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    console.log('Please check your .env file and ensure MONGODB_URI is set');
    return;
  }

  console.log('🔗 Testing MongoDB Atlas connection...');
  console.log(`📊 Database: ${dbName}`);
  console.log(`🌐 URI: ${uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@')}`);
  
  const client = new MongoClient(uri);
  
  try {
    // Connect to MongoDB
    console.log('⏳ Connecting to MongoDB Atlas...');
    await client.connect();
    
    // Test connection
    await client.db(dbName).admin().ping();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Get database info
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`📁 Available collections: ${collections.length}`);
    
    if (collections.length > 0) {
      console.log('📋 Collections:');
      collections.forEach(col => {
        console.log(`   - ${col.name}`);
      });
    } else {
      console.log('📝 No collections found (this is normal for new databases)');
    }
    
    // Test write operation
    console.log('🧪 Testing write operation...');
    const testCollection = db.collection('connection_test');
    const testDoc = {
      message: 'EarnX API Connection Test',
      timestamp: new Date(),
      status: 'success'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log(`✅ Test document inserted with ID: ${insertResult.insertedId}`);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('🧹 Test document cleaned up');
    
    console.log('\n🎉 MongoDB Atlas connection test successful!');
    console.log('🚀 Your EarnX Verification API is ready to use MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error(error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Check your username and password in the connection string');
      console.log('   2. Ensure the database user has proper permissions');
      console.log('   3. Verify the database user exists in MongoDB Atlas');
    }
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the cluster hostname in the connection string');
      console.log('   3. Ensure the cluster is running in MongoDB Atlas');
    }
    
    if (error.message.includes('IP address')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('   1. Add your IP address to MongoDB Atlas Network Access');
      console.log('   2. Or allow access from anywhere (0.0.0.0/0) for development');
    }
    
  } finally {
    await client.close();
    console.log('🔐 Connection closed');
  }
}

// Run the test
testMongoDBConnection().catch(console.error);