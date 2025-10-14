import {IsNotEmpty, IsString, IsEmail, MinLength} from 'class-validator';

export class SignInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}