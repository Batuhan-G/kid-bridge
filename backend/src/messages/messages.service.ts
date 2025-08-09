import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessagesQueryDto } from './dto/get-messages-query.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async create(createMessageDto: CreateMessageDto, senderId: string) {
    const { content, type, receiverId, childId } = createMessageDto;

    // Verify sender has access to this child
    const senderChild = await this.prisma.child.findFirst({
      where: {
        id: childId,
        parents: {
          some: {
            id: senderId,
          },
        },
        isActive: true,
      },
    });

    if (!senderChild) {
      throw new ForbiddenException('You do not have access to this child');
    }

    // Verify receiver has access to this child
    const receiverChild = await this.prisma.child.findFirst({
      where: {
        id: childId,
        parents: {
          some: {
            id: receiverId,
          },
        },
        isActive: true,
      },
    });

    if (!receiverChild) {
      throw new BadRequestException(
        'Receiver does not have access to this child',
      );
    }

    // Prevent sending message to self
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    const message = await this.prisma.message.create({
      data: {
        content,
        type,
        senderId,
        receiverId,
        childId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return message;
  }

  async findAll(userId: string, query: GetMessagesQueryDto) {
    const { childId, type, isRead, page = '1', limit = '20' } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      OR: [{ senderId: userId }, { receiverId: userId }],
    };

    if (childId) {
      // Verify user has access to this child
      const userChild = await this.prisma.child.findFirst({
        where: {
          id: childId,
          parents: {
            some: {
              id: userId,
            },
          },
          isActive: true,
        },
      });

      if (!userChild) {
        throw new ForbiddenException('You do not have access to this child');
      }

      where.childId = childId;
    }

    if (type) {
      where.type = type;
    }

    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          child: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limitNum,
      }),
      this.prisma.message.count({ where }),
    ]);

    return {
      messages,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: {
        id,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto, userId: string) {
    const message = await this.findOne(id, userId);

    // Only receiver can mark as read
    if (
      updateMessageDto.isRead !== undefined &&
      message.receiverId !== userId
    ) {
      throw new ForbiddenException('Only receiver can mark message as read');
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id },
      data: updateMessageDto,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedMessage;
  }

  async getConversation(userId: string, otherUserId: string, childId: string) {
    // Verify user has access to this child
    const userChild = await this.prisma.child.findFirst({
      where: {
        id: childId,
        parents: {
          some: {
            id: userId,
          },
        },
        isActive: true,
      },
    });

    if (!userChild) {
      throw new ForbiddenException('You do not have access to this child');
    }

    const messages = await this.prisma.message.findMany({
      where: {
        childId,
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        child: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  async markAllAsRead(userId: string, childId?: string) {
    const where: any = {
      receiverId: userId,
      isRead: false,
    };

    if (childId) {
      // Verify user has access to this child
      const userChild = await this.prisma.child.findFirst({
        where: {
          id: childId,
          parents: {
            some: {
              id: userId,
            },
          },
          isActive: true,
        },
      });

      if (!userChild) {
        throw new ForbiddenException('You do not have access to this child');
      }

      where.childId = childId;
    }

    const result = await this.prisma.message.updateMany({
      where,
      data: {
        isRead: true,
      },
    });

    return { updatedCount: result.count };
  }
}
