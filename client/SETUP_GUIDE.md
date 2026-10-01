# Frontend Integration Setup Guide

This document explains how to connect the login and register pages with the backend API.

## Prerequisites

- Backend server running on `http://localhost:5000`
- Backend environment properly configured with `.env` file containing `JWT_SECRET`
- MongoDB connection configured

## Frontend Configuration

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Create Environment File

Create a `.env` file in the client folder (already provided as `.env.example`):

```bash
# .env
VITE_API_URL=http://localhost:5000
```

**Note:** If your backend runs on a different port or domain, update the `VITE_API_URL` accordingly.

### 3. Run Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or another port shown in terminal)

---

## Backend Setup (Verify It's Running)

Before testing the frontend, ensure the backend is properly set up:

### 1. Backend Installation

```bash
cd server
npm install
```

### 2. Backend Environment File

Create a `.env` file in the server folder:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/inventory-db
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### 3. Start Backend Server

```bash
npm start
```

You should see: `Server is running on port 5000`

---

## API Endpoints Documentation

### Login Endpoint

**Route:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

**Note:** Provide either `email` OR `phone`, not both. At least one is required along with `password`.

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "company": "company_id",
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "1234567890",
    "role": "admin",
    "createdAt": "2024-03-31T10:00:00.000Z"
  },
  "token": "jwt_token_here",
  "company": {
    "id": "company_id",
    "company_name": "Company Name",
    "email": "company@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "plan": "pro",
    "subscription_start_date": "2024-01-01",
    "subscription_end_date": "2025-01-01"
  }
}
```

**Error Response (400/401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### Register Endpoint

**Route:** `POST /api/auth/register`

**Request Body:**
```json
{
  "company_name": "Acme Corporation",
  "name": "John Doe",
  "email": "john@acme.com",
  "phone": "+1-555-0123",
  "password": "SecurePass123",
  "address": "123 Business St, City, State 12345",
  "role": "admin"
}
```

**Required Fields:**
- `company_name` - Company name (required)
- `name` - User's full name (required)
- `email` - Company email (required, must be unique)
- `phone` - Company phone (required, must be unique)
- `password` - Minimum 6 characters (required)
- `address` - Company address (required)
- `role` - Optional (defaults to 'admin' for first user)

**Success Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "company": "company_id",
    "name": "John Doe",
    "email": "john@acme.com",
    "phone": "+1-555-0123",
    "role": "admin",
    "createdAt": "2024-03-31T10:00:00.000Z"
  },
  "token": "jwt_token_here",
  "company": {
    "id": "company_id",
    "company_name": "Acme Corporation",
    "email": "john@acme.com",
    "phone": "+1-555-0123",
    "address": "123 Business St, City, State 12345",
    "plan": "",
    "subscription_start_date": null,
    "subscription_end_date": null
  }
}
```

**Error Responses:**

```json
{
  "message": "All Fields are required"
}
```

```json
{
  "message": "Password must be at least 6 characters long"
}
```

```json
{
  "message": "Email already exists"
}
```

---

## Frontend Authentication Flow

### 1. Registration Flow

1. User fills the signup form with all required fields
2. Form validates all fields before submission
3. If validation fails, error messages display on respective fields
4. On submit, `registerUser()` function is called with form data
5. API response stores:
   - JWT token in localStorage
   - User data in localStorage
   - Company data in localStorage
6. User is redirected to `/dashboard`
7. Sidebar displays logged-in user info

### 2. Login Flow

1. User enters email/phone and password on login page
2. Form validates required fields
3. On submit, `loginUser()` function detects if input is email or phone
4. API request sent with appropriate credentials
5. Success response stores auth data in localStorage
6. User is redirected to `/dashboard`
7. Sidebar displays logged-in user info

### 3. Authentication State Management

The `AuthService` object in `api.js` handles:

```javascript
// Store/retrieve token
AuthService.setToken(token)
AuthService.getToken()

// Store/retrieve user data
AuthService.setUser(user)
AuthService.getUser()

// Store/retrieve company data
AuthService.setCompany(company)
AuthService.getCompany()

// Check if logged in
AuthService.isAuthenticated()

// Clear on logout
AuthService.clearAuth()
```

---

## Testing the Integration

### Test Login

1. Start backend server: `npm start` (in server folder)
2. Start frontend: `npm run dev` (in client folder)
3. Navigate to `http://localhost:5173/login`
4. Enter credentials:
   - Email: `john@acme.com`
   - Password: `SecurePass123`
5. Click "Authorize Access"
6. You should be redirected to dashboard

### Test Registration

1. Navigate to `http://localhost:5173/register`
2. Fill all fields with new data
3. Click "Register Account"
4. Upon success, you'll be redirected to dashboard with auth data stored

### Test Logout

1. Click the logout button in sidebar
2. Auth data will be cleared
3. User will be redirected to login page

---

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/login"

**Solution:** 
- Ensure backend server is running on port 5000
- Check `VITE_API_URL` in `.env` file
- Verify backend has auth routes configured

### Issue: "Invalid JWT_SECRET" error

**Solution:**
- Ensure backend `.env` has `JWT_SECRET` set
- Restart backend server after updating `.env`

### Issue: CORS errors in browser console

**Solution:**
- Backend should have CORS middleware enabled (if not on same domain)
- Check backend configuration for CORS settings

### Issue: Email/Phone already exists error

**Solution:**
- Use different email/phone for registration
- Or delete existing user from MongoDB and try again

---

## Frontend Authentication Files

### Key Files Modified:

1. **client/src/api.js**
   - Contains `loginUser()` function
   - Contains `registerUser()` function
   - Contains `AuthService` object for auth state management

2. **client/src/components/auth/LoginForm.jsx**
   - Handles login form submission
   - Displays error messages
   - Redirects on successful login

3. **client/src/components/auth/SignupForm.jsx**
   - Handles signup form with all required fields
   - Validates each field
   - Shows field-specific errors
   - Handles registration submission

4. **client/src/components/dashboard/Sidebar.jsx**
   - Displays logged-in user info
   - Shows logout button
   - Navigation based on current route

5. **client/.env**
   - API base URL configuration

---

## Next Steps

After successful login/registration integration:

1. Create protected routes to prevent unauthorized access
2. Add token refresh functionality for long sessions
3. Implement password reset feature
4. Add additional API integrations for Dashboard, Products, Categories, etc.
5. Add user profile management page

---

## Support

For issues or questions, please check:
- Backend error logs for API errors
- Browser console for frontend errors
- Network tab in DevTools to inspect API requests/responses
