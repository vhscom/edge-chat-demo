import { useCallback } from "react";
import { ChatRoom } from "./ChatRoom";
import { RoomJoin } from "./RoomJoin";
import { useChatStore } from "~/stores/chatStore";

export function Chat() {
    const { roomId, reset } = useChatStore();

    const handleLeaveRoom = useCallback(() => {
        reset();
    }, [reset]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {!roomId ? (
                <RoomJoin />
            ) : (
                <ChatRoom onLeave={handleLeaveRoom} />
            )}
        </div>
    );
}