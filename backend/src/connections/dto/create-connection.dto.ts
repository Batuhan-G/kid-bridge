import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateConnectionDto {
  @IsEmail()
  receiverEmail: string;

  @IsOptional()
  @IsString()
  message?: string;
}
