import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class createUserDTO {
  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  names: string;

  @IsString()
  @IsNotEmpty()
  lastNames: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  departments: string;

  @IsString()
  @IsNotEmpty()
  directions: string;

  @IsString()
  @IsNotEmpty()
  jobNumber: string;

  @IsString()
  @IsNotEmpty()
  contact: string;
}

class ValuesDTO {
  @IsString()
  @IsNotEmpty()
  columnId: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  rowIndex: number;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateUserInfoDTO {
  @ValidateNested({ each: true })
  @Type(() => ValuesDTO)
  values: ValuesDTO[];

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;
}
