import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createUserDTO {
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

export class updateUserDTO {
  @IsString()
  @IsOptional()
  names: string;

  @IsString()
  @IsOptional()
  lastNames: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  departments: string;

  @IsString()
  @IsOptional()
  directions: string;

  @IsString()
  @IsOptional()
  jobNumber: string;

  @IsString()
  @IsOptional()
  contact: string;
}
