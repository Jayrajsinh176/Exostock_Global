# 📦 Inventory Management System

A comprehensive full-stack inventory management platform built with **React**, **Node.js/Express**, and **MongoDB**. This system enables companies to efficiently manage their product inventory, categories, stock levels, and user access through a modern, multi-tenant architecture.

---

## 🎯 Project Overview

**Inventory Management** is designed to solve the complexity of managing product catalogs and inventory for multiple companies. Whether you're a small business tracking a few dozen SKUs or a larger organization managing thousands of products across multiple locations, this system provides:

- **Multi-tenant architecture** - Secure isolation between different companies
- **User role management** - Admin and staff user roles with different access levels
- **Product & category management** - Full CRUD operations for organizing inventory
- **Dashboard & analytics** - Real-time KPI visualization and trend analysis
- **Reporting & exports** - Generate PDF reports and analyze inventory data
- **Authentication & security** - JWT-based authentication with secure password hashing

---

## ✨ Key Features

### Authentication & User Management
- User registration and login with JWT tokens
- Role-based access control (Admin/Staff)
- Secure password hashing with bcryptjs
- Company-scoped user isolation

### Inventory Management
- **Products** - Create, read, update, delete product entries
- **Categories** - Organize products by category with unique naming per company
- **SKU Tracking** - Product SKU management for inventory tracking
- **Stock Levels** - Real-time stock monitoring and low-stock alerts
- **Pricing** - Product pricing management

### Dashboard & Reporting
- KPI cards showing key metrics
- Inventory trend charts and visualizations
- Low-stock alerts and notifications
- Filterable analytics dashboards
- PDF export of reports

### Additional Features
- **Company Management** - Multi-tenant support with company profiles
- **Payment Integration** - Stripe integration ready for future features
- **File Uploads** - Multer support for importing inventory data
- **Email Notifications** - Nodemailer integration for alerts
- **Task Scheduling** - Node-cron for automated tasks
- **Caching** - Redis support for performance optimization

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.4 | UI library |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Styling framework |
| React Router | 7.13.2 | Client-side routing |
| React Hook Form | 7.72.0 | Form state management |
| Yup | 1.7.1 | Form validation |
| Axios | 1.13.6 | HTTP client |
| Chart.js | 4.5.1 | Data visualization |
| React Hot Toast | 2.6.0 | Toast notifications |
| jsPDF | 4.2.1 | PDF export |
| ESLint | 9.39.4 | Code linting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | Latest LTS | Runtime |
| Express | 5.2.1 | Web framework |
| MongoDB | (Cloud) | NoSQL database |
| Mongoose | 9.3.2 | MongoDB ORM |
| JWT | 9.0.3 | Token-based auth |
| bcryptjs | 3.0.3 | Password hashing |
| Helmet | 8.1.0 | Security headers |
| CORS | 2.8.6 | Cross-origin requests |
| Multer | 2.1.1 | File uploads |
| redis | 5.11.0 | Caching |
| Stripe | 20.4.1 | Payment processing |
| pdfkit | 0.18.0 | PDF generation |

---

## 📁 Project Structure

```
Inventory Management/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   ├── main.jsx                # Entry point
│   │   ├── App.css                 # Application styles
│   │   ├── index.css               # Global styles
│   │   └── assets/                 # Images and static files
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md                   # Frontend documentation
│
└── server/                          # Node.js/Express backend
    ├── config/
    │   └── db.js                   # MongoDB connection setup
    ├── models/
    │   ├── users.model.js          # User schema
    │   ├── company.model.js        # Company schema
    │   ├── category.model.js       # Category schema
    │   └── product.model.js        # Product schema
    ├── routes/
    │   ├── auth.routes.js          # Authentication routes
    │   └── controllers/
    │       └── auth.controller.js  # Authentication logic
    ├── index.js                    # Server entry point
    ├── .env                        # Environment variables
    ├── .gitignore
    ├── package.json
    └── README.md                   # Backend documentation
```

