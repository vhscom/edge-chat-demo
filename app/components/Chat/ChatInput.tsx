import { useState, type FormEvent } from "react";
import { validate } from "~/utils/validation";
import { messageContentSchema } from "~/schemas/chat";

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (disabled || !message.trim()) return;

        try {
            const validatedMessage = validate(messageContentSchema, message);
            onSendMessage(validatedMessage);
            setMessage("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            {error && (
                <div className="mb-2 text-sm text-red-600">{error}</div>
            )}
            <div className="flex space-x-4">
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={disabled}
                    maxLength={256}
                    className="flex-1 p-2 border rounded disabled:bg-gray-100"
                    placeholder={disabled ? "Disconnected..." : "Type a message..."}
                />
                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                >
                    Send
                </button>
            </div>
        </form>
    );
}