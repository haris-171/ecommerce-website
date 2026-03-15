# ecommerce-website

Full-stack MERN e-commerce app with a React frontend and a Node/Express backend.

**Structure**
- `frontend` React app
- `backend` Express API + MongoDB

**Prerequisites**
- Node.js 18+ (20 recommended)
- MongoDB connection string

**Setup**
1. Backend
Create `backend/.env` with:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=5000
```
Then run:
```
cd backend
npm install
npm run dev
```

2. Frontend
```
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000` and expects the API at `http://localhost:5000`.

**Scripts**
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm start`, `npm run build`
