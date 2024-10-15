import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDirectionDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

export class UpdateDirectionDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;
}
