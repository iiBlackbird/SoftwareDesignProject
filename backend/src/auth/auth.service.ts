import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async signUp(fullName: string, email: string, pass: string): Promise<{accessToken: string}> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });

        return this.generateJwt(user.id, user.email, user.fullName || '');
    }

    async signIn(email: string, pass: string): Promise<{accessToken: string}> {
        const user = await this.prisma.user.findUnique({
            where: {email},
        });

        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.generateJwt(user.id, user.email, user.fullName || '');
    }

    private async generateJwt(userId: string, username: string, fullName: string): Promise<{accessToken: string}> {
        const payload = {sub: userId, username, fullName};
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
}
