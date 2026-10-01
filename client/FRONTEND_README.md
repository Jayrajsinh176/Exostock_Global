# 🎨 Frontend README - Inventory Management System

## 📌 Overview

This is the frontend application for the **Inventory Management System** - a modern React/Vite web application for managing inventory, products, categories, users, and subscriptions.

**Frontend URL**: `http://localhost:3000`  
**Build Tool**: Vite 8  
**Framework**: React 19  
**Package Manager**: npm  
**Styling**: Tailwind CSS 4  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | JavaScript (ES6+) |
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **State Management** | React Hooks / Context API |
| **Form Handling** | React Hook Form 7 |
| **Validation** | Yup |
| **HTTP Client** | Axios |
| **Styling** | Tailwind CSS 4 |
| **UI Icons** | React Icons 5 |
| **Charts** | Chart.js + react-chartjs-2 |
| **PDF Export** | jsPDF + jspdf-autotable |
| **Notifications** | React Hot Toast |
| **Linting** | ESLint |
| **Tailwind Vite** | @tailwindcss/vite |

---

## 📂 Project Structure

```
client/
├── public/                            # Static assets
├── src/
│   ├── api/                          # API integration
│   │   └── api.js                    # Axios instance & API calls
│   ├── assets/                       # Images, fonts
│   ├── components/
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── LoginBranding.jsx
│   │   │   ├── SignupBranding.jsx
│   │   │   ├── AuthFooter.jsx
│   │   │   └── SystemStatusBar.jsx
│   │   ├── common/                   # Reusable components
│   │   │   └── ConfirmationModal.jsx
│   │   ├── dashboard/                # Dashboard components
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── KPICards.jsx
│   │   │   ├── InventoryHealthFeed.jsx
│   │   │   ├── InventoryTrendChart.jsx
│   │   │   ├── LowStockAlerts.jsx
│   │   │   ├── AddProductComponents.jsx
│   │   │   ├── ProductsComponents.jsx
│   │   │   ├── CategoriesComponents.jsx
│   │   │   ├── UsersComponents.jsx
│   │   │   └── SubscriptionComponents.jsx
│   │   ├── landing/                  # Landing page sections
│   │   │   ├── Navbar.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   ├── FeaturesSection.jsx
│   │   │   ├── DashboardPreviewSection.jsx
│   │   │   ├── HowItWorksSection.jsx
│   │   │   ├── PricingSection.jsx
│   │   │   ├── LogoBarSection.jsx
│   │   │   ├── TrustSection.jsx
│   │   │   ├── BlindSpotsSection.jsx
│   │   │   ├── BuiltForSection.jsx
│   │   │   ├── CTASection.jsx
│   │   │   └── Footer.jsx
│   │   ├── layout/                   # Layout components
│   │   ├── products/                 # Product related
│   ├── context/                      # Context API
│   ├── data/                         # Mock data
│   ├── hooks/                        # Custom React hooks
│   ├── images/                       # Image assets
│   ├── pages/                        # Page components
│   │   ├── LandingPage.jsx           # Public landing page
│   │   ├── LoginPage.jsx             # Login
│   │   ├── SignupPage.jsx            # Registration
│   │   ├── DashboardPage.jsx         # Main dashboard
│   │   ├── ProductsPage.jsx          # Products list
│   │   ├── AddProductPage.jsx        # Create product
│   │   ├── EditProductPage.jsx       # Edit product
│   │   ├── CategoriesPage.jsx        # Categories management
│   │   ├── UsersPage.jsx             # Users management
│   │   ├── EditUserPage.jsx          # Edit user
│   │   └── SubscriptionPage.jsx      # Subscription/billing
│   ├── App.jsx                       # Main app component
│   ├── App.css                       # Global styles
│   ├── index.css                     # Base styles
│   └── main.jsx                      # Entry point
├── eslint.config.js                  # ESLint configuration
├── vite.config.js                    # Vite configuration
└── package.json                      # Dependencies

```

---

## ⚙️ Setup & Installation

### 1. Setup Environment Variables

Create a `.env` file in the `client` folder:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Inventory Management
VITE_APP_VERSION=1.0.0
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Server will start on: **http://localhost:3000**

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm run preview
```

### 6. Lint Code

```bash
npm run lint
```

---

## 📄 Pages & Routes

### Public Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Landing Page | Marketing/intro landing page |
| `/login` | Login | User authentication |
| `/register` | Signup | New user registration |

### Protected Routes (Requires Authentication)

| Route | Page | Purpose | Role |
|-------|------|---------|------|
| `/dashboard` | Dashboard | Main dashboard with KPIs | all |
| `/products` | Products List | View & search products | all |
| `/products/add` | Add Product | Create new product | all |
| `/products/edit/:id` | Edit Product | Update product | all |
| `/categories` | Categories | Manage categories | all |
| `/users` | Users | User management | admin |
| `/users/edit/:id` | Edit User | Update user | admin |
| `/subscription` | Subscription | Billing & plans | all |

---

## 🔑 Key Components

### 1. API Service (`src/api/api.js`)

```javascript
// Authentication
POST /auth/login
POST /auth/register

