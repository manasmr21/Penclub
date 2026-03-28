import { ApiProperty } from "@nestjs/swagger";

export class CreateBlogDto {
    @ApiProperty({
        example: "A Night in Calcutta"
    })
    title: string;

    @ApiProperty({
        example: "Full story content goes here..."
    })
    content: string;

    @ApiProperty({
        example: ["mystery", "noir"],
        required: false
    })
    tags?: string[];

    @ApiProperty({
        example: "8f3f7e8b-1f1c-4d4d-9b1c-9f3a1f2b3c4d"
    })
    userId: string;

    @ApiProperty({
        example: "posted"
    })
    status?: string
}
