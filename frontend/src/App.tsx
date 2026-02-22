import './App.css'
import type {AppDispatch, RootState} from "./app/store.ts";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {fetchMessages, sendMessage} from "./features/messages/messagesSlice.ts";
import { Box, Button, TextField, Paper, Typography, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    const messages = useSelector((state: RootState) => state.messages.items);
    const loading = useSelector((state: RootState) => state.messages.loading);

    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        dispatch(fetchMessages());
        const interval = setInterval(() => {
            dispatch(fetchMessages());
        }, 5000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleSend = async () => {
        if (!author.trim() || !message.trim()) return;
        await dispatch(sendMessage({ author, message }));
        setMessage('');
    };

    return (
        <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <TextField
                    label="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Button variant="contained" onClick={handleSend} disabled={loading}>
                    Send
                </Button>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                [...messages].reverse().map((msg) => (
                    <Paper key={msg.id} sx={{ padding: 1, marginBottom: 1 }}>
                        <Typography variant="subtitle2">{msg.author}</Typography>
                        <Typography>{msg.message}</Typography>
                        <Typography variant="caption">
                            {dayjs(msg.dateTime).format('DD.MM.YYYY HH:mm')}
                        </Typography>
                    </Paper>
                ))
            )}
        </Box>
    );
};

export default App;