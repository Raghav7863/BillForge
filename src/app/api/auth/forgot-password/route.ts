import connectDb from "@/lib/db";
import { generateOTP } from "@/lib/otpGenerator";
import User from "@/models/User";
import { getJestSWCOptions } from "next/dist/build/swc/options";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/transporter";

export async function POST(req: NextRequest) {

    try {

        await connectDb();

        const body = await req.json();

        const { action } = body;

        if (action === "REQUEST_OTP") {

            const { email } = body;

            if (!email || typeof email !== "string") {
                return NextResponse.json({
                    error: "A Valid Email Address is Required."
                }, { status: 400 })
            }

            const formatedEmail = email.trim().toLowerCase();

            const user = await User.findOne({
                email: formatedEmail
            })

            if (!user) {
                return NextResponse.json({
                    message: "If an account already exists, a verification code has been sent."
                }, { status: 200 })
            }

            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            const hashedOtp = await bcrypt.hash(otp, 10);

            user.Resetotp = hashedOtp;
            user.ResetotpExpiresAt = otpExpires;

            await sendOTPEmail(formatedEmail, otp);

            await user.save();

            return NextResponse.json({
                message: "If an account exists, a verification code has been sent."
            }, { status: 200 })

        }

        if (action === "VERIFY_OTP") {
            const { email, otp } = body;

            if (!email || !otp) {
                return NextResponse.json({
                    error: "Email and Verification code are required."
                }, { status: 400 });
            }

            const formattedEmail = email.trim().toLowerCase();
            const user = await User.findOne({ email: formattedEmail });

            if (!user || !user.Resetotp || !user.ResetotpExpiresAt) {
                return NextResponse.json({
                    error: "Invalid or Expired Verification Code."
                }, { status: 400 });
            }

            const isOtpValid = await bcrypt.compare(otp, user.Resetotp);

            if (!isOtpValid || new Date() > new Date(user.ResetotpExpiresAt)) {
                return NextResponse.json({
                    error: "Invalid or Expired Verification Code."
                }, { status: 400 });
            }

            user.Resetotp = null;
            user.ResetotpExpiresAt = null;
            await user.save(); 

            let JWT_SECRET = process.env.AUTH_SECRET;

            const resetToken = jwt.sign({
                userId: user._id,
                email: user.email,
                purpose: "password_reset"
            }, JWT_SECRET!, { expiresIn: "15m" });

            return NextResponse.json({
                message: "OTP verified successfully",
                resetToken
            }, { status: 200 });
        }

        if (action === "RESET_PASSWORD") {

            const { resetToken, newPassword } = body;

            if (!resetToken || !newPassword) {
                return NextResponse.json({
                    message: "Reset token and new password is required."
                }, { status: 400 })
            }

            let JWT_SECRET = process.env.AUTH_SECRET;

            let decoded;

            try {

                decoded = jwt.verify(resetToken, JWT_SECRET!);

            } catch (error) {
                return NextResponse.json({
                    message: "Session expired or invalid reset token. Please restart."
                }, { status: 401 })
            }

            if (decoded.purpose !== "password_reset") {
                return NextResponse.json({
                    error: "Invalid token type"
                }, { status: 400 })
            }

            const user = await User.findOne({
                email: decoded.email
            })

            if (!user) {
                return NextResponse.json({
                    message: "User not found"
                }, { status: 404 })
            }

            const newPasswordHash = await bcrypt.hash(newPassword, 10);

            user.password = newPasswordHash;

            await user.save();

            return NextResponse.json({
                message: "Password Updated Successfully"
            }, { status: 200 })
        }

        return NextResponse.json({
            error: "Invalid action type"
        }, { status: 400 })

    } catch (error) {

        console.error("Password Reset Error: ", error);

        return NextResponse.json({
            error: "An Unexpected Error occured. Please try again"
        }, { status: 500 })

    }

}