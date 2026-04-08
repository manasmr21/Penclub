import { ApiProperty } from '@nestjs/swagger';

export class SiteUpdateDto {
    @ApiProperty({ description: 'Navbar menu items', example: ['Home', 'Books', 'Profile'] })
    navbar?: string[];

    @ApiProperty({ description: 'Available user roles', example: ['admin', 'reader'] })
    roles?: string[];

    @ApiProperty({ description: 'Role permissions mapping', example: ['admin:full', 'reader:read'] })
    rolepermissions?: string[];

    @ApiProperty({ description: 'Available genres/categories', example: ['fiction', 'mystery'] })
    genre?: string[];

    @ApiProperty({ description: 'Site logo URL', example: 'https://example.com/logo.png' })
    logo?: string;

    @ApiProperty({ description: 'Cloudinary logo public ID', example: 'logo/abc123' })
    logoId?: string;

    @ApiProperty({ 
        description: 'Site API key for external integrations', 
        example: 'sk-1234567890abcdef' 
    })
    apiKey?: string;
}
