import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDirectionDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDirectionDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
