import type { ChatMessage as ChatMessageType } from "~/schemas/chat";
import { formatTime, formatRelativeTime } from "~/utils/format";

interface ChatMessageProps {
    message: ChatMessageType;
    showFullTimestamp?: boolean;
}

export function ChatMessage({ message, showFullTimestamp = false }: ChatMessageProps) {
    return (
        <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="font-medium text-gray-900">{message.name}</div>
            <div className="text-gray-700 break-words">{message.message}</div>
            <div className="text-xs text-gray-500 mt-1" title={formatTime(message.timestamp, { showDate: true, showSeconds: true })}>
                {showFullTimestamp
                    ? formatTime(message.timestamp, { showDate: true })
                    : formatRelativeTime(message.timestamp)
                }
            </div>
        </div>
    );
}