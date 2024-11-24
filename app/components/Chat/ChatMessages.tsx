import type { RefObject } from "react";
import * as ScrollArea from '@radix-ui/react-scroll-area';
import type { ChatMessage as ChatMessageType } from "~/schemas/chat";
import { ChatMessage } from "./ChatMessage";

interface ChatMessagesProps {
    messages: ChatMessageType[];
    messagesEndRef: RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, messagesEndRef }: ChatMessagesProps) {
    return (
        <ScrollArea.Root className="flex-1 w-full">
            <ScrollArea.Viewport className="w-full h-full">
                <div className="p-4 space-y-4">
                    {messages.map((msg, i) => (
                        <ChatMessage
                            key={`${msg.timestamp}-${i}`}
                            message={msg}
                            showFullTimestamp={i === 0 || messages[i - 1]?.timestamp < msg.timestamp - 300000}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
                className="flex select-none touch-none p-0.5 bg-gray-100 transition-colors hover:bg-gray-200"
                orientation="vertical"
            >
                <ScrollArea.Thumb className="flex-1 bg-gray-300 rounded-lg relative" />
            </ScrollArea.Scrollbar>
        </ScrollArea.Root>
    );
}