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

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || !name.trim() || !email.trim() || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser?.isVerified === true) {
            return NextResponse.json(
                {
                    message: "User already exists. Please log in.",
                },
                { status: 409 }
            );
        }

        const generatedotp = generateOTP();

        const hashedOtp = await bcrypt.hash(String(generatedotp), 10);

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        if (existingUser) {
            existingUser.otp = hashedOtp;
            existingUser.otpExpiresAt = expiresAt;

            await existingUser.save();

            await sendOTPEmail(normalizedEmail, String(generatedotp));

            return NextResponse.json(
                {
                    message: "Your account is awaiting verification. A new OTP has been sent to your email.",
                    userId: existingUser._id.toString(),
                },
                { status: 200 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            otp: hashedOtp,
            otpExpiresAt: expiresAt,
            isVerified: false,
        });

        const createBusiness = await Business.create({
            ownerId: createdUser._id,
            email: normalizedEmail,
            logo: "",
            address: "",
            gstin: "",
            currency: "INR",
            invoicePrefix: "INV",
        });

        createdUser.businessId = createBusiness._id;

        await createdUser.save();

        await sendOTPEmail(
            normalizedEmail,
            String(generatedotp)
        );

        return NextResponse.json(
            {
                message: "Registration successful. OTP sent to your email.",
                userId: createdUser._id.toString(),
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle concurrent requests for the same email
        if (error?.code === 11000) {
            return NextResponse.json(
                {
                    message: "This email is already registered. Please try logging in or request a new verification OTP.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                message: error.message || "Something went wrong",
            },
            { status: 500 }
        );
    }
}