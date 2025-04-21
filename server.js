import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/gpt', async (req, res) => {
  const userText = req.body.text;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Ты выступаешь как вежливый, внимательный ассистент, который:
            - внимательно выслушал человека,
            - понял его тему,
            - формирует 2–3 вежливых, полезных и конкретных вопроса по теме, чтобы помочь ему раскрыться или подумать глубже.

            Всегда начинай с краткого ободряющего вступления (например: "Спасибо за рассказ!", "Отличная презентация!" и т.д.), затем задавай вопросы в виде списка.

            Пример:
            Спасибо за рассказ! Вот что я хотел бы уточнить:
            1. ...
            2. ...
            3. ...

            Не извиняйся. Не добавляй "как ИИ", говори естественно.`,

          },
          {
            role: 'user',
            content: userText,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("ОТВЕТ ОТ OPENAI:", JSON.stringify(data, null, 2));
    
    const content = data.choices?.[0]?.message?.content;
    res.json({ reply: content });
    

    
  } catch (error) {
    console.error('Ошибка GPT:', error);
    res.status(500).json({ error: 'Ошибка при запросе к GPT' });
  }
});

app.listen(PORT, () => {
  console.log(`GPT backend запущен на http://localhost:${PORT}`);
});
