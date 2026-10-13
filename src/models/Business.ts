import mongoose, { Document, Schema } from "mongoose";

interface IBusiness extends Document {
    name?: string
    logo?: string,
    email?: string,
    phone?: string,
    address?: string,
    gstin?: string,
    currency?: string,
    invoicePrefix?: string,
    ownerId?: mongoose.Schema.Types.ObjectId
}

const businessSchema:Schema = new mongoose.Schema<IBusiness>({
    name: {
        type: String,
        default: ""
    },
    logo: {
        type: String, 
        default: ""
    },
    email: {
        type: String,
        unique: true,
    },
    phone: {
        type: String,
        default: undefined,
        trim: true
    },
    address: {
        type: String,
        default: ""
    },
    gstin: {
        type: String,
        default: ""
    },
    currency: {
        type: String,
        default: ""
    },
    invoicePrefix: {
        type: String,
        default: ""
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

const Business = mongoose.models.Business || mongoose.model("Business", businessSchema);

export default Business;