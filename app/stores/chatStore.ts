import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ChatMessage } from '~/types/chat';

interface ChatState {
    messages: ChatMessage[];
    users: Set<string>;
    connected: boolean;
    username: string | null;
    roomId: string | null;
    // Actions
    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    setUsers: (users: Set<string>) => void;
    addUser: (username: string) => void;
    removeUser: (username: string) => void;
    setConnected: (isConnected: boolean) => void;
    setUsername: (username: string | null) => void;
    setRoomId: (roomId: string | null) => void;
    reset: () => void;
}

const initialState = {
    messages: [],
    users: new Set<string>(),
    connected: false,
    username: null,
    roomId: null,
};

export const useChatStore = create<ChatState>()(
    devtools(
        (set) => ({
            ...initialState,

            setMessages: (messages) => set({ messages }),

            addMessage: (message) =>
                set((state) => ({
                    messages: [...state.messages, message],
                })),

            setUsers: (users) => set({ users }),

            addUser: (username) =>
                set((state) => ({
                    users: new Set([...state.users, username]),
                })),

            removeUser: (username) =>
                set((state) => {
                    const newUsers = new Set(state.users);
                    newUsers.delete(username);
                    return { users: newUsers };
                }),

            setConnected: (isConnected) => set({ connected: isConnected }),

            setUsername: (username) => set({ username }),

            setRoomId: (roomId) => set({ roomId }),

            reset: () => set(initialState),
        }),
        { name: 'chat-store' }
    )
);