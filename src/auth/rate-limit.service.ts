// MAX-LOYALTY | RATE LIMIT SERVICE
// Rate limiting for login attempts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';

@Injectable()
export class RateLimitService {
  private client: redis.RedisClient;
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes
  private readonly blockDurationMs = 30 * 60 * 1000; // 30 minutes

  constructor(private config: ConfigService) {
    this.client = redis.createClient({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get('REDIS_PORT', 6379),
      db: this.config.get('REDIS_DB', 0),
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  /**
   * Проверить если ли rate limit для пользователя
   */
  async isRateLimited(identifier: string, action: string): Promise<boolean> {
    return new Promise((resolve) => {
      const key = `rate_limit:${action}:${identifier}`;
      const blockKey = `rate_limit:blocked:${action}:${identifier}`;

      // Проверить если заблокирован
      this.client.get(blockKey, (err, isBlocked) => {
        if (err) {
          console.error('Redis error:', err);
          resolve(false);
          return;
        }

        resolve(!!isBlocked);
      });
    });
  }

  /**
   * Записать неудачную попытку
   */
  async recordFailedAttempt(
    identifier: string,
    action: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      const key = `rate_limit:${action}:${identifier}`;
      const blockKey = `rate_limit:blocked:${action}:${identifier}`;

      // Увеличить счетчик попыток
      this.client.incr(key, (err, count) => {
        if (err) {
          console.error('Redis error:', err);
          resolve();
          return;
        }

        // Установить срок действия ключа если это первая попытка
        if (count === 1) {
          this.client.expire(key, Math.floor(this.windowMs / 1000));
        }

        // Если превышен лимит, заблокировать
        if (count > this.maxAttempts) {
          this.client.setex(
            blockKey,
            Math.floor(this.blockDurationMs / 1000),
            '1',
            () => {
              resolve();
            },
          );
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Очистить счетчик неудачных попыток
   */
  async clearFailedAttempts(
    identifier: string,
    action: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      const key = `rate_limit:${action}:${identifier}`;

      this.client.del(key, () => {
        resolve();
      });
    });
  }

  /**
   * Получить количество оставшихся попыток
   */
  async getRemainingAttempts(
    identifier: string,
    action: string,
  ): Promise<number> {
    return new Promise((resolve) => {
      const key = `rate_limit:${action}:${identifier}`;

      this.client.get(key, (err, count) => {
        if (err) {
          console.error('Redis error:', err);
          resolve(this.maxAttempts);
          return;
        }

        const attempts = parseInt(count || '0');
        const remaining = Math.max(0, this.maxAttempts - attempts);
        resolve(remaining);
      });
    });
  }

  /**
   * Получить время разблокирования
   */
  async getBlockedUntil(
    identifier: string,
    action: string,
  ): Promise<number | null> {
    return new Promise((resolve) => {
      const blockKey = `rate_limit:blocked:${action}:${identifier}`;

      this.client.ttl(blockKey, (err, ttl) => {
        if (err) {
          console.error('Redis error:', err);
          resolve(null);
          return;
        }

        if (ttl <= 0) {
          resolve(null);
        } else {
          resolve(ttl * 1000); // convert to ms
        }
      });
    });
  }

  /**
   * Очистить блокировку (для admin'ов)
   */
  async unblock(identifier: string, action: string): Promise<void> {
    return new Promise((resolve) => {
      const key = `rate_limit:${action}:${identifier}`;
      const blockKey = `rate_limit:blocked:${action}:${identifier}`;

      this.client.del(key);
      this.client.del(blockKey, () => {
        resolve();
      });
    });
  }
}
