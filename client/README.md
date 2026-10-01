# Inventory Management - Client (Frontend)

This is the frontend application for the Inventory Management project, built with React and Vite.

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Axios
- React Hook Form + Yup
- Tailwind CSS
- Chart.js + react-chartjs-2
- jsPDF + jspdf-autotable

## Current Page Structure

At the moment, the frontend has a basic single-page setup:

- Main page (App)
	- Displays a heading text: "hello"
	- Styling is applied with utility classes

As the project grows, this app can be extended with pages such as Dashboard, Products, Categories, Companies, and User Authentication screens.

## Planned Page Map

This section outlines the proposed frontend screen structure for upcoming development.

| Route | Screen | Purpose | Key Components |
|---|---|---|---|
| / | Landing or Dashboard Redirect | App entry and routing decision | App layout, auth guard redirect |
| /login | Login | User sign-in | Login form, validation, submit state |
| /register | Register | New user registration | Register form, role selector, validation |
| /dashboard | Dashboard | High-level inventory and activity summary | KPI cards, low-stock widget, charts |
| /products | Products List | View and search all products | Data table, filters, pagination |
| /products/new | Add Product | Create a new product | Product form, category dropdown |
| /products/:id/edit | Edit Product | Update product details | Pre-filled form, save actions |
| /categories | Categories | Manage category records | Category table, add/edit modal |
| /companies | Companies | Company profile management | Company details form, update action |
| /users | Users and Roles | Admin user management | User table, role change action |
| /reports | Reports | View analytics and export documents | Charts, PDF export button |
| /settings | Settings | App and account settings | Profile form, password change |

### Suggested Layout Plan

- Public layout
	- Login page
	- Register page
- Protected app layout
	- Header with user profile and quick actions
	- Sidebar navigation for Dashboard, Products, Categories, Reports, Settings
	- Main content area for route-level pages

### Suggested Component Groups

- Shared UI
	- Button
	- Input
	- Select
	- Modal
	- Table
	- Card
	- Spinner
- Domain components
	- ProductForm
	- ProductTable
	- CategoryManager
	- DashboardSummary
	- ReportFilters

### Suggested State and API Flow

- Authentication state
	- Store token and user profile
	- Use route guards for protected pages
- Data domains
	- Products
	- Categories
	- Company
	- Users
- API client
	- Central Axios instance with base URL and auth interceptor

## Folder Structure

```
client/
	public/
	src/
		assets/
		App.css
		App.jsx
		index.css
		main.jsx
	index.html
	package.json
	vite.config.js
	eslint.config.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Available Scripts

- npm run dev - Start local development server
- npm run build - Create production build
- npm run lint - Run ESLint checks
- npm run preview - Preview production build locally

## Backend Integration

This client is intended to communicate with the backend API under:

- /api/auth/register
- /api/auth/login

You can configure API base URL in your frontend service layer (Axios config) as you add API integration.

## Detailed Frontend Implementation Plan

This plan translates the page map into actionable build steps.

### Phase 1: App Foundation

Goal: establish scalable frontend architecture.

Tasks:

- Set up route structure with React Router
	- Public routes: /login, /register
	- Protected routes: /dashboard, /products, /categories, /reports, /settings
- Create base layouts
	- PublicLayout
	- AppLayout with sidebar and topbar
- Configure API layer
	- Axios instance with base URL
	- Request interceptor for auth token
	- Response interceptor for unauthorized handling
- Create shared UI primitives
	- Button, Input, Select, Card, Table, Modal, Loader

Deliverables:

- Navigation shell working
- Route placeholders for all planned screens

### Phase 2: Authentication Screens

Goal: enable secure user entry and session management.

Tasks:

- Build Login page
	- react-hook-form + yup validation
	- call POST /api/auth/login
	- save token and user in local storage/state
- Build Register page
	- form fields: company, name, email, password, role
	- call POST /api/auth/register
- Build auth context/store
	- isAuthenticated state
	- login/logout methods
	- user profile state
- Implement route guards
	- redirect unauthenticated users to /login

Deliverables:

- Fully working login and register flows
- Protected route behavior enforced

### Phase 3: Dashboard and Metrics

Goal: provide a useful at-a-glance inventory overview.

Tasks:

- Build dashboard KPI cards
	- total products
	- total categories
	- low stock count
- Add charts using react-chartjs-2
	- stock distribution by category
	- inventory trend placeholder
- Add recent activity or latest products table

Deliverables:

- Dashboard with usable summary widgets and charts

### Phase 4: Product Management

Goal: enable full product lifecycle from UI.

Tasks:

- Products list page
	- table view
	- search by name/SKU
	- filter by category
	- pagination
- Add Product page
	- validated form
	- category dropdown integration
- Edit Product page
	- load product details by id
	- update and save flow
- Delete action with confirmation modal

Deliverables:

- End-to-end product CRUD from frontend

### Phase 5: Category, Company, and Users

Goal: complete essential management screens.

Tasks:

- Categories page
	- list categories
	- add, edit, delete category
- Companies page
	- company profile details
	- update company info
- Users page (admin)
	- user list
	- role update

Deliverables:

- Complete management screens for core business entities

### Phase 6: Reports and Export

Goal: provide reporting utility for operations.

Tasks:

- Reports page with filters
	- date range
	- category filter
- Chart blocks for report summaries
- PDF export using jsPDF + autotable

Deliverables:

- Downloadable inventory reports

### Phase 7: UX, Quality, and Release

Goal: production-ready UI behavior.

Tasks:

- Add loading and empty states for all list pages
- Add global toast notifications for success/error actions
- Add form-level and API-level error messages
- Add responsive behavior for mobile sidebar and tables
- Add lint cleanup and final UI consistency pass

Deliverables:

- Stable and responsive user experience across major screens

### Suggested Build Sequence by Screens

1. Login
2. Register
3. App layout with protected routing
4. Dashboard
5. Products list
6. Add/Edit product
7. Categories
8. Companies
9. Users
10. Reports
11. Settings

### Definition of Done (Frontend)

- All planned routes render and navigate correctly.
- Auth token flow works with protected routes.
- Product and category CRUD flows are complete.
- Dashboard and reports display real backend data.
- UI is responsive for desktop and mobile.
