import { useState, useEffect } from "react";
import { useParams } from "@remix-run/react";

export function ChatRoom() {
    const [messages, setMessages] = useState<Array<any>>([]);
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const { roomId } = useParams();

    useEffect(() => {
        if (!roomId) return;

        const ws = new WebSocket(`wss://${window.location.host}/api/room/${roomId}/websocket`);
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages(prev => [...prev, data]);
        };

        return () => {
            ws.close();
        };
    }, [roomId]);

    // ... Rest of the component implementation ...

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, i) => (
                    <div key={i} className="mb-2">
                        <span className="font-bold">{msg.name}:</span> {msg.message}
                    </div>
                ))}
            </div>
            {/* Add chat input here */}
        </div>
    );
}