import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';

export class CreatePublisherDto {
  @ApiProperty({ description: 'Name of the publisher', example: 'Penguin Books' })
  name: string;

  @ApiProperty({ description: 'Unique publisher identifier', example: 'PUB-12345' })
  publisherId: string;

  @ApiProperty({ description: 'Contact email address for the publisher', example: 'contact@penguin.com' })
  email: string;

  @ApiProperty({ description: 'Contact phone number', example: '+1-555-0198' })
  number: string;

  @ApiProperty({ description: 'Logo URL', example: 'https://example.com/logo.png', required: false })
  logo?: string;

  @ApiProperty({ description: 'Cloudinary logo public ID', example: 'publishers/logo123', required: false })
  logoId?: string;
}

export class UpdatePublisherDto extends PartialType(
  OmitType(CreatePublisherDto, ['publisherId', 'email'] as const)
) { }
