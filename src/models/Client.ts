import mongoose, { Document, Schema } from "mongoose";

interface IClient extends Document {
    businessId: mongoose.Schema.Types.ObjectId,
    name?: string,
    email?: string,
    phone?: string,
    company?: string,
    city?: string,
    state?: string,
    postalCode?: number,
    country?: string,
    address?: string,
    gstin?: string,
    notes?: string
}

const clientSchema: Schema = new mongoose.Schema<IClient>({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business"
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    city: {
        type: String
    },
    postalCode: {
        type: Number
    },
    country: {
        type: String
    },
    address: {
        type: String
    },
    state: {
        type: String
    },
    gstin: {
        type: String
    },
    notes: {
        types: String
    }
}, { timestamps: true })

const Client = mongoose.models.Client || mongoose.model("Client", clientSchema);

export default Client;