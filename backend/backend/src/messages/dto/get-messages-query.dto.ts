import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { MessageType } from '@prisma/client';

export class GetMessagesQueryDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;

  @IsOptional()
  @IsString()
  isRead?: string; // 'true' | 'false'

  @IsOptional()
  @IsNumberString()
  page?: string = '1';

  @IsOptional()
  @IsNumberString()
  limit?: string = '20';
}
