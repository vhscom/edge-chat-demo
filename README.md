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
│       ├── Chat.tsx
│       ├── ChatRoom.tsx
│       ├── ChatInput.tsx
│       ├── ChatMessages.tsx
│       └── RoomHeader.tsx
├── durable-objects/
│   ├── ChatRoom/
│   │   ├── index.ts
│   │   ├── ChatRoom.ts
│   │   └── schemas.ts
│   └── RateLimiter/
│       ├── index.ts
│       ├── RateLimiter.ts
│       ├── client.ts
│       └── schemas.ts
├── routes/
│   ├── _index.tsx
│   ├── api.room.tsx
│   └── api.room.$roomId.tsx
├── types/
│   └── chat.ts
└── utils/
    ├── errors.ts
    └── validation.ts
```

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Remix
- **State Management**: Durable Objects
- **Real-time Communication**: WebSockets
- **Type Safety**: TypeScript
- **Validation**: Zod
- **Styling**: Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Wrangler:
```toml
name = "edge-chat-demo"
compatibility_date = "2024-01-01"
send_metrics = false

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

3. Start development server:
```bash
npm run dev
```

## Development

### Components

The chat interface is built with React components:

- `Chat`: Main container component
- `ChatRoom`: Handles WebSocket connection and message state
- `ChatInput`: Message input form
- `ChatMessages`: Message display and auto-scrolling
- `RoomHeader`: Room information and controls

### Durable Objects

Two Durable Object classes manage state:

- `ChatRoom`: Manages WebSocket connections and message broadcasting
- `RateLimiter`: Implements rate limiting logic

### Type Safety

- TypeScript for static type checking
- Zod schemas for runtime validation
- Proper error handling and type guards

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Cloudflare:
```bash
wrangler deploy
```

## Architecture

The application uses:

1. **Durable Objects** for:
    - WebSocket connection management
    - Message persistence
    - Rate limiting
    - User presence tracking

2. **WebSockets** for:
    - Real-time message delivery
    - User presence updates
    - Connection status

3. **Remix** for:
    - Server-side rendering
    - API routes
    - Client-side state management

## Security

- Rate limiting to prevent spam
- Input validation using Zod
- Proper error handling
- Secure WebSocket connections

## Future Improvements

- Authentication
- File sharing
- Message formatting (markdown, emojis)
- Thread replies
- User profiles
- Admin features
- Message search
- Direct messages

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request