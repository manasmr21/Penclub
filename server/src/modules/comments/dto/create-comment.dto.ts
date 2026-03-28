import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
    @ApiProperty({
        example: "Great read — loved the ending!"
    })
    content: string;

    @ApiProperty({
        example: "8f3f7e8b-1f1c-4d4d-9b1c-9f3a1f2b3c4d"
    })
    blogId: string;

    @ApiProperty({
        example: "7b1a2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
        required: false,
        description: "Set when replying to an existing comment"
    })
    parentId?: string;

    @ApiProperty({
        example: "3f1a0d9b-2c3e-4f5a-6b7c-8d9e0f1a2b3c",
        required: false,
        description: "Author id (required if commenter is an author)"
    })
    authorId?: string;

    @ApiProperty({
        example: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        required: false,
        description: "Reader id (required if commenter is a reader)"
    })
    readerId?: string;
}
