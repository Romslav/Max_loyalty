// MAX-LOYALTY | SESSION SERVICE
// Session management for concurrent logins

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SessionService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создать новую сессию
   */
  async createSession(
    userId: bigint,
    ipAddress: string,
    userAgent?: string,
  ) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 дней

    return this.prisma.userSession.create({
      data: {
        userId,
        refreshToken: this.generateRefreshToken(),
        ipAddress,
        userAgent,
        isActive: true,
        expiresAt,
      },
    });
  }

  /**
   * Получить сессию
   */
  async getSession(sessionId: bigint) {
    return this.prisma.userSession.findUnique({
      where: { id: sessionId },
    });
  }

  /**
   * Получить все активные сессии пользователя
   */
  async getActiveSessions(userId: bigint) {
    return this.prisma.userSession.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Ревокировать сессию
   */
  async revokeSession(sessionId: bigint) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Ревокировать все сессии пользователя
   */
  async revokeAllSessions(userId: bigint) {
    return this.prisma.userSession.updateMany({
      where: { userId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });
  }

  /**
   * Удалить истекшие сессии (для cleanup)
   */
  async cleanupExpiredSessions() {
    const result = await this.prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Обновить последнее активность сессии
   */
  async updateSessionActivity(sessionId: bigint) {
    return this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        lastActivityAt: new Date(),
      },
    });
  }

  /**
   * Генерировать refresh token
   */
  private generateRefreshToken(): string {
    return Buffer.from(Math.random().toString() + Date.now().toString())
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '');
  }
}
