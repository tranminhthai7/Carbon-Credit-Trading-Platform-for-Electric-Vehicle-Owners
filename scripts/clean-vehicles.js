const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ev_data_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  // Remove documents with null license_plate
  const result = await mongoose.connection.db.collection('vehicles').deleteMany({
    license_plate: null
  });

  console.log(`Removed ${result.deletedCount} documents with null license_plate`);

  // Also remove any documents with empty string license_plate
  const result2 = await mongoose.connection.db.collection('vehicles').deleteMany({
    license_plate: ''
  });

  console.log(`Removed ${result2.deletedCount} documents with empty license_plate`);

  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});