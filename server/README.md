# Inventory Management - Server (Backend)

This is the backend API for the Inventory Management project.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- dotenv
- bcryptjs
- jsonwebtoken

Additional installed packages include utilities for security, logging, uploads, mail, reporting, payments, caching, and scheduling.

## Folder Structure

```
server/
  config/
    db.js
  models/
    category.model.js
    company.model.js
    product.model.js
    users.model.js
  routes/
    auth.routes.js
    controllers/
      auth.controller.js
  index.js
  package.json
```

## Server Responsibilities

- Connect to MongoDB
- Expose REST API routes
- Handle authentication endpoints
- Define core database schemas for inventory entities

## Current Routes

### Health / Test Route

- GET /
  - Response: hello form backend server

### Authentication Routes

Base path: /api/auth

- POST /register
- POST /login

Combined full paths:

- POST /api/auth/register
- POST /api/auth/login

## Auth API Reference

The following table documents the authentication endpoints that are currently defined in routing. Controller logic is in progress, so examples below represent the intended API contract.

| Endpoint | Method | Description | Auth Required |
|---|---|---|---|
| /api/auth/register | POST | Register a new user account | No |
| /api/auth/login | POST | Authenticate an existing user | No |

### 1) Register User

Endpoint: /api/auth/register  
Method: POST  
Content-Type: application/json

Request body example:

```json
{
  "company": "67f10d89fae6f0f53c5f8a10",
  "name": "Harsh Prajapati",
  "email": "harsh@example.com",
  "password": "StrongPass123",
  "role": "admin"
}
```

Success response example (201 Created):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "67f10f0d4f9ce3b8b28f2bd1",
    "company": "67f10d89fae6f0f53c5f8a10",
    "name": "Harsh Prajapati",
    "email": "harsh@example.com",
    "role": "admin",
    "createdAt": "2026-03-26T10:15:00.000Z"
  },
  "token": "jwt_token_here"
}
```

Validation error example (400 Bad Request):

```json
{
  "message": "All fields are required"
}
```

Duplicate user error example (400 Bad Request):

```json
{
  "message": "User already exists"
}
```

### 2) Login User

Endpoint: /api/auth/login  
Method: POST  
Content-Type: application/json

Request body example:

```json
{
  "email": "harsh@example.com",
  "password": "StrongPass123"
}
```

Success response example (200 OK):

```json
{
  "message": "Login successful",
  "user": {
    "id": "67f10f0d4f9ce3b8b28f2bd1",
    "company": "67f10d89fae6f0f53c5f8a10",
    "name": "Harsh Prajapati",
    "email": "harsh@example.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

Invalid credentials example (401 Unauthorized):

```json
{
  "message": "Invalid email or password"
}
```

Server error example (500 Internal Server Error):

```json
{
  "message": "Internal server error"
}
```

## Data Models

### Company

Fields:

- name
- email
- phone
- address
- createdAt, updatedAt

### User

Fields:

- company (ref Company)
- name
- email
- password (hashed via pre-save hook)
- role (admin or staff)
- createdAt, updatedAt

### Category

Fields:

- company (ref Company)
- name
- createdAt, updatedAt

Unique index:

- company + name

### Product

Fields:

- company (ref Company)
- name
- sku
- category (ref Category)
- price
- stock
- createdAt, updatedAt

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a .env file inside server directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3. Start in development mode

```bash
npm run dev
```

### 4. Start in production mode

```bash
npm start
```

## Available Scripts

- npm run dev - Run with nodemon
- npm start - Run with node

## Notes

- Authentication controller and routes are scaffolded and should be completed with full logic and error handling.
- Ensure MongoDB is running or use a valid cloud MongoDB URI before starting the server.

## Detailed Backend Implementation Plan

This is a step-by-step execution plan to move the backend from scaffold to production-ready API.

### Phase 1: Foundation and Fixes

Goal: stabilize the existing codebase so auth can be implemented safely.

Tasks:

- Fix import paths in auth router and controller
  - Use proper Express import in router
  - Correct controller import path to model file
- Fix user model password comparison method
  - Replace broken bcrypt method call with bcrypt.compare
- Ensure middleware order is correct
  - Register express.json() before route mounting
- Add consistent error response helper format
  - message
  - optional errors array

Deliverables:

- Server boots without runtime import errors
- Auth routes reachable from Postman

### Phase 2: Auth Core (Register and Login)

Goal: complete authentication business logic.

Tasks:

- Register endpoint implementation
  - Validate required fields
  - Validate role enum
  - Check duplicate email
  - Hash password via model hook
  - Save user and return safe user payload
- Login endpoint implementation
  - Validate email and password presence
  - Fetch user with password field explicitly selected
  - Compare password using matchPassword
  - Return JWT token and user profile
- JWT utility
  - Add token generation helper
  - Include id, role, company claims
  - Configure expiration from env

Deliverables:

- POST /api/auth/register fully operational
- POST /api/auth/login fully operational

### Phase 3: Auth Security Hardening

Goal: protect endpoints and reduce abuse.

Tasks:

- Add security middleware
  - helmet
  - cors with allowed origins
  - morgan for request logging
- Add auth middleware
  - Verify bearer token
  - Attach req.user context
- Add role-based guard middleware
  - admin-only routes support
- Add rate limiting on auth routes
  - registration and login brute-force protection

Deliverables:

- Protected route middleware ready for future modules
- Auth endpoints have basic abuse protections

### Phase 4: Core Inventory APIs

Goal: expose CRUD for main entities.

Tasks:

- Categories
  - create, list, update, delete
  - enforce company scope
- Products
  - create, list, get by id, update, delete
  - add filtering by category and search by name/SKU
- Companies
  - get company profile
  - update company details
- Users
  - list users for company
  - update user role (admin only)

Deliverables:

- CRUD API for categories and products
- Company and user management endpoints

### Phase 5: Validation and Error Standards

Goal: make API behavior predictable for frontend integration.

Tasks:

- Add request validation using express-validator
- Add centralized error middleware
- Add unified response conventions
  - success shape
  - error shape
  - pagination shape for list endpoints

Deliverables:

- Consistent HTTP status handling
- Clear validation error responses

### Phase 6: Testing and Documentation

Goal: lock behavior and improve maintainability.

Tasks:

- Add API tests for auth and product/category flows
- Add seed script for local development data
- Expand README with all endpoint tables
- Add Postman collection export

Deliverables:

- Repeatable test coverage for critical flows
- API contract documentation for frontend developers

### Suggested Execution Order

1. Finish Phase 1 before writing new endpoints.
2. Complete and verify Phase 2 with Postman.
3. Add security from Phase 3 before exposing more routes.
4. Implement Phase 4 domain APIs in this order: categories, products, companies, users.
5. Standardize responses in Phase 5.
6. Finalize with tests and docs in Phase 6.

### Definition of Done (Backend)

- Auth endpoints pass manual and automated tests.
- All new routes require valid JWT except public auth routes.
- Company-scoped access control is enforced.
- README includes endpoint tables and examples for all modules.
