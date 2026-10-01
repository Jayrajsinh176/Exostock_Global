import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import User from "../models/users.model.js";
import Vendor from "../models/vendor.model.js";
import Order from "../models/order.model.js";
import Notification from "../models/notification.model.js";
import LocationStock from "../models/locationStock.model.js";
import Franchise from "../models/franchise.model.js";

const LIST_LIMIT = 10;
const HISTORY_LIMIT = 8;
const STOCK_LIST_LIMIT = 50;

const toObjectId = (value) => new mongoose.Types.ObjectId(value);

const getUserLocationId = (user) => user?.locationId || null;

const getOrderTotal = (order) =>
  Number(order?.totalAmount || 0) > 0 ? order.totalAmount : order?.total || 0;

// Overlays each product's `stock` with its franchise-specific stock
// (0 if the franchise has never stocked that product), matching the
// same stock resolution used by the main Products page.
const applyLocationStock = async (products, companyId, locationId) => {
  if (!products.length) return products;

  const locationStocks = await LocationStock.find({
    company: companyId,
    locationId,
  }).lean();

  const stockMap = {};
  locationStocks.forEach((item) => {
    stockMap[item.product.toString()] = item.stock;
  });

  products.forEach((product) => {
    product.stock = stockMap[product._id.toString()] || 0;
  });

  return products;
};

const getProductStats = async (companyId, locationId) => {
  if (locationId) {
    const stocks = await LocationStock.find({
      company: toObjectId(companyId),
      locationId: toObjectId(locationId),
    }).populate("product");

    return stocks.reduce(
      (acc, item) => {
        if (!item.product) return acc;

        const stock = item.stock || 0;
        const threshold = item.product.lowStockThreshold ?? 5;

        acc.totalProducts += 1;
        acc.totalUnits += stock;
        acc.inventoryValue += stock * (item.product.price || 0);
        if (stock <= threshold) acc.lowStockCount += 1;
        if (stock === 0) acc.outOfStockCount += 1;

        return acc;
      },
      {
        totalProducts: 0,
        totalUnits: 0,
        inventoryValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
      },
    );
  }

  const [summary] = await Product.aggregate([
    { $match: { company: toObjectId(companyId) } },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalUnits: { $sum: { $ifNull: ["$stock", 0] } },
        inventoryValue: {
          $sum: {
            $multiply: [{ $ifNull: ["$price", 0] }, { $ifNull: ["$stock", 0] }],
          },
        },
        lowStockCount: {
          $sum: {
            $cond: [
              {
                $lte: [
                  { $ifNull: ["$stock", 0] },
                  { $ifNull: ["$lowStockThreshold", 5] },
                ],
              },
              1,
              0,
            ],
          },
        },
        outOfStockCount: {
          $sum: {
            $cond: [{ $eq: [{ $ifNull: ["$stock", 0] }, 0] }, 1, 0],
          },
        },
      },
    },
  ]);

  return {
    totalProducts: summary?.totalProducts || 0,
    totalUnits: summary?.totalUnits || 0,
    inventoryValue: summary?.inventoryValue || 0,
    lowStockCount: summary?.lowStockCount || 0,
    outOfStockCount: summary?.outOfStockCount || 0,
  };
};

const getRevenue = async (companyId, locationId, dateRange) => {
  const match = {
    company: toObjectId(companyId),
    status: "completed",
  };

  if (locationId) {
    match.locationId = toObjectId(locationId);
  }

  if (dateRange) {
    match.createdAt = dateRange;
  }

  const [summary] = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: {
            $cond: [
              { $gt: [{ $ifNull: ["$totalAmount", 0] }, 0] },
              "$totalAmount",
              { $ifNull: ["$total", 0] },
            ],
          },
        },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  return {
    totalRevenue: summary?.totalRevenue || 0,
    totalOrders: summary?.totalOrders || 0,
  };
};

const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return { $gte: start, $lt: end };
};

const normalize = (message = "") =>
  message.toLowerCase().replace(/\s+/g, " ").trim();

