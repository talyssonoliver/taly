import { PrismaService } from '../../prisma.service';

export async function seedSalons(prisma: PrismaService, users) {
  // Find the salon owner
  const owner = users.find(u => u.email === 'owner@example.com');
  
  if (!owner) {
    throw new Error('Salon owner not found in seeded users');
  }
  
  const salons = [
    {
      name: 'Elegant Cuts',
      address: '123 Main St, City',
      phone: '555-123-4567',
      email: 'info@elegantcuts.com',
      description: 'A premium hair salon offering top-notch services',
      ownerId: owner.id,
      isActive: true,
    },
    {
      name: 'Beauty Haven',
      address: '456 Elm St, City',
      phone: '555-987-6543',
      email: 'contact@beautyhaven.com',
      description: 'Full-service beauty salon for all your needs',
      ownerId: owner.id,
      isActive: true,
    },
    {
      name: 'Urban Styles',
      address: '789 Oak St, City',
      phone: '555-567-8901',
      email: 'hello@urbanstyles.com',
      description: 'Modern salon with the latest trends and styles',
      ownerId: owner.id,
      isActive: true,
    },
  ];
  
  const createdSalons = [];
  
  for (const salonData of salons) {
    // Check if salon already exists
    const existingSalon = await prisma.salon.findFirst({
      where: { 
        name: salonData.name,
        ownerId: salonData.ownerId,
      },
    });
    
    if (!existingSalon) {
      const salon = await prisma.salon.create({
        data: salonData,
      });
      createdSalons.push(salon);
    } else {
      createdSalons.push(existingSalon);
    }
  }
  
  return createdSalons;
}
