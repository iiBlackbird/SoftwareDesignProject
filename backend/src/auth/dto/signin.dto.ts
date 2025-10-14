import {IsNotEmpty, IsString} from 'class-validator';

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}