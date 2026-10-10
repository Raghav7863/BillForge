import connectDb from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Business from "@/models/Business";
import { NextRequest, NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/transporter";
import { generateOTP } from "@/lib/otpGenerator";

export async function POST(req: NextRequest) {
    try {

        const { name, email, password } = await req.json();

        await connectDb();

        if (!name || !email || !password) {
            return NextResponse.json({
                message: "All Field's are Required"
            }, { status: 400 })
        }

        const UserAlreadyExits = await User.findOne({
            email
        })

        if (UserAlreadyExits) {
            return NextResponse.json({
                message: "User Already Exists"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const generatedotp = generateOTP();

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const hashedOtp = await bcrypt.hash(generatedotp, 10);

        const createdUser = await User.create({
            name,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            otpExpiresAt: expiresAt
        })

        const createBusiness = await Business.create({
            ownerId: createdUser._id,
            email: email,
            logo: "",
            phone: "",
            address: "",
            gstin: "",
            currency: "INR",
            invoicePrefix: "INV",
        })

        createdUser.businessId = createBusiness._id;

        await createdUser.save();

        await sendOTPEmail(email, generatedotp);

        return NextResponse.json(
            {
                message: "Registration successful. OTP sent to your email.",
                userId: createdUser._id.toString(),
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }

}