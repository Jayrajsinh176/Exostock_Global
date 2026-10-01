import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    // NEW
franchise: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Franchise",
  default: null,
},

// NEW
createdBy: {
  type: String,
  enum: ["company", "franchise"],
  default: "company",
},

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,           
        productSku: String,            
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'failed'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now,
        },
        reason: String,  
      },
    ],
    paymentMethod: {
      type: String,
      enum: ['online', 'cash'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paidAt: Date,
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    notes: String,
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    stockAdjustments: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        quantity: Number,
        adjustedAt: Date,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
 locationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Franchise",
  default: null,
  index: true,
},
  },
  { timestamps: true }
);

orderSchema.index({ company: 1, createdAt: -1 });
orderSchema.index({ company: 1, status: 1 });
orderSchema.index({ company: 1, user: 1 });
orderSchema.index({
  company: 1,
  franchise: 1,
  createdAt: -1,
});
// orderSchema.index({ orderNumber: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;