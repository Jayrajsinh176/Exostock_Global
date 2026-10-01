# Billing & POS System - Backend Integration Guide

**Status:** ✅ **Frontend fully integrated with existing products API** - NO backend changes needed!

---

## 📋 Current Integration

### ✅ What Works (Without Backend Changes)

The POS system is currently integrated with your existing backend:

#### **1. Product Fetching**
- **Endpoint:** `GET /api/products`
- **Authentication:** Bearer token required
- **Features:**
  - Fetches all products for the logged-in user's company
  - Supports search by SKU
  - Returns: `id`, `name`, `sku`, `price`, `stock`, `category`
  - **Auto-populated:** Products load on BillingPage mount

#### **2. Product Lookup**
- **Method:** SKU-based search
- **Process:**
  1. User scans/enters SKU
  2. Frontend searches in products array
  3. Returns matching product with stock info
  4. Prevents overselling (checks available stock)

#### **3. Stock Validation**
- Out of stock products: Shows error
- Quantity limit: Prevents adding more than available stock
- Real-time validation during order creation

---

## 🔄 Data Flow (Current)

```
User scans SKU
    ↓
Frontend searches products array
    ↓
Product found?
    ├─ YES: Add to cart (check stock)
    └─ NO: Show error message
    ↓
Calculate totals (Subtotal + GST 18%)
    ↓
User selects payment method (Cash/Online)
    ↓
Review order details
    ↓
Confirm payment (simulated 1-2 sec delay)
    ↓
Success screen shown (Local data only - not sent to backend)
```

---

## ⚠️ Limitations (Current Frontend-Only Approach)

1. **No Order Storage** - Orders are not saved to database
2. **No Payment Gateway** - Payments are simulated locally
3. **No Stock Deduction** - Inventory is not updated after purchase
4. **No Order History** - Orders don't persist after page refresh
5. **No Multi-user Tracking** - Can't track who made which sale

---

## 🎯 Full Backend Integration Plan

If you want to complete the billing system with order persistence, history, and payment processing, implement these endpoints:

### **Phase 1: Order Management Endpoints**

#### **1. Create Order**
```
POST /api/orders
Authorization: Bearer {token}

Request Body:
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 2500
    }
  ],
  "paymentMethod": "online|cash",
  "customerName": "John Doe",
  "customerPhone": "9876543210",
  "customerEmail": "john@example.com",
  "totalAmount": 5300,
  "gst": 300,
  "subtotal": 5000
}

Response:
{
  "success": true,
  "orderId": "ORD-2024-00001",
  "transactionId": "TXN-XXXXX",
  "status": "pending|completed",
  "createdAt": "2024-04-10T10:30:00Z"
}
```

**Backend Logic:**
- Validate all product IDs exist
- Check stock availability for each item
- Deduct stock from products
- Create order document in DB
- Save order items
- Return order confirmation

---

#### **2. Get Orders**
```
GET /api/orders?page=1&limit=10&status=completed
Authorization: Bearer {token}

Response:
{
  "orders": [
    {
      "orderId": "ORD-2024-00001",
      "items": [...],
      "totalAmount": 5300,
      "paymentMethod": "online",
      "status": "completed",
      "createdAt": "2024-04-10T10:30:00Z",
      "createdBy": "userId"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10
}
```

---

#### **3. Get Order Details**
```
GET /api/orders/:orderId
Authorization: Bearer {token}

Response:
{
  "orderId": "ORD-2024-00001",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Wireless Keyboard",
      "sku": "KB-001",
      "quantity": 2,
      "price": 2500,
      "subtotal": 5000
    }
  ],
  "totalAmount": 5300,
  "gst": 300,
  "subtotal": 5000,
  "paymentMethod": "online",
  "status": "completed",
  "transactionId": "TXN-XXXXX",
  "createdAt": "2024-04-10T10:30:00Z"
}
```

---

