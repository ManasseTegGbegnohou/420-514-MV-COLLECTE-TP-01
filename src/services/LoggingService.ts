import winston from 'winston';
import fs from 'fs';
import path from 'path';

// Winston  setup
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// User actions logger
export const operationsLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, 'operations.log')
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Errors logger
export const errorsLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(logsDir, 'errors.log')
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// GET /api/logs
export const getLastAction = (): any | null => {
    try {
        const operationsLogPath = path.join(logsDir, 'operations.log');
        
        if (!fs.existsSync(operationsLogPath)) {
            return null;
        }

        const logContent = fs.readFileSync(operationsLogPath, 'utf-8');
        const lines = logContent.trim().split('\n');
        
        if (lines.length === 0) {
            return null;
        }

        // Get the last line
        const lastLine = lines[lines.length - 2];
        
        if (!lastLine) {
            return null;
        }
        
        try {
            return JSON.parse(lastLine);
        } catch (parseError) {
            return {
                message: 'Error parsing last log entry',
                raw: lastLine,
                timestamp: new Date().toISOString()
            };
        }
    } catch (error) {
        return null;
    }
};