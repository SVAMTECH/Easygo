

import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { jsPDF } from "jspdf";


const Payment = ({ setCurrentPage }) => {
  const { currentUser, addBooking } = useAppContext();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [latestBooking, setLatestBooking] = useState(null);

  const [bookingData, setBookingData] = useState(null);
  const [checkedStorage, setCheckedStorage] = useState(false);

  // read pending booking on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pendingBooking");
      if (raw) setBookingData(JSON.parse(raw));
      else setBookingData(null);
    } catch (e) {
      console.error("Payment: failed to parse pendingBooking", e);
      setBookingData(null);
    } finally {
      setCheckedStorage(true);
    }
  }, []);

  if (!checkedStorage) return (
    <div className="content-page"><h2>Loading...</h2></div>
  );

  if (!currentUser) {
    return (
      <div className="content-page">
        <h2>You must be logged in to make a booking</h2>
        <button type="button" className="btn btn-primary" onClick={() => setCurrentPage("login")}>Go to Login</button>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="content-page">
        <h2>No booking found</h2>
        <p>It looks like the booking was not created or was removed. Try booking again.</p>
        <button type="button" className="btn btn-primary" onClick={() => setCurrentPage("vehicles")}>Browse Vehicles</button>
      </div>
    );
  }

  if (!bookingData.vehicle) {
    return (
      <div className="content-page">
        <h2>Booking data incomplete</h2>
        <p>Vehicle information is missing from the booking. Please try booking again.</p>
        <button type="button" className="btn btn-primary" onClick={() => setCurrentPage("vehicles")}>Browse Vehicles</button>
      </div>
    );
  }

  const getPaymentMethodName = (method) => {
    const methods = { upi: "UPI Payment", card: "Credit/Debit Card", netbanking: "Net Banking", wallet: "Digital Wallet" };
    return methods[method] || method;
  };

  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  const handlePayment = async () => {
    if (processing) return;
    setProcessing(true);

    try {
      await wait(1000);

      const id = Date.now().toString();
      const booking = {
        ...bookingData,
        id,
        userId: currentUser.id,
        paymentMethod,
        status: "confirmed",
        bookingDate: new Date().toISOString(),
      };

      setLatestBooking(booking);

      if (typeof addBooking === "function") {
        try {
          await addBooking(booking);
        } catch (err) {
          console.warn("addBooking failed (but continuing):", err);
        }
      }

      try { sessionStorage.removeItem("pendingBooking"); } catch (e) { /* ignore */ }

      setProcessing(false);
      setSuccess(true);

    } catch (err) {
      console.error("Payment error", err);
      setProcessing(false);
      alert("Payment failed: " + (err?.message || err));
    }
  };


  const loadImageAsDataURL = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };


