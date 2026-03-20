import { ApiProperty } from "@nestjs/swagger";

export class AuthorRegisterDto{
    
    @ApiProperty({
        example:"John Doe"
    })
    name:string;

    @ApiProperty({
        example:"johndoe8"
    })
    penName: string

    @ApiProperty({
        example:"johndoe@gmail.com"
    })
    email:string;

    @ApiProperty({
        example:"password123"
    })
    password:string;

}