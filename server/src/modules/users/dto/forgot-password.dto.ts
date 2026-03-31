import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({
    example: "johndoe@gmail.com"
  })
  email: string;
}
