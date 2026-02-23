import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type {RootState} from "../../app/store.ts";

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

export const fetchMessages = createAsyncThunk<
    Message[],
    void,
    { state: RootState }
>(
    'messages/fetch',
    async (_, { getState }) => {
        const state = getState();
        const lastMessage = state.messages.items.at(-1);
        const lastDate = lastMessage?.dateTime;

        const url = lastDate
            ? `http://localhost:8000/messages?datetime=${lastDate}`
            : 'http://localhost:8000/messages';

        const response = await axios.get<Message[]>(url);
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

                const existingIds = new Set(state.items.map(m => m.id));

                const newMessages = action.payload.filter(
                    msg => !existingIds.has(msg.id)
                );

                state.items.push(...newMessages);
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