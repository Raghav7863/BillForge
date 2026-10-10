import Client from "@/models/Client";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {

    try {
        await connectDb();

        const session = await auth();

        if (!session?.user) {
            return NextResponse.json({
                message: "No Session Provided"
            }, { status: 400 })
        }

        const user = await User.findById(session?.user.id);

        if (!user) {
            return NextResponse.json({
                message: "user not found"
            }, { status: 404 })
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found"
            }, { status: 404 })
        }

        const clients = await Client.find({
            businessId: user.businessId
        }).sort({
            createdAt: -1
        })

        return NextResponse.json({
            message: "Clients fetched Successfully",
            clients
        }, { status: 200 })
    } catch (error) {
        console.error("Get Clients Error", error)

        return NextResponse.json({
            message: "Failed to fetch clients"
        }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {

    try {

        const session = await auth();

        await connectDb();

        if (!session?.user) {
            return NextResponse.json({
                message: "Please Login First"
            }, { status: 400 })
        }

        const { name, email, phone, company, address, gstin, notes, city, state, postalCode, country } = await req.json();

        if (!name) {
            return NextResponse.json({
                message: "client name is required"
            }, {status: 400})
        }

        console.log(session.user.id);

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, {status: 404})
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found"
            }, {status: 404})
        }

        const CreatedClient = await Client.create({
            businessId: user.businessId,
            name,
            email,
            phone,
            company,
            city,
            state,
            postalCode,
            country,
            address,
            gstin,
            notes
        })

        return NextResponse.json({
            message: "Client Added Successfully",
            CreatedClient
        }, { status: 201 })

    } catch (error) {
        console.error("Create Client Error", error);

        return NextResponse.json({
            message: "Failed to create client"
        }, {status: 500})
    }

}