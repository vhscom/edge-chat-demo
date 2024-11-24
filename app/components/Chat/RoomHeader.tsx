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
                <div className="text-sm text-gray-600 flex items-center space-x-2">
                    <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>
            {userCount} user{userCount !== 1 ? 's' : ''} online
          </span>
                </div>
            </div>
            <button
                onClick={onLeave}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
                Leave Room
            </button>
        </div>
    );
}

interface RoomJoinProps {
    onJoinRoom: (roomId: string) => void;
}

export function RoomJoin({ onJoinRoom }: RoomJoinProps) {
    const handleCreatePrivateRoom = async () => {
        try {
            const response = await fetch('/api/room', { method: 'POST' });
            if (!response.ok) throw new Error('Failed to create room');
            const roomId = await response.text();
            onJoinRoom(roomId);
        } catch (err) {
            console.error('Failed to create private room:', err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
                <h2 className="text-2xl font-bold">Join a Chat Room</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const roomId = new FormData(e.currentTarget).get("roomId") as string;
                        if (roomId) onJoinRoom(roomId);
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

                <button
                    onClick={handleCreatePrivateRoom}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                    Create Private Room
                </button>
            </div>
        </div>
    );
}