import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage } from "~/types/chat";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { RoomHeader } from "./RoomHeader";

interface ChatRoomProps {
    roomId: string;
    onLeave: () => void;
}

export function ChatRoom({ roomId, onLeave }: ChatRoomProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [users, setUsers] = useState<Set<string>>(new Set());
    const [connected, setConnected] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    useEffect(() => {
        const ws = new WebSocket(
            `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/room/${roomId}/websocket`
        );

        socketRef.current = ws;

        ws.addEventListener("open", () => {
            setConnected(true);
        });

        ws.addEventListener("close", () => {
            setConnected(false);
        });

        ws.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if ("error" in data) {
                console.error("WebSocket error:", data.error);
                return;
            }

            if ("joined" in data) {
                setUsers(prev => new Set([...prev, data.joined]));
                return;
            }

            if ("quit" in data) {
                setUsers(prev => {
                    const next = new Set(prev);
                    next.delete(data.quit);
                    return next;
                });
                return;
            }

            if ("ready" in data) {
                console.log("WebSocket ready");
                return;
            }

            // Regular chat message
            setMessages(prev => [...prev, data as ChatMessage]);
        });

        return () => {
            ws.close();
        };
    }, [roomId]);

    const handleSendMessage = useCallback((message: string) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        socketRef.current.send(JSON.stringify({ message }));
    }, []);

    const handleSetName = useCallback((name: string) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        socketRef.current.send(JSON.stringify({ name }));
        setUserName(name);
    }, []);

    if (!userName) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Enter your name</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const name = new FormData(e.currentTarget).get("name") as string;
                            if (name) handleSetName(name);
                        }}
                        className="space-y-4"
                    >
                        <input
                            type="text"
                            name="name"
                            maxLength={32}
                            className="w-full p-2 border rounded"
                            placeholder="Your name"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Join Chat
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen">
            <RoomHeader
                roomId={roomId}
                connected={connected}
                userCount={users.size}
                onLeave={onLeave}
            />

            <ChatMessages
                messages={messages}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput
                onSendMessage={handleSendMessage}
                disabled={!connected}
            />
        </div>
    );
}