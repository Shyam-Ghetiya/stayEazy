# 🚀 How to Run StayEazy Project

## Prerequisites
- Node.js installed (v16 or higher)
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

---

## 📦 Step 1: Install Dependencies

### Backend
```bash
cd Backend_
npm install
```

### Frontend
```bash
cd Frontend
npm install
```

---

## ⚙️ Step 2: Configure Environment Variables

### Backend Configuration

1. Go to the `Backend_` folder
2. Create a `.env` file (copy from `.env.example`)
3. Fill in your configuration:

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stayeazy

# JWT Configuration
JWT_SECRET=your_secret_key_here_make_it_long_and_random
JWT_EXPIRE=7d

# Email Configuration (for password reset, etc.)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration

1. Go to `Frontend/src/config.js`
2. Update the `BACKEND_ID` to point to your local backend:

```javascript
const config = {
    BACKEND_ID : "http://localhost:8000",  // Change this to your local backend
    GOOGLE_CLIENT_ID : "your_google_client_id",
};
```

---

## 🗄️ Step 3: Setup MongoDB

### Option A: Local MongoDB
1. Install MongoDB on your Mac:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. Start MongoDB:
   ```bash
   brew services start mongodb-community
   ```

3. Use this in your `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/stayeazy
   ```

### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Use it in your `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stayeazy
   ```

---

## ▶️ Step 4: Run the Application

### Terminal 1 - Run Backend
```bash
cd Backend_
npm run dev
```

You should see:
```
Server is running at port : 8000
MongoDB connected!! DB host : ...
```

### Terminal 2 - Run Frontend
```bash
cd Frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🌐 Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

---

## 🔧 Troubleshooting

### Backend won't start
- ✅ Check if MongoDB is running
- ✅ Check if `.env` file exists and has correct values
- ✅ Check if port 8000 is available

### Frontend won't connect to Backend
- ✅ Make sure Backend is running on port 8000
- ✅ Update `Frontend/src/config.js` to use `http://localhost:8000`
- ✅ Check browser console for CORS errors

### Database connection error
- ✅ Verify MongoDB is running: `brew services list`
- ✅ Check MONGODB_URI in `.env` file
- ✅ Try connecting with MongoDB Compass to test connection

---

## 📝 Quick Commands Reference

```bash
# Start Backend (from Backend_ folder)
npm run dev

# Start Frontend (from Frontend folder)
npm run dev

# Build Frontend for production
npm run build

# Check MongoDB status
brew services list

# Stop MongoDB
brew services stop mongodb-community
```

---

## 🎯 Next Steps

1. Create a `.env` file in `Backend_` folder
2. Update `Frontend/src/config.js` with local backend URL
3. Start MongoDB
4. Run Backend in one terminal
5. Run Frontend in another terminal
6. Open http://localhost:5173 in your browser

---

## 📧 Need Help?

If you encounter any issues:
1. Check the terminal logs for error messages
2. Verify all environment variables are set correctly
3. Make sure MongoDB is running
4. Check if ports 8000 and 5173 are available
