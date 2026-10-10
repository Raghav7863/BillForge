import InvoicePrint from "@/components/InvoicePrint";

export default async function PrintInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <InvoicePrint invoiceId={id} />;
}