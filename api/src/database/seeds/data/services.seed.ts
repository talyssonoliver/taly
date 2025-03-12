import { PrismaService } from '../../prisma.service';

export async function seedServices(prisma: PrismaService, salons) {
  if (!salons || salons.length === 0) {
    throw new Error('No salons found to associate services with');
  }
  
  const services = [];
  
  // Create services for each salon
  for (const salon of salons) {
    const salonServices = [
      {
        name: 'Haircut',
        description: 'Professional haircut with consultation',
        duration: 30, // minutes
        price: 35.00,
        salonId: salon.id,
        isActive: true,
      },
      {
        name: 'Hair Coloring',
        description: 'Full hair coloring service with premium products',
        duration: 90, // minutes
        price: 75.00,
        salonId: salon.id,
        isActive: true,
      },
      {
        name: 'Manicure',
        description: 'Basic manicure with polish',
        duration: 45, // minutes
        price: 25.00,
        salonId: salon.id,
        isActive: true,
      },
      {
        name: 'Pedicure',
        description: 'Relaxing pedicure with exfoliation and massage',
        duration: 60, // minutes
        price: 40.00,
        salonId: salon.id,
        isActive: true,
      },
      {
        name: 'Facial',
        description: 'Rejuvenating facial treatment',
        duration: 60, // minutes
        price: 55.00,
        salonId: salon.id,
        isActive: true,
      },
    ];
    
    for (const serviceData of salonServices) {
      // Check if service already exists
      const existingService = await prisma.service.findFirst({
        where: { 
          name: serviceData.name,
          salonId: serviceData.salonId,
        },
      });
      
      if (!existingService) {
        const service = await prisma.service.create({
          data: serviceData,
        });
        services.push(service);
      } else {
        services.push(existingService);
      }
    }
  }
  
  return services;
}
