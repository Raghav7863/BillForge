import mongoose, { Schema } from "mongoose";

interface IProduct extends Document {
    businessId: Schema.Types.ObjectId,
    name: string,
    description: string,
    type: "product" | "service",
    price: number,
    taxRate: number,
    quantity: number,
    unit: string,
}

const proudctSchema:Schema = new Schema<IProduct>({

    businessId: {
        type: Schema.Types.ObjectId,
        ref: "Business",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    type: {
        type: String,
        enum: ["product", "service"],
        default: "product"
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
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unit: {
        type: String,
        default: "piece"
    }

}, {timestamps: true})

const Product = mongoose.models.Product || mongoose.model("Product", proudctSchema);

export default Product;