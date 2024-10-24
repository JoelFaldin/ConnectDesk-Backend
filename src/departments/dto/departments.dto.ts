import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewDepartmentDTO {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateDepartmentDTO {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
