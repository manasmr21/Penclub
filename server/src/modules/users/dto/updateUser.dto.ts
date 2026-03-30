import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe'
  })
  name?: string;

  @ApiProperty({
    example: 'Avid reader of mystery novels.'
  })
  bio?: string;

  @ApiProperty({
    description: "Public id for profile picture"
  })
  profilePictureId: string

  @ApiProperty({
    example: ['fiction', 'mystery']
  })
  interest?: string[];

  @ApiProperty({
    example: ['https://twitter.com/johndoe', 'https://facebook.com/johndoe']
  })
  socialeLinks?: string[];
}
