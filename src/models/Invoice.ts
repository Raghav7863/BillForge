import { number } from "framer-motion";
import mongoose, {Document, Schema} from "mongoose";

export interface IInvoiceItem extends Document{
    productId: Schema.Types.ObjectId;
    name: string;
    description?: string;
    quantity: number;
    price: number;
    taxRate: number;
    total: number;
    unit: string;
}

export interface IInvoice extends Document{
    businessId: Schema.Types.ObjectId;
    clientId: Schema.Types.ObjectId;
    invoiceNumber: string;
    issueDate: Date;
    dueDate: Date;
    items: IInvoiceItem[];
    subTotal: number;
    taxAmount: number;
    total: number;
    notes: string;
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

const invoiceItemSchema:Schema = new Schema<IInvoiceItem>({

    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    taxRate: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        default: "piece"
    },
    

}, {_id: false})

const invoiceSchema:Schema = new Schema<IInvoice>({
    businessId: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true,
        index: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    items: {
        type: [invoiceItemSchema],
        required: true,
        validate: {
            validator: function (
                items: IInvoiceItem[]
            ) {
                return items.length > 0;
            },
            message: "Invoice Must Contain at least one item"
        }
    },
    subTotal: {
        type: Number,
        required: true,
        min: 0
    },
    taxAmount: {
        type: Number,
        required: true,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["draft", "sent", "paid", "overdue", "cancelled",],
        default: "draft"
    }

}, {timestamps: true})

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;