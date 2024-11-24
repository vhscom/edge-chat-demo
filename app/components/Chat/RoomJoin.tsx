import * as Dialog from '@radix-ui/react-dialog';
import { useChatStore } from "~/stores/chatStore";
import { validateOrThrow } from "~/utils/validation";
import { roomIdSchema } from "~/schemas/chat";

interface RoomJoinProps {
    onCancel?: () => void;
}

export function RoomJoin({ onCancel }: RoomJoinProps) {
    const setRoomId = useChatStore(state => state.setRoomId);

    const handleCreatePrivateRoom = async () => {
        try {
            const response = await fetch('/api/room', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to create room');
            const roomId = await response.text();
            // Validate the room ID before setting it
            const validatedId = validateOrThrow(roomIdSchema, roomId);
            setRoomId(validatedId);
        } catch (err) {
            console.error('Failed to create private room:', err);
            // Could use Radix Toast here to show error
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold">Join a Chat Room</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        try {
                            const roomId = new FormData(e.currentTarget).get("roomId") as string;
                            const validatedId = validateOrThrow(roomIdSchema, roomId);
                            setRoomId(validatedId);
                        } catch (err) {
                            console.error('Invalid room ID:', err);
                            // Could use Radix Toast here to show error
                        }
                    }}
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">
                            Public Room Name
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            maxLength={32}
                            className="w-full p-2 border rounded"
                            placeholder="Enter room name"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Join Room
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                </div>

                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <button
                            onClick={handleCreatePrivateRoom}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                        >
                            Create Private Room
                        </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full">
                            <Dialog.Title className="text-lg font-bold">
                                Creating Private Room
                            </Dialog.Title>
                            <Dialog.Description className="mt-2 text-gray-600">
                                Please wait while we create your private room...
                            </Dialog.Description>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="w-full py-2 px-4 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}