---

## 🚀 Quick Start

Get the application running in 5 minutes:

### Prerequisites
- Node.js 16+ and npm
- MongoDB account (cloud or local instance)
- Git

### Step 1: Clone the Repository
```bash
cd path/to/project
```

### Step 2: Setup Backend
```bash
cd server
npm install
```

Create `.env` file in the server directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend:
```bash
npm run dev
```

You should see: `Server running on http://localhost:5000`

### Step 3: Setup Frontend
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

You should see: `Local: http://localhost:5173`

### Step 4: Verify Installation
- Visit `http://localhost:5173` in your browser
- You should see the application homepage
- Backend health check: `http://localhost:5000` returns "hello form backend server"

---

## 📋 Detailed Installation Guide

### Backend Setup (Detailed)

#### 1. Install Dependencies
```bash
cd server
npm install
```

This installs all packages including Express, Mongoose, JWT, bcryptjs, and utilities for logging, file uploads, payments, and caching.

#### 2. Configure MongoDB

**Option A: Cloud MongoDB (Recommended)**
- Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

**Option B: Local MongoDB**
- Install MongoDB locally
- Connection string: `mongodb://localhost:27017/inventory_management`
- Ensure MongoDB service is running before starting the server

#### 3. Create Environment Variables
Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars_long
```

#### 4. Start Development Server
```bash
npm run dev
```

**Troubleshooting:**
- **Port already in use**: Change `PORT` in `.env` to an available port (e.g., 5001)
- **MongoDB connection refused**: Check `MONGO_URI` and ensure MongoDB is running
- **Import errors**: See [Known Issues](#-known-issues) section

#### 5. Available Commands
```bash
npm run dev      # Start with hot-reload (nodemon)
npm start        # Start in production mode
npm test         # Run tests (when available)
```

### Frontend Setup (Detailed)

#### 1. Install Dependencies
```bash
cd client
npm install
```

#### 2. Configure API Endpoint
The frontend is configured to hit `http://localhost:5000` by default. To change this, update the API base URL in your axios configuration file (will be in `src/` once services are created).

#### 3. Start Development Server
```bash
npm run dev
```

The app will open automatically at `http://localhost:5173`

#### 4. Available Commands
```bash
npm run dev      # Start dev server with hot-reload
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

**Troubleshooting:**
- **Port already in use**: Vite will switch to another port (5174, 5175, etc.)
- **Backend API not responding**: Ensure server is running on port 5000
- **Node modules issues**: Delete `node_modules` and `package-lock.json`, then run `npm install` again

---

## ⚙️ Environment Variables

### Backend (.env in `server/` directory)

```env
# Server Configuration
PORT=5000                                    # Server port (default: 5000)

# Database Configuration
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
                                            # MongoDB connection string

# Authentication
JWT_SECRET=your_jwt_secret_key_here        # Secret for signing JWT tokens
                                            # Must be at least 32 characters
                                            # Generate: openssl rand -base64 32

# Optional (for future features)
STRIPE_SECRET_KEY=sk_test_...              # Stripe API key for payments
SENDGRID_API_KEY=SG...                     # SendGrid for email
REDIS_URL=redis://localhost:6379           # Redis for caching
NODE_ENV=development                        # environment (development/production)
```

### Frontend Configuration
Currently, the frontend uses `http://localhost:5000` as the backend URL. This will be configurable once the API service layer is established.

---

## 🏃 Running the Application

### Development Mode (Recommended for Development)

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend (in a new terminal):**
```bash
cd client
npm run dev
```

Both servers support hot-reload. You can edit files and see changes instantly.

### Production Mode

**Build Frontend:**
```bash
cd client
npm run build
```

This creates an optimized build in `client/dist/`

**Start Backend in Production:**
```bash
cd server
NODE_ENV=production npm start
```

