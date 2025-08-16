import 'reflect-metadata';
import { AppDataSource } from '../config/postgresql';

async function checkDatabase() {
  try {
    console.log('🔄 Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('🔍 Checking users table structure...');
    const queryRunner = AppDataSource.createQueryRunner();
    
    // Check if users table exists
    const tableExists = await queryRunner.hasTable('users');
    console.log('Users table exists:', tableExists);
    
    if (tableExists) {
      // Get table structure
      const table = await queryRunner.getTable('users');
      console.log('\n📋 Users table columns:');
      table?.columns.forEach(column => {
        console.log(`- ${column.name}: ${column.type} ${column.isNullable ? 'NULL' : 'NOT NULL'}`);
      });
    }
    
    await queryRunner.release();
    await AppDataSource.destroy();
    console.log('📴 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

checkDatabase();
