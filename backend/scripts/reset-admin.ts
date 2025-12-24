import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);
  
  console.log('🔐 Generating new bcrypt hash for password: admin123');
  console.log('   Hash:', passwordHash);
  
  // Update or create admin user
  const user = await prisma.user.upsert({
    where: { email: 'admin@sagessedafrique.blog' },
    update: { passwordHash },
    create: {
      email: 'admin@sagessedafrique.blog',
      passwordHash,
      name: 'Malick Diarra',
      role: 'admin',
    },
  });
  
  console.log('');
  console.log('✅ Admin user updated successfully!');
  console.log('');
  console.log('📋 Credentials:');
  console.log('   Email: admin@sagessedafrique.blog');
  console.log('   Password: admin123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

