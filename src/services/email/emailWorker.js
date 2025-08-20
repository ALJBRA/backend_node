const { Worker } = require("bullmq");
const emailService = require("./emailService");
const { client } = require("../../redis");

// Criando o Worker que processa os e-mails da fila com a conexão existente
const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        try {
            const { to, subject, text } = job.data;
            await emailService.sendEmail(to, subject, text);
            console.log(`✅ E-mail enviado para: ${to}`);
        } catch (error) {
            console.error(`❌ Erro ao enviar e-mail para: ${job.data.to}`, error);
            throw error; // Importante relançar o erro para o BullMQ saber que o job falhou
        }
    },
    { connection: client }
);

console.log("👷 Worker de e-mail iniciado...");

module.exports = emailWorker;
