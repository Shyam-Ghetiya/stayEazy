# 🌥️ Cloudinary Setup Guide

## Quick Setup (5 minutes)

### Step 1: Sign Up for Cloudinary

1. **Go to:** https://cloudinary.com/users/register_free
2. **Fill in:**
   - Email: your_email@gmail.com
   - Password: (create a password)
   - Click "Sign Up"
3. **Verify your email**

### Step 2: Get Your Credentials

After login, you'll see your **Dashboard** with these credentials:

```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz
```

### Step 3: Add to .env File

Open: `Backend_/.env`

Update these lines:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

### Step 4: Restart Backend

The backend will auto-restart with nodemon, or you can manually restart it.

---

## 🎯 Where to Find Credentials

After signing up:

1. **Dashboard** (first page you see after login)
2. Look for "Account Details" section
3. You'll see:
   - **Cloud Name** (e.g., "dxyz123abc")
   - **API Key** (16 digits)
   - **API Secret** (click "eye" icon to reveal)

---

## 📸 What Cloudinary Does

- Stores hotel images
- Optimizes images automatically
- Provides fast CDN delivery
- Free tier: 25 GB storage + 25 GB bandwidth/month

---

## ✅ Free Tier Limits

Perfect for development:
- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ Unlimited transformations
- ✅ No credit card required

---

## 🔗 Quick Links

- Sign Up: https://cloudinary.com/users/register_free
- Dashboard: https://cloudinary.com/console
- Documentation: https://cloudinary.com/documentation

---

## 🆘 Troubleshooting

### "Invalid credentials" error
- Check if all 3 values are correct
- No extra spaces in .env file
- Cloud name is case-sensitive

### "Upload failed" error
- Verify API Key and Secret are correct
- Check internet connection
- Make sure you verified your email

---

**After setup, restart your backend and try uploading images again!**
