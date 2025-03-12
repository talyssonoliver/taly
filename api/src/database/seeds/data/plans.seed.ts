import { PrismaService } from '../../prisma.service';
import { SubscriptionPlan } from '../../../common/enums/subscription-plan.enum';
import { addMonths } from 'date-fns';

export async function seedPlans(prisma: PrismaService, users) {
  // For each user, create subscription records
  const subscriptions = [];
  const now = new Date();
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    
    // Assign different plan types based on user index for variety
    let planType;
    switch (i % 4) {
      case 0:
        planType = SubscriptionPlan.FREE;
        break;
      case 1:
        planType = SubscriptionPlan.BASIC;
        break;
      case 2:
        planType = SubscriptionPlan.PROFESSIONAL;
        break;
      case 3:
        planType = SubscriptionPlan.ENTERPRISE;
        break;
    }
    
    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planType,
        status: 'active',
        startDate: now,
        endDate: addMonths(now, 1), // 1 month subscription
      },
    });
    
    subscriptions.push(subscription);
  }
  
  return subscriptions;
}
