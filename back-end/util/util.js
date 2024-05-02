import validator from 'validator';
import winston from 'winston';
const { Console } = winston.transports; // For console output

// Validate email domain before generating API key
function validateEmailDomain(email) {
    const allowedDomains = ['@fse.com', '@limu.com'];
    return allowedDomains.some(domain => email.endsWith(domain));
}

function validateNewUser(req, res, next) {

    const newUser = req.body;
    //Check for request body
    if (!newUser || Object.keys(newUser).length === 0) {
        return res.status(400).send({ message: 'Missing request body' });
    }
    // Checking if the request body contains an id field
    if (!newUser.username) {
        return res.status(400).send({ message: 'Username is required' });
    }
    // Checking if the request body contains an email field
    if (!newUser.email) {
        return res.status(400).send({ message: 'Email is required' });
    }
    if (!validator.isEmail(newUser.email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }
    // Checking if the request body contains a password field
    if (!newUser.password) {
        return res.status(400).send({ message: 'Password is required' });
    }
    if (!validator.isStrongPassword(newUser.password)) {
        return res.status(400).send({ message: 'Strong Password required' });
    }

    next();
}

function validateUserData(username, password) {
    return username && username.trim() && password && password.trim();
}

const logger = winston.createLogger({
    level: 'info', // Set minimum log level
    transports: [
        new Console({
            format: winston.format.combine(
                winston.format.colorize(), // Add colors (optional)
                winston.format.timestamp(),
                winston.format.simple() // Basic message format
            ),
        }),
    ],
});


export { logger, validateUserData, validateEmailDomain, validateNewUser };