import { Injectable, UnauthorizedException, ConflictException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) {}

    async signUp(fullName: string, email: string, pass: string): Promise<{ message: string }> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists.');
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        
        const verificationToken = randomBytes(32).toString('hex');
        const emailVerificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

        const user = await this.prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                verificationToken,
                emailVerificationTokenExpires,
            },
        });

        const verificationUrl = `http://localhost:3001/auth/verify-email?token=${verificationToken}`;

        const info = await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcome to our app! Please verify your email',
            template: './verification', // `.pug` extension is appended automatically
            context: {
                name: user.fullName,
                url: verificationUrl,
            },
        });

        this.logger.log(`Ethereal message sent: ${nodemailer.getTestMessageUrl(info)}`);

        return { message: 'User successfully registered. Please check your email to verify your account.' };
    }

    async verifyEmail(token: string): Promise<{ message: string }> {
        const user = await this.prisma.user.findUnique({
            where: { verificationToken: token },
        });

        if (!user || !user.emailVerificationTokenExpires) {
            throw new BadRequestException('Invalid verification token.');
        }

        if (new Date() > user.emailVerificationTokenExpires) {
            throw new BadRequestException('Verification token has expired.');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                emailVerificationTokenExpires: null,
            },
        });

        return { message: 'Email successfully verified.' };
    }

    async signIn(email: string, pass: string): Promise<{accessToken: string}> {
        const user = await this.prisma.user.findUnique({
            where: {email},
        });

        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.emailVerified) {
            throw new UnauthorizedException('Please verify your email before signing in.');
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
