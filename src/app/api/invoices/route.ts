import { auth } from "@/auth";
import connectDb from "@/lib/db";
import Client from "@/models/Client";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";
import User from "@/models/User";
import next from "next/dist/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        const { clientId, issueDate, dueDate, items, notes } = await req.json();

        if (!clientId) {
            return NextResponse.json({
                message: "Client is Required"
            }, { status: 400 })
        }

        if (!issueDate) {
            return NextResponse.json({
                message: "IssueDate is required"
            }, { status: 400 })
        }

        if (!dueDate) {
            return NextResponse.json({
                message: "Due date is required"
            }, { status: 400 })
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({
                message: "Invoice must have at least one item",
            }, { status: 400 })
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

        const client = await Client.findOne({
            _id: clientId,
            businessId: user.businessId
        })

        if (!client) {
            return NextResponse.json({
                message: "Client not found"
            }, { status: 404 })
        }

        const invoiceItems = [];

        let subTotal = 0;
        let taxAmount = 0;

        for (const item of items) {
            if (!item.productId) {
                return NextResponse.json({
                    message: "Product is required"
                }, { status: 400 })
            }

            const quantity = Number(item.quantity);

            if (!quantity || quantity < 1) {
                return NextResponse.json({
                    message: "Quantity must be at least 1"
                }, { status: 400 })
            }

            const product = await Product.findOne({
                _id: item.productId,
                businessId: user.businessId
            })

            if (!product) {
                return NextResponse.json({
                    message: "Product not found"
                }, { status: 404 })
            }

            const itemSubtotal = product.price * quantity;

            const itemTax = itemSubtotal * (product.taxRate / 100);

            const itemTotal = itemSubtotal + itemTax;

            subTotal += itemSubtotal;
            taxAmount += itemTax;

            invoiceItems.push({
                productId: product._id,
                name: product.name,
                description: product.description,
                quantity,
                price: product.price,
                taxRate: product.taxRate,
                total: itemTotal,
                unit: product.unit,
            })
        }

        const total = subTotal + taxAmount;

        const invoiceCount = await Invoice.countDocuments({
            businessId: user.businessId
        })

        const invoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, "0")}`;

        const invoice = await Invoice.create({
            businessId: user.businessId,
            clientId: client._id,
            invoiceNumber,
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            items: invoiceItems,
            subTotal,
            taxAmount,
            total,
            notes: notes || "",
            status: "draft",
        });

        return NextResponse.json({
            message: "Invoice Created Successfully",
            invoice
        }, {status: 201})



    } catch (error) {

        console.error("Create Invoice Error", error);

        return NextResponse.json({
            message: "Failed to create invoice"
        }, {status: 500})

    }
}

export async function GET() {
  try {
    // ==========================================
    // 1. CHECK AUTHENTICATION
    // ==========================================

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // 2. CONNECT DATABASE
    // ==========================================

    await connectDb();

    // ==========================================
    // 3. FIND USER
    // ==========================================

    const user = await User.findById(
      session.user.id
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // 4. CHECK BUSINESS
    // ==========================================

    if (!user.businessId) {
      return NextResponse.json(
        {
          message: "Business not found",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // 5. GET INVOICES
    // ==========================================

    const invoices = await Invoice.find({
      businessId: user.businessId,
    })
      .populate(
        "clientId",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      });

    // ==========================================
    // 6. RETURN INVOICES
    // ==========================================

    return NextResponse.json(
      {
        message: "Invoices fetched successfully",
        invoices,
      },
      {
        status: 200,
      }
    );

  } catch (error) {
    console.error(
      "GET INVOICES ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch invoices",
      },
      {
        status: 500,
      }
    );
  }
}