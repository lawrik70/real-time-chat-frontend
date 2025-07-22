# Chat Application Client

Angular frontend for the real-time chat application.

## Features

- User authentication (login/register)
- Room creation and joining
- Real-time messaging
- Responsive design
- Typing indicators

## Prerequisites

- Node.js 16+
- npm 8+
- Angular CLI 15+

## Installation

1. git clone https://github.com/lawrik70/real-time-chat-frontend.git
2. Navigate to client directory:
   cd real-time-chat-frontend
   npm install

## Development Server
    Run development server:
    ng serve
    Navigate to http://localhost:4200

## Key Components

WebSocketService: Handles real-time communication
AuthService: Manages user authentication
ChatService: Room and message management
LoginComponent: User authentication
RoomListComponent: Room selection interface
ChatRoomComponent: Main chat interface

## Troubleshooting

WebSocket Connection Issues
Verify CORS settings on server
Check firewall/network permissions
Ensure correct WebSocket URL
Room Creation Fails
Verify user is authenticated
Check for duplicate room names