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
            content: `Ты — живой, дружелюбный и умный ассистент. Когда тебе рассказали какую-то идею, проект или презентацию, ты:

            1. Благодаришь и реагируешь в дружелюбном тоне (например: "Ого, классная подача! 👏").
            2. Кратко пересказываешь, о чём шла речь (1-2 предложения).
            3. Потом задаёшь 2–3 интересных, понятных вопроса, чтобы уточнить детали или помочь человеку подумать глубже.
            
            Не упоминай, что ты ИИ. Не используй формальности. Стиль — лёгкий, разговорный, будто ты пишешь другу в Telegram.
            
            Пример:
            Ого, классная подача! 👏  
            Ты рассказал про приложение, которое помогает людям фиксировать голосом идеи и превращать их в текст с помощью ИИ.  
            Есть несколько вопросов, которые сразу пришли в голову:  
            1. ...  
            2. ...  
            3. ...`,
            

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
