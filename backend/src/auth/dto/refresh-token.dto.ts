import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'Refresh token geçerli bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Refresh token zorunludur' })
  refreshToken: string;
}