import { auth } from "@/auth";
import connectDb from "@/lib/db";
import transporter from "@/lib/mailer";
import Client from "@/models/Client";
import Invoice from "@/models/Invoice";
import { NextRequest, NextResponse } from "next/server";
import { generateInvoicePDF } from "@/lib/generateInvoicePDF";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    try {

        const session = await auth();

        if (!session?.user.id) {
            return NextResponse.json({
                message: "Unauthorized"
            }, { status: 401 })
        }

        await connectDb();

        const user = session.user as {
            id: string;
            businessId?: string;
        }

        if (!user.businessId) {
            return NextResponse.json({
                message: "Business not found"
            }, { status: 404 })
        }

        const { id } = await params;

        const cookie = req.headers.get("cookie") || "";

        const invoice = await Invoice.findOne({
            _id: id,
            businessId: user.businessId
        })

        if (!invoice) {
            return NextResponse.json({
                message: "Invoice not found"
            }, { status: 404 })
        }

        const client = await Client.findOne({
            _id: invoice.clientId,
            businessId: user.businessId
        })

        if (!client) {
            return NextResponse.json({
                message: "Client not found"
            }, { status: 404 })
        }

        if (!client.email) {
            return NextResponse.json({
                message: "Client does not have any email address"
            }, { status: 400 })
        }

        const pdf = await generateInvoicePDF(id, cookie);

        console.log("PDF type:", typeof pdf);
        console.log("PDF size:", pdf.length);
        console.log(
            "PDF header:",
            pdf.subarray(0, 5).toString()
        );

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: client.email,
            subject: `Invoice ${invoice.invoiceNumber}`,
            html: `
                <div style="font-family: Arial, sans-serif;">
                <h2>Invoice ${invoice.invoiceNumber}</h2>

                <p>Hello ${client.name},</p>

                <p>
                    Please find your invoice details below.
                </p>

                <p>
                    <strong>Invoice Number:</strong> ${invoice.invoiceNumber}
                </p>

                <p>
                    <strong>Total Amount:</strong> ₹${invoice.total}
                </p>

                <p>
                    <strong>Due Date:</strong>
                    ${new Date(invoice.dueDate).toLocaleDateString()}
                </p>

                <p>
                    Thank you for your business.
                </p>
                </div>
            `,
            attachments: [
                {
                    filename: `${invoice.invoiceNumber}.pdf`,
                    content: pdf,
                    contentType: "application/pdf"
                }
            ]
        })

        invoice.status = "sent";

        await invoice.save();

        return NextResponse.json({
            message: "Invoice sent sucessfully",
            invoice
        }, { status: 200 })


    } catch (error) {

        console.error("Send Invoice Error", error);

        return NextResponse.json({
            message: "Failed to send invoice"
        }, { status: 500 })

    }

}