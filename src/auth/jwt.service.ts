// MAX-LOYALTY | JWT SERVICE
// JWT token generation and verification

import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class JwtService {
  private readonly accessTokenExpiration: number;
  private readonly refreshTokenExpiration: number;

  constructor(
    private nestJwt: NestJwtService,
    private config: ConfigService,
  ) {
    this.accessTokenExpiration = parseInt(
      this.config.get('JWT_EXPIRATION', '900'),
    );
    this.refreshTokenExpiration = parseInt(
      this.config.get('JWT_REFRESH_EXPIRATION', '2592000'),
    );
  }

  /**
   * Генерировать access и refresh токены
   */
  async generateTokens(user: User, sessionId: bigint) {
    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      sessionId,
    };

    const accessToken = this.nestJwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.accessTokenExpiration,
    });

    const refreshToken = this.nestJwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.refreshTokenExpiration,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: this.accessTokenExpiration,
    };
  }

  /**
   * Верифицировать access token
   */
  verifyAccessToken(token: string) {
    try {
      const decoded = this.nestJwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Верифицировать refresh token
   */
  verifyRefreshToken(token: string) {
    try {
      const decoded = this.nestJwt.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Генерировать token для сброса пароля (30 минут)
   */
  generatePasswordResetToken(userId: bigint): string {
    const payload = { sub: userId, type: 'password_reset' };
    return this.nestJwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '30m',
    });
  }

  /**
   * Верифицировать password reset token
   */
  verifyPasswordResetToken(token: string) {
    try {
      const decoded = this.nestJwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      if (decoded.type !== 'password_reset') {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Генерировать token для верификации email (24 часа)
   */
  generateEmailVerificationToken(userId: bigint): string {
    const payload = { sub: userId, type: 'email_verification' };
    return this.nestJwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '24h',
    });
  }

  /**
   * Верифицировать email verification token
   */
  verifyEmailVerificationToken(token: string) {
    try {
      const decoded = this.nestJwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      if (decoded.type !== 'email_verification') {
        return null;
      }

      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Декодировать token без верификации (для debug)
   */
  decodeToken(token: string) {
    try {
      return this.nestJwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}
