// MAX-LOYALTY | PASSWORD SERVICE
// Password hashing and validation

import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  /**
   * Хешировать пароль
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Сравнить пароль с хешем
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Валидировать пароль
   * - Минимум 8 символов
   * - Хотя бы одна заглавная буква
   * - Хотя бы одна цифра
   * - Хотя бы один спецсимвол
   */
  validatePassword(password: string): void {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      throw new BadRequestException('Password must contain at least one digit');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new BadRequestException('Password must contain at least one special character');
    }
  }

  /**
   * Сгенерировать временный пароль
   */
  generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    // Убедиться что есть все требуемые типы символов
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

    // Заполнить оставшиеся символы
    for (let i = 0; i < 9; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // Перемешать
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
}
