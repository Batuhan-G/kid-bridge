import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { MessageType } from '@prisma/client';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.GENERAL;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  childId: string;
}
