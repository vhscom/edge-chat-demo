import { useState, type FormEvent } from "react";
import * as Popover from '@radix-ui/react-popover';
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
            <div className="flex space-x-4">
                <div className="flex-1 relative">
                    {error && (
                        <Popover.Root open={!!error}>
                            <Popover.Trigger asChild>
                                <span className="absolute -top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                            </Popover.Trigger>
                            <Popover.Portal>
                                <Popover.Content
                                    className="bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-600"
                                    sideOffset={5}
                                >
                                    {error}
                                    <Popover.Arrow className="fill-red-200" />
                                </Popover.Content>
                            </Popover.Portal>
                        </Popover.Root>
                    )}
                    <input
                        type="text"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={disabled}
                        maxLength={256}
                        className="w-full p-2 border rounded disabled:bg-gray-100"
                        placeholder={disabled ? "Disconnected..." : "Type a message..."}
                    />
                </div>
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