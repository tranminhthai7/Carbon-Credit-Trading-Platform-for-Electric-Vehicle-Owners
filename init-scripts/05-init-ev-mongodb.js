// Init script for EV MongoDB
// Create vehicles collection and insert sample data

db = db.getSiblingDB('ev_data_db');

db.createCollection('vehicles');

// Insert sample vehicles
db.vehicles.insertMany([
  {
    _id: ObjectId('507f1f77bcf86cd799439011'),
    userId: '28d396e3-e10c-4e6b-ae95-edf2dce83527',
    licensePlate: 'EV-001-ABC',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    batteryCapacity: 75,
    currentCharge: 85,
    lastTrip: {
      distance: 45.5,
      carbonSaved: 12.3,
      timestamp: new Date('2025-11-24T10:00:00Z')
    },
    totalCarbonCredits: 150,
    status: 'ACTIVE',
    createdAt: new Date('2025-11-20T08:00:00Z'),
    updatedAt: new Date('2025-11-24T10:00:00Z')
  },
  {
    _id: ObjectId('507f1f77bcf86cd799439012'),
    userId: '28d396e3-e10c-4e6b-ae95-edf2dce83527',
    licensePlate: 'EV-002-XYZ',
    make: 'Nissan',
    model: 'Leaf',
    year: 2022,
    batteryCapacity: 62,
    currentCharge: 72,
    lastTrip: {
      distance: 32.1,
      carbonSaved: 8.7,
      timestamp: new Date('2025-11-24T09:30:00Z')
    },
    totalCarbonCredits: 95,
    status: 'ACTIVE',
    createdAt: new Date('2025-11-19T14:00:00Z'),
    updatedAt: new Date('2025-11-24T09:30:00Z')
  },
  {
    _id: ObjectId('507f1f77bcf86cd799439013'),
    userId: 'a640cec4-1021-4127-821d-1f93191504e1',
    licensePlate: 'EV-003-DEF',
    make: 'BMW',
    model: 'i3',
    year: 2024,
    batteryCapacity: 42,
    currentCharge: 90,
    lastTrip: {
      distance: 28.7,
      carbonSaved: 6.2,
      timestamp: new Date('2025-11-24T11:15:00Z')
    },
    totalCarbonCredits: 67,
    status: 'ACTIVE',
    createdAt: new Date('2025-11-21T16:00:00Z'),
    updatedAt: new Date('2025-11-24T11:15:00Z')
  },
  {
    _id: ObjectId('507f1f77bcf86cd799439014'),
    userId: '622304f2-c0d0-4f3c-bd8e-b98ab1f2413a',
    licensePlate: 'EV-004-GHI',
    make: 'Hyundai',
    model: 'Kona Electric',
    year: 2023,
    batteryCapacity: 67,
    currentCharge: 65,
    lastTrip: {
      distance: 51.2,
      carbonSaved: 15.8,
      timestamp: new Date('2025-11-24T08:45:00Z')
    },
    totalCarbonCredits: 203,
    status: 'ACTIVE',
    createdAt: new Date('2025-11-18T12:00:00Z'),
    updatedAt: new Date('2025-11-24T08:45:00Z')
  },
  {
    _id: ObjectId('507f1f77bcf86cd799439015'),
    userId: '96a4e081-1a2b-43c7-8831-f5837411184b',
    licensePlate: 'EV-005-JKL',
    make: 'Volkswagen',
    model: 'ID.4',
    year: 2024,
    batteryCapacity: 77,
    currentCharge: 78,
    lastTrip: {
      distance: 38.9,
      carbonSaved: 11.4,
      timestamp: new Date('2025-11-24T07:20:00Z')
    },
    totalCarbonCredits: 134,
    status: 'ACTIVE',
    createdAt: new Date('2025-11-22T09:00:00Z'),
    updatedAt: new Date('2025-11-24T07:20:00Z')
  }
]);

// Create indexes
db.vehicles.createIndex({ userId: 1 });
db.vehicles.createIndex({ licensePlate: 1 }, { unique: true });
db.vehicles.createIndex({ status: 1 });