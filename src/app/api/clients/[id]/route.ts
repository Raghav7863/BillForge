import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Client from "@/models/Client";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: {
    params: Promise<{
        id: string;
    }>
}) {

    try {

        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const id = await context.params;

        await connectDb();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found"
            }, { status: 404 })
        }

        const client = await Client.findOne({
            _id: id.id,
            businessId: user.businessId
        })

        if (!client) {
            return NextResponse.json({
                message: "Client not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Client fetched successfully",
            client
        }, { status: 200 })

    } catch (error) {
        console.error("Failed to fetch client", error);

        return NextResponse.json({
            message: "Failed to fetch client"
        }, { status: 400 })
    }

}

export async function PUT(req: NextRequest, context: {
    params: Promise<{
        id: string
    }>
}) {

    try {

        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { id } = await context.params;

        const { name, email, phone, company, address, city, state, postalCode, country, gstin } = await req.json();

        await connectDb();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({
                message: "User not found"
            }, { status: 404 })
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found"
            }, { status: 404 })
        }

        const client = await Client.findOneAndUpdate({
            _id: id,
            businessId: user.businessId
        }, {
            name: name,
            email: email,
            phone: phone,
            company: company,
            address: address,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country,
            gstin: gstin
        }, { new: true, runValidators: true })

        if (!client) {
            return NextResponse.json({
                message: "Client not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            message: "Client Updated successfully"
        }, { status: 200 })

    } catch (error) {
        console.error("Failed to update client", error);

        return NextResponse.json({
            message: "Failed to update client"
        }, {status: 400})
    }
    
}

export async function DELETE(req:NextRequest, context: {
    params: Promise<{
        id: string
    }>
}) {
    
    try {
        
        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {status: 401})
        }

        const {id} = await context.params;

        await connectDb();

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

        const client = await Client.findOneAndDelete({
            _id: id,
            businessId: user.businessId
        })

        if (!client) {
            return NextResponse.json({
                message: "Client not found"
            }, {status: 404})
        }

        return NextResponse.json({
            message: "Client Deleted Successfully"
        }, {status: 200})

    } catch (error) {
        
        console.error("Delete client error", error);

        return NextResponse.json({
            message: "Failed to delete client"
        }, {status: 400})

    }

}