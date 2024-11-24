import { useEffect, useRef } from "react";
import { useChatStore, useConnectionStatus, useUserCount } from "~/stores/chatStore";
import { useWebSocket } from "~/hooks/useWebSocket";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { RoomHeader } from "./RoomHeader";

interface ChatRoomProps {
    onLeave: () => void;
}

export function ChatRoom({ onLeave }: ChatRoomProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messages = useChatStore(state => state.messages);
    const connectionStatus = useConnectionStatus();
    const userCount = useUserCount();
    const setUsername = useChatStore(state => state.setUsername);

    // Ensure roomId exists
    if (!connectionStatus.roomId) throw new Error("Room ID is required");

    const { sendMessage } = useWebSocket(connectionStatus.roomId);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!connectionStatus.username) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Enter your name</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const name = new FormData(e.currentTarget).get("name") as string;
                            if (name) setUsername(name);
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
                roomId={connectionStatus.roomId}
                connected={connectionStatus.connected}
                userCount={userCount}
                onLeave={onLeave}
            />

            <ChatMessages
                messages={messages}
                messagesEndRef={messagesEndRef}
            />

            <ChatInput
                onSendMessage={sendMessage}
                disabled={!connectionStatus.connected}
            />
        </div>
    );
}