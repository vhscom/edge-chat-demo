import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '~/stores/chatStore';
import { validateOrThrow } from '~/utils/validation';
import {
    websocketMessageSchema,
    chatMessageSchema,
} from '~/schemas/chat';

export function useWebSocket(roomId: string) {
    const socketRef = useRef<WebSocket | null>(null);
    const {
        setConnected,
        addMessage,
        addUser,
        removeUser,
        username,
    } = useChatStore();

    const connect = useCallback(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(
            `${protocol}//${window.location.host}/api/room/${roomId}/websocket`
        );

        ws.addEventListener('open', () => {
            setConnected(true);
            if (username) {
                ws.send(JSON.stringify({ name: username }));
            }
        });

        ws.addEventListener('close', () => {
            setConnected(false);
        });

        ws.addEventListener('message', (event) => {
            try {
                const rawData = JSON.parse(event.data);
                const message = validateOrThrow(websocketMessageSchema, rawData);

                switch (message.type) {
                    case 'chat': {
                        const timestamp = message.timestamp ?? Date.now();
                        addMessage({
                            ...message,
                            timestamp,
                        });
                        break;
                    }
                    case 'join':
                        addUser(message.joined);
                        break;
                    case 'quit':
                        removeUser(message.quit);
                        break;
                    case 'error':
                        console.error('WebSocket error:', message.error);
                        break;
                    case 'system':
                        addMessage({
                            name: 'System',
                            message: message.content,
                            timestamp: message.timestamp ?? Date.now(),
                        });
                        break;
                }
            } catch (err) {
                console.error('Failed to process message:', err);
            }
        });

        socketRef.current = ws;

        return () => {
            ws.close();
            setConnected(false);
        };
    }, [roomId, username, setConnected, addMessage, addUser, removeUser]);

    useEffect(() => {
        return connect();
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !username) {
            return;
        }

        try {
            const timestamp = Date.now();
            const message = validateOrThrow(chatMessageSchema, {
                name: username,
                message: content,
                timestamp,
            });

            socketRef.current.send(JSON.stringify(message));
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }, [username]);

    return { sendMessage };
}