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
CLIENT_ORIGIN=http://localhost:3000
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

**Deploy (Vercel single project, same domain)**
This repo is configured to deploy both frontend and backend in one Vercel project.

1. In Vercel, import this repo and set Root Directory to the repo root.
2. Add backend environment variables in Vercel:
   `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`
3. Deploy.

The `vercel.json` at repo root builds the React app from `frontend/` and exposes the Express API as serverless functions under `/api`.

**Scripts**
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm start`, `npm run build`
