import { IsNotEmpty, IsString } from 'class-validator';

export class tokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
