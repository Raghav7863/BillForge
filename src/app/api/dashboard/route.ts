import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Client from "@/models/Client";
import Invoice from "@/models/Invoice";
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

        const user = session.user as {
            id: string,
            businessId?: string
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found"
            }, { status: 404 })
        }

        const businessId = user.businessId;

        const invoices = await Invoice.find({ businessId })
            .populate("clientId", "name")
            .sort({ createdAt: -1 })
            .lean();

        const clientsCount = await Client.countDocuments({
            businessId
        })

        const totalInvoices = invoices.length;

        const paidInvoices = invoices.filter(
            (invoice) => invoice.status === "paid"
        );

        const pendingInvoices = invoices.filter(
            (invoice) => invoice.status !== "paid" && invoice.status !== "cancelled"
        )

        const totalRevenue = paidInvoices.reduce(
            (sum, invoice) => sum + invoice.total,
            0
        )

        const pendingAmount = pendingInvoices.reduce(
            (sum, invoice) => sum + invoice.total,
            0
        )

        const revenueOverTime = paidInvoices.map((invoice) => ({
            date: invoice.createdAt,
            amount: invoice.total,
        }));

        return NextResponse.json({
            totalRevenue,
            pendingAmount,
            totalInvoices,
            clientsCount,
            paidInvoices: paidInvoices.length,
            recentInvoices: invoices.slice(0, 5),
            revenueOverTime
        })



    } catch (error) {

        console.log("Dashboard Error", error);

        return NextResponse.json({
            message: "Failed to fetch dashboard data"
        }, { status: 500 })

    }

}