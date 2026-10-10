import mongoose, {Document, Schema} from "mongoose";

interface IUser extends Document {
    name: string,
    email: string,
    password?: string,
    businessId?: mongoose.Schema.Types.ObjectId,
    otp?: string,
    isVerified?: boolean,
    otpExpiresAt?: Date,
    provider: string
}

const userSchema:Schema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business"
    },
    otp: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpExpiresAt: {
        type: Date,
    },
    provider: {
        type: String,
        default: "credentials"
    }
}, {timestamps: true})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;