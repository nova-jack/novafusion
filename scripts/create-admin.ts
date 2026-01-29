import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@novafusion.in';
  const password = await bcrypt.hash('YOUR_NEW_SECURE_PASSWORD_HERE', 12);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password },
    create: {
      email,
      password,
      name: 'Admin',
      role: 'SUPER_ADMIN'
    }
  });
  
  console.log('Admin user created:', user.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());