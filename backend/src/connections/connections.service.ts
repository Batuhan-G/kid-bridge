import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConnectionDto } from './dto/create-connection.dto';
import { UpdateConnectionDto } from './dto/update-connection.dto';

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  async invite(
    createConnectionDto: CreateConnectionDto,
    requesterEmail: string,
  ) {
    const { receiverEmail, message } = createConnectionDto;

    // Check if trying to invite self
    if (requesterEmail === receiverEmail) {
      throw new BadRequestException(
        'Kendinizi co-parent olarak ekleyemezsiniz',
      );
    }

    // Check if receiver exists
    const receiver = await this.prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiver) {
      throw new NotFoundException(
        'Bu email adresi ile kayıtlı kullanıcı bulunamadı',
      );
    }

    // Check if connection already exists
    const existingConnection = await this.prisma.parentConnection.findFirst({
      where: {
        OR: [
          { requesterEmail, receiverEmail },
          { requesterEmail: receiverEmail, receiverEmail: requesterEmail },
        ],
      },
    });

    if (existingConnection) {
      if (existingConnection.status === 'PENDING') {
        throw new BadRequestException(
          'Bu kullanıcı ile zaten bekleyen bir davet var',
        );
      }
      if (existingConnection.status === 'ACCEPTED') {
        throw new BadRequestException(
          'Bu kullanıcı ile zaten eşleşmiş durumdasınız',
        );
      }
      if (existingConnection.status === 'REJECTED') {
        // If the connection was rejected, delete the old record and allow re-invitation
        await this.prisma.parentConnection.delete({
          where: { id: existingConnection.id },
        });
      }
    }

    // Create connection
    const connection = await this.prisma.parentConnection.create({
      data: {
        requesterEmail,
        receiverEmail,
        message,
        status: 'PENDING',
      },
    });

    // Create notification for the receiver
    await this.createNotification({
      userEmail: receiverEmail,
      type: 'INVITATION_RECEIVED',
      title: 'Yeni co-parent daveti',
      message: `${requesterEmail} adresli kullanıcı size co-parent daveti gönderdi.`,
      actionable: true,
      connectionId: connection.id,
    });

    // Create notification for the sender (requester)
    await this.createNotification({
      userEmail: requesterEmail,
      type: 'INVITATION_SENT',
      title: 'Co-parent daveti gönderildi',
      message: `${receiverEmail} adresli kullanıcıya co-parent daveti gönderdiniz.`,
    });

    return {
      message: 'Co-parent daveti başarıyla gönderildi',
      connection,
    };
  }

  async getPending(userEmail: string) {
    const connections = await this.prisma.parentConnection.findMany({
      where: {
        receiverEmail: userEmail,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get requester user info for each connection
    const connectionsWithUserInfo = await Promise.all(
      connections.map(async (connection) => {
        const requester = await this.prisma.user.findUnique({
          where: { email: connection.requesterEmail },
          select: { id: true, firstName: true, lastName: true, email: true },
        });
        return {
          ...connection,
          requester,
        };
      }),
    );

    return connectionsWithUserInfo;
  }

  async updateConnection(
    connectionId: string,
    updateConnectionDto: UpdateConnectionDto,
    userEmail: string,
  ) {
    const { status } = updateConnectionDto;

    // Find the connection
    const connection = await this.prisma.parentConnection.findUnique({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Davet bulunamadı');
    }

    if (connection.receiverEmail !== userEmail) {
      throw new BadRequestException('Bu daveti yalnızca alıcı kabul edebilir');
    }

    if (connection.status !== 'PENDING') {
      throw new BadRequestException('Bu davet zaten işlenmiş');
    }

    // Update connection status
    const updatedConnection = await this.prisma.parentConnection.update({
      where: { id: connectionId },
      data: { status },
    });

    // Create notifications for both parties
    if (status === 'ACCEPTED') {
      // Add cross-parent child relationships
      await this.addCrossParentRelationships(
        connection.requesterEmail,
        connection.receiverEmail,
      );
      // Notify the requester
      await this.createNotification({
        userEmail: connection.requesterEmail,
        type: 'CONNECTION_ACCEPTED',
        title: 'Co-parent daveti kabul edildi!',
        message: `${userEmail} adresli kullanıcı co-parent davetinizi kabul etti. Artık mesajlaşabilir ve çocuklarınızın gelişimini birlikte takip edebilirsiniz.`,
      });

      // Notify the receiver (person who accepted)
      await this.createNotification({
        userEmail: connection.receiverEmail,
        type: 'CONNECTION_ACCEPTED_BY_ME',
        title: 'Co-parent daveti kabul ettiniz',
        message: `${connection.requesterEmail} kullanıcısının co-parent davetini kabul ettiniz. Artık mesajlaşabilir ve çocuklarınızın gelişimini birlikte takip edebilirsiniz.`,
      });
    } else if (status === 'REJECTED') {
      // Notify the requester
      await this.createNotification({
        userEmail: connection.requesterEmail,
        type: 'CONNECTION_REJECTED',
        title: 'Co-parent daveti reddedildi',
        message: `${userEmail} adresli kullanıcı co-parent davetinizi reddetti.`,
      });

      // Notify the receiver (person who rejected)
      await this.createNotification({
        userEmail: connection.receiverEmail,
        type: 'CONNECTION_REJECTED_BY_ME',
        title: 'Co-parent davetini reddettiniz',
        message: `${connection.requesterEmail} kullanıcısının co-parent davetini reddettiniz.`,
      });
    }

    return {
      message:
        status === 'ACCEPTED'
          ? 'Co-parent daveti kabul edildi. Artık çocukları paylaşıyorsunuz.'
          : 'Co-parent daveti reddedildi',
      connection: updatedConnection,
    };
  }

  private async addCrossParentRelationships(
    requesterEmail: string,
    receiverEmail: string,
  ) {
    // Get both users
    const requester = await this.prisma.user.findUnique({
      where: { email: requesterEmail },
      include: { children: true },
    });

    const receiver = await this.prisma.user.findUnique({
      where: { email: receiverEmail },
      include: { children: true },
    });

    if (!requester || !receiver) {
      throw new NotFoundException('Kullanıcılar bulunamadı');
    }

    // Add requester's children to receiver
    for (const child of requester.children) {
      await this.prisma.child.update({
        where: { id: child.id },
        data: {
          parents: {
            connect: { id: receiver.id },
          },
        },
      });
    }

    // Add receiver's children to requester
    for (const child of receiver.children) {
      await this.prisma.child.update({
        where: { id: child.id },
        data: {
          parents: {
            connect: { id: requester.id },
          },
        },
      });
    }
  }

  private async createNotification({
    userEmail,
    type,
    title,
    message,
    actionable = false,
    connectionId,
  }: {
    userEmail: string;
    type: string;
    title: string;
    message: string;
    actionable?: boolean;
    connectionId?: string;
  }) {
    try {
      await this.prisma.notification.create({
        data: {
          userEmail,
          type,
          title,
          message,
          actionable,
          connectionId,
        },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Don't throw error, just log it since notifications are not critical
    }
  }
}
