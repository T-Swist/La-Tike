import { Response } from 'express';
import { AuthRequest } from '../types';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';

const authService = new AuthService();

export class AuthController {
  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const tokens = await authService.register(req.body);
      sendSuccess(res, tokens, 'Registration successful', 201);
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async login(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  async refreshToken(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      sendSuccess(res, tokens, 'Token refreshed');
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      await authService.logout(req.user!.id);
      sendSuccess(res, null, 'Logout successful');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      sendSuccess(res, req.user, 'Profile retrieved');
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
}
