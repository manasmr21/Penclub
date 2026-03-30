import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 'johndoe@gmail.com'
  })
  email: string;

  @ApiProperty({
    example: 'johndoe123'
 })
  username: string;

  @ApiProperty({
    example: 'John Doe'
  })
  name: string;

  @ApiProperty({
    example: 'password123'
  })
  password: string;

  @ApiProperty({
    example: 'reader'
  })
  role: string;

  @ApiProperty({
    example: 'Avid reader of mystery novels.'
  })
  bio?: string;

  @ApiProperty({
    example: ['fiction', 'mystery']
  })
  interest?: string[];

  @ApiProperty({
    example: ['https://twitter.com/johndoe', 'https://facebook.com/johndoe']
  })
  socialeLinks?: string[];
}
