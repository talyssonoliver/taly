import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Notification } from './entities/notification.entity';

@ApiTags('notifications')
@Controller('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({ status: HttpStatus.OK, type: [Notification] })
  async getUserNotifications(@Query('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.getUserNotifications(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Notification })
  async getNotificationById(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.getNotificationById(id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: HttpStatus.OK, type: Notification })
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Post('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @HttpCode(HttpStatus.NO_CONTENT)
  async markAllAsRead(@Body('userId') userId: string): Promise<void> {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Post('test')
  @ApiOperation({ summary: 'Send a test notification' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Notification })
  async sendTestNotification(
    @Body() testNotificationDto: {
      userId: string;
      type: string;
      templateKey: string;
      data: any;
    },
  ): Promise<Notification> {
    return this.notificationsService.sendNotification(
      testNotificationDto.userId,
      testNotificationDto.type,
      testNotificationDto.templateKey,
      testNotificationDto.data,
    );
  }
}
