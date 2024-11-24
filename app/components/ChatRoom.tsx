import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";
import type { ChatMessage } from "~/types/chat";

export function ChatRoom() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const { roomId } = useParams();

    useEffect(() => {
        if (!roomId) return;

        const ws = new WebSocket(
            `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/room/${roomId}/websocket`
        );

        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data) as ChatMessage;
            setMessages(prev => [...prev, data]);
        };

        return () => {
            ws.close();
        };
    }, [roomId]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                        {msg.name && <span className="font-bold">{msg.name}:</span>}
                        {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
}