Ensure all environment variables are properly set before running in production.



#### 4. **Incomplete Auth Controller**
**Location:** `server/routes/controllers/auth.controller.js`
**Issue:** Register and login functions are not implemented
**Impact:** Authentication endpoints will not work
**Status:** Implementation needed in Phase 2

#### 5. **Missing JWT_SECRET in .env**
**Location:** `server/.env`
**Issue:** JWT_SECRET variable is missing from environment configuration
**Impact:** JWT generation will fail at runtime
**Workaround:** Add `JWT_SECRET=your_secret_key` to `.env`
**Status:** User must add manually

### Non-Critical Issues

#### Frontend
- No routing structure implemented yet
- No API service layer or Axios configuration
- No authentication flow
- Only basic component structure exists

#### General
- No tests yet (to be added in Phase 6)
- No Postman collection for API testing yet
- Database models ready but CRUD endpoints not implemented

---

## 📊 Current Status

### Backend Completion: **10%**
- ✅ Project structure created
- ✅ Database models defined (Company, User, Category, Product)
- ✅ MongoDB connection configured
- ✅ Auth routes scaffolded
- ❌ Auth logic incomplete
- ❌ Security middleware not added
- ❌ CRUD endpoints not implemented

### Frontend Completion: **5%**
- ✅ Vite & React setup complete
- ✅ Tailwind CSS configured
- ✅ Dependencies installed (React Router, Form validation, Charts, etc.)
- ✅ Basic component structure
- ❌ Routing not implemented
- ❌ Login/Register pages not created
- ❌ Dashboard not created
- ❌ API integration not started

### Overall Progress: **~8%**

---

## 🗺️ Development Roadmap

The project is organized into 6 phases, progressing from core foundation to production-ready system.

### Phase 1: Foundation & Fixes ⚙️
**Goal:** Stabilize the existing codebase and fix critical bugs
**Duration:** 2-3 days
**Priority:** 🔴 CRITICAL

**Deliverables:**
- Fix all import/path errors in auth routes and controllers
- Fix password comparison method in User model
- Correct middleware order in server setup
- Ensure server boots without runtime errors
- Auth routes reachable from Postman

**Key Files:**
- `server/routes/auth.routes.js`
- `server/models/users.model.js`
- `server/index.js`

**Success Criteria:**
```bash
# Backend health check succeeds
curl http://localhost:5000

# Auth endpoints are reachable
curl http://localhost:5000/api/auth/register
```

### Phase 2: Authentication Core 🔐
**Goal:** Implement complete register and login functionality
**Duration:** 3-4 days
**Depends on:** Phase 1 complete

**Deliverables:**
- Complete register endpoint with validation
- Complete login endpoint with JWT generation
- Implement password hashing on user creation
- Add JWT utility functions
- User model password comparison method working

**Endpoints Implemented:**
- `POST /api/auth/register` - Full implementation
- `POST /api/auth/login` - Full implementation

**Success Criteria:**
- Register creates user and returns JWT token
- Login authenticates and returns JWT token
- Passwords are securely hashed and compared

### Phase 3: Auth Security Hardening 🛡️
**Goal:** Apply security best practices and middleware
**Duration:** 2-3 days
**Depends on:** Phase 2 complete

**Deliverables:**
- Helmet middleware for security headers
- CORS configuration
- Morgan request logging
- Auth middleware for JWT verification
- Role-based access control middleware
- Rate limiting on auth endpoints

**Components Added:**
- Auth middleware (`server/middleware/auth.js`)
- Role guard middleware (`server/middleware/roleGuard.js`)
- Rate limiter middleware

### Phase 4: Core Inventory APIs 📦
**Goal:** Implement CRUD operations for main inventory entities
**Duration:** 4-5 days
**Depends on:** Phase 3 complete

**Endpoints to Implement:**

**Categories:**
- `GET /api/categories` - List all categories for company
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

