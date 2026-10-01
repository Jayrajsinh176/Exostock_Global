import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
    company : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Company',
        required : true,
    },
franchise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Franchise",
    default: null,
},

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    invoiceNumber : {
        type : String,
        unique : true,
        required : true,
    },
    order : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Order',
        required : true,
    },
    subtotal : {
        type : Number,
        required : true,
    },
    tax : {
        type : Number,
        default : 0,
    },
    discount : {
        type : Number,
        default : 0,
    },
    amount : {
        type : Number,
        required : true,
    },
    status : {
        type : String,
        enum : ['paid','unpaid'],
        default : 'unpaid',
    },
    issueDate : {
        type : Date,
        default : Date.now,
    },
    dueDate : {
        type : Date,
    },
    paidDate : {
        type : Date,
    },
    paymentMethod : {
        type : String,
        enum : ['online', 'cash'],
    },
    transactionId : {
        type : String,
    },
    notes : String,
})

const Invoice = mongoose.model('Invoice',invoiceSchema);

export default Invoice;