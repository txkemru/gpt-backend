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
            content: 'Ты ассистент, который задаёт 2–3 осмысленных вопроса по теме, которую только что рассказали.',
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