const downloadInvoicePdf = async (bookingParam) => {
  const b = bookingParam || latestBooking || {
    id: Date.now().toString(),
    userId: currentUser.id,
    vehicleName: bookingData.vehicle?.name || "N/A",
    rentalType: bookingData.rentalType,
    duration: bookingData.duration,
    startDate: bookingData.startDate,
    totalCost: bookingData.totalCost,
    paymentMethod,
    status: "confirmed",
    bookingDate: new Date().toISOString(),
  };

  try {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let y = 40;
  doc.setFont("helvetica", "normal");

   
    const bannerHeight = 70;
    doc.setFillColor(2, 119, 189); // deep blue
    doc.rect(0, 0, pageWidth, bannerHeight, "F");


    const possibleLogoPaths = ["/logo.jpg", "/assets/images/logo.jpg", window.location.origin + "/logo.jpg"];
    let logoData = null;
    for (const p of possibleLogoPaths) {
      try {
        const res = await fetch(p);
        if (!res.ok) continue;
        const blob = await res.blob();
        logoData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        if (logoData) break;
      } catch (e) {
       
      }
    }

    
    const logoSize = 60;
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", margin, 5, logoSize, logoSize);
      } catch (e) {
        
      }
    }

    // Company name on banner (white)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const companyX = margin + (logoData ? logoSize + 10 : 0);
    doc.text("Easy Goo", companyX, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Trusted car & bike rentals", companyX, 46);

    y += bannerHeight + 10;

    // INVOICE title and meta (right side)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", margin, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const invoiceMetaX = pageWidth - margin - 200;
    doc.text(`Invoice #: INV-${b.id}`, invoiceMetaX, y);
    y += 16;
    doc.text(`Date: ${new Date(b.bookingDate).toLocaleDateString()}`, invoiceMetaX, y);
    y += 16;
    doc.text(`Time: ${new Date(b.bookingDate).toLocaleTimeString()}`, invoiceMetaX, y);
    y += 20;

    // Bill-to / Payment card
    const cardX = margin;
    const cardW = pageWidth - margin * 2;
    const cardH = 80;
    doc.setFillColor(245, 247, 250);
    doc.rect(cardX, y, cardW, cardH, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Bill To:", cardX + 10, y + 18);
    doc.setFont("helvetica", "normal");
    doc.text(`${currentUser?.name || "Guest"}`, cardX + 10, y + 34);
    doc.text(`${currentUser?.email || "-"}`, cardX + 10, y + 50);

    // Payment method on right of card
    doc.setFont("helvetica", "bold");
    doc.text("Payment Method:", cardX + cardW - 180, y + 18);
    doc.setFont("helvetica", "normal");
    doc.text(getPaymentMethodName(b.paymentMethod), cardX + cardW - 180, y + 34);

    y += cardH + 20;

    // Table header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const tableX = margin;
    const tableW = pageWidth - margin * 2;
    const col1 = tableX;
    const col2 = tableX + 300;
    const col3 = tableX + tableW - 80; // amount column (right aligned)
    doc.text("Description", col1, y);
    doc.text("Qty", col2, y);
    doc.text("Amount (Rs)", col3, y, { align: "right" });

    y += 10;
    doc.setLineWidth(0.5);
    doc.line(tableX, y, tableX + tableW, y);
    y += 14;

    // Row: booking
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const desc = `${b.vehicleName || "N/A"} (${b.rentalType})`;
    doc.text(desc, col1, y);
    doc.text(String(b.duration), col2, y);
    // Use ASCII digits and "Rs" prefix to avoid glyph fallback problems
    doc.text(`Rs ${String(b.totalCost)}`, col3, y, { align: "right" });

    y += 20;
    doc.line(tableX, y, tableX + tableW, y);
    y += 14;

    // Totals block (right-aligned)
    const totalsX = tableX + tableW - 160;
    doc.setFont("helvetica", "bold");
    doc.text("Subtotal:", totalsX, y);
    doc.setFont("helvetica", "normal");
    doc.text(`Rs ${String(b.totalCost)}`, totalsX + 80, y, { align: "right" });
    y += 16;

    doc.setFont("helvetica", "bold");
    doc.text("Tax (0%):", totalsX, y);
    doc.setFont("helvetica", "normal");
    doc.text("Rs 0", totalsX + 80, y, { align: "right" });
    y += 16;

    doc.setLineWidth(1);
    doc.setDrawColor(2, 119, 189);
    doc.line(totalsX, y, totalsX + 160, y);
    y += 14;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", totalsX, y);
    doc.text(`Rs ${String(b.totalCost)}`, totalsX + 80, y, { align: "right" });
    y += 30;

    // Notes / footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Notes: Thank you for choosing Easy Goo. Drive safely.", margin, y);
    y += 16;
    doc.text("Easy Goo | support@easygoo.com | +91-9876543210", margin, y);

    // Save PDF
    const filename = `EasyGoo_Invoice_${b.id}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error("Error generating invoice", error);
    alert("Error generating invoice: " + (error?.message || error));
  }
};


  const bookingForUI = latestBooking || {
    id: bookingData.id || '—',
    vehicleName: bookingData.vehicle?.name || 'N/A',
    rentalType: bookingData.rentalType,
    duration: bookingData.duration,
    startDate: bookingData.startDate,
    totalCost: bookingData.totalCost,
    paymentMethod,
  };

  // Success screen - REMAINS until user clicks "Go to Dashboard" (no auto redirect)
  if (success) {
    return (
      <div className="content-page">
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: '#28a745', color: 'white', fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontWeight: 'bold' }}>✓</div>

          <h2 style={{ color: '#28a745', marginBottom: 12 }}>Payment Successful!</h2>
          <p style={{ fontSize: 16, color: '#666', marginBottom: 24 }}>Your booking has been confirmed. Booking ID: <strong>{bookingForUI.id}</strong></p>

          <div style={{ backgroundColor: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 24, textAlign: 'left' }}>
            <h4 style={{ marginBottom: 12 }}>Booking Summary</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Vehicle:</span><strong>{bookingForUI.vehicleName}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Duration:</span><strong>{bookingForUI.duration} {bookingForUI.rentalType === 'hourly' ? 'hours' : 'days'}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Payment Method:</span><strong>{getPaymentMethodName(bookingForUI.paymentMethod)}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #dee2e6' }}><span>Total Paid:</span><strong style={{ fontSize: 18, color: '#28a745' }}>₹{bookingForUI.totalCost}</strong></div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <button type="button" className="btn btn-primary" onClick={() => downloadInvoicePdf(latestBooking || bookingForUI)} style={{ minWidth: 180, padding: '10px 20px' }}>📄 Download Invoice</button>
            <button type="button" className="btn btn-outline-primary" onClick={() => setCurrentPage('dashboard')} style={{ minWidth: 180, padding: '10px 20px' }}>Go to Dashboard</button>
          </div>

          <p style={{ marginTop: 20, color: '#999', fontSize: 14 }}>Success screen will remain until you click a button above.</p>
        </div>
      </div>
    );
  }

  // Payment form UI
  return (
    <div className="content-page">
      <h1>Complete Payment</h1>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 20 }}>
        <div style={{ flex: 1, minWidth: 300, backgroundColor: '#f8f9fa', padding: 20, borderRadius: 8 }}>
          <h3 style={{ marginBottom: 16 }}>Booking Summary</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #dee2e6' }}>
            <span>Vehicle:</span>
            <strong>{bookingData.vehicle?.name}</strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Type:</span><strong>{bookingData.rentalType}</strong></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span>Duration:</span><strong>{bookingData.duration} {bookingData.rentalType === 'hourly' ? 'hours' : 'days'}</strong></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><span>Start Date:</span><strong>{bookingData.startDate ? new Date(bookingData.startDate).toLocaleString() : 'N/A'}</strong></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '2px solid #007bff', fontSize: 18 }}><strong>Total Amount:</strong><strong style={{ color: '#007bff' }}>₹{bookingData.totalCost}</strong></div>
        </div>

        <div style={{ width: 360 }}>
          <h3 style={{ marginBottom: 16 }}>Select Payment Method</h3>

          {["upi", "card", "netbanking", "wallet"].map((method) => (
            <label key={method} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, border: paymentMethod === method ? '2px solid #007bff' : '1px solid #e6e6e6', borderRadius: 8, marginBottom: 12, cursor: 'pointer', backgroundColor: paymentMethod === method ? '#e7f3ff' : 'white' }}>
              <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} style={{ cursor: 'pointer' }} />
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}>{method === 'upi' ? '📱' : method === 'card' ? '💳' : method === 'netbanking' ? '🏦' : '👛'}</span>
                <strong>{getPaymentMethodName(method)}</strong>
              </div>
            </label>
          ))}

          <div style={{ marginTop: 24 }}>
            <button type="button" className="btn btn-primary" disabled={processing} onClick={handlePayment} style={{ width: '100%', padding: '14px', fontSize: 16, marginBottom: 12 }}>{processing ? 'Processing Payment...' : `Pay ₹${bookingData.totalCost}`}</button>
            <button type="button" className="btn btn-secondary" onClick={() => setCurrentPage('vehicles')} disabled={processing} style={{ width: '100%' }}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;