// Products
GET /products
POST /products
PUT /products/:id
DELETE /products/:id
GET /products/low-stock
GET /products/stats

// Categories
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id

// Users
GET /users
POST /users
PUT /users/:id
DELETE /users/:id
GET /users/:id/activity

// Alerts
GET /alerts/low-stock
```

### 2. Authentication Flow

```
User enters credentials
        ↓
Form submitted to API login
        ↓
JWT token received & stored in localStorage
        ↓
Token added to all API request headers
        ↓
Token validated by backend middleware
        ↓
Protected pages accessible
```

### 3. Dashboard Components

**KPI Cards**
- Total Products
- Total Categories
- Low Stock Alerts
- Inventory Value

**Inventory Health Feed**
- Recent user activities
- Product changes
- Stock alerts

**Inventory Trend Chart**
- 6-month trend visualization
- Charts.js line chart

**Low Stock Alerts**
- Critical items
- Warning items
- Priority indicators

### 4. Product Management

**Products List**
- Search & filter by category
- Pagination (10 per page)
- Stock status indicators
- Quick actions (edit/delete)

**Add/Edit Product**
- Form with validation (react-hook-form + Yup)
- Category dropdown
- Price & stock input
- Low stock threshold setting

### 5. User Management

**Users List** (Admin only)
- View all users
- Role display (admin/staff)
- Status indicators (active/inactive)
- Action buttons

**Edit User**
- Update name, email, phone
- Change role (admin/staff)
- Activate/deactivate user

---

## 📊 Features Currently Implemented

✅ **Authentication**
- User login & registration
- JWT token management
- Protected route guards
- Session persistence

✅ **Dashboard**
- KPI cards with real data
- Inventory trend chart
- Low stock alerts
- Activity feed
- Overall system health

✅ **Products**
- View products with pagination
- Search products
- Filter by category
- Add new product
- Edit product details
- Delete product
- Stock level display
- Low stock indicators

✅ **Categories**
- View all categories
- Create categories
- Edit categories
- Delete categories
- Filter products by category

✅ **Users** (Admin)
- View all users
- Add new users
- Edit user details
- Delete users
- Activate/deactivate users
- View user activity
- Role management

✅ **UI/UX**
- Responsive design (Tailwind CSS)
- Dark/light theme support
- Modal dialogs
- Toast notifications
- Loading states
- Error handling
- Form validation

✅ **Landing Page**
- Hero section
- Features showcase
- Dashboard preview
- How it works section
- Pricing tiers
- Trust indicators
- CTA sections
- Footer

---

## 🚧 To-Do / Future Features

❌ **Advanced Features**
- [✅ Subscription management page] - Billing & plan management
- [ ] Payment gateway integration (Stripe)
- [ ] Invoice generation & download
- [ ] PDF export for reports
- [ ] Excel/CSV export

❌ **Analytics & Reports**
- [ ] Advanced analytics dashboard
- [ ] Revenue reports
- [ ] Sales trends
- [ ] Inventory forecasting
- [ ] ROI analysis
- [ ] Custom report builder

❌ **Notifications**
- [ ] Real-time notifications
- [ ] Email alerts
- [ ] Browser push notifications
- [ ] Notification preferences

❌ **Search & Filtering**
- [ ] Advanced search
- [ ] Save filter presets
- [ ] Quick filters
- [ ] Search history

❌ **Inventory Optimization**
- [ ] Automated reorder suggestions
- [ ] Bulk import/export
- [ ] Inventory history tracking
- [ ] Stock movement graphs
- [ ] Obsolescence detection

❌ **Settings & Admin**
- [ ] Company settings
- [ ] User preferences
- [ ] Two-factor authentication
- [ ] API keys management
- [ ] Webhook configuration

❌ **Mobile**
- [ ] Mobile app version
- [ ] Responsive improvements
- [ ] Mobile-specific features

❌ **Performance**
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategies
- [ ] Service workers (PWA)

---

## 🎨 Styling

### Tailwind CSS Configuration

**Colors**
- Primary: Blue
- Secondary: Gray
- Success: Green
- Warning: Yellow
- Error: Red

**Responsive Breakpoints**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### CSS Classes Used

```javascript
// Layout
flex, grid, container, mx-auto, px-4, py-6

// Typography
text-sm, text-lg, font-bold, text-center

// Colors
bg-blue-500, text-gray-700, border-gray-200

// Spacing
space-y-4, gap-4, mb-6, mt-2

