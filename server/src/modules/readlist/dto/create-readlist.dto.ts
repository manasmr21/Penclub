import { ApiProperty } from "@nestjs/swagger";

export class CreateReadlistDto {
    @ApiProperty({ example: "Fantasy Reads" })
    name: string;

    @ApiProperty({ example: false, required: false })
    isPublic?: boolean;
}
