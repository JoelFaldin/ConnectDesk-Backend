import { IsNotEmpty, IsString } from 'class-validator';

export class GetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
