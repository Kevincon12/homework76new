import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Message {
    id: string;
    author: string;
    message: string;
    dateTime: string;
}

interface MessagesState {
    items: Message[];
    loading: boolean;
    error: boolean;
}

const initialState: MessagesState = {
    items: [],
    loading: false,
    error: false,
};

export const fetchMessages = createAsyncThunk(
    'messages/fetch',
    async () => {
        const response = await axios.get<Message[]>('http://localhost:8000/messages');
        return response.data;
    }
);

export const sendMessage = createAsyncThunk(
    'messages/send',
    async (messageData: { author: string; message: string }) => {
        const response = await axios.post<Message>(
            'http://localhost:8000/messages',
            messageData
        );
        return response.data;
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMessages.rejected, (state) => {
                state.loading = false;
                state.error = true;
            })
            .addCase(sendMessage.pending, (state) => {
                state.error = false;
            })
            .addCase(sendMessage.rejected, (state) => {
                state.error = true;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default messagesSlice.reducer;