# CollabTask Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Docker & Docker Compose (optional, for containerized setup)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/jagannathanpraneeth-blip/CollabTask.git
cd CollabTask
```

### 2. Setup Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/collabtask
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### 3. Install Backend Dependencies
```bash
npm install
```

### 4. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 5. Setup MongoDB

**Option A: Local Installation**
```bash
mongod
```

**Option B: Docker Container**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

## Running the Application

### Development Mode

**Terminal 1 - Backend Server**
```bash
npm run dev
```
Server will run on `http://localhost:5000`

**Terminal 2 - Frontend Development Server**
```bash
cd client
npm start
```
Frontend will run on `http://localhost:3000`

### Production Mode with Docker Compose
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Building for Production

### Build Frontend
```bash
cd client
npm run build
cd ..
```

### Create Production Docker Image
```bash
docker build -t collabtask:latest .
```

## Project Structure

```
CollabTask/
├── server.js           # Express server setup
├── package.json        # Backend dependencies
├── .env.example        # Environment variables template
├── docker-compose.yml  # Docker Compose configuration
├── API.md              # API documentation
├── SETUP.md            # This file
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.js      # Main React component
│   │   ├── services/
│   │   │   └── taskService.js  # API client
│   │   └── components/
│   ├── package.json    # Frontend dependencies
│   └── Dockerfile      # Frontend Docker image
└── README.md           # Project overview
```

## API Endpoints

See [API.md](API.md) for detailed API documentation.

### Quick Reference
- GET `/api/tasks` - Get all tasks
- GET `/api/tasks/:id` - Get specific task
- POST `/api/tasks` - Create new task
- PUT `/api/tasks/:id` - Update task
- DELETE `/api/tasks/:id` - Delete task

## WebSocket Events

- `task:created` - Task created in real-time
- `task:updated` - Task updated in real-time
- `task:deleted` - Task deleted in real-time

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check MONGODB_URI in .env file
- Verify MongoDB port (default: 27017)

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Or change PORT in .env file
```

### CORS Errors
- Verify CORS_ORIGIN in .env matches your frontend URL
- Default frontend URL: http://localhost:3000

## Performance Tips

1. Use connection pooling for MongoDB
2. Enable compression middleware
3. Implement caching strategies
4. Use load balancing for production
5. Monitor WebSocket connections

## Security Considerations

1. Change JWT_SECRET in production
2. Use HTTPS in production
3. Implement rate limiting
4. Validate and sanitize inputs
5. Use environment variables for sensitive data
6. Regular security audits

## Support

For issues and support, please visit the [GitHub Issues](https://github.com/jagannathanpraneeth-blip/CollabTask/issues) page.
