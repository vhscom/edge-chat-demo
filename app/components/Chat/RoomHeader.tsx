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