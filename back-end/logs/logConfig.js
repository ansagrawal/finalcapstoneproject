import winston from "winston";
const { Console } = winston.transports; // For console output

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

export { logger };