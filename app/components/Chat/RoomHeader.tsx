import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';

interface RoomHeaderProps {
    roomId: string;
    connected: boolean;
    userCount: number;
    onLeave: () => void;
}

export function RoomHeader({
                               roomId,
                               connected,
                               userCount,
                               onLeave
                           }: RoomHeaderProps) {
    return (
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">Room: {roomId}</h1>
                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div className="text-sm text-gray-600 flex items-center space-x-2">
                                <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span>
                  {userCount} user{userCount !== 1 ? 's' : ''} online
                </span>
                            </div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                            <Tooltip.Content
                                className="bg-gray-800 text-white text-sm rounded px-2 py-1"
                                sideOffset={5}
                            >
                                {connected ? 'Connected' : 'Disconnected'}
                                <Tooltip.Arrow className="fill-gray-800" />
                            </Tooltip.Content>
                        </Tooltip.Portal>
                    </Tooltip.Root>
                </Tooltip.Provider>
            </div>

            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <button
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                    >
                        Leave Room
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md w-full">
                        <Dialog.Title className="text-lg font-bold">
                            Leave Room?
                        </Dialog.Title>
                        <Dialog.Description className="mt-2 text-gray-600">
                            Are you sure you want to leave this chat room? Your message history will be lost.
                        </Dialog.Description>
                        <div className="mt-6 flex justify-end space-x-4">
                            <Dialog.Close asChild>
                                <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <button
                                    onClick={onLeave}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Leave Room
                                </button>
                            </Dialog.Close>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </div>
    );
}