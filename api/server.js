const express = require('express');
const cors = require('cors');

const app = express();
const port = 8000;

const Vigenere = require('caesar-salad').Vigenere;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running');
});

app.post('/encode', (req, res) => {
    const {password, message} = req.body;
    if (!password || !message) {
        return res.status(400).json({ error: 'Password and message required' });
    }

    const cipher = Vigenere.Cipher(password);
    const encrypted = cipher.crypt(message);

    res.json({ encoded: encrypted });
});

app.post('/decode', (req, res) => {
    const {password, message} = req.body;
    if (!password || !message) {
        return res.status(400).json({ error: 'Password and message required' });
    }

    const decipher = Vigenere.Decipher(password);
    const decrypted = decipher.crypt(message);

    res.json({ decoded: decrypted });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});