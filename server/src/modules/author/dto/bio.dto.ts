import { ApiProperty } from "@nestjs/swagger";

export class BioDto{

    @ApiProperty({
        example:"Hello, I am John Doe"
    })
    bio?: string;

    @ApiProperty({
    example:["Murder myster", "Sci-fi", "Fantasy"]
    })
    interests?: string[]

    @ApiProperty({
        example:"https://profileimage.com/johndoe"
    })
    profilePicture?: string;

    @ApiProperty({
        example:["https://twitter/johndoe", "https://facebook/johndoe"]
    })
    socialLinks?: string[]
}

