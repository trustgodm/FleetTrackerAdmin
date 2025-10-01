const bcrypt = require('bcryptjs');
const { User, Department } = require('../models');

async function createDemoUser() {
  try {
    // Create a demo department if it doesn't exist
    const [department] = await Department.findOrCreate({
      where: { code: 'ADMIN' },
      defaults: {
        name: 'Administration',
        code: 'ADMIN',
        description: 'Administrative department',
        is_active: true
      }
    });

    // Create demo user
    const [user] = await User.findOrCreate({
      where: { coyno_id: 'ADMIN001' },
      defaults: {
        coyno_id: 'ADMIN001',
        email: 'admin@fleettracker.com',
        first_name: 'Admin',
        last_name: 'User',
        phone_number: '+1234567890',
        department_id: department.id,
        user_role: 'admin',
        is_active: true
      }
    });

    //console.log('✅ Demo user created successfully:');
    //console.log(`   Company ID: ${user.coyno_id}`);
    //console.log(`   Email: ${user.email}`);
    //console.log(`   Role: ${user.user_role}`);
    //console.log(`   Department: ${department.name}`);

  } catch (error) {
    //console.error('❌ Error creating demo user:', error);
  }
}

// Run the seeder
createDemoUser(); 