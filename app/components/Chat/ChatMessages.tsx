import { type RefObject } from "react";
import type { ChatMessage as ChatMessageType } from "~/schemas/chat";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
    messages: ChatMessageType[];
    messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
                <ChatMessage
                    key={`${msg.timestamp}-${i}`}
                    message={msg}
                    showFullTimestamp={i === 0 || messages[i - 1]?.timestamp < msg.timestamp - 300000} // Show full timestamp if first message or >5 min gap
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}