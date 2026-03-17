const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PAGE_ACCESS_TOKEN = "EAARbeoZBRcaUBQ9lC0m0fCeMZBswFrWG5UCMR8tI7kpuRpC5FwZCY05oG3w0lF56Oq3W9xZBFtBC9hsNfQYE8HZBl9G77iEmpjhUew1or0KqCVCANK7f4OjIXBw87ssaclg7B54ytIyoRHXubQiPDN3sd0aJgqek2sP2dZA7a5l9XcZBWH5URZAZBdR8eqM9RsGZADoRYNRgu8TwZDZD";
const VERIFY_TOKEN = "haboo123"; // اختر أي كلمة للتحقق

// التحقق من الرابط عند إضافته في Messenger
app.get('/webhook', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error');
  }
});

// استقبال الرسائل
app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const event = entry.messaging[0];
      const senderId = event.sender.id;
      if (event.message && event.message.text) {
        const text = event.message.text;
        sendMessage(senderId, `أنت قلت: ${text}`);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// دالة إرسال الرسالة
function sendMessage(senderId, text) {
  axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    recipient: { id: senderId },
    message: { text: text }
  }).catch(err => console.error(err.response.data));
}

app.listen(3000, () => console.log('Server running'));