import mongoose from 'mongoose';

const supplyRequestSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    locationId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Franchise",
  default: null,
  index: true,
},
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    requestNumber: {
      type: String,
      unique: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    expectedDeliveryDate: {
      type: Date,
      required: true,
    },
    actualDeliveryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
    shopName: {
      type: String,
      trim: true,
      default: '',
    },
    ownerName: {
      type: String,
      trim: true,
      default: '',
    },
    ownerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    ownerPhone: {
      type: String,
      trim: true,
      default: '',
    },
    vendorResponseNotes: {
      type: String,
      trim: true,
      default: '',
    },
    quotedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    paidAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'cash', 'bank_transfer', 'upi', 'other'],
      default: 'online',
    },
    paymentReference: {
      type: String,
      trim: true,
      default: '',
    },
    invoiceNumber: {
      type: String,
      trim: true,
      default: '',
    },

    purchaseNumber: {
      type: String,
      trim: true,
      default: "",
    },

    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isOnTime: {
      type: Boolean,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);


supplyRequestSchema.index({ vendorId: 1, companyId: 1 });
supplyRequestSchema.index({ status: 1 });
supplyRequestSchema.index({ expectedDeliveryDate: 1 });

export default mongoose.model('SupplyRequest', supplyRequestSchema);
