const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = 8000;
const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

const loadMessages = () => {
    if (!fs.existsSync(dbPath)) return [];
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch {
        return [];
    }
};

app.post('/messages', (req, res) => {
    const { author, message } = req.body;

    if (!author || !message || author.trim() === '' || message.trim() === '') {
        return res.status(400).json({ error: 'Author and message must be present in the request' });
    }

    const messages = loadMessages();

    const newMessage = {
        id: crypto.randomUUID(),
        author,
        message,
        dateTime: new Date().toISOString()
    };

    messages.push(newMessage);
    fs.writeFileSync(dbPath, JSON.stringify(messages, null, 2));

    res.status(201).json(newMessage);
});

app.get('/messages', (req, res) => {
    const messages = loadMessages();
    const { datetime } = req.query;

    if (datetime) {
        const date = new Date(datetime);

        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid datetime format' });
        }

        const filtered = messages.filter(msg =>
            new Date(msg.dateTime) > date
        );

        return res.json(filtered);
    }

    const last30 = messages.slice(-30);
    res.json(last30);
});

app.get('/', (_req, res) => {
    res.send('API is running');
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});