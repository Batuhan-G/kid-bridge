import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password with increased salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      iat: Math.floor(Date.now() / 1000), // Issued at
      jti: Math.random().toString(36).substr(2, 9), // JWT ID for tracking
    };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' }); // Short-lived access token
    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' }, 
      { expiresIn: '7d' }
    ); // Long-lived refresh token
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900, // 15 minutes in seconds
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            children: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async deleteAccount(userEmail: string, emailConfirmation: string) {
    // Validate email confirmation
    if (emailConfirmation.toLowerCase() !== userEmail.toLowerCase()) {
      throw new BadRequestException('Email doğrulaması eşleşmiyor');
    }

    // Find the user
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
      include: { children: true },
    });

    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı');
    }

    // Find and remove all co-parent connections
    const connections = await this.prisma.parentConnection.findMany({
      where: {
        OR: [
          { requesterEmail: userEmail },
          { receiverEmail: userEmail },
        ],
        status: 'ACCEPTED',
      },
    });

    // Notify co-parents and remove connections
    for (const connection of connections) {
      const coParentEmail = 
        connection.requesterEmail === userEmail 
          ? connection.receiverEmail 
          : connection.requesterEmail;

      // Create notification for co-parent
      await this.createNotification({
        userEmail: coParentEmail,
        type: 'CO_PARENT_ACCOUNT_DELETED',
        title: 'Co-parent hesabını sildi',
        message: `${userEmail} adresli kullanıcı hesabını sildi. Co-parent bağlantınız sonlandırıldı.`,
      });

      // Remove cross-parent relationships
      await this.removeCrossParentRelationships(userEmail, coParentEmail);
    }

    // Delete all connections involving this user
    await this.prisma.parentConnection.deleteMany({
      where: {
        OR: [
          { requesterEmail: userEmail },
          { receiverEmail: userEmail },
        ],
      },
    });

    // Delete user's notifications
    await this.prisma.notification.deleteMany({
      where: { userEmail },
    });

    // Find user to get ID for relations
    const userToDelete = await this.prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (userToDelete) {
      // Delete user's messages
      await this.prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userToDelete.id },
            { receiverId: userToDelete.id },
          ],
        },
      });

      // Delete user's expenses
      await this.prisma.expense.deleteMany({
        where: { createdById: userToDelete.id },
      });

      // Delete user's activities
      await this.prisma.activity.deleteMany({
        where: { createdById: userToDelete.id },
      });
    }

    // Soft delete user (mark as inactive)
    await this.prisma.user.update({
      where: { email: userEmail },
      data: { 
        isActive: false,
        email: `deleted_${Date.now()}_${userEmail}`, // Prevent email conflicts
        firstName: 'DELETED',
        lastName: 'USER',
      },
    });

    return {
      message: 'Hesabınız başarıyla silindi. Co-parent bildirimler gönderildi.',
    };
  }

  private async createNotification({
    userEmail,
    type,
    title,
    message,
  }: {
    userEmail: string;
    type: string;
    title: string;
    message: string;
  }) {
    try {
      await this.prisma.notification.create({
        data: {
          userEmail,
          type,
          title,
          message,
          actionable: false,
        },
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
      // Don't throw error, just log it since notifications are not critical
    }
  }

  private async removeCrossParentRelationships(
    userEmail: string,
    coParentEmail: string,
  ) {
    try {
      // Get both users
      const user = await this.prisma.user.findUnique({
        where: { email: userEmail },
        include: { children: true },
      });

      const coParent = await this.prisma.user.findUnique({
        where: { email: coParentEmail },
        include: { children: true },
      });

      if (!user || !coParent) return;

      // Remove user's children from co-parent
      for (const child of user.children) {
        await this.prisma.child.update({
          where: { id: child.id },
          data: {
            parents: {
              disconnect: { id: coParent.id },
            },
          },
        });
      }

      // Remove co-parent's children from user
      for (const child of coParent.children) {
        await this.prisma.child.update({
          where: { id: child.id },
          data: {
            parents: {
              disconnect: { id: user.id },
            },
          },
        });
      }
    } catch (error) {
      console.error('Failed to remove cross-parent relationships:', error);
      // Don't throw error, continue with deletion
    }
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get current user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mevcut parola yanlış');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('Yeni parola mevcut parola ile aynı olamaz');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12); // Increased salt rounds for better security

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return {
      message: 'Parola başarıyla güncellendi',
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = this.jwtService.verify(refreshToken);
      
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Geçersiz refresh token');
      }

      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Kullanıcı bulunamadı veya aktif değil');
      }

      // Generate new access token
      const payload = { 
        email: user.email, 
        sub: user.id,
        iat: Math.floor(Date.now() / 1000),
        jti: Math.random().toString(36).substr(2, 9),
      };
      
      const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

      return {
        access_token: accessToken,
        expires_in: 900,
        token_type: 'Bearer',
      };
    } catch (error) {
      throw new UnauthorizedException('Geçersiz refresh token');
    }
  }
}
