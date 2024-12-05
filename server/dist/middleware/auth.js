import jwt from 'jsonwebtoken';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Access denied. No token provided.'
        });
        return; // Add explicit return
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: 'Token has expired.'
            });
            return; // Add explicit return
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: 'Invalid token.'
            });
            return; // Add explicit return
        }
        res.status(500).json({
            message: 'Internal server error.'
        });
        return; // Add explicit return
    }
};
