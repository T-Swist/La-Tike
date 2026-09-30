import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import prisma from '../config/database';
import env from '../config/env';
import { RegisterInput, LoginInput } from '../validators';
import { TokenPair } from '../types';
import { generateTokenPair, hashToken, verifyRefreshToken } from '../utils/jwt';
import { conflict, notFound, unauthorized } from '../utils/AppError';

export type PublicUser = Omit<User, 'password' | 'refreshToken'>;

const toPublicUser = ({ password: _p, refreshToken: _r, ...user }: User): PublicUser => user;

export class AuthService {
  private async issueTokens(user: User): Promise<TokenPair> {
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashToken(tokens.refreshToken) },
    });

    return tokens;
  }

  async register(dto: RegisterInput): Promise<TokenPair & { user: PublicUser }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw conflict('An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, env.BCRYPT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role,
      },
    });

    const tokens = await this.issueTokens(user);
    return { ...tokens, user: toPublicUser(user) };
  }

  async login(dto: LoginInput): Promise<TokenPair & { user: PublicUser }> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    // Same error for unknown email and wrong password to avoid account enumeration.
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw unauthorized('Invalid email or password');
    }

    const tokens = await this.issueTokens(user);
    return { ...tokens, user: toPublicUser(user) };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      verifyRefreshToken(refreshToken);
    } catch {
      throw unauthorized('Invalid or expired refresh token');
    }

    const user = await prisma.user.findFirst({
      where: { refreshToken: hashToken(refreshToken) },
    });

    if (!user) {
      throw unauthorized('Invalid or expired refresh token');
    }

    return this.issueTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw notFound('User not found');
    }
    return toPublicUser(user);
  }
}
