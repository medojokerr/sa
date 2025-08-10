// Database setup script for KYCtrust
const { ensureSchema } = require('../lib/schema');

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database tables...');
    await ensureSchema();
    console.log('✅ Database tables created successfully!');
    console.log('📊 Tables created:');
    console.log('  - settings');
    console.log('  - users');
    console.log('  - analytics_daily');
    console.log('  - content_snapshots');
    console.log('  - rate_limits');
    console.log('  - chat_sessions');
    console.log('  - chat_messages');
    console.log('  - reviews (NEW)');
    console.log('');
    console.log('🎉 Database setup completed!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
