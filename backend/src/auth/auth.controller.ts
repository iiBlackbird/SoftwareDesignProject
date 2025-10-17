import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto} from './dto/create-user.dto';
import {SignInDto} from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto) {
        return this.authService.signUp(createUserDto.fullName, createUserDto.email, createUserDto.password);
    }

    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('signin')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.email, signInDto.password);
    }
}
