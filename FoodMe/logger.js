const winston = require('winston');

const userlogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: 'applog.log' }),
    ],
});
