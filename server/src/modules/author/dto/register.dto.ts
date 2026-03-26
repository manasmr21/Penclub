import { ApiProperty } from "@nestjs/swagger";

export class AuthorDto {

    @ApiProperty({
        example: "John Doe"
    })
    name: string;

    @ApiProperty({
        example: "johndoe8"
    })
    penName: string

    @ApiProperty({
        example: "johndoe@gmail.com"
    })
    email: string;

    @ApiProperty({
        example: "password123"
    })
    password: string;

    @ApiProperty({
        example:"reader"
    })
    role:string

    @ApiProperty({
        example: "Hello, I am John Doe"
    })
    bio?: string;

    @ApiProperty({
        example: ["Murder myster", "Sci-fi", "Fantasy"]
    })
    interests?: string[]

    @ApiProperty({
        example: "https://profileimage.com/johndoe"
    })
    profilePicture?: string;

    @ApiProperty({
        example: ["https://twitter/johndoe", "https://facebook/johndoe"]
    })
    socialLinks?: string[]
}