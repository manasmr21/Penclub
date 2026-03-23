import { ApiProperty } from "@nestjs/swagger";

export class ReaderDto {
    @ApiProperty({ description: "Reader's full name", example: "John Doe", required: true })
    name: string;

    @ApiProperty({ description: "Unique username for the reader", example: "johndoe123", required: true })
    username: string;

    @ApiProperty({ description: "Reader's email address", example: "john.doe@example.com", required: true })
    email: string;

    @ApiProperty({ description: "Reader's password", example: "securePass123", required: true })
    password: string;
}
