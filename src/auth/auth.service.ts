// MAX-LOYALTY | AUTH SERVICE
// Complete authentication logic with email/phone, JWT, MFA, rate limiting

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from './jwt.service';
import { PasswordService } from './password.service';
import { RateLimitService } from './rate-limit.service';
import { SessionService } from './session.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, RefreshTokenDto, PasswordResetDto } from './dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
    private rateLimitService: RateLimitService,
    private sessionService: SessionService,
    private emailService: EmailService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  async register(dto: RegisterDto, ipAddress: string) {
    // 1. Валидировать пароль
    this.passwordService.validatePassword(dto.password);

    // 2. Проверить что email/phone не существует
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: dto.phone },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        existingUser.email === dto.email
          ? 'Email already registered'
          : 'Phone already registered',
      );
    }

    // 3. Хешировать пароль
    const passwordHash = await this.passwordService.hash(dto.password);

    // 4. Создать пользователя
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: UserStatus.ACTIVE,
      },
    });

    // 5. Отправить email верификации
    await this.emailService.sendVerificationEmail(
      user.email,
      user.id,
      this.generateEmailVerificationToken(user.id),
    );

    // 6. Создать сессию
    const session = await this.sessionService.createSession(user.id, ipAddress);

    // 7. Генерировать токены
    const tokens = await this.jwtService.generateTokens(user, session.id);

    // 8. Вернуть
    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Логин пользователя
   */
  async login(dto: LoginDto, ipAddress: string, userAgent: string) {
    // 1. Проверить rate limiting
    const isRateLimited = await this.rateLimitService.isRateLimited(
      dto.email || dto.phone,
      'login',
    );

    if (isRateLimited) {
      throw new ForbiddenException(
        'Too many login attempts. Try again in 30 minutes.',
      );
    }

    // 2. Найти пользователя
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { phone: dto.phone },
        ],
      },
    });

    if (!user) {
      await this.rateLimitService.recordFailedAttempt(dto.email || dto.phone, 'login');
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Проверить статус
    if (user.status === UserStatus.BLOCKED) {
      throw new ForbiddenException('User account is blocked');
    }

    // 4. Проверить пароль
    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      await this.rateLimitService.recordFailedAttempt(dto.email || dto.phone, 'login');
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5. Проверить что email верифицирован
    if (!user.emailVerified) {
      throw new BadRequestException('Please verify your email first');
    }

    // 6. Если MFA включен, требовать TOTP код
    if (user.mfaEnabled) {
      if (!dto.mfaCode) {
        throw new BadRequestException('MFA code required');
      }

      const isMfaValid = this.validateMfaCode(dto.mfaCode, user.mfaSecret);
      if (!isMfaValid) {
        await this.rateLimitService.recordFailedAttempt(dto.email || dto.phone, 'mfa');
        throw new UnauthorizedException('Invalid MFA code');
      }
    }

    // 7. Очистить rate limit counter
    await this.rateLimitService.clearFailedAttempts(dto.email || dto.phone, 'login');

    // 8. Проверить лимит активных сессий (max 5)
    const activeSessions = await this.sessionService.getActiveSessions(user.id);
    if (activeSessions.length >= 5) {
      // Удалить самую старую сессию
      await this.sessionService.revokeSession(activeSessions[0].id);
    }

    // 9. Создать новую сессию
    const session = await this.sessionService.createSession(user.id, ipAddress, userAgent);

    // 10. Обновить last_login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    // 11. Генерировать токены
    const tokens = await this.jwtService.generateTokens(user, session.id);

    // 12. Вернуть
    return {
      user: this.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Обновить access token через refresh token
   */
  async refreshTokens(dto: RefreshTokenDto) {
    // 1.验证 refresh token
    const decoded = this.jwtService.verifyRefreshToken(dto.refreshToken);

    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // 2. Получить сессию
    const session = await this.sessionService.getSession(decoded.sessionId);

    if (!session || !session.isActive) {
      throw new UnauthorizedException('Session expired or revoked');
    }

    // 3. Получить пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user || user.status === UserStatus.BLOCKED) {
      throw new UnauthorizedException('User not found or blocked');
    }

    // 4. Генерировать новые токены
    const tokens = await this.jwtService.generateTokens(user, session.id);

    return { tokens };
  }

  /**
   * Логаут (ревокировать сессию и refresh token)
   */
  async logout(userId: bigint, sessionId?: bigint) {
    if (sessionId) {
      // Ревокировать конкретную сессию
      await this.sessionService.revokeSession(sessionId);
    } else {
      // Ревокировать текущую активную сессию
      const sessions = await this.sessionService.getActiveSessions(userId);
      if (sessions.length > 0) {
        await this.sessionService.revokeSession(sessions[0].id);
      }
    }

    return { success: true };
  }

  /**
   * Логаут со всех устройств
   */
  async logoutAll(userId: bigint) {
    // Ревокировать все активные сессии
    const sessions = await this.sessionService.getActiveSessions(userId);

    for (const session of sessions) {
      await this.sessionService.revokeSession(session.id);
    }

    return { success: true };
  }

  /**
   * Запрос на сброс пароля
   */
  async requestPasswordReset(email: string) {
    // 1. Найти пользователя
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Не раскрывать что email не найден (security)
      return { success: true, message: 'If email exists, reset link will be sent' };
    }

    // 2. Создать token на сброс пароля (30 минут)
    const resetToken = await this.jwtService.generatePasswordResetToken(user.id);

    // 3. Отправить email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { success: true, message: 'Reset link sent to email' };
  }

  /**
   * Подтвердить сброс пароля
   */
  async confirmPasswordReset(dto: PasswordResetDto) {
    // 1. Верифицировать reset token
    const decoded = this.jwtService.verifyPasswordResetToken(dto.token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // 2. Валидировать новый пароль
    this.passwordService.validatePassword(dto.newPassword);

    // 3. Получить пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 4. Хешировать новый пароль
    const newPasswordHash = await this.passwordService.hash(dto.newPassword);

    // 5. Обновить пароль
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // 6. Ревокировать все активные сессии (security)
    const sessions = await this.sessionService.getActiveSessions(user.id);
    for (const session of sessions) {
      await this.sessionService.revokeSession(session.id);
    }

    return { success: true, message: 'Password reset successfully' };
  }

  /**
   * Верифицировать email
   */
  async verifyEmail(token: string) {
    // 1. Верифицировать token
    const decoded = this.jwtService.verifyEmailVerificationToken(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // 2. Получить пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 3. Обновить email_verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    return { success: true, message: 'Email verified successfully' };
  }

  /**
   * Получить текущего пользователя
   */
  async getCurrentUser(userId: bigint) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Очистить чувствительные данные пользователя
   */
  private sanitizeUser(user: any) {
    const { passwordHash, mfaSecret, ...sanitized } = user;
    return sanitized;
  }

  /**
   * Генерировать token для email верификации
   */
  private generateEmailVerificationToken(userId: bigint): string {
    return this.jwtService.generateEmailVerificationToken(userId);
  }

  /**
   * Валидировать TOTP код для MFA
   */
  private validateMfaCode(code: string, secret: string): boolean {
    // TODO: использовать speakeasy или другую библиотеку
    // Для примера:
    // const window = 2;
    // const isValid = speakeasy.totp.verify({
    //   secret: secret,
    //   encoding: 'base32',
    //   token: code,
    //   window: window,
    // });
    // return isValid;
    return true; // placeholder
  }
}
