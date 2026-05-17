# JWT Token Authentication Fix

## Problem
The application was showing "Token is not valid" error when users tried to add reviews or access protected routes.

## Root Cause
Multiple authentication controllers were using **hardcoded JWT secrets** (`'your-secret-key'`) instead of the environment variable `process.env.JWT_SECRET`. This caused a mismatch:

- **Token Generation** (login): Used hardcoded secret `'your-secret-key'`
- **Token Verification** (middleware): Used `process.env.JWT_SECRET` from `.env` file
- Since the secrets didn't match, tokens couldn't be verified ❌

## Files Fixed

### 1. `/Backend_/controllers/loginhandle.js`
**Before:**
```javascript
const JWT_SECRET = 'your-secret-key';
const token = jwt.sign({ ... }, JWT_SECRET, { expiresIn: '7d' });
```

**After:**
```javascript
const token = jwt.sign({ ... }, process.env.JWT_SECRET, { expiresIn: '7d' });
```

### 2. `/Backend_/controllers/manager.controller.js`
**Before:**
```javascript
const JWT_SECRET = 'your-secret-key';
const token = jwt.sign({ hotelId: hotel._id }, JWT_SECRET, { expiresIn: '7d' });
```

**After:**
```javascript
const token = jwt.sign({ hotelId: hotel._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
```

### 3. `/Backend_/controllers/passwordResetController.js`
**Before:**
```javascript
const JWT_SECRET = 'your-secret-key';
const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
const decoded = jwt.verify(token, JWT_SECRET);
```

**After:**
```javascript
const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 4. `/Backend_/.env`
Added `ACCESS_TOKEN_SECRET` for the alternative auth middleware:
```env
JWT_SECRET=stayeazy_secret_key_2024_change_this_in_production
ACCESS_TOKEN_SECRET=stayeazy_secret_key_2024_change_this_in_production
```

## How It Works Now

1. **User Login** → Backend generates JWT token using `process.env.JWT_SECRET`
2. **Frontend** → Stores token in localStorage
3. **Protected Request** (e.g., add review) → Frontend sends token in Authorization header
4. **Backend Middleware** → Verifies token using `process.env.JWT_SECRET` ✅
5. **Request Processed** → User can add reviews, book hotels, etc.

## Testing the Fix

### Step 1: Restart Backend Server
```bash
cd Backend_
npm start
```

### Step 2: Login Again
- Go to frontend (http://localhost:5173)
- Login with your credentials
- A new token will be generated with the correct secret

### Step 3: Test Protected Routes
- Try adding a review to a hotel
- Try booking a hotel
- Try accessing your profile

All should work without "Token is not valid" error! ✅

## Important Notes

⚠️ **Users must login again** after this fix because old tokens were generated with the wrong secret and cannot be verified.

🔒 **Security Best Practice**: In production, use a strong, randomly generated JWT secret:
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Environment Variables Used

- `JWT_SECRET` - Main JWT secret for token generation and verification
- `ACCESS_TOKEN_SECRET` - Alternative JWT secret (used by `auth.middleware.js`)
- Both are set to the same value for consistency

## Related Files
- `/Backend_/middlewares/authMiddleware.js` - Verifies JWT tokens
- `/Backend_/middlewares/auth.middleware.js` - Alternative auth middleware
- `/Backend_/routes/hotel.route.js` - Uses authMiddleware for review endpoint
