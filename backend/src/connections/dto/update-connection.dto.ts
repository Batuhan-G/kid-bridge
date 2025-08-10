import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateConnectionDto {
  @IsOptional()
  @IsString()
  @IsIn(['ACCEPTED', 'REJECTED'])
  status?: 'ACCEPTED' | 'REJECTED';
}
