# EduConnect — MERN Full-Stack Prototype

EduConnect is based on the uploaded Far Western University project proposal. It implements:
- Student / Professional role-based registration and login
- JWT authentication + bcrypt password hashing
- Academic resource upload, search, filtering and download
- Professional job/internship posting
- Student applications
- Social feed with posts, likes, comments
- Connection requests
- Direct messaging with Socket.IO
- Profile management
- Responsive React SPA

## Requirements
- Node.js 18+
- MongoDB local or MongoDB Atlas

## 1. Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```
Linux/macOS:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/educonnect
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

## 2. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally `http://localhost:5173`.

## Notes
Uploaded resources are stored locally in `backend/uploads`. For production, replace this with a cloud storage adapter.