#### **4. Generate Invoice**
```
POST /api/orders/:orderId/invoice
Authorization: Bearer {token}

Response:
{
  "success": true,
  "invoiceUrl": "/invoices/INV-2024-00001.pdf",
  "invoiceNumber": "INV-2024-00001"
}
```

---

### **Phase 2: Stock Management Endpoints**

#### **5. Update Product Stock (After Sale)**
```
PATCH /api/products/:productId/stock
Authorization: Bearer {token}

Request Body:
{
  "quantityDeducted": 2,
  "reason": "order_sale"
}

Response:
{
  "productId": "507f1f77bcf86cd799439011",
  "newStock": 48,
  "previousStock": 50
}
```

---

### **Phase 3: Database Schema Requirements**

#### **Order Model**
```javascript
{
  orderId: String (unique, auto-generated),
  company: ObjectId (ref: Company),
  createdBy: ObjectId (ref: User),
  
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  
  customerName: String,
  customerPhone: String,
  customerEmail: String,
  
  totals: {
    subtotal: Number,
    gst: Number,
    total: Number
  },
  
  paymentMethod: String (cash|online),
  paymentStatus: String (pending|completed|failed),
  transactionId: String,
  
  status: String (pending|completed|cancelled),
  
  invoice: {
    number: String,
    url: String,
    generatedAt: Date
  },
  
  createdAt: Date,
  updatedAt: Date
}
```

#### **OrderItem Model**
```javascript
{
  orderId: ObjectId (ref: Order),
  productId: ObjectId (ref: Product),
  quantity: Number,
  price: Number,
  subtotal: Number
}
```

---

## 📊 Implementation Checklist

### For Frontend (✅ Complete)
- [x] POS cart interface
- [x] Product SKU scanning
- [x] Real-time totals calculation
- [x] Payment method selection
- [x] Order review page
- [x] Success confirmation
- [x] Nested routing (/billing/payment, /billing/review, /billing/success)
- [x] Integration with products API

### For Backend (⏳ To be done)
- [ ] Order creation endpoint
- [ ] Order retrieval endpoints
- [ ] Stock deduction logic
- [ ] Payment gateway integration
- [ ] Invoice generation
- [ ] Order history filtering
- [ ] Order status tracking
- [ ] Audit logging for sales

---

## 🔌 How to Integrate Backend Endpoints

### **Step 1: Update Review Page**
When user clicks "Confirm Payment", call backend:

```javascript
const handleConfirm = async () => {
  const response = await fetch(
    '/api/orders',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod,
        totalAmount: total,
        gst,
        subtotal
      })
    }
  );
  
  const order = await response.json();
  // Pass to success page
}
```

### **Step 2: Update Success Page**
Display real order data from backend:

```javascript
const [order, setOrder] = useState(null);

useEffect(() => {
  const fetchOrder = async () => {
    const response = await fetch(
      `/api/orders/${orderId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    setOrder(await response.json());
  };
  fetchOrder();
}, [orderId]);
```

### **Step 3: Add Orders History Page**
```javascript
GET /api/orders → Display in table
```

---

## 📁 File Structure for Backend

```
server/
├── models/
│   ├── order.model.js         (NEW)
│   └── orderItem.model.js     (NEW)
├── controllers/
│   └── order.controller.js    (NEW)
├── routes/
│   └── order.routes.js        (NEW)
└── utils/
    └── invoiceGenerator.js    (NEW - optional)
```

---

## 🎓 Next Steps

1. **Immediate (Current):** Use frontend-only POS for testing UI/UX
2. **Phase 1:** Implement Phase 1 endpoints (Order CRUD)
3. **Phase 2:** Add stock management
4. **Phase 3:** Integrate payment gateway
5. **Phase 4:** Add analytics & reporting

---

## 📞 Need Help?

For any backend integration questions:
- Check existing controller patterns in `server/controllers/`
- Follow authentication middleware: `server/middleware/auth.middleware.js`
- Use company scoping pattern from existing controllers
- Implement audit logging using `server/utils/logActivity.js`

---

**Current Status:** ✅ POS Frontend Ready | ⏳ Backend Integration Optional
