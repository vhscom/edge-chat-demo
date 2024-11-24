import { type RefObject } from "react";
import type { ChatMessage } from "~/types/chat";

interface ChatMessagesProps {
    messages: ChatMessage[];
    messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
                <div key={`${msg.timestamp}-${i}`} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="font-medium text-gray-900">{msg.name}</div>
                    <div className="text-gray-700 break-words">{msg.message}</div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}