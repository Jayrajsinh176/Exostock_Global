# API Quick Reference - Authentication

This file provides a quick reference for the authentication API integration with the frontend.

## Environment Setup

```bash
# .env (in client folder)
VITE_API_URL=http://localhost:5000
```

---

## Using AuthService

The `AuthService` object manages all authentication state in localStorage:

```javascript
import { AuthService } from '@/api';

// Store token after login/register
AuthService.setToken(jwtToken);

// Retrieve stored token
const token = AuthService.getToken();

// Store user data
AuthService.setUser(userData);

// Get stored user data
const user = AuthService.getUser();
// Returns: { id, company, name, email, phone, role, createdAt }

// Store company data
AuthService.setCompany(companyData);

// Get stored company data
const company = AuthService.getCompany();
// Returns: { id, company_name, email, phone, address, plan, subscription_start_date, subscription_end_date }

// Check if user is logged in
if (AuthService.isAuthenticated()) {
  // User has valid token
}

// Clear all auth data (on logout)
AuthService.clearAuth();

// Get auth header for API calls (with Bearer token)
const headers = AuthService.getAuthHeader();
// Returns: { Authorization: 'Bearer token' } or {}
```

---

## Login Function

```javascript
import { loginUser } from '@/api';

const response = await loginUser(email, phone, password);
// email: string | null
// phone: string | null
// password: string (required)
// 
// Note: Provide either email OR phone, not both
// 
// Returns: { message, user, token, company }
```

### Example Usage:

```javascript
try {
  const response = await loginUser('user@example.com', null, 'password123');
  // Token and user data are automatically stored by the function
  navigate('/dashboard');
} catch (error) {
  console.error(error.message); // "Invalid email or password"
}
```

---

## Register Function

```javascript
import { registerUser } from '@/api';

const response = await registerUser({
  company_name: 'Company Inc',
  name: 'John Doe',
  email: 'john@company.com',
  phone: '+1-555-0123',
  password: 'SecurePass123',
  address: '123 Main St, City, State'
});
// Returns: { message, user, token, company }
```

### Example Usage:

```javascript
try {
  const response = await registerUser(formData);
  // Token and user data are automatically stored
  navigate('/dashboard');
} catch (error) {
  if (error.message.includes('already exists')) {
    console.error('Email/Phone already registered');
  } else {
    console.error('Registration failed:', error.message);
  }
}
```

---

## Response Data Structure

### Login/Register Success Response:

```javascript
{
  message: "Login successful" | "Account created successfully",
  user: {
    id: string,
    company: string,
    name: string,
    email: string,
    phone: string,
    role: "admin" | "staff",
    createdAt: string
  },
  token: string, // JWT token
  company: {
    id: string,
    company_name: string,
    email: string,
    phone: string,
    address: string,
    plan: string,
    subscription_start_date: string | null,
    subscription_end_date: string | null
  }
}
```

---

## Making Authenticated API Calls

For future API calls that require authentication:

```javascript
import { AuthService } from '@/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Example: Fetch user's products
const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeader() // Adds Authorization header
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - clear auth and redirect to login
      AuthService.clearAuth();
      window.location.href = '/login';
    }
    throw new Error(data.message || 'Failed to fetch products');
  }

  return data;
};
```

---

## Error Handling Examples

### Registration Errors:

```javascript
try {
  await registerUser(formData);
} catch (error) {
  // Examples of possible error messages:
  // "All Fields are required"
  // "Password must be at least 6 characters long"
  // "Email already exists"
  // "Phone already exists"
  // "Company email already exists"
  // "Company phone already exists"
  // "Internal server error"
  
  console.error(error.message);
}
```

### Login Errors:

```javascript
try {
  await loginUser(email, phone, password);
} catch (error) {
  // Examples of possible error messages:
  // "Email or phone and password are required"
  // "Invalid email or password"
  // "Login failed"
  
  console.error(error.message);
}
```

---

## Common Implementation Patterns

### Pattern 1: Using in a React Component

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, AuthService } from '@/api';

export function MyAuthComponent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');

    try {
      await loginUser(credentials.email, credentials.phone, credentials.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // JSX here
  );
}
```

### Pattern 2: Checking Authentication Status

```javascript
import { AuthService } from '@/api';

// Check if user is logged in
if (AuthService.isAuthenticated()) {
  const user = AuthService.getUser();
  console.log(`Welcome ${user.name}!`);
  
  // Show user-specific UI
} else {
  // Redirect to login
  window.location.href = '/login';
}
```

### Pattern 3: Protected Route Component

```javascript
import { Navigate } from 'react-router-dom';
import { AuthService } from '@/api';

export function ProtectedRoute({ children }) {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage in App.jsx:
// <Route
//   path="/dashboard"
//   element={
//     <ProtectedRoute>
//       <DashboardPage />
//     </ProtectedRoute>
//   }
// />
```

### Pattern 4: Logout Implementation

```javascript
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/api';

export function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.clearAuth();
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## Frontend Validation Rules

### Email Validation:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

### Password Requirements:
- Minimum 6 characters
- Recommended: Mix of uppercase, lowercase, numbers, special characters

### Phone Validation:
- Any format accepted by backend
- Example: "+1-555-0123" or "1234567890"

---

## Data Persistence

All authentication data is stored in browser's localStorage:

```javascript
// What gets stored:
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('company', JSON.stringify(companyData));

// Persists across:
// ✓ Page refreshes
// ✓ Browser restarts (until logout)
// ✗ Clearing browser data/cache

// Cleared on:
// - User logout
// - Manual AuthService.clearAuth() call
```

---

## Best Practices

1. ✅ Always wrap API calls in try-catch blocks
2. ✅ Clear auth data on 401 Unauthorized responses
3. ✅ Show loading state during authentication
4. ✅ Display user-friendly error messages
5. ✅ Redirect to login on authentication failure
6. ✅ Check authentication status before showing protected pages
7. ✅ Use AuthService methods instead of direct localStorage access
8. ✅ Include Authorization header in all authenticated requests

---

## Troubleshooting

### Token not being stored?
- Check network tab for API response containing `token` field
- Verify backend is returning token in response
- Check browser localStorage is enabled

### Logout not working?
- Ensure `AuthService.clearAuth()` is being called
- Check localStorage is cleared after logout
- Verify redirect to login page

### Getting 401 Unauthorized?
- Token may have expired (default 7 days)
- Check token is being sent in Authorization header
- Verify JWT_SECRET matches between frontend and backend

---

## API Endpoints Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/register` | ✗ | Create new account |
| POST | `/api/auth/login` | ✗ | Login existing user |
| GET | `/api/products` | ✓ | Fetch products (future) |
| POST | `/api/products` | ✓ | Create product (future) |

---

## Files Modified for Authentication

- `client/src/api.js` - API functions and AuthService
- `client/src/components/auth/LoginForm.jsx` - Login form with backend integration
- `client/src/components/auth/SignupForm.jsx` - Register form with all required fields
- `client/src/components/dashboard/Sidebar.jsx` - Logout functionality
- `client/.env` - API base URL configuration
