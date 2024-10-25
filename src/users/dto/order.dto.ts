import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class OrderDto {
  @IsString()
  column: string;

  @IsString()
  order: string;

  @IsString()
  searchValue: string;

  @IsString()
  searchColumn: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pageSize: number;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;
}
