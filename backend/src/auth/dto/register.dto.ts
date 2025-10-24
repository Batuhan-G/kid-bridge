import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  Matches,
  MaxLength,
  IsStrongPassword,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Geçerli bir email adresi giriniz' })
  @IsNotEmpty({ message: 'Email adresi zorunludur' })
  @MaxLength(100, { message: 'Email adresi çok uzun' })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, { message: 'Parola en az 8 karakter olmalı ve büyük harf, küçük harf, sayı ve özel karakter içermelidir' })
  password: string;

  @IsString({ message: 'Ad geçerli bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Ad zorunludur' })
  @MinLength(2, { message: 'Ad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Ad çok uzun' })
  @Matches(/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/, { message: 'Ad sadece harf ve boşluk içerebilir' })
  firstName: string;

  @IsString({ message: 'Soyad geçerli bir metin olmalıdır' })
  @IsNotEmpty({ message: 'Soyad zorunludur' })
  @MinLength(2, { message: 'Soyad en az 2 karakter olmalıdır' })
  @MaxLength(50, { message: 'Soyad çok uzun' })
  @Matches(/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/, { message: 'Soyad sadece harf ve boşluk içerebilir' })
  lastName: string;

  @IsString({ message: 'Telefon numarası geçerli bir metin olmalıdır' })
  @IsOptional()
  @Matches(/^(\+90|0)?[0-9]{10}$/, { message: 'Geçerli bir Türk telefon numarası giriniz' })
  phone?: string;
}
