import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type Message = {
    name: string;
    message: string;
    timestamp: number;
};

interface ChatState {
    messages: Message[];
    users: Set<string>;
    connected: boolean;
    username: string | null;
    roomId: string | null;

    // Selectors
    getRecentMessages: (count: number) => Message[];
    getMessagesByUser: (username: string) => Message[];
    getUserCount: () => number;
    isUserOnline: (username: string) => boolean;
    getConnectionStatus: () => { connected: boolean; username: string | null; roomId: string | null };

    // Actions
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setUsers: (users: Set<string>) => void;
    addUser: (username: string) => void;
    removeUser: (username: string) => void;
    setConnected: (isConnected: boolean) => void;
    setUsername: (username: string | null) => void;
    setRoomId: (roomId: string | null) => void;
    reset: () => void;
}

const initialState = {
    messages: [],
    users: new Set<string>(),
    connected: false,
    username: null,
    roomId: null,
};

export const useChatStore = create<ChatState>()(
    devtools(
        (set, get) => ({
            ...initialState,

            // Selectors
            /**
             * Get the most recent messages
             * @example
             * ```tsx
             * // Get last 10 messages
             * const recentMessages = useChatStore(state => state.getRecentMessages(10));
             *
             * // Display in component
             * return (
             *   <div>
             *     {recentMessages.map(msg => (
             *       <div key={msg.timestamp}>{msg.message}</div>
             *     ))}
             *   </div>
             * );
             * ```
             */
            getRecentMessages: (count: number) => {
                const state = get();
                return [...state.messages].slice(-count);
            },

            /**
             * Get all messages from a specific user
             * @example
             * ```tsx
             * // Get all messages from "john"
             * const johnsMessages = useChatStore(state => state.getMessagesByUser("john"));
             *
             * // Count messages from current user
             * const myMessages = useChatStore(state => {
             *   const username = state.username;
             *   return username ? state.getMessagesByUser(username).length : 0;
             * });
             * ```
             */
            getMessagesByUser: (username: string) => {
                const state = get();
                return state.messages.filter(msg => msg.name === username);
            },

            /**
             * Get the current number of online users
             * @example
             * ```tsx
             * // Simple user count
             * const userCount = useChatStore(state => state.getUserCount());
             *
             * // In a header component
             * return <div>{userCount} users online</div>;
             * ```
             */
            getUserCount: () => {
                const state = get();
                return state.users.size;
            },

            /**
             * Check if a specific user is online
             * @example
             * ```tsx
             * // Check if specific user is online
             * const isJohnOnline = useChatStore(state => state.isUserOnline("john"));
             *
             * // With username from props
             * function UserStatus({ username }: { username: string }) {
             *   const isOnline = useChatStore(state => state.isUserOnline(username));
             *   return <span className={isOnline ? "text-green-500" : "text-gray-500"}>
             *     ●
             *   </span>;
             * }
             * ```
             */
            isUserOnline: (username: string) => {
                const state = get();
                return state.users.has(username);
            },

            /**
             * Get all connection-related state
             * @example
             * ```tsx
             * // Get all connection info
             * const { connected, username, roomId } = useChatStore(state =>
             *   state.getConnectionStatus()
             * );
             *
             * // In a header component
             * return (
             *   <div>
             *     <span>{connected ? "Connected" : "Disconnected"}</span>
             *     {username && <span>Logged in as {username}</span>}
             *     {roomId && <span>Room: {roomId}</span>}
             *   </div>
             * );
             * ```
             */
            getConnectionStatus: () => {
                const state = get();
                return {
                    connected: state.connected,
                    username: state.username,
                    roomId: state.roomId,
                };
            },

            // Actions remain the same...
            setMessages: (messages) => set({ messages }),
            addMessage: (message) =>
                set((state) => ({
                    messages: [...state.messages, message],
                })),
            setUsers: (users) => set({ users }),
            addUser: (username) =>
                set((state) => ({
                    users: new Set([...state.users, username]),
                })),
            removeUser: (username) =>
                set((state) => {
                    const newUsers = new Set(state.users);
                    newUsers.delete(username);
                    return { users: newUsers };
                }),
            setConnected: (isConnected) => set({ connected: isConnected }),
            setUsername: (username) => set({ username }),
            setRoomId: (roomId) => set({ roomId }),
            reset: () => set(initialState),
        }),
        { name: 'chat-store' }
    )
);

/**
 * Hook to get recent messages
 * @example
 * ```tsx
 * function RecentMessages() {
 *   const messages = useRecentMessages(10);
 *   return <MessageList messages={messages} />;
 * }
 * ```
 */
export const useRecentMessages = (count: number) =>
    useChatStore(state => state.getRecentMessages(count));

/**
 * Hook to get messages from a specific user
 * @example
 * ```tsx
 * function UserMessages({ username }: { username: string }) {
 *   const messages = useUserMessages(username);
 *   return <MessageList messages={messages} />;
 * }
 * ```
 */
export const useUserMessages = (username: string) =>
    useChatStore(state => state.getMessagesByUser(username));

/**
 * Hook to get current user count
 * @example
 * ```tsx
 * function UserCounter() {
 *   const count = useUserCount();
 *   return <span>{count} online</span>;
 * }
 * ```
 */
export const useUserCount = () =>
    useChatStore(state => state.getUserCount());

/**
 * Hook to get connection status
 * @example
 * ```tsx
 * function ConnectionStatus() {
 *   const { connected, username } = useConnectionStatus();
 *   return (
 *     <div>
 *       {connected ? "●" : "○"} {username}
 *     </div>
 *   );
 * }
 * ```
 */
export const useConnectionStatus = () =>
    useChatStore(state => state.getConnectionStatus());

// Direct state selectors with TypeScript support
export const selectMessages = (state: ChatState) => state.messages;
export const selectUsers = (state: ChatState) => state.users;
export const selectConnected = (state: ChatState) => state.connected;
export const selectUsername = (state: ChatState) => state.username;
export const selectRoomId = (state: ChatState) => state.roomId;