**Products:**
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Companies:**
- `GET /api/company` - Get company profile
- `PUT /api/company` - Update company details

**Users:**
- `GET /api/users` - List users for company (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

### Phase 5: Frontend Authentication & Routing 🎨
**Goal:** Implement frontend auth flow and navigation structure
**Duration:** 4-5 days
**Depends on:** Phase 2 backend complete

**Deliverables:**
- React Router setup with layout structure
- Login page with form validation
- Register page with form validation
- Protected routes middleware
- JWT token storage and retrieval
- Logout functionality
- Auth context for global state

**Pages to Create:**
- Login page
- Register page
- Dashboard (protected)
- Products page (protected)
- Categories page (protected)
- Settings/Profile page (protected)

### Phase 6: Dashboard & Reporting 📈
**Goal:** Add analytics dashboard and reporting features
**Duration:** 5-6 days
**Depends on:** Phase 4 APIs complete

**Deliverables:**
- Dashboard KPI cards
- Inventory trend charts
- Low-stock alerts
- Filterable analytics
- PDF report generation
- Date range and category filtering

**Backend Endpoints Needed:**
- `GET /api/dashboard/kpis` - KPI metrics
- `GET /api/analytics/trends` - Inventory trends
- `GET /api/alerts/low-stock` - Low stock items
- `POST /api/reports/generate` - Generate PDF

### Post-Phase 6: Polish & Quality 🚀
- Unit and integration tests
- End-to-end testing
- Performance optimization
- Production deployment
- Monitoring setup

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
**Endpoint:** `POST /api/auth/register`
**Authentication:** Not required
**Description:** Create a new user account

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "company": "67f10d89fae6f0f53c5f8a10",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "role": "admin"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "67f10f0d4f9ce3b8b28f2bd1",
    "company": "67f10d89fae6f0f53c5f8a10",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "2026-03-26T10:15:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (400 Bad Request):**
```json
{
  "message": "All fields are required"
}
```

**Validation Rules:**
- All fields are required
- Email must be unique per company
- Password must be at least 8 characters
- Role must be either "admin" or "staff"
- Company must be a valid ObjectId

---

#### 2. Login User
**Endpoint:** `POST /api/auth/login`
**Authentication:** Not required
**Description:** Authenticate user and receive JWT token

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "67f10f0d4f9ce3b8b28f2bd1",
    "company": "67f10d89fae6f0f53c5f8a10",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized):**
```json
{
  "message": "Invalid email or password"
}
```

---

### Using Authentication Token

After login/register, include the JWT token in all protected requests:

```javascript
// Using Axios
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
};
axios.get('/api/products', config);

// Using fetch
fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### Inventory Endpoints (Phase 4)

#### Categories

**List Categories**
```
GET /api/categories
Authorization: Bearer <token>
```

**Create Category**
```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Electronics"
}
```

**Update Category**
```
PUT /api/categories/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Electronics"
}
```

**Delete Category**
```
DELETE /api/categories/:id
Authorization: Bearer <token>
```

---

#### Products

**List Products**
```
GET /api/products?category=<categoryId>&search=<searchTerm>
Authorization: Bearer <token>
```

**Get Product**
```
GET /api/products/:id
Authorization: Bearer <token>
```

**Create Product**
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop",
  "sku": "LP-2024-001",
  "category": "67f10d89fae6f0f53c5f8a10",
  "price": 999.99,
  "stock": 50
}
```

**Update Product**
```
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 899.99,
  "stock": 45
}
```

**Delete Product**
```
DELETE /api/products/:id
Authorization: Bearer <token>
```

---

### Data Models Reference

#### User Model
```javascript
{
  _id: ObjectId,
  company: ObjectId,           // Reference to Company
  name: String,
  email: String,               // Unique per company
  password: String,            // Hashed
  role: String,                // "admin" or "staff"
  createdAt: Date,
  updatedAt: Date
}
```

