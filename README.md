# Edge Chat Demo

A real-time chat application built with Cloudflare Workers, Durable Objects, WebSockets, and Remix. This demo showcases edge computing capabilities with persistent connections and state management.

## Features

- Real-time messaging using WebSockets
- Public and private chat rooms
- Message persistence using Durable Objects
- State management with Zustand
- Runtime validation with Zod
- Type safety with TypeScript
- Responsive UI with Tailwind CSS
- Time-based message grouping
- Relative and absolute timestamps

## Project Structure

```
app/
├── components/
│   └── Chat/
│       ├── index.ts
│       ├── Chat.tsx           # Main chat container
│       ├── ChatRoom.tsx       # Room management
│       ├── ChatInput.tsx      # Message input
│       ├── ChatMessage.tsx    # Individual message display
│       ├── ChatMessages.tsx   # Message list container
│       └── RoomHeader.tsx     # Room info & controls
├── durable-objects/
│   ├── ChatRoom/
│   │   ├── index.ts
│   │   ├── ChatRoom.ts       # Chat room implementation
│   │   └── schemas.ts        # Zod schemas
│   └── RateLimiter/
│       ├── index.ts
│       ├── RateLimiter.ts    # Rate limiting logic
│       ├── client.ts         # Client implementation
│       └── schemas.ts        # Validation schemas
├── routes/
│   ├── _index.tsx            # Main chat interface
│   ├── api.room.tsx          # Room creation
│   └── api.room.$roomId.tsx  # WebSocket handling
├── schemas/
│   └── chat.ts               # Shared Zod schemas
├── stores/
│   └── chatStore.ts          # Zustand state management
├── styles/
│   └── tailwind.css         # Tailwind imports
├── types/
│   └── chat.ts              # Shared TypeScript types
└── utils/
    ├── errors.ts            # Error handling
    ├── format.ts            # Date/time formatting
    └── validation.ts        # Validation utilities
```

## State Management

Uses Zustand for state management with selectors and actions:

```typescript
// Using store with selectors
const messages = useChatStore(state => state.messages);
const userCount = useUserCount();
const { connected, username } = useConnectionStatus();

// Actions
const { setUsername, addMessage, reset } = useChatStore();
```

## Validation

Runtime validation using Zod schemas:

```typescript
// Validate incoming messages
const message = validateOrThrow(chatMessageSchema, data);

// Safe parsing with type inference
const result = safeParse(userSchema, userData);
if (result.success) {
  const validUser = result.data;
}
```

## Utility Functions

### Time Formatting
```typescript
// Format timestamp
formatTime(timestamp)  // "3:45 PM"
formatTime(timestamp, { showDate: true })  // "Jan 24, 3:45 PM"
formatTime(timestamp, { showSeconds: true })  // "3:45:30 PM"

// Relative time
formatRelativeTime(timestamp)  // "2 minutes ago"

// Message grouping
formatMessageDate(timestamp)  // "Today", "Yesterday", or "January 24, 2024"
```

## Setup & Development

1. Install dependencies:
```bash
npm install
```

2. Configure Wrangler:
```toml
name = "edge-chat-demo"
compatibility_date = "2024-01-01"

main = "build/index.js"

[build]
command = "npm run build"
watch_dir = "app"

[durable_objects]
bindings = [
  { name = "rooms", class_name = "ChatRoom" },
  { name = "limiters", class_name = "RateLimiter" }
]

[[migrations]]
tag = "v1"
new_classes = ["ChatRoom", "RateLimiter"]
```

3. Development:
```bash
npm run dev
```

4. Production build:
```bash
npm run build
```

5. Deploy:
```bash
npm run deploy
```

## Development Notes

### Durable Objects
- ChatRoom DO manages WebSocket connections and message persistence
- RateLimiter DO provides global rate limiting across rooms
- Both support hibernation for efficient resource usage

### Room Types
- Public rooms: Use readable names (max 32 chars)
- Private rooms: Use 64-character hex IDs

### Limitations
- Message size: 256 characters
- Username length: 32 characters
- History: Last 100 messages per room
- Rate limit: One message per 5 seconds (with 20-second grace period)

## Future Improvements

- [ ] Authentication & user profiles
- [ ] File sharing
- [ ] Message formatting (markdown, emojis)
- [ ] Thread replies
- [ ] Admin features
- [ ] Message search
- [ ] Direct messages
- [ ] Room persistence configuration
- [ ] Enhanced rate limiting options
- [ ] Message reactions
- [ ] Typing indicators
- [ ] Read receipts

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is released under the [BSD Zero Clause License (0BSD)](COPYING).

```
BSD Zero Clause License (0BSD)

Copyright (C) 2024 by VHS <vhsdev@tutanota.com>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

The Zero Clause BSD license is a permissive license that allows unlimited freedom with the software without requirements to include the copyright notice, license text, or disclaimer in either source or binary forms.