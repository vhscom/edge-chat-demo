import { type RefObject } from "react";
import type { ChatMessage } from "~/schemas/chat";

interface ChatMessagesProps {
    messages: ChatMessage[];
    messagesEndRef: RefObject<HTMLDivElement>;
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function ChatMessage({ message }: { message: ChatMessage }) {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="font-medium text-gray-900">{message.name}</div>
            <div className="text-gray-700 break-words">{message.message}</div>
            <div className="text-xs text-gray-500 mt-1">
                {formatTime(message.timestamp)}
            </div>
        </div>
    );
}

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
                <ChatMessage key={`${msg.timestamp}-${i}`} message={msg} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}