import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
    @ApiProperty({
        example: "The Last Monsoon"
    })
    title: string;

    @ApiProperty({
        example: "A sweeping historical novel set in 1940s India."
    })
    description: string;

    @ApiProperty({
        example: "Historical Fiction"
    })
    genre: string;

    @ApiProperty({
        example: "2026-01-15",
        required: false
    })
    releaseDate?: string;

    @ApiProperty({
        example: ["https://bookstore.example.com/the-last-monsoon"],
        required: false
    })
    purchaseLinks?: string[];
}
