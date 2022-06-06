import { IsNotEmpty, IsString,Length, Matches } from "class-validator"

export class CreateUserDto {
    @Length(1, 20)
    @IsString()
    @IsNotEmpty()
    @Matches(/^[A-Za-z][A-Za-z]*$/,{message:'firstName is english character only.'})
    firstName:string
    @IsString()
    @IsNotEmpty()
    @Length(1, 20)
    @Matches(/^[A-Za-z][A-Za-z]*$/,{message:'lastName is english character only.'})
    lastName:string
}
