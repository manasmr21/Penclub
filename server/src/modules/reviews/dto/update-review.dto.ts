import { ApiProperty } from "@nestjs/swagger";

export class UpdateReviewDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5, required: false })
  rating?: number;

  @ApiProperty({ example: "Updated review content.", required: false })
  content?: string;
}

