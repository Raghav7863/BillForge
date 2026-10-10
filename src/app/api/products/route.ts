import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    try {
        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

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

        const products = await Product.find({
            businessId: user.businessId
        }).sort({
            createdAt: -1
        })

        return NextResponse.json({
            message: "Products Fetched Successfully",
            products
        }, { status: 200 })


    } catch (error) {
        console.error("Get products error ", error);

        return NextResponse.json({
            message: "Failed to fetch clients"
        }, { status: 400 })
    }

}

export async function POST(req: NextRequest) {

    try {

        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { name, description, type, price, taxRate, unit, quantity } = await req.json();

        console.log(name, description, type, price, taxRate, unit);

        if (!name || !description || !type || !price || !taxRate || !unit) {
            return NextResponse.json({
                message: "All Fields are Required"
            }, {status: 400})
        }

        if ( price == undefined || price == null || Number(price)<0 ) {
            return NextResponse.json({
                message: "Valid price is required"
            }, {status: 400})
        }

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

        const product = await Product.create({
            businessId: user.businessId,
            name,
            description: description || "",
            type: type === "service" ? "service" : "product",
            price: Number(price),
            taxRate: taxRate !== undefined ? Number(taxRate) : 0,
            unit: unit || "piece",
            quantity: quantity || 1
        })

        return NextResponse.json({
            message: "Product Created Successfully",
            product
        }, {status: 201})

    } catch (error) {

        console.error("Create Product Error", error);

        return NextResponse.json({
            message: "Failed to create product"
        }, {status: 400})

    }

}