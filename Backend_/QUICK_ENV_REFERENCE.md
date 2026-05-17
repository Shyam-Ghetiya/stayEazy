# ⚡ Quick Environment Variables Reference

## 🎯 **What You Need Right Now**

### ✅ **Already Working (No Action Needed)**
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/stayeazy
JWT_SECRET=stayeazy_secret_key_2024_change_this_in_production
EMAIL_USER=shyamdummy10@gmail.com
EMAIL_PASS=bfzodqaskcnrgiyr
GOOGLE_CLIENT_ID=312868104346-5s6cqltb36i50uckprvsfrcv130n1mmf.apps.googleusercontent.com
```

### ⚠️ **Need to Setup (For Image Uploads)**
Only needed when you want to upload hotel images:

**CLOUDINARY** - Get from: https://cloudinary.com/
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📍 **Where to Find Each Value**

| Variable | Where to Get It | Required? |
|----------|----------------|-----------|
| `PORT` | Any port number (8000 is good) | ✅ Yes |
| `MONGODB_URI` | Local: `mongodb://localhost:27017/stayeazy`<br>Cloud: MongoDB Atlas | ✅ Yes |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` | ✅ Yes |
| `EMAIL_USER` | Your Gmail address | ✅ Yes (for OTP) |
| `EMAIL_PASS` | Gmail App Password (not your Gmail password!)<br>Get from: https://myaccount.google.com/apppasswords | ✅ Yes (for OTP) |
| `CLOUDINARY_*` | Sign up at https://cloudinary.com/<br>Dashboard shows all 3 values | ⚠️ For images |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console<br>https://console.cloud.google.com/ | ❌ Optional |

---

## 🚀 **Quick Setup Steps**

### **1. Gmail App Password (5 minutes)**
```bash
1. Go to: https://myaccount.google.com/apppasswords
2. Enable 2-Step Verification (if not enabled)
3. Create App Password:
   - App: Mail
   - Device: Other (StayEazy)
4. Copy the 16-character password (remove spaces)
5. Paste in .env as EMAIL_PASS
```

### **2. Cloudinary (3 minutes)**
```bash
1. Go to: https://cloudinary.com/users/register_free
2. Sign up (free account)
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Paste all 3 in .env
```

### **3. Generate JWT Secret (30 seconds)**
```bash
# Run this in terminal:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and replace JWT_SECRET in .env
```

---

## 🔍 **How to Check if It's Working**

### **Test Email (OTP):**
```bash
1. Start your backend: npm run dev
2. Try to sign up a new user
3. Check if OTP email is received
✅ Working: Email received
❌ Not working: Check EMAIL_USER and EMAIL_PASS
```

### **Test Cloudinary (Images):**
```bash
1. Try to register a hotel with images
2. Check if images upload successfully
✅ Working: Images appear in hotel listing
❌ Not working: Check CLOUDINARY credentials
```

### **Test Database:**
```bash
1. Start backend: npm run dev
2. Look for: "MongoDB connected!! DB host : localhost"
✅ Working: Connection message appears
❌ Not working: Check if MongoDB is running
```

---

## 🆘 **Common Issues**

### **"MongoDB connection failed"**
```bash
# Check if MongoDB is running:
brew services list | grep mongodb

# If not running, start it:
brew services start mongodb-community
```

### **"Email not sending"**
```bash
# Check:
1. EMAIL_USER is correct Gmail address
2. EMAIL_PASS is App Password (not Gmail password)
3. No spaces in EMAIL_PASS
4. 2-Step Verification is enabled on Gmail
```

### **"Cloudinary upload failed"**
```bash
# Check:
1. All 3 Cloudinary variables are set
2. No typos in variable names
3. Values are from Cloudinary Dashboard
4. No extra spaces in values
```

---

## 📝 **Your Current .env Status**

```env
✅ PORT - Set to 8000
✅ MONGODB_URI - Local MongoDB configured
✅ JWT_SECRET - Set (should generate a stronger one)
✅ EMAIL_USER - Set to shyamdummy10@gmail.com
✅ EMAIL_PASS - Set (working)
✅ GOOGLE_CLIENT_ID - Set
❌ CLOUDINARY_CLOUD_NAME - Need to set
❌ CLOUDINARY_API_KEY - Need to set
❌ CLOUDINARY_API_SECRET - Need to set
⚠️ GOOGLE_CLIENT_SECRET - Optional
⚠️ ACCESS_TOKEN_SECRET - May be needed
```

---

## 🎯 **Priority Actions**

### **Do Now (If you want image uploads):**
1. Sign up for Cloudinary (free)
2. Get the 3 Cloudinary credentials
3. Add them to .env
4. Restart backend

### **Do Later (For better security):**
1. Generate a stronger JWT_SECRET
2. Get GOOGLE_CLIENT_SECRET (if using Google Sign-In)

### **Already Done:**
✅ Email configuration
✅ Database connection
✅ Server port

---

## 💡 **Pro Tips**

1. **Never share your .env file** - It contains secrets!
2. **Restart backend after changing .env** - Changes won't apply until restart
3. **No spaces around = sign** - `KEY=value` not `KEY = value`
4. **No quotes needed** - `KEY=value` not `KEY="value"`
5. **Keep .env.example updated** - For team members

---

## 📞 **Quick Links**

- Gmail App Passwords: https://myaccount.google.com/apppasswords
- Cloudinary Signup: https://cloudinary.com/users/register_free
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Google Cloud Console: https://console.cloud.google.com/

---

**Need more details? Check `ENV_SETUP_GUIDE.md` for complete instructions!**
