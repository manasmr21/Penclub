import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpDto {
    @ApiProperty({
        example: "johndoe@gmail.com"
    })
    email: string;

    @ApiProperty({
        example: "123456"
    })
    otp: string;
}
