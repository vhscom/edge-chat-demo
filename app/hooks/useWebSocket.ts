import { useEffect, useRef, useCallback } from 'react';
import { useChatStore } from '~/stores/chatStore';
import { validate } from '~/utils/validation';
import {
    websocketMessageSchema,
    chatMessageSchema,
    type WebSocketMessage
} from '~/schemas/chat';

export function useWebSocket(roomId: string) {
    const socketRef = useRef<WebSocket | null>(null);
    const {
        setConnected,
        addMessage,
        addUser,
        removeUser,
        setUsername,
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
                const message = validate(websocketMessageSchema, rawData);

                switch (message.type) {
                    case 'chat':
                        addMessage(message);
                        break;
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
                            timestamp: message.timestamp,
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
        const cleanup = connect();
        return cleanup;
    }, [connect]);

    const sendMessage = useCallback((content: string) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        try {
            const message = validate(chatMessageSchema, {
                name: username,
                message: content,
                timestamp: Date.now(),
            });

            socketRef.current.send(JSON.stringify(message));
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    }, [username]);

    return { sendMessage };
}