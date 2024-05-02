import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function generateAccessToken(username, password) {
    const payload = { username, password };
    const secret = process.env.JWT_SECRET;
    return jwt.sign(payload, secret, { expiresIn: '1h' }); // Set appropriate expiration time
}

function verifyAdminToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from header

    if (!token) return res.status(401).send({ message: 'Unauthorized: No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Attach decoded data to request object (optional)
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized: Invalid token' });
    }
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    return await bcrypt.hash(password, salt);
}

async function isAuthenticated(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

export { isAuthenticated, generateAccessToken, hashPassword, verifyAdminToken };