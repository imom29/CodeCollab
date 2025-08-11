# Code Collab

A real-time collaborative code editor with AI assistance, built with React, TypeScript, and Socket.IO. Create rooms, code together, execute code, and get AI-powered suggestions for your projects.

## Features

- **Real-time Collaboration**: Multiple developers can edit code simultaneously in shared rooms
- **Multi-file Support**: Create, edit, and delete files within your collaborative workspace
- **Code Execution**: Run code directly in the browser using the Piston API
- **AI Code Assistant**: Get intelligent code suggestions and help with debugging
- **Multiple Language Support**: JavaScript, Python, Java, C++, and more
- **Monaco Editor**: Full-featured code editor with syntax highlighting and IntelliSense
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Monaco Editor** for code editing
- **Material-UI** for UI components
- **TailwindCSS** for styling
- **Socket.IO Client** for real-time communication
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Socket.IO** for real-time collaboration
- **Google Generative AI** for code assistance
- **Axios** for HTTP requests

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd code-collab
```

2. Install frontend dependencies:
```bash
npm install
# or
bun install
```

3. Install server dependencies:
```bash
cd server
npm install
# or
bun install
```

4. Set up environment variables:

Create `.env` in the root directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Create `server/.env`:
```env
PORT=4000
GOOGLE_API_KEY=your_google_ai_api_key
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
# or
bun start
```

2. Start the frontend development server:
```bash
npm run dev
# or
bun run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Create or Join a Room**: Enter a room ID on the homepage to create or join a collaborative session
2. **Add Files**: Click "Add File" to create new files with different extensions
3. **Code Together**: Start coding - changes are synchronized in real-time across all participants
4. **Execute Code**: Click "Run code" to execute your code and see output in the console
5. **Get AI Help**: Use the chat panel to ask questions about your code and get AI-powered suggestions

## Supported Languages

- JavaScript (.js)
- TypeScript (.ts)
- Python (.py)
- Java (.java)
- C++ (.cpp)
- C (.c)
- Go (.go)
- Rust (.rs)
- And many more...

## Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linting
npm run format       # Format code with Biome
npm run preview      # Preview production build
```

### Backend
```bash
npm start            # Start server with nodemon
npm run build        # Run server in production mode
```

## Deployment

The application is configured for deployment on:

- **Frontend**: Netlify or Vercel (configuration files included)
- **Backend**: Any Node.js hosting platform

### Environment Variables for Production

Make sure to set the following environment variables:

- `VITE_BACKEND_URL`: Your backend server URL
- `GOOGLE_API_KEY`: Google Generative AI API key
- `PORT`: Server port (default: 4000)

## Architecture

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── Chatbot/       # AI chat functionality
│   ├── utils/         # Utility functions
│   └── assets/        # Static assets
├── server/
│   ├── helpers/       # Server utilities
│   └── index.js       # Main server file
└── public/            # Static files
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
