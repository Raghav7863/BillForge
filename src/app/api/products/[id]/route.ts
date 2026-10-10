import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Business from "@/models/Business";
import Product from "@/models/Product";
import User from "@/models/User";
import { desc } from "framer-motion/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, context: {
    params: Promise<{
        id: string;
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

        const product = await Product.findOne({
            _id: id,
            businessId: user.businessId
        })

        if (!product) {
            return NextResponse.json({
                message: "Product not found"
            }, {status: 404})
        }

        return NextResponse.json({
            message: "Product fetched successfully"
        }, {status: 200})

    } catch (error) {
        
        console.error("Product fetch error", error);

        return NextResponse.json({
            message: "Failed to fetch product"
        }, {status: 400})

    }

}

export async function PUT(req:NextRequest, context: {
    params: Promise<{
        id: string;
    }>
}) {
    
    try {
        
        const session = await auth();

        if (!session) {
            return NextResponse.json({
                message: "Unauthorized"
            }, {status: 401})
        }

        const { id } = await context.params;

        const { name, description, type, price, taxRate, unit } = await req.json();

        if (!name || !description || !type || !price || !taxRate || !unit) {
            return NextResponse.json({
                message: "All fields are required"
            }, {status: 400})
        }

        if (price === undefined || price === null || Number(price) < 0) {
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

        const product = await Product.findOneAndUpdate({
            _id: id,
            businessId: user.businessId
        }, {
            name,
            description,
            type: type === "service" ? "service" : "product",
            price: Number(price),
            taxRate: taxRate !== undefined ? Number(taxRate) : 0,
            unit: unit || "piece"
        }, {
            new: true,
            runValidators: true
        })

        if (!product) {
            return NextResponse.json({
                message: "Product not found"
            }, {status: 404})
        }

        return NextResponse.json({
            message: "Failed to update product",
            product
        }, {status: 200})

    } catch (error) {
        
        console.error("Product Update Error", error);

        return NextResponse.json({
            message: "Failed to Update product"
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

        if (!id) {
            return NextResponse.json({
                message: "User id is required"
            }, {status: 500})
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

        const product = await Product.findOneAndDelete({
            _id: id,
            businessId: user.businessId
        })

        if (!product) {
            return NextResponse.json({
                message: "Product not found"
            }, {status: 404})
        }

        return NextResponse.json({
            message: "Product Deleted Successfully"
        }, {status: 200})


    } catch (error) {
        
        console.error("Delete Product Error", error);

        return NextResponse.json({
            message: "Failed to Delete Prodcut"
        }, {status: 400})

    }

}