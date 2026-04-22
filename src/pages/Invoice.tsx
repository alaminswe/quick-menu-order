import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Printer, CheckCircle2 } from "lucide-react";
import { useStore } from "@/store/StoreContext";

const Invoice = () => {
  const { id } = useParams();
  const { orders } = useStore();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <p className="text-muted-foreground">Invoice not found.</p>
        <Link to="/" className="mt-4 underline text-primary">
          Back to menu
        </Link>
      </div>
    );
  }

  const subtotal = order.total;
  const tax = +(subtotal * 0.08).toFixed(2);
  const grandTotal = +(subtotal + tax).toFixed(2);
  const date = new Date(order.createdAt);

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const lines = [
      "TASTY BITES — INVOICE",
      "================================",
      `Invoice #: ${order.id}`,
      `Date: ${date.toLocaleString()}`,
      `Customer: ${order.customerName}`,
      `Phone: ${order.phone}`,
      `Table: ${order.table}`,
      `Payment: ${order.payment === "online" ? "Paid Online" : "Pay at Counter"}`,
      "--------------------------------",
      "Items:",
      ...order.items.map(
        (c) =>
          `${c.item.name} x${c.quantity}  $${(c.item.price * c.quantity).toFixed(2)}`
      ),
      "--------------------------------",
      `Subtotal: $${subtotal.toFixed(2)}`,
      `Tax (8%): $${tax.toFixed(2)}`,
      `TOTAL: $${grandTotal.toFixed(2)}`,
      "================================",
      "Thank you for dining with us!",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border print:hidden">
        <div className="container max-w-3xl flex items-center gap-3 py-4">
          <Link
            to={`/order/${order.id}`}
            className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Invoice</h1>
          <div className="ml-auto flex gap-2">
            <button
              onClick={handlePrint}
              className="h-10 px-3 rounded-full bg-secondary inline-flex items-center gap-1 text-sm font-semibold"
            >
              <Printer className="h-4 w-4" /> Print
            </button>
            <button
              onClick={handleDownload}
              className="h-10 px-3 rounded-full bg-gradient-warm text-primary-foreground inline-flex items-center gap-1 text-sm font-semibold shadow-glow"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl px-4 py-6">
        <div className="bg-card rounded-3xl shadow-card p-6 sm:p-10 print:shadow-none print:rounded-none">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold bg-gradient-warm bg-clip-text text-transparent">
                Tasty Bites
              </h2>
              <p className="text-xs text-muted-foreground">
                123 Flavor Street · contact@tastybites.com
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Invoice</p>
              <p className="font-mono font-bold">{order.id}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {date.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <p className="text-muted-foreground text-xs">Billed To</p>
              <p className="font-semibold">{order.customerName}</p>
              <p>{order.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs">Details</p>
              <p>Table {order.table}</p>
              <p className="inline-flex items-center gap-1 text-green-600 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                {order.payment === "online" ? "Paid Online" : "Pay at Counter"}
              </p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2">Item</th>
                <th className="py-2 text-center">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((c) => (
                <tr key={c.item.id} className="border-b border-border/60">
                  <td className="py-3">{c.item.name}</td>
                  <td className="py-3 text-center">{c.quantity}</td>
                  <td className="py-3 text-right">${c.item.price.toFixed(2)}</td>
                  <td className="py-3 text-right font-semibold">
                    ${(c.item.price * c.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mt-6">
            <div className="w-full sm:w-72 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-lg">
                <span>Total</span>
                <span className="bg-gradient-warm bg-clip-text text-transparent">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Thank you for dining with us! · This is a computer-generated invoice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Invoice;
