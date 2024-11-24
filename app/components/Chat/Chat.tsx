import { useState, useCallback } from "react";
import { ChatRoom } from "./ChatRoom";
import { RoomJoin } from "./RoomJoin";

export function Chat() {
    const [roomId, setRoomId] = useState<string | null>(null);

    const handleJoinRoom = useCallback((id: string) => {
        setRoomId(id);
    }, []);

    const handleLeaveRoom = useCallback(() => {
        setRoomId(null);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {!roomId ? (
                <RoomJoin onJoinRoom={handleJoinRoom} />
            ) : (
                <ChatRoom
                    roomId={roomId}
                    onLeave={handleLeaveRoom}
                />
            )}
        </div>
    );
}