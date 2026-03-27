import { ApiProperty } from "@nestjs/swagger";

export class UpdateBlogDto {

    @ApiProperty({
        example: "A Night in Calcutta (Revised Edition)",
        required: false
    })
    title?: string;

    @ApiProperty({
        example: "Updated story content goes here...",
        required: false
    })
    content?: string;

    @ApiProperty({
        example: ["mystery", "noir", "thriller"],
        required: false
    })
    tags?: string[];

    @ApiProperty({
        example: "https://images.example.com/cover-updated.jpg",
        required: false
    })
    coverImage?: string;

    @ApiProperty({
        example: "https://images.example.com/cover-updated.jpg",
        required: false
    })
    coverImageId: string

    @ApiProperty({
        example: "edited"
    })
    status?: string

    @ApiProperty({
        example: true
    })
    removeCoverImage?: Boolean
}
