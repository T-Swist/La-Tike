import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { RegisterDTO, LoginDTO } from '../types/dtos';
import { TokenPair } from '../types';
import { generateTokenPair } from '../utils/jwt';

export class AuthService {
  async register(dto: RegisterDTO): Promise<TokenPair> {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(
      dto.password,
      parseInt(process.env.BCRYPT_ROUNDS || '10')
    );

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: dto.role || 'CUSTOMER',
      },
    });

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async login(dto: LoginDTO): Promise<TokenPair & { user: any }> {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    const { password, refreshToken, ...userWithoutSensitive } = user;

    return {
      ...tokens,
      user: userWithoutSensitive,
    };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const user = await prisma.user.findFirst({
      where: { refreshToken },
    });

    if (!user) {
      throw new Error('Invalid refresh token');
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken },
    });

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
