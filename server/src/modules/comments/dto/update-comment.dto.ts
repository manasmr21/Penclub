import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @ApiProperty({
    example: 'Updated content',
  })
  content: string;

  @ApiProperty({
    example: "9asd08f2-d9asd0as-da0sd9a0"
  })
  commentId: string
  
  @ApiProperty({
    example: "9asd08f2-d9asd0as-da0sd9a0"
  })
  parentId?: string | undefined;
}
