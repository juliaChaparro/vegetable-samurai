// =============================================================
// validateEnv.ts — Validação de variáveis de ambiente
// Responsável: Membro 2 | Exercício #3
// =============================================================
import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
    return cleanEnv(process.env, {
        PORT: port({
            default: 3000,
            docs: "Porta em que o servidor vai rodar",
        }),
        DATABASE_URL: str({
            docs: "URL de conexão com o banco de dados MySQL (Prisma)",
        }),
        LOGS_PATH: str({
            docs: "Caminho absoluto ou relativo do arquivo de log",
        }),
    });
};

export default validateEnv;
