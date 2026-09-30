import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration successful', 201);
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    const result = await authService.login(req.body);
    sendSuccess(res, result, 'Login successful');
  }

  async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    sendSuccess(res, tokens, 'Token refreshed');
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    await authService.logout(req.user!.id);
    sendSuccess(res, null, 'Logout successful');
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    const user = await authService.getProfile(req.user!.id);
    sendSuccess(res, user, 'Profile retrieved');
  }
}
