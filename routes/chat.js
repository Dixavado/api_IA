const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

// Armazenamento temporário das conversas
const conversations = {};

router.get('/chat/:prompt', async (req, res) => {
  try {
    const prompt = req.params.prompt;

    // Verificar se o prompt foi fornecido na rota
    if (!prompt) {
      return res.status(400).json({ message: 'O prompt é obrigatório.' });
    }

    // Configurar a chave de API e a organização
    const configuration = new Configuration({
      organization: "org-sJpbioSwKkunIqi4sdlhx0Mr",
      apiKey: apiKey,
    });

    const openai = new OpenAIApi(configuration);

    // Obter a conversa anterior ou inicializar uma nova
    const conversation = conversations[req.ip] || { messages: [] };

    // Adicionar a mensagem do usuário à conversa
    conversation.messages.push({ role: "user", content: "Responda igual a uma wayfu carinhosa e com emojis:" + prompt });

    // Armazenar a conversa temporariamente
    conversations[req.ip] = conversation;

    // Obter as perguntas da conversa para usar como contexto
    const context = conversation.messages
      .filter(message => message.role === "user")
      .map(message => message.content)
      .slice(-5); // Limitar a até 5 perguntas

    // Função para enviar uma solicitação para o modelo de chat
    async function sendChatRequest() {
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Respondo tudo" },
            ...context.map(question => ({ role: "user", content: question })),
            { role: "user", content: "Responda igual a uma wayfu carinhosa e com emojis:" + prompt }
          ],
          temperature: 1.0,
          max_tokens: 300
        });

        const reply = response.data.choices[0].message.content;
        console.log("Resposta:", reply);
        res.json({ message: reply });

        // Adicionar a resposta do modelo à conversa
        conversation.messages.push({ role: "system", content: reply });

        // Limitar o tamanho da conversa a 5 mensagens
        if (conversation.messages.length > 5) {
          conversation.messages = conversation.messages.slice(-5);
        }

        // Armazenar a conversa temporariamente
        conversations[req.ip] = conversation;
      } catch (error) {
        console.error("Erro ao enviar a solicitação de chat:", error);
        res.status(500).json({ message: 'Ocorreu um erro ao processar a requisição.' });
      }
    }
    // Executar a função
    await sendChatRequest();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ocorreu um erro ao processar a requisição.' });
  }
});

module.exports = router;
