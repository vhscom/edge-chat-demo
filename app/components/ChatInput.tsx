import { useState, type FormEvent, type ChangeEvent } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    disabled={disabled}
                    maxLength={256}
                    className="flex-1 p-2 border rounded"
                    placeholder="Type a message..."
                />
                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
                >
                    Send
                </button>
            </div>
        </form>
    );
}