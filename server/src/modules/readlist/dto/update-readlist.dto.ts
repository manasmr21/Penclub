import { ApiProperty } from "@nestjs/swagger";

export class UpdateReadlistDto {
    @ApiProperty({ example: "My Updated List", required: false })
    name?: string;

    @ApiProperty({ example: true, required: false })
    isPublic?: boolean;
}
