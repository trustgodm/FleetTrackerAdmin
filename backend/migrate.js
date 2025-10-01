const { sequelize } = require('./config/database');

async function runMigration() {
  try {
    console.log('🔄 Running migration: Add assigned_driver_id to vehicles table...');
    
    // Add the assigned_driver_id column
    await sequelize.query(`
      ALTER TABLE vehicles 
      ADD COLUMN IF NOT EXISTS assigned_driver_id UUID REFERENCES users(id) ON DELETE SET NULL;
    `);
    
    // Create index for the new column
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_driver_id ON vehicles(assigned_driver_id);
    `);
    
    console.log('✅ Migration completed successfully!');
    
    // Test the vehicles endpoint
    console.log('🧪 Testing vehicles endpoint...');
    const { Vehicle } = require('./models');
    
    const count = await Vehicle.count();
    console.log(`📊 Found ${count} vehicles in database`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

runMigration(); 