import { Injectable, UnauthorizedException, ConflictException, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private emailService: EmailService,
        private configService: ConfigService,
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
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        //const verificationUrl = `http://localhost:3001/auth/verify-email?token=${verificationToken}`;
        const verificationUrl = `${frontendUrl}/auth/verify-email?token=${verificationToken}`;

        const templateId = this.configService.get<string>('SENDGRID_VERIFICATION_TEMPLATE_ID');
        if (!templateId) {
            throw new InternalServerErrorException('SENDGRID_VERIFICATION_TEMPLATE_ID not found');
        }

        await this.emailService.send({
            to: user.email,
            from: 'matthewcg832@gmail.com',
            templateId: templateId,
            dynamicTemplateData: {
                name: user.fullName,
                url: verificationUrl,
            },
        });

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
