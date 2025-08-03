// MongoDB initialization script for EarnX development
db = db.getSiblingDB('earnx_verification');

// Create collections
db.createCollection('verificationrecords');
db.createCollection('invoicedatas');

// Create indexes for better performance
db.verificationrecords.createIndex({ "invoiceId": 1 });
db.verificationrecords.createIndex({ "timestamp": -1 });
db.verificationrecords.createIndex({ "metadata.source": 1 });

db.invoicedatas.createIndex({ "invoiceId": 1 });
db.invoicedatas.createIndex({ "supplier.country": 1 });
db.invoicedatas.createIndex({ "buyer.country": 1 });
db.invoicedatas.createIndex({ "commodity": 1 });

// Insert sample data for testing
db.verificationrecords.insertMany([
  {
    "invoiceId": "TEST-001",
    "isValid": true,
    "riskScore": 25,
    "creditRating": "A",
    "details": "Low risk agricultural trade",
    "timestamp": new Date(),
    "metadata": {
      "source": "docker-init",
      "environment": "development"
    }
  },
  {
    "invoiceId": "TEST-002", 
    "isValid": true,
    "riskScore": 45,
    "creditRating": "BBB",
    "details": "Medium risk commodity trade",
    "timestamp": new Date(),
    "metadata": {
      "source": "docker-init",
      "environment": "development"
    }
  }
]);

db.invoicedatas.insertMany([
  {
    "invoiceId": "TEST-001",
    "supplier": {
      "name": "Kenya Coffee Cooperative",
      "country": "Kenya",
      "address": "Nairobi, Kenya"
    },
    "buyer": {
      "name": "European Coffee Imports",
      "country": "Germany", 
      "address": "Hamburg, Germany"
    },
    "amount": 50000,
    "commodity": "Coffee",
    "dueDate": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    "timestamp": new Date()
  },
  {
    "invoiceId": "TEST-002",
    "supplier": {
      "name": "Ghana Cocoa Board",
      "country": "Ghana",
      "address": "Accra, Ghana"
    },
    "buyer": {
      "name": "Swiss Chocolate Co",
      "country": "Switzerland",
      "address": "Zurich, Switzerland"
    },
    "amount": 75000,
    "commodity": "Cocoa",
    "dueDate": new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    "timestamp": new Date()
  }
]);

print('EarnX database initialized with sample data');
print('Collections created: verificationrecords, invoicedatas');
print('Indexes created for performance optimization');
print('Sample verification records inserted: 2');
print('Sample invoice data inserted: 2');