import {
  IsString,
  IsNotEmpty,
  IsStrongPassword,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'Mevcut parola geçerli bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Mevcut parola zorunludur' })
  currentPassword: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, { message: 'Yeni parola en az 8 karakter olmalı ve büyük harf, küçük harf, sayı ve özel karakter içermelidir' })
  newPassword: string;
}