import { ApiProperty } from "@nestjs/swagger";

export class UpdateBookDto {
    @ApiProperty({
        example: "The Last Monsoon (Revised Edition)",
        required: false
    })
    title?: string;

    @ApiProperty({
        example: "Updated description for the revised edition.",
        required: false
    })
    description?: string;

    @ApiProperty({
        example: "Historical Fiction",
        required: false
    })
    genre?: string;

    @ApiProperty({
        example: "2026-02-01",
        required: false
    })
    releaseDate?: string;

    @ApiProperty({
        example: ["https://bookstore.example.com/the-last-monsoon"],
        required: false
    })
    purchaseLinks?: string[];

    @ApiProperty({
        example: true,
        required: false
    })
    removeImages?: boolean;
}
