import { PrismaService } from '../../database/prisma.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Notification, NotificationStatus } from '../entities/notification.entity';

@Injectable()
export class NotificationRepository {
  constructor(
    
    private notificationRepository: Repository<Notification>,
  ) {}

  async findById(id: string): Promise<Notification | null> {
    return this.notificationRepository.findOne({ where: { id } });
  }

  async findByUserId(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      status?: NotificationStatus;
    },
  ): Promise<Notification[]> {
    const query = this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.userId = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');

    if (options?.status) {
      query.andWhere('notification.status = :status', { status: options.status });
    }

    if (options?.limit) {
      query.take(options.limit);
    }

    if (options?.offset) {
      query.skip(options.offset);
    }

    return query.getMany();
  }

  async countUnreadByUserId(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        userId,
        status: NotificationStatus.SENT,
      },
    });
  }

  async save(notification: Notification): Promise<Notification> {
    return this.notificationRepository.save(notification);
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.update(
      { id },
      {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      {
        userId,
        status: NotificationStatus.SENT,
      },
      {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    );
  }

  async deleteOldNotifications(olderThan: Date): Promise<number> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .delete()
      .from(Notification)
      .where('createdAt < :olderThan', { olderThan })
      .execute();

    return result.affected || 0;
  }
}



