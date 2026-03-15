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

**Deploy (Vercel frontend + backend elsewhere, single domain)**
1. Deploy the backend to Render/Railway/Heroku and note the public URL, for example:
   `https://your-backend.example.com`
2. Set backend env vars (including `CLIENT_ORIGIN`) to your Vercel domain, for example:
   `CLIENT_ORIGIN=https://your-frontend.vercel.app`
3. In `frontend/vercel.json`, replace `https://YOUR_BACKEND_DOMAIN` with your backend URL.
4. In Vercel, import this repo and set:
   - Root Directory: `frontend`
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`

With the rewrite, your frontend uses `/api/*` and Vercel proxies those requests to your backend, so everything works under one domain.

**Scripts**
- Backend: `npm run dev` (nodemon), `npm start`
- Frontend: `npm start`, `npm run build`
