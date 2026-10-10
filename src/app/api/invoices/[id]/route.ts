import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";

import User from "@/models/User";
import Invoice from "@/models/Invoice";
import Client from "@/models/Client";
import Product from "@/models/Product";
import connectDb from "@/lib/db";

export async function GET(request: Request,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        // ==========================================
        // 1. CHECK AUTHENTICATION
        // ==========================================

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized",
            }, { status: 401 });
        }

        // ==========================================
        // 2. GET INVOICE ID
        // ==========================================

        const { id } = await context.params;

        // ==========================================
        // 3. CONNECT DATABASE
        // ==========================================

        await connectDB();

        // ==========================================
        // 4. FIND USER
        // ==========================================

        const user = await User.findById(
            session.user.id
        );

        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 });
        }

        // ==========================================
        // 5. CHECK BUSINESS
        // ==========================================

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found",
            }, { status: 404 });
        }

        // ==========================================
        // 6. FIND INVOICE
        // ==========================================

        const invoice = await Invoice.findOne({
            _id: id,
            businessId: user.businessId,
        }).populate(
            "clientId",
            "name email phone address"
        )
            .populate(
                "businessId",
                "name logo email phone address gstin currency invoicePrefix"
            );

        if (!invoice) {
            return NextResponse.json({
                message: "Invoice not found",
            }, { status: 404 });
        }


        if (invoice && invoice.status !== "paid" && invoice.status !== "cancelled" && new Date(invoice.dueDate) < new Date()) {
            invoice.status = "overdue";

            await invoice.save();
        }

        if (invoice.status === "sent" && new Date(invoice.dueDate) < new Date()) {
            invoice.status = "overdue";

            await invoice.save();
        }
        
        
        return NextResponse.json({
            message: "Invoice fetched successfully",
            invoice,
        }, { status: 200 });

    } catch (error) {
        console.error(
            "GET SINGLE INVOICE ERROR:",
            error
        );

        return NextResponse.json({
            message: "Failed to fetch invoice",
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: {
    params: Promise<{
        id: string;
    }>;
}
) {
    try {
        // ==========================================
        // 1. CHECK AUTHENTICATION
        // ==========================================

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized",
            }, { status: 401 }
            );
        }

        const { id } = await context.params;


        const { clientId, issueDate, dueDate, items, notes, status } = await req.json();


        if (!clientId) {
            return NextResponse.json({
                message: "Client is required",
            }, { status: 400 }
            );
        }

        if (!issueDate) {
            return NextResponse.json({
                message: "Issue date is required",
            }, { status: 400 }
            );
        }

        if (!dueDate) {
            return NextResponse.json({
                message: "Due date is required",
            }, { status: 400 }
            );
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({
                message: "Invoice must have at least one item",
            }, { status: 400 }
            );
        }

        // ==========================================
        // 5. CONNECT DATABASE
        // ==========================================

        await connectDB();

        // ==========================================
        // 6. FIND USER
        // ==========================================

        const user = await User.findById(
            session.user.id
        );

        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 }
            );
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found",
            }, { status: 404 }
            );
        }

        const existingInvoice =
            await Invoice.findOne({
                _id: id,
                businessId: user.businessId,
            });

        if (!existingInvoice) {
            return NextResponse.json({
                message: "Invoice not found",
            }, { status: 404 }
            );
        }

        // ==========================================
        // 8. VERIFY CLIENT
        // ==========================================

        const client = await Client.findOne({
            _id: clientId,
            businessId: user.businessId,
        });

        if (!client) {
            return NextResponse.json({
                message: "Client not found",
            }, { status: 404 }
            );
        }

        const invoiceItems = [];

        let subtotal = 0;
        let taxAmount = 0;

        for (const item of items) {
            if (!item.productId) {
                return NextResponse.json({
                    message: "Product is required",
                }, { status: 400 }
                );
            }

            const quantity = Number(
                item.quantity
            );

            if (!quantity || quantity < 1) {
                return NextResponse.json({
                    message:
                        "Quantity must be at least 1",
                }, { status: 400 }
                );
            }

            // Find product belonging to this business
            const product =
                await Product.findOne({
                    _id: item.productId,
                    businessId: user.businessId,
                });

            if (!product) {
                return NextResponse.json({
                    message: "Product not found",
                }, { status: 404 }
                );
            }

            // Calculate item subtotal
            const itemSubtotal =
                product.price * quantity;

            // Calculate item tax
            const itemTax =
                itemSubtotal *
                (product.taxRate / 100);

            // Calculate item total
            const itemTotal =
                itemSubtotal + itemTax;

            subtotal += itemSubtotal;
            taxAmount += itemTax;

            invoiceItems.push({
                productId: product._id,

                name: product.name,

                description:
                    product.description,

                quantity,

                price: product.price,

                taxRate: product.taxRate,

                total: itemTotal,

                unit: product.unit,
            });
        }

        const total = subtotal + taxAmount;


        existingInvoice.clientId = client._id;

        existingInvoice.issueDate = new Date(issueDate);

        existingInvoice.dueDate = new Date(dueDate);

        existingInvoice.items = invoiceItems;

        existingInvoice.subtotal = subtotal;

        existingInvoice.taxAmount = taxAmount;

        existingInvoice.total = total;

        existingInvoice.notes = notes || "";

        if (status) {
            existingInvoice.status = status;
        }

        await existingInvoice.save();

        return NextResponse.json({
            message: "Invoice updated successfully",
            invoice: existingInvoice,
        }, { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE INVOICE ERROR:", error);

        return NextResponse.json({
            message:
                "Failed to update invoice",
        }, { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    context: {
        params: Promise<{
            id: string;
        }>;
    }
) {
    try {
        // ==========================================
        // 1. CHECK AUTHENTICATION
        // ==========================================

        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({
                message: "Unauthorized",
            }, { status: 401 }
            );
        }

        const { id } = await context.params;

        await connectDB();

        const user = await User.findById(
            session.user.id
        );

        if (!user) {
            return NextResponse.json({
                message: "User not found",
            }, { status: 404 }
            );
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found",
            }, { status: 404 }
            );
        }

        const invoice =
            await Invoice.findOneAndDelete({
                _id: id,
                businessId: user.businessId,
            });

        if (!invoice) {
            return NextResponse.json({
                message: "Invoice not found",
            }, { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Invoice deleted successfully",
        }, { status: 200 }
        )

    } catch (error) {
        console.error("DELETE INVOICE ERROR:", error);

        return NextResponse.json({
            message: "Failed to delete invoice",
        }, { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

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

        const { id } = await params;

        const { status } = await req.json();

        const allowedStatuses = ["draft", "sent", "paid", "overdue", "cancelled"];

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json({
                message: "Invaild Invoice status"
            }, { status: 400 })
        }

        const invoice = await Invoice.findOne({
            _id: id,
            businessId: user.businessId
        })

        if (!invoice) {
            return NextResponse.json({
                message: "Invoice not found"
            }, { status: 404 })
        }

        invoice.status = status;

        await invoice.save();

        return NextResponse.json({
            message: "Invoice Status Updated Successfully",
            invoice
        })


    } catch (error) {

        console.error("Update Invoice Status Error", error);

        return NextResponse.json({
            message: "Failed to update Invoce Status"
        }, { status: 500 })

    }

}