import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req) {
    return this.notificationsService.getNotifications(req.user.email);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.email);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.email);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.email);
  }

  @Delete('all')
  async deleteAll(@Request() req) {
    return this.notificationsService.deleteAll(req.user.email);
  }

  @Post(':id/accept-connection')
  async acceptConnection(@Param('id') notificationId: string, @Request() req) {
    return this.notificationsService.acceptConnectionFromNotification(
      notificationId,
      req.user.email,
    );
  }

  @Post(':id/reject-connection')
  async rejectConnection(@Param('id') notificationId: string, @Request() req) {
    return this.notificationsService.rejectConnectionFromNotification(
      notificationId,
      req.user.email,
    );
  }
}