const extractSearchText = (query = "") => {
  const stopWords = new Set([
    "show",
    "find",
    "search",
    "product",
    "products",
    "item",
    "items",
    "details",
    "detail",
    "info",
    "information",
    "of",
    "for",
    "sku",
    "barcode",
    "name",
    "names",
  ]);

  return query
    .split(" ")
    .map((word) => word.replace(/[^\w-]/g, ""))
    .filter((word) => word.length > 1 && !stopWords.has(word))
    .join(" ")
    .trim();
};

const findProducts = async (companyId, query, limit = LIST_LIMIT, locationId) => {
  const searchText = extractSearchText(query);
  const filter = { company: companyId };

  if (searchText) {
    filter.$or = [
      { name: { $regex: searchText, $options: "i" } },
      { sku: { $regex: searchText, $options: "i" } },
      { barcode: { $regex: searchText, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .select("name sku barcode price stock lowStockThreshold category createdAt")
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  if (locationId) {
    await applyLocationStock(products, companyId, locationId);
  }

  return products;
};

// Name + current stock for every product counted by getProductStats.
const getProductStockList = async (companyId, locationId) => {
  if (locationId) {
    const stocks = await LocationStock.find({
      company: companyId,
      locationId,
    })
      .populate("product", "name")
      .lean();

    return stocks
      .filter((item) => item.product)
      .map((item) => ({ name: item.product.name, stock: item.stock || 0 }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, STOCK_LIST_LIMIT);
  }

  return Product.find({ company: companyId })
    .select("name stock")
    .sort({ name: 1 })
    .limit(STOCK_LIST_LIMIT)
    .lean();
};

const getLowStockProducts = async (companyId, limit = LIST_LIMIT, locationId) => {
  if (locationId) {
    const stocks = await LocationStock.find({
      company: companyId,
      locationId,
    }).populate({ path: "product", populate: { path: "category", select: "name" } });

    return stocks
      .filter(
        (item) => item.product && item.stock <= (item.product.lowStockThreshold ?? 5),
      )
      .map((item) => ({ ...item.product.toObject(), stock: item.stock }))
      .sort((a, b) => a.stock - b.stock || a.name.localeCompare(b.name))
      .slice(0, limit);
  }

  return Product.find({
    company: companyId,
    $expr: {
      $lte: [
        { $ifNull: ["$stock", 0] },
        { $ifNull: ["$lowStockThreshold", 5] },
      ],
    },
  })
    .select("name sku barcode price stock lowStockThreshold category")
    .populate("category", "name")
    .sort({ stock: 1, name: 1 })
    .limit(limit)
    .lean();
};

const getOutOfStockProducts = async (companyId, limit = LIST_LIMIT, locationId) => {
  if (locationId) {
    const stocks = await LocationStock.find({
      company: companyId,
      locationId,
      stock: { $lte: 0 },
    }).populate({ path: "product", populate: { path: "category", select: "name" } });

    return stocks
      .filter((item) => item.product)
      .map((item) => ({ ...item.product.toObject(), stock: item.stock }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, limit);
  }

  return Product.find({ company: companyId, stock: { $lte: 0 } })
    .select("name sku barcode price stock category")
    .populate("category", "name")
    .sort({ name: 1 })
    .limit(limit)
    .lean();
};

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
};

const pluralize = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

const formatProductList = (products = []) => {
  if (!products.length) return "No matching product records were found.";

  return products
    .map(
      (product, index) => `${index + 1}. ${product.name}
   Category: ${product.category?.name || "N/A"}
   Price: ${formatCurrency(product.price || 0)}
   Stock: ${product.stock ?? 0}
   SKU: ${product.sku || "N/A"}
   Barcode: ${product.barcode || "N/A"}`,
    )
    .join("\n\n");
};

const formatProductStockList = (products = []) => {
  if (!products.length) return "No product records were found.";

  return products
    .map(
      (product, index) =>
        `${index + 1}. ${product.name} - Stock: ${product.stock ?? 0}`,
    )
    .join("\n");
};

const formatCategoryList = (categories = []) => {
  if (!categories.length) return "No category records were found.";
  return categories
    .map((category, index) => `${index + 1}. ${category.name}`)
    .join("\n");
};

const formatUserList = (users = []) => {
  if (!users.length) return "No user records were found.";

  return users
    .map(
      (user, index) =>
        `${index + 1}. ${user.name}
   Role: ${user.role || "N/A"}
   Status: ${user.status?.value || "N/A"}
   Email: ${user.email || "N/A"}
   Phone: ${user.phone || "N/A"}`,
    )
    .join("\n\n");
};

const formatVendorList = (vendors = []) => {
  if (!vendors.length) return "No vendor records were found.";

  return vendors
    .map(
      (vendor, index) =>
        `${index + 1}. ${vendor.name}
   Phone: ${vendor.phone || "N/A"}
   Email: ${vendor.email || "N/A"}
   Status: ${vendor.status || "N/A"}
   Products: ${vendor.products?.length || 0}
   Address: ${vendor.address || "N/A"}`,
    )
    .join("\n\n");
};

const formatFranchiseList = (franchises = []) =>
  franchises
    .map(
      (franchise, index) =>
        `${index + 1}. ${franchise.locationName}
   Manager: ${franchise.name || "N/A"}
   Email: ${franchise.email || "N/A"}
   Phone: ${franchise.phone || "N/A"}
   Status: ${franchise.status || "N/A"}
   Address: ${franchise.address || "N/A"}`,
    )
    .join("\n\n");

const formatNotificationList = (notifications = []) => {
  if (!notifications.length) return "No notification records were found.";

  return notifications
    .map(
      (notification, index) =>
        `${index + 1}. ${notification.title}
   Type: ${notification.type || "N/A"}
   Status: ${notification.isRead ? "Read" : "Unread"}
   Date: ${formatDate(notification.createdAt)}
   Message: ${notification.message || "N/A"}`,
    )
    .join("\n\n");
};

const formatOrderList = (orders = []) => {
  if (!orders.length) return "No order records were found.";

  return orders
    .map((order, index) => {
      const items = (order.items || [])
        .slice(0, 3)
        .map(
          (item) =>
            `${item.productName || item.productSku || "Product"} x ${item.quantity}`,
        )
        .join(", ");

      return `${index + 1}. ${order.orderNumber}
   Date: ${formatDate(order.createdAt)}
   Customer: ${order.customerName || "N/A"}
   Status: ${order.status || "N/A"}
   Payment: ${order.paymentStatus || "N/A"}
   Total: ${formatCurrency(getOrderTotal(order))}
   Items: ${items || "N/A"}`;
    })
    .join("\n\n");
};

const formatProductHistory = (orders = []) => {
  if (!orders.length) return "No product history records were found.";

  return orders
    .flatMap((order) =>
      (order.items || []).map((item) => ({
        orderNumber: order.orderNumber,
        date: order.createdAt,
        productName: item.productName || item.productSku || "Product",
        sku: item.productSku,
        quantity: item.quantity || 0,
        subtotal: item.subtotal || (item.quantity || 0) * (item.unitPrice || 0),
      })),
    )
    .slice(0, HISTORY_LIMIT)
    .map(
      (record, index) =>
        `${index + 1}. ${record.productName}
   Order: ${record.orderNumber}
   Date: ${formatDate(record.date)}
   SKU: ${record.sku || "N/A"}
   Quantity: ${record.quantity}
   Amount: ${formatCurrency(record.subtotal)}`,
    )
    .join("\n\n");
};

const FRANCHISE_USERS_RESTRICTED_REPLY = `User management is handled at the company (admin) level.

Franchise accounts don't have access to user data. Please contact your company admin for user-related information.`;

// Staff and managers only get these assistant topics.
const LIMITED_ROLES = new Set(["staff", "manager"]);

const LIMITED_ROLE_INTENTS = new Set([
  "greeting",
  "restricted",
  "product_count",
  "low_stock",
  "billing_history",
  "billing_count",
  "order_count",
  "order_list",
  "pending_orders",
  "vendor_count",
  "vendor_list",
  "vendor_details",
  "category_count",
  "category_list",
]);

const LIMITED_ROLE_REPLY = `Your role has access to the following in the assistant:

- Total Products
- Low Stock
- Billing History
- Orders
- Vendor Details
- Categories

Please contact your company admin for other information.`;

const FRANCHISE_LIST_RESTRICTED_REPLY = `Franchise details are managed at the company (admin) level.

Please contact your company admin for franchise information.`;

const SUPPORT_REPLY = `I'm designed specifically to help with this Inventory Management System.

Please ask inventory, products, billing, vendors, orders, stock, reports or dashboard related questions.

Need additional help?

Email:
support@stockflow.com

Phone:
+91-9876543210`;

const greetingReply = `Hello!

Welcome to ExoStock AI Assistant.

I'm your Inventory Management Assistant.

I can help you with:

- Products
- Categories
- Vendors
- Billing
- Inventory
- Revenue
- Dashboard
- Reports

How can I help you today?`;

const inventoryTipsReply = `Inventory Management Tips

- Keep stock updated regularly.
- Monitor low stock products.
- Track inventory value frequently.
- Review billing reports.
- Verify vendor information.
- Check dashboard daily.
- Avoid overstocking.
- Use SKU and barcode for better inventory tracking.`;

const detectIntent = (message = "") => {
  const normalized = normalize(message);

  if (!normalized) return { name: "restricted", query: normalized };
  if (
    /^(hi|hello|hey|hii|hello there|hey there|good morning|good afternoon|good evening)$/.test(
      normalized,
    )
  ) {
    return { name: "greeting", query: normalized };
  }

  if (
    !/inventory|franchise|product|products|stock|low stock|out of stock|quantity|sku|category|categories|vendor|vendors|billing|bill|invoice|invoices|order|orders|sale|sales|revenue|dashboard|user|users|notification|notifications|history|purchase|report|reports|value|movement|details|list|show|find|search|pending|completed|tip|tips|advice|best practice/i.test(
      normalized,
    )
  ) {
    return { name: "restricted", query: normalized };
  }

  if (/franchise/.test(normalized))
    return { name: "franchise_list", query: normalized };
  if (/dashboard|summary|overview/.test(normalized))
    return { name: "dashboard_summary", query: normalized };
  if (/inventory value|stock value|value/.test(normalized))
    return { name: "inventory_value", query: normalized };
  if (
    /inventory summary|stock summary|inventory report|stock report/.test(
      normalized,
    )
  )
    return { name: "inventory_summary", query: normalized };
  if (/today.*sale|sale.*today|today.*revenue/.test(normalized))
    return { name: "todays_sales", query: normalized };
  if (/revenue|income|earning/.test(normalized))
    return { name: "revenue", query: normalized };
  if (/low stock|reorder|running low/.test(normalized))
    return { name: "low_stock", query: normalized };
  if (/out of stock/.test(normalized))
    return { name: "out_of_stock", query: normalized };
  if (
    /billing|bill|invoice|invoices/.test(normalized) &&
    /(how many|count|total|number of|qty|quantity)/.test(normalized)
  ) {
    return { name: "billing_count", query: normalized };
  }
  if (
    /billing history|bill history|completed bills|latest bills|show bills|list bills|bills|bill report|billing report/.test(
      normalized,
    )
  ) {
    return { name: "billing_history", query: normalized };
  }
  if (/product history|stock movement|movement/.test(normalized))
    return { name: "product_history", query: normalized };
  if (/vendor|supplier/.test(normalized)) {
    if (/(how many|count|total|number of|qty|quantity)/.test(normalized))
      return { name: "vendor_count", query: normalized };
    if (/(detail|details|info|information|profile|show)/.test(normalized))
      return { name: "vendor_details", query: normalized };
    return { name: "vendor_list", query: normalized };
  }
  if (/categor/.test(normalized)) {
    if (/(how many|count|total|number of|qty|quantity)/.test(normalized))
      return { name: "category_count", query: normalized };
    return { name: "category_list", query: normalized };
  }
  if (/user|staff|admin/.test(normalized)) {
    if (/(how many|count|total|number of|qty|quantity)/.test(normalized))
      return { name: "user_count", query: normalized };
    return { name: "user_list", query: normalized };
  }
  if (/notification|alert/.test(normalized)) {
    if (
      /(show|list|all|unread|latest|display)/.test(normalized) ||
      /unread/.test(normalized)
    )
      return { name: "notification_list", query: normalized };
    return { name: "notification_count", query: normalized };
  }
  if (/order/.test(normalized)) {
    if (/pending|open/.test(normalized))
      return { name: "pending_orders", query: normalized };
    if (/(show|list|all|history|latest|display)/.test(normalized))
      return { name: "order_list", query: normalized };
    return { name: "order_count", query: normalized };
  }
  if (/search|find/.test(normalized))
    return { name: "product_search", query: normalized };
  if (
    /(detail|details|info|information)/.test(normalized) &&
    /product|sku|barcode/.test(normalized)
  )
    return { name: "product_details", query: normalized };
  if (
    /product|products|item|items|stock|quantity/.test(normalized) &&
    /(how many|count|total|number of|qty|quantity)/.test(normalized)
  )
    return { name: "product_count", query: normalized };
  if (
    /product|products|item|items/.test(normalized) &&
    /(show|list|all|what.*have|display|records|report|reports)/.test(normalized)
  )
    return { name: "product_list", query: normalized };
  if (/product|stock|quantity/.test(normalized))
    return { name: "product_list", query: normalized };

  return { name: "dashboard_summary", query: normalized };
};

export const buildAssistantReply = async ({ message, user }) => {
  const intent = detectIntent(message);
  const companyId = user.company;
  const locationId = getUserLocationId(user);
  const isFranchise = user.role === "franchise";

  if (intent.name === "greeting") {
    return { intent: intent.name, reply: greetingReply };
  }

  if (intent.name === "restricted") {
    return { reply: SUPPORT_REPLY, intent: intent.name };
  }

  if (LIMITED_ROLES.has(user.role) && !LIMITED_ROLE_INTENTS.has(intent.name)) {
    return { intent: intent.name, reply: LIMITED_ROLE_REPLY };
  }

  if (intent.name === "product_count") {
    const [stats, products] = await Promise.all([
      getProductStats(companyId, locationId),
      getProductStockList(companyId, locationId),
    ]);
    const moreNote =
      stats.totalProducts > products.length
        ? `\n\nShowing ${products.length} of ${stats.totalProducts} products.`
        : "";

    return {
      intent: intent.name,
      reply: `There are currently ${pluralize(stats.totalProducts, "active product")} with ${pluralize(stats.totalUnits, "unit")} in stock.

${formatProductStockList(products)}${moreNote}`,
    };
  }

  if (intent.name === "product_list") {
    const products = await findProducts(companyId, "", LIST_LIMIT, locationId);
    return {
      intent: intent.name,
      reply: `Current Products\n\n${formatProductList(products)}`,
    };
  }

  if (intent.name === "product_details" || intent.name === "product_search") {
    const products = await findProducts(companyId, intent.query, LIST_LIMIT, locationId);
    return {
      intent: intent.name,
      reply: products.length
        ? `Matching Product Records\n\n${formatProductList(products)}`
        : "I could not find a matching product. Try searching by product name, SKU, or barcode.",
    };
  }

  if (intent.name === "inventory_value") {
    const stats = await getProductStats(companyId, locationId);
    return {
      intent: intent.name,
      reply: `Current Inventory Value\n\n${formatCurrency(stats.inventoryValue)}`,
    };
  }

  if (intent.name === "inventory_summary") {
    const [stats, lowStockProducts] = await Promise.all([
      getProductStats(companyId, locationId),
      getLowStockProducts(companyId, 5, locationId),
    ]);

    return {
      intent: intent.name,
      reply: `Inventory Summary

Products: ${stats.totalProducts}
Total stock: ${stats.totalUnits}
Inventory value: ${formatCurrency(stats.inventoryValue)}
Low stock products: ${stats.lowStockCount}
Out of stock products: ${stats.outOfStockCount}

Low Stock Records

${formatProductList(lowStockProducts)}`,
    };
  }

  if (intent.name === "low_stock") {
    const products = await getLowStockProducts(companyId, LIST_LIMIT, locationId);
    return {
      intent: intent.name,
      reply: products.length
        ? `Low Stock Products\n\n${formatProductList(products)}`
        : "No products are currently below their low-stock threshold.",
    };
  }

  if (intent.name === "out_of_stock") {
    const products = await getOutOfStockProducts(companyId, LIST_LIMIT, locationId);
    return {
      intent: intent.name,
      reply: products.length
        ? `Out of Stock Products\n\n${formatProductList(products)}`
        : "No products are currently out of stock.",
    };
  }

  if (intent.name === "todays_sales") {
    const [sales, orders] = await Promise.all([
      getRevenue(companyId, locationId, getTodayRange()),
      Order.find({
        company: companyId,
        status: "completed",
        createdAt: getTodayRange(),
        ...(locationId ? { locationId } : {}),
      })
        .select(
          "orderNumber customerName status paymentStatus items total totalAmount createdAt",
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return {
      intent: intent.name,
      reply: `Today's Sales

Revenue: ${formatCurrency(sales.totalRevenue)}
Bills today: ${sales.totalOrders}

Latest Bills

${formatOrderList(orders)}`,
    };
  }

  if (intent.name === "revenue") {
    const revenue = await getRevenue(companyId, locationId);
    return {
      intent: intent.name,
      reply: `Total Revenue

Revenue: ${formatCurrency(revenue.totalRevenue)}
Completed orders: ${revenue.totalOrders}`,
    };
  }

  if (intent.name === "billing_count") {
    const count = await Order.countDocuments({
      company: companyId,
      status: "completed",
      ...(locationId ? { locationId } : {}),
    });
    return {
      intent: intent.name,
      reply: `There are ${pluralize(count, "completed bill")} in billing history.`,
    };
  }

  if (intent.name === "billing_history") {
    const orders = await Order.find({
      company: companyId,
      status: "completed",
      ...(locationId ? { locationId } : {}),
    })
      .select(
        "orderNumber customerName status paymentStatus items total totalAmount createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(HISTORY_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `Latest Billing History\n\n${formatOrderList(orders)}`,
    };
  }

  if (intent.name === "order_count") {
    const [completed, pending] = await Promise.all([
      Order.countDocuments({
        company: companyId,
        status: "completed",
        ...(locationId ? { locationId } : {}),
      }),
      Order.countDocuments({
        company: companyId,
        status: { $ne: "completed" },
        ...(locationId ? { locationId } : {}),
      }),
    ]);

    return {
      intent: intent.name,
      reply: `Orders Summary

Completed orders: ${completed}
Open or pending orders: ${pending}`,
    };
  }

  if (intent.name === "pending_orders" || intent.name === "order_list") {
    const filter = {
      company: companyId,
      ...(locationId ? { locationId } : {}),
      ...(intent.name === "pending_orders"
        ? { status: { $in: ["pending", "processing"] } }
        : {}),
    };
    const orders = await Order.find(filter)
      .select(
        "orderNumber customerName status paymentStatus items total totalAmount createdAt",
      )
      .sort({ createdAt: -1 })
      .limit(HISTORY_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `${intent.name === "pending_orders" ? "Pending Orders" : "Latest Orders"}\n\n${formatOrderList(orders)}`,
    };
  }

  if (intent.name === "vendor_count") {
    const [active, total] = await Promise.all([
      Vendor.countDocuments({ companyId, status: "active" }),
      Vendor.countDocuments({ companyId }),
    ]);

    return {
      intent: intent.name,
      reply: `There are ${pluralize(active, "active vendor")}.
Total vendors: ${total}`,
    };
  }

  if (intent.name === "vendor_list" || intent.name === "vendor_details") {
    const vendors = await Vendor.find({ companyId })
      .select(
        "name phone email status address products totalSupplyRequests averageProductQuality",
      )
      .populate("products", "name sku stock")
      .sort({ name: 1 })
      .limit(LIST_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `Vendor Records\n\n${formatVendorList(vendors)}`,
    };
  }

  if (intent.name === "category_count") {
    const count = await Category.countDocuments({ company: companyId });
    return {
      intent: intent.name,
      reply: `There are ${pluralize(count, "category")} in your inventory system.`,
    };
  }

  if (intent.name === "category_list") {
    const categories = await Category.find({ company: companyId })
      .select("name")
      .sort({ name: 1 })
      .limit(LIST_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `Categories\n\n${formatCategoryList(categories)}`,
    };
  }

  if (intent.name === "franchise_list") {
    if (isFranchise) {
      return { intent: intent.name, reply: FRANCHISE_LIST_RESTRICTED_REPLY };
    }

    const franchises = await Franchise.find({
      company: companyId,
      isDefault: { $ne: true },
    })
      .select("locationName name email phone address status")
      .sort({ locationName: 1 })
      .lean();

    return {
      intent: intent.name,
      reply: franchises.length
        ? `Franchises (${franchises.length})\n\n${formatFranchiseList(franchises)}`
        : "No franchises have been created yet.",
    };
  }

  if (intent.name === "user_count") {
    if (isFranchise) {
      return { intent: intent.name, reply: FRANCHISE_USERS_RESTRICTED_REPLY };
    }

    const [active, total] = await Promise.all([
      User.countDocuments({ company: companyId, "status.value": "active" }),
      User.countDocuments({ company: companyId }),
    ]);

    return {
      intent: intent.name,
      reply: `Users Summary

Active users: ${active}
Total users: ${total}`,
    };
  }

  if (intent.name === "user_list") {
    if (isFranchise) {
      return { intent: intent.name, reply: FRANCHISE_USERS_RESTRICTED_REPLY };
    }

    const users = await User.find({ company: companyId })
      .select("name role status email phone")
      .sort({ name: 1 })
      .limit(LIST_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `Users\n\n${formatUserList(users)}`,
    };
  }

  if (intent.name === "notification_count") {
    const [unread, total] = await Promise.all([
      Notification.countDocuments({ company: companyId, isRead: false }),
      Notification.countDocuments({ company: companyId }),
    ]);

    return {
      intent: intent.name,
      reply: `Notifications Summary

Unread notifications: ${unread}
Total notifications: ${total}`,
    };
  }

  if (intent.name === "notification_list") {
    const filter = { company: companyId };
    if (/unread/.test(intent.query)) filter.isRead = false;

    const notifications = await Notification.find(filter)
      .select("title message type isRead createdAt")
      .sort({ createdAt: -1 })
      .limit(LIST_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `${filter.isRead === false ? "Unread Notifications" : "Latest Notifications"}\n\n${formatNotificationList(notifications)}`,
    };
  }

  if (intent.name === "product_history") {
    const orders = await Order.find({
      company: companyId,
      status: "completed",
      ...(locationId ? { locationId } : {}),
    })
      .select("orderNumber items createdAt")
      .sort({ createdAt: -1 })
      .limit(HISTORY_LIMIT)
      .lean();

    return {
      intent: intent.name,
      reply: `Latest Product History\n\n${formatProductHistory(orders)}`,
    };
  }

  const [stats, revenue, categories, users, vendors, orders, todaySales] =
    await Promise.all([
      getProductStats(companyId, locationId),
      getRevenue(companyId, locationId),
      Category.countDocuments({ company: companyId }),
      isFranchise ? null : User.countDocuments({ company: companyId }),
      Vendor.countDocuments({ companyId }),
      Order.countDocuments({
        company: companyId,
        ...(locationId ? { locationId } : {}),
      }),
      getRevenue(companyId, locationId, getTodayRange()),
    ]);

  return {
    intent: "dashboard_summary",
    reply: `Dashboard Summary

Products: ${stats.totalProducts}
Categories: ${categories}
${isFranchise ? "" : `Users:${users}\n`}Vendors: ${vendors}
Inventory value: ${formatCurrency(stats.inventoryValue)}
Revenue: ${formatCurrency(revenue.totalRevenue)}
Today's sales: ${formatCurrency(todaySales.totalRevenue)}
Low stock: ${stats.lowStockCount}
Orders: ${orders}`,
  };
};
