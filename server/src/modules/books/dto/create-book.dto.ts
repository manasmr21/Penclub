import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
    @ApiProperty({
        example: "A game of thrones"
    })
    title: string;

    @ApiProperty({
        example: "A greate fantasy story"
    })
    description: string;

    @ApiProperty({
        example: "Mediaval Fiction"
    })
    genre: string;

    @ApiProperty({
        example: "Gorege R R Martin"
    })
    authorname : string;

    @ApiProperty({
        example: "2026-01-15",
        required: false
    })
    releaseDate?: string;

    @ApiProperty({
        example: ["https://bookstore.example.com/a-game-of-thrones"],
        required: false
    })
    purchaseLinks?: string[];
}
