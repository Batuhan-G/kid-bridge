import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectionsService } from '../connections/connections.service';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ConnectionsService))
    private connectionsService: ConnectionsService,
  ) {}

  async getNotifications(userEmail: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userEmail },
      orderBy: { createdAt: 'desc' },
    });

    return notifications;
  }

  async markAsRead(notificationId: string, userEmail: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, userEmail },
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return updatedNotification;
  }

  async markAllAsRead(userEmail: string) {
    await this.prisma.notification.updateMany({
      where: { userEmail, isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  }

  async deleteAll(userEmail: string) {
    await this.prisma.notification.deleteMany({
      where: { userEmail },
    });

    return { success: true };
  }

  async getUnreadCount(userEmail: string) {
    const count = await this.prisma.notification.count({
      where: { userEmail, isRead: false },
    });

    return { count };
  }

  async acceptConnectionFromNotification(
    notificationId: string,
    userEmail: string,
  ) {
    // Find the notification
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userEmail,
        actionable: true,
        type: 'INVITATION_RECEIVED',
      },
    });

    if (!notification) {
      throw new NotFoundException('Actionable notification not found');
    }

    if (!notification.connectionId) {
      throw new BadRequestException(
        'Notification has no associated connection',
      );
    }

    // Use the existing connection service method
    const result = await this.connectionsService.updateConnection(
      notification.connectionId,
      { status: 'ACCEPTED' },
      userEmail,
    );

    // Mark notification as read
    await this.markAsRead(notificationId, userEmail);

    return result;
  }

  async rejectConnectionFromNotification(
    notificationId: string,
    userEmail: string,
  ) {
    // Find the notification
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userEmail,
        actionable: true,
        type: 'INVITATION_RECEIVED',
      },
    });

    if (!notification) {
      throw new NotFoundException('Actionable notification not found');
    }

    if (!notification.connectionId) {
      throw new BadRequestException(
        'Notification has no associated connection',
      );
    }

    // Use the existing connection service method
    const result = await this.connectionsService.updateConnection(
      notification.connectionId,
      { status: 'REJECTED' },
      userEmail,
    );

    // Mark notification as read
    await this.markAsRead(notificationId, userEmail);

    return result;
  }
}
