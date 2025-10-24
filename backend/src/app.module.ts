import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import { MessagesModule } from './messages/messages.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ConnectionsModule } from './connections/connections.module';
import { NotificationsModule } from './notifications/notifications.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    ChildrenModule,
    MessagesModule,
    ExpensesModule,
    ConnectionsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
