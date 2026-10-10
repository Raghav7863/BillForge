import Business from "@/models/Business";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const { name, email, phone, address, currency, ownerId } = await req.json();

    const createdBusiness = await Business.create({
        name,
        email,
        phone,
        address,
        currency,
        ownerId
    })

    const hashedPassword = await bcrypt.hash(password, 10);

    const generatedotp = generateOTP();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const hashedOtp = await bcrypt.hash(generatedotp, 10);

    return NextResponse.json({
        message: "Business Created Successfully",
        createdBusiness
    }, { status: 201 })

}