#### Company Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  address: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Category Model
```javascript
{
  _id: ObjectId,
  company: ObjectId,           // Reference to Company
  name: String,                // Unique per company
  createdAt: Date,
  updatedAt: Date
}
```

#### Product Model
```javascript
{
  _id: ObjectId,
  company: ObjectId,           // Reference to Company
  name: String,
  sku: String,                 // SKU code
  category: ObjectId,          // Reference to Category
  price: Number,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🏗️ Project Architecture

### Multi-Tenant Architecture

This system uses a **multi-tenant** approach where each company has isolated data:

```
┌─────────────────────────────────────────┐
│        Single Database (MongoDB)        │
├─────────────────────────────────────────┤
│                                         │
│  Company A              Company B      │
│  ├─ Users              ├─ Users        │
│  ├─ Products           ├─ Products     │
│  ├─ Categories         ├─ Categories   │
│  └─ Orders             └─ Orders       │
│                                         │
└─────────────────────────────────────────┘
```

**Benefits:**
- Single database for operations
- Each company's data is completely isolated via `company` field
- Efficient use of resources
- Easier backup and maintenance

**Implementation:**
- Every query filters by `company` ID from JWT token
- Middleware attaches `req.user.company` from token
- All endpoints enforce company scope automatically

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow the coding standards:**
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions focused and modular
   - Follow the existing code style

3. **Test your changes:**
   - For backend: Use Postman to test endpoints
   - For frontend: Test in browser and console
   - Check for console errors and warnings

4. **Commit with clear messages:**
   ```bash
   git commit -m "feature: add product search functionality"
   ```

5. **Push and create pull request:**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

**JavaScript/Node.js:**
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Use async/await instead of callbacks
- Use destructuring where appropriate

**React:**
- Use functional components with hooks
- Keep components focused and reusable
- Props validation with PropTypes or TypeScript
- Use meaningful component names

---

## 📞 Getting Help & Support

### Common Questions

**Q: Server won't start - "Port already in use"**
- Change PORT in `.env` or kill the process using that port
- Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID>`
- Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

**Q: MongoDB connection fails**
- Check your `MONGO_URI` in `.env`
- Ensure MongoDB is running (if local) or cluster is accessible (if cloud)
- Verify network access is allowed in MongoDB Atlas

**Q: Frontend can't reach backend API**
- Ensure backend server is running on port 5000
- Check browser console for CORS errors
- Verify API calls use correct URL: `http://localhost:5000`

**Q: Authentication not working**
- See [Known Issues](#-known-issues) section
- Ensure JWT_SECRET is set in `.env`
- Check that auth controller is implemented

### Reporting Issues

When reporting issues, please include:
1. Error message and full stack trace
2. Steps to reproduce
3. Your environment (OS, Node version, npm version)
4. Current branch and recent commits

### Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose Guide](https://mongoosejs.com/)
- [React Documentation](https://react.dev)
- [JWT Introduction](https://jwt.io/introduction)
- [REST API Best Practices](https://restfulapi.net/)

### Contact

For questions or support:
- Check existing issues in the repository
- Review documentation in `/server/README.md` and `/client/README.md`
- Create a new issue with detailed information

---

## 📝 License

This project is part of an educational/development initiative. See LICENSE file for details (if applicable).

---

## 🎯 Next Steps

1. **Immediate:** Fix Phase 1 critical issues (see [Known Issues](#-known-issues))
2. **Short-term:** Implement Phase 2 (Authentication)
3. **Medium-term:** Build Phase 3-4 (Security & Inventory APIs)
4. **Long-term:** Develop frontend and add analytics

**Start with:** `server/index.js` - Fix middleware order, then tackle import errors in `server/routes/auth.routes.js`

---

**Last Updated:** March 26, 2026
**Project Status:** In Active Development
**Current Phase:** Phase 1 (Foundation & Fixes)