// Interactive
hover:bg-blue-600, focus:outline-none, cursor-pointer
```

---

## 📝 Form Validation

### Using React Hook Form + Yup

```javascript
const schema = Yup.object({
  name: Yup.string().required('Name is required').min(2),
  email: Yup.string().email().required('Email is required'),
  password: Yup.string().min(6).required('Password required')
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: yupResolver(schema)
});
```

---

## 🔒 Authentication & Authorization

### How It Works

1. **Login**: User provides credentials
2. **Token Received**: JWT token stored in localStorage
3. **Protected Routes**: Checked before rendering
4. **API Requests**: Token sent in Authorization header
5. **Token Validation**: Backend middleware validates
6. **Response**: Data returned or 401 error

### Logout

```javascript
// Clear token from localStorage
localStorage.removeItem('authToken');
// Redirect to login
navigate('/login');
```

---

## 🧪 Testing

### Manual Testing Steps

1. **Registration**
   - Go to `/register`
   - Fill in company & user details
   - Submit form
   - Should redirect to dashboard

2. **Login**
   - Go to `/login`
   - Enter credentials
   - Should redirect to `/dashboard`
   - Token stored in localStorage

3. **Dashboard**
   - Check KPI cards load
   - Verify trend chart displays
   - Check alerts appear
   - View activity feed

4. **Products**
   - Visit `/products`
   - Search for product
   - Filter by category
   - Page through results
   - Edit/delete functionality

5. **Users Management**
   - Visit `/users` (admin only)
   - Add new user
   - Edit existing user
   - Deactivate user
   - View activity

---

## 🔌 API Integration

### Axios Instance

```javascript
// src/api/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Making API Calls

```javascript
// Get products
const response = await api.get('/products?page=0&limit=10');
const { products, total } = response.data;

// Create product
const newProduct = await api.post('/products', {
  name: 'Product Name',
  sku: 'SKU-001',
  category: categoryId,
  price: 99.99,
  stock: 50
});
```

---

## 🔄 State Management

### Using React Hooks

```javascript
// useState for local state
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(false);

// useEffect for side effects
useEffect(() => {
  fetchProducts();
}, []);

// useContext for global state (auth, theme)
const { user, logout } = useContext(AuthContext);
```

---

## 📱 Responsive Design

### Mobile-First Approach

```javascript
// Tailwind responsive classes
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, 1/3 on desktop */}
</div>
```

### Breakpoints

- **Mobile**: 0-640px
- **Tablet**: 640px-1024px
- **Desktop**: 1024px+

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot find module 'axios'"
**Solution**: Run `npm install axios`

### Issue: "Chart not displaying"
**Solution**: Ensure Chart.js and react-chartjs-2 are installed
```bash
npm install chart.js react-chartjs-2
```

### Issue: "Form validation not working"
**Solution**: Install react-hook-form and yup
```bash
npm install react-hook-form yup @hookform/resolvers
```

### Issue: "Routing not working"
**Solution**: Ensure React Router is properly configured in App.jsx

### Issue: "Token not persisting after refresh"
**Solution**: Implement localStorage persistence
```javascript
// On login
localStorage.setItem('authToken', token);

// On app load
const token = localStorage.getItem('authToken');
if (token) setAuthState(token);
```

---

## 📚 Dependencies & Versions

| Package | Version | Purpose |
|---------|---------|---------|
| react | 19.2.4 | UI framework |
| react-router-dom | 7.13.2 | Routing |
| axios | 1.13.6 | HTTP client |
| react-hook-form | 7.72.0 | Form handling |
| yup | 1.7.1 | Validation |
| tailwindcss | 4.2.2 | Styling |
| chart.js | 4.5.1 | Charts |
| jspdf | 4.2.1 | PDF export |
| react-icons | 5.6.0 | Icons |
| react-hot-toast | 2.6.0 | Notifications |
| vite | 8.0.1 | Build tool |
| eslint | 9.39.4 | Linting |

---

## 🚀 Performance Tips

1. **Code Splitting**
   - Use React.lazy() for route-based splitting
   - Implements automatic chunk splitting with Vite

2. **Image Optimization**
   - Compress images before upload
   - Use modern formats (WebP, AVIF)
   - Lazy load images with IntersectionObserver

3. **Caching**
   - Leverage browser cache
   - Use HTTP cache headers
   - Store computed results

4. **Bundle Optimization**
   - Tree shaking removes unused code
   - Minification in production
   - Monitor bundle size with `npm run build`

---

## 📊 Debug Mode

Enable debug logging:

```javascript
// In API calls
console.log('Request:', config);
console.log('Response:', response);

// Check localStorage
console.log(localStorage.getItem('authToken'));

// Check Redux/Context state
console.log('Auth State:', useContext(AuthContext));
```

---

## 🔗 API Base URL Configuration

Update in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📝 Notes

- All form inputs should have validation
- All API calls should have loading/error states
- Use toast notifications for user feedback
- Track all user actions for activity feed
- Implement proper error boundaries
- Keep components small and reusable
- Use descriptive variable names
- Document complex logic with comments

---

**Last Updated**: April 4, 2026  
**Status**: ✅ Production Ready  
**Contributors**: Development Team
