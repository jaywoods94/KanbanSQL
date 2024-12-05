import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = Router();

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ 
        message: 'Username and password are required' 
      });
      return;
    }

    // Corrected Sequelize query syntax
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      res.status(401).json({ 
        message: 'Invalid username or password' 
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ 
        message: 'Invalid username or password' 
      });
      return;
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        username: user.username,
        id: user.id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

router.post('/login', login);

export default router;