// server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/send-chat', async (req, res) => {
  const { chatChannelId, message, accessToken } = req.body;

  if (!chatChannelId || !message || !accessToken) {
    return res.status(400).json({ error: '필수 데이터가 누락되었습니다.' });
  }

  try {
    const response = await fetch(
      `https://api.chzzk.naver.com/service/v1/chats/send?chatChannelId=${chatChannelId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: message })
      }
    );
    
    if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('메시지 전송 오류:', error.message);
    res.status(500).json({ error: '메시지 전송에 실패했습니다.' });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
