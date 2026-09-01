import { Request, Response, NextFunction } from 'express';
import { db } from '../repository/db';
import { UserRole } from '../models/types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    isFoundingCustomer: boolean;
  };
}

/**
 * Require Admin Role Guard
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const adminToken = req.headers['x-admin-token'] || req.headers['authorization'];
  const userId = req.headers['x-user-id'] as string;

  const users = db.getUsers();
  let adminUser = users.find((u) => u.role === 'admin' && (u.id === userId || adminToken === 'admin-secret-token'));

  // Development / Admin header fallback
  if (!adminUser && (adminToken === 'admin-secret-token' || adminToken === 'Bearer admin-secret-token')) {
    adminUser = users.find((u) => u.role === 'admin') || {
      id: 'usr-admin-01',
      email: 'admin@kryonhost.com',
      fullName: 'KryonHost Infrastructure Admin',
      role: 'admin',
      isFoundingCustomer: false,
      createdAt: new Date().toISOString(),
    };
  }

  if (!adminUser) {
    return res.status(403).json({
      error: 'Access Denied',
      message: 'Admin authorization required. Valid admin credentials must be provided.',
    });
  }

  req.user = adminUser;
  next();
};

/**
 * Require Authenticated Customer Guard
 */
export const requireCustomer = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const customerId = (req.headers['x-customer-id'] || req.headers['x-user-id']) as string;
  const users = db.getUsers();

  const customerUser = users.find((u) => u.id === customerId) || users.find((u) => u.role === 'customer');

  if (!customerUser) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Customer authentication required. Provide x-customer-id header.',
    });
  }

  req.user = customerUser;
  next();
};
