import { useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
}

export function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t">
            <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={256}
                className="w-full p-2 border rounded"
                placeholder="Type a message..."
            />
        </form>
    );
}