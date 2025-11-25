// Init script for Reporting MongoDB
// Create collections for reporting data

db = db.getSiblingDB('reporting_db');

// Create collections
db.createCollection('revenue_reports');
db.createCollection('platform_analytics');
db.createCollection('personal_reports');

// Insert some sample analytics data
db.platform_analytics.insertMany([
  {
    _id: ObjectId('507f1f77bcf86cd799439021'),
    date: new Date('2025-11-24'),
    totalUsers: 21,
    activeUsers: 15,
    totalTransactions: 16,
    totalRevenue: 152400,
    totalListings: 22,
    carbonCreditsTraded: 450,
    createdAt: new Date()
  },
  {
    _id: ObjectId('507f1f77bcf86cd799439022'),
    date: new Date('2025-11-23'),
    totalUsers: 19,
    activeUsers: 12,
    totalTransactions: 14,
    totalRevenue: 145200,
    totalListings: 18,
    carbonCreditsTraded: 380,
    createdAt: new Date()
  }
]);

// Insert sample revenue report
db.revenue_reports.insertMany([
  {
    _id: ObjectId('507f1f77bcf86cd799439023'),
    period: '2025-11',
    totalRevenue: 297600,
    transactionCount: 30,
    averageTransactionValue: 9920,
    topSellingUsers: [
      { userId: '28d396e3-e10c-4e6b-ae95-edf2dce83527', revenue: 185000 },
      { userId: 'a640cec4-1021-4127-821d-1f93191504e1', revenue: 45600 }
    ],
    createdAt: new Date()
  }
]);

// Create indexes
db.platform_analytics.createIndex({ date: 1 });
db.revenue_reports.createIndex({ period: 1 });
db.personal_reports.createIndex({ userId: 1 });