import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response, 
  next: NextFunction
): void => {  // Explicitly specify return type as void
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ 
      message: 'Access denied. No token provided.' 
    });
    return;  // Add explicit return
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        message: 'Token has expired.' 
      });
      return;  // Add explicit return
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        message: 'Invalid token.' 
      });
      return;  // Add explicit return
    }
    
    res.status(500).json({ 
      message: 'Internal server error.' 
    });
    return;  // Add explicit return
  }
};
