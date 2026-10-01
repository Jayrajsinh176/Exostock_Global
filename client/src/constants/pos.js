// Mock product data for POS system
export const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Keyboard', sku: 'KB-001', price: 2500, category: 'Electronics' },
  { id: 2, name: 'USB Mouse', sku: 'MS-001', price: 800, category: 'Electronics' },
  { id: 3, name: 'HDMI Cable', sku: 'AB-001', price: 300, category: 'Cables' },
  { id: 4, name: 'Monitor Stand', sku: 'ST-001', price: 1500, category: 'Accessories' },
  { id: 5, name: 'Webcam HD', sku: 'WC-001', price: 3500, category: 'Electronics' },
  { id: 6, name: 'USB Hub 7 Port', sku: 'HB-001', price: 1200, category: 'Accessories' },
  { id: 7, name: 'Laptop Stand', sku: 'LS-001', price: 2000, category: 'Accessories' },
  { id: 8, name: 'Type-C Cable', sku: 'TC-001', price: 500, category: 'Cables' },
  { id: 9, name: 'Wireless Charger', sku: 'WCH-001', price: 1800, category: 'Electronics' },
  { id: 10, name: 'Screen Protector', sku: 'SP-001', price: 400, category: 'Accessories' },
];

export const GST_RATE = 18; // 18% GST

export const PAYMENT_METHODS = {
  CASH: 'cash',
  ONLINE: 'online',
};

// Helper function to find product by SKU
export const findProductBySKU = (sku) => {
  return MOCK_PRODUCTS.find(product => product.sku.toLowerCase() === sku.toLowerCase());
};

// Helper function to format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
