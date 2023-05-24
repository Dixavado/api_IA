// Importando as dependências necessárias
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000; // Use a porta definida no arquivo .env, ou 3000 como padrão

// Criando a instância do Express
const app = express();

app.use(express.static('views/public')); // Onde "public" é o nome do diretório que contém seus arquivos estáticos

// Adicionando o middleware do CORS
app.use(cors());

// Definindo as rotas do sistema
app.use('/', require('./routes/main'));
app.use('/api', require('./routes/chat'));

// Iniciando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}!`);
});

// Exportando o app para uso externo
module.exports = app;
