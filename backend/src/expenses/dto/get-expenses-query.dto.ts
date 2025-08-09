import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ExpenseCategory, ExpenseStatus } from '@prisma/client';

export class GetExpensesQueryDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}