import { logAccess } from '../data-access/data-access.js';

const accessLogMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const tokenPresent = authHeader && authHeader.split(' ')[1]; // Extract token from header
    if (tokenPresent) {
        const token = authHeader.split(' ')[1];
        logAccess(token.substring(0, 16), req.url, req.method);
    }
    next();
};

export { accessLogMiddleware };