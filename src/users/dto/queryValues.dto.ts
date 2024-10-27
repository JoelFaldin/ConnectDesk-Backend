import { IsOptional, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryValuesDto {
  @IsString()
  @IsOptional()
  searchValue: string;

  @IsString()
  @IsOptional()
  searchColumn: string;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  pageSize: number;
}

export class QueryFilterDto {
  @IsString()
  @IsOptional()
  column: string;

  @IsOptional()
  @Type(() => Number)
  sendOrder: number;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number = 10;
}
