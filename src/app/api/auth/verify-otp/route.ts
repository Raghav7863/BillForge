import connectDb from "@/lib/db";
import User from "@/models/User";
import { awaitAllCallbacks } from "@langchain/core/callbacks/promises";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    
    try {
       
        await connectDb();

        const {userId, otp} = await req.json();

        if (!userId || !otp) {
            return NextResponse.json({
                message: "User Id and OTP is Required"
            }, {status: 400})
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, {status: 404})
        }

        if (user.isVerified) {
            return NextResponse.json({
                message: "User Already Verified"
            }, {status: 400})
        }

        if (!user.otp || !user.otpExpiresAt) {
            return NextResponse.json({
                message: "OTP not Found"
            }, {status: 400})
        }

        if (new Date() > user.otpExpiresAt) {
            return NextResponse.json({
                message: "OTP has expired",
            }, {status: 400})
        }

        const isOtpValid = await bcrypt.compare(otp, user.otp);

        if (!isOtpValid) {
            return NextResponse.json({
                message: "Invalid OTP"
            }, {status: 400})
        }

        user.isVerified = true;
        user.otp = null;
        user.otpExpiresAt = null;

        await user.save();

        return NextResponse.json({
            message: "Email Verified Successfully"
        }, {status: 201})

    } catch (error) {
        
        console.error(error);

        return NextResponse.json({
            message: "something went wrong"
        }, {status: 500})

    }

}