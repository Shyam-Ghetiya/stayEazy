# 🔐 Environment Variables Setup Guide

This guide will help you find and configure all the environment variables needed for your StayEazy backend.

---

## 📋 **Environment Variables Needed**

### ✅ **Already Configured (Working)**

1. **PORT** - Server port (already set to 8000)
2. **MONGODB_URI** - Local MongoDB (already working)
3. **JWT_SECRET** - JWT secret key (already set)
4. **JWT_EXPIRE** - JWT expiration time (already set)
5. **FRONTEND_URL** - Frontend URL (already set)
6. **GOOGLE_CLIENT_ID** - Google OAuth (already set)

### ⚠️ **Need Configuration**

1. **EMAIL_USER** - Gmail for sending emails
2. **EMAIL_PASS** - Gmail App Password
3. **CLOUDINARY_CLOUD_NAME** - For image uploads
4. **CLOUDINARY_API_KEY** - Cloudinary API key
5. **CLOUDINARY_API_SECRET** - Cloudinary API secret
6. **GOOGLE_CLIENT_SECRET** - Google OAuth secret (optional)
7. **ACCESS_TOKEN_SECRET** - Additional JWT secret (if needed)

---

## 📧 **1. EMAIL Configuration (Gmail)**

### **What it's used for:**
- Sending OTP for user registration
- Sending booking confirmation emails
- Password reset emails

### **How to get it:**

#### **Step 1: Use Your Gmail Account**
```
EMAIL_USER=your_email@gmail.com
```

#### **Step 2: Generate App Password**

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/

2. **Enable 2-Step Verification:**
   - Go to: Security → 2-Step Verification
   - Follow the steps to enable it

3. **Generate App Password:**
   - Go to: Security → 2-Step Verification → App passwords
   - Or direct link: https://myaccount.google.com/apppasswords
   
4. **Create App Password:**
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "StayEazy Backend"
   - Click "Generate"
   
5. **Copy the 16-character password:**
   ```
   Example: abcd efgh ijkl mnop
   ```
   
6. **Remove spaces and use in .env:**
   ```
   EMAIL_PASS=abcdefghijklmnop
   ```

### **Current Status:**
Your code has hardcoded email credentials:
```javascript
user: 'shyamdummy10@gmail.com',
pass: 'bfzodqaskcnrgiyr'
```

**⚠️ IMPORTANT:** You should update the code to use environment variables instead!

---

## ☁️ **2. CLOUDINARY Configuration**

### **What it's used for:**
- Uploading hotel images
- Storing user profile pictures
- Managing all image assets

### **How to get it:**

#### **Step 1: Create Cloudinary Account**
1. Go to: https://cloudinary.com/
2. Click "Sign Up" (Free account available)
3. Fill in your details and verify email

#### **Step 2: Get Your Credentials**
1. After login, go to Dashboard
2. You'll see your credentials:

```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

#### **Step 3: Add to .env:**
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### **Free Tier Limits:**
- 25 GB storage
- 25 GB bandwidth/month
- Perfect for development and small projects

---

## 🔑 **3. JWT_SECRET & ACCESS_TOKEN_SECRET**

### **What it's used for:**
- Securing user authentication tokens
- Protecting API endpoints

### **How to generate:**

#### **Option 1: Using Node.js (Recommended)**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### **Option 2: Using OpenSSL**
```bash
openssl rand -hex 64
```

#### **Option 3: Online Generator**
- Visit: https://randomkeygen.com/
- Use "CodeIgniter Encryption Keys" section

### **Add to .env:**
```
JWT_SECRET=your_generated_secret_key_here
ACCESS_TOKEN_SECRET=another_generated_secret_key_here
```

**Note:** Make them different and long (at least 32 characters)

---

## 🔐 **4. GOOGLE OAuth (Optional)**

### **What it's used for:**
- Google Sign-In functionality
- Quick user registration

### **How to get it:**

#### **Step 1: Go to Google Cloud Console**
1. Visit: https://console.cloud.google.com/
2. Create a new project or select existing one

#### **Step 2: Enable Google+ API**
1. Go to: APIs & Services → Library
2. Search for "Google+ API"
3. Click "Enable"

#### **Step 3: Create OAuth Credentials**
1. Go to: APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized origins:
   ```
   http://localhost:5173
   http://localhost:8000
   ```
5. Add authorized redirect URIs:
   ```
   http://localhost:5173
   http://localhost:8000/api/v1/user/google-signin
   ```

#### **Step 4: Copy Credentials**
```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

**Note:** You already have GOOGLE_CLIENT_ID configured!

---

## 🗄️ **5. MONGODB_URI (Already Working)**

### **Current Setup:**
```
MONGODB_URI=mongodb://localhost:27017/stayeazy
```

### **Alternative: MongoDB Atlas (Cloud)**

If you want to use cloud database:

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Sign up for free

2. **Create Cluster:**
   - Choose "Free Shared" tier
   - Select region closest to you
   - Click "Create Cluster"

3. **Setup Database Access:**
   - Go to: Database Access
   - Add new database user
   - Set username and password
   - Give "Read and write to any database" permission

4. **Setup Network Access:**
   - Go to: Network Access
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Or add your specific IP

5. **Get Connection String:**
   - Go to: Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/stayeazy
   ```

6. **Replace in .env:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stayeazy
   ```

---

## 📝 **Complete .env File Example**

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/stayeazy
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stayeazy

# JWT Configuration
JWT_SECRET=your_long_random_secret_key_here_at_least_32_characters
JWT_EXPIRE=7d
ACCESS_TOKEN_SECRET=another_long_random_secret_key_different_from_jwt

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz

# Google OAuth
GOOGLE_CLIENT_ID=312868104346-5s6cqltb36i50uckprvsfrcv130n1mmf.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

---

## 🚀 **Quick Start (Minimum Required)**

To get your app running quickly, you only need:

### **Essential (Must Have):**
1. ✅ PORT (already set)
2. ✅ MONGODB_URI (already working)
3. ✅ JWT_SECRET (already set)

### **For Full Functionality:**
4. **EMAIL_USER & EMAIL_PASS** - For OTP and booking emails
5. **CLOUDINARY credentials** - For image uploads

### **Optional (Can Skip for Now):**
6. GOOGLE_CLIENT_SECRET - Only if using Google Sign-In
7. ACCESS_TOKEN_SECRET - Only if your code uses it

---

## 🔧 **Testing Your Configuration**

After setting up, test each feature:

1. **Database:** Check if server connects to MongoDB
2. **Email:** Try user registration (OTP should be sent)
3. **Cloudinary:** Try uploading hotel images
4. **Google OAuth:** Try Google Sign-In

---

## ⚠️ **Security Tips**

1. **Never commit .env file to Git** (already in .gitignore)
2. **Use different secrets for production**
3. **Rotate secrets regularly**
4. **Use strong, random passwords**
5. **Keep App Passwords secure**

---

## 📞 **Need Help?**

If you get stuck:
1. Check the error messages in terminal
2. Verify each credential is correct
3. Make sure no extra spaces in .env values
4. Restart the server after changing .env

---

## 🎯 **Priority Order**

Set up in this order:

1. **First:** JWT_SECRET (generate a strong one)
2. **Second:** EMAIL credentials (for user registration)
3. **Third:** CLOUDINARY (for image uploads)
4. **Last:** GOOGLE_CLIENT_SECRET (optional)

---

**Good luck! 🚀**
