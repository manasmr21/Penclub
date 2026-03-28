import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'johndoe123'
  })
  identifier: string;

  @ApiProperty({
    example: 'password123'
  })
  password: string;
}
