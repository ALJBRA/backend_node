const { Queue } = require("bullmq");
const { client } = require("../../redis");

// Criando a fila de envio de e-mails usando a conexão já existente
const emailQueue = new Queue("emailQueue", { connection: client });

module.exports = emailQueue;
