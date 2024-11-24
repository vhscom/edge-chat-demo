# Edge Chat Demo

A real-time chat application built with Cloudflare Workers, Durable Objects, WebSockets, and Remix. This demo showcases edge computing capabilities with persistent connections and state management.

## Features

- Real-time messaging using WebSockets
- Public and private chat rooms
- Message persistence using Durable Objects
- Rate limiting to prevent spam
- User presence tracking
- Message history
- TypeScript type safety
- Zod runtime validation
- Responsive UI with Tailwind CSS

## Project Structure

```
app/
├── components/
│   └── Chat/
│       ├── index.ts
│       ├── Chat.tsx         # Main chat container
│       ├── ChatRoom.tsx     # Room management
│       ├── ChatInput.tsx    # Message input
│       ├── ChatMessages.tsx # Message display
│       ├── RoomHeader.tsx   # Room info & controls
│       └── RoomJoin.tsx     # Room joining
├── durable-objects/
│   ├── ChatRoom/
│   │   ├── index.ts
│   │   ├── ChatRoom.ts     # Chat room implementation
│   │   └── schemas.ts      # Zod schemas
│   └── RateLimiter/
│       ├── index.ts
│       ├── RateLimiter.ts  # Rate limiting logic
│       ├── client.ts       # Client implementation
│       └── schemas.ts      # Validation schemas
├── routes/
│   ├── _index.tsx          # Main chat interface
│   ├── api.room.tsx        # Room creation
│   └── api.room.$roomId.tsx # WebSocket handling
├── styles/
│   └── tailwind.css        # Tailwind imports
├── types/
│   └── chat.ts             # Shared TypeScript types
└── utils/
    ├── errors.ts           # Error handling
    └── validation.ts       # Validation utilities
```

## API Routes

### Room Creation
- `POST /api/room`
   - Creates a new private room
   - Returns: Room ID (64-character hex string)

### Room Connection
- `GET /api/room/:roomId/websocket`
   - Establishes WebSocket connection
   - Supports both public (named) and private rooms
   - Handles message routing and persistence

## WebSocket Protocol

Messages are JSON-encoded and follow these formats:

### Client → Server
```typescript
// Join room with username
{ name: string }

// Send message
{ message: string }
```

### Server → Client
```typescript
// User joined
{ joined: string }

// User left
{ quit: string }

// Chat message
{ 
  name: string,
  message: string,
  timestamp: number 
}

// Error
{ error: string }

// Ready confirmation
{ ready: true }
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

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is released under the BSD Zero Clause License (0BSD).

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

The Zero Clause BSD license is a permissive license that is even more permissive than the MIT license. It allows unlimited freedom with the software without requirements to include the copyright notice, license text, or disclaimer in either source or binary forms.

