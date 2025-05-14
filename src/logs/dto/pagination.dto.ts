import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pageSize: number;
}
