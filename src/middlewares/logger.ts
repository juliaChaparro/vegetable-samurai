import { type Request, type Response, type NextFunction } from "express";
import fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";

export type LogType = "simple" | "complete";

function logger(type: LogType) {
    const logPath = process.env.LOGS_PATH;

    // Garante que o diretório existe apenas uma vez na inicialização
    if (logPath) {
        const dir = path.dirname(logPath);
        if (!fsSync.existsSync(dir)) {
            fsSync.mkdirSync(dir, { recursive: true });
        }
    }

    if (type === "simple" || (type as string) === "simples") {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!logPath) {
                console.error("A variável LOGS_PATH não está definida.");
                return next();
            }

            const now = new Date().toISOString();
            const method = req.method;
            const url = req.originalUrl || req.url;
            const logMessage = `[${now}] ${method} ${url}\n`;

            fs.appendFile(logPath, logMessage).catch((err) => {
                console.error("Erro ao escrever no arquivo de log:", err);
            });

            next();
        };
    } else {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!logPath) {
                console.error("A variável LOGS_PATH não está definida.");
                return next();
            }

            const now = new Date().toISOString();
            const method = req.method;
            const url = req.originalUrl || req.url;
            const httpVersion = req.httpVersion;
            const userAgent = req.get('User-Agent') || 'Desconhecido';
            const logMessage = `[${now}] ${method} ${url} HTTP/${httpVersion} - ${userAgent}\n`;

            fs.appendFile(logPath, logMessage).catch((err) => {
                console.error("Erro ao escrever no arquivo de log:", err);
            });

            next();
        };
    }
}

export default logger;
