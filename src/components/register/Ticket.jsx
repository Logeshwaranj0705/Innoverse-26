import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import Particle from "./particles";

const Ticket = ({ data }) => {
  const qrRef = useRef(null);
  const ticketId = `INV26-${Date.now()}`;

  const qrText = `
INNOVERSE 26 ENTRY PASS

Team Name: ${data.teamName}
Team Size: ${data.teamSize}

Members:
${data.members
  .map(
    (m, i) =>
      `${i + 1}. ${m.name} | ${m.regNo} | ${m.department} | ${m.mobile}`
  )
  .join("\n")}

Ticket ID: ${ticketId}
`;

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const PAGE_WIDTH = 210;
    const LEFT_MARGIN = 20;
    const RIGHT_MARGIN = 20;
    const QR_START_X = 130;
    const TEXT_WIDTH = QR_START_X - LEFT_MARGIN - 5;

    pdf.setFillColor(10, 10, 10);
    pdf.rect(0, 0, PAGE_WIDTH, 297, "F");

    pdf.setTextColor(34, 197, 94);
    pdf.setFont("courier", "bold");
    pdf.setFontSize(20);
    pdf.text("INNOVERSE ’26", LEFT_MARGIN, 25);
    pdf.setFontSize(12);
    pdf.text("ENTRY TICKET", LEFT_MARGIN, 33);

    pdf.setDrawColor(34, 197, 94);
    pdf.line(LEFT_MARGIN, 38, PAGE_WIDTH - RIGHT_MARGIN, 38);

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(`Team Name : ${data.teamName}`, LEFT_MARGIN, 50);
    pdf.text(`Team Size : ${data.teamSize}`, LEFT_MARGIN, 58);
    pdf.text(`Ticket ID : ${ticketId}`, LEFT_MARGIN, 66);

    const qrCanvas = qrRef.current?.querySelector("canvas");
    if (qrCanvas) {
      const qrImage = qrCanvas.toDataURL("image/png");
      pdf.setDrawColor(34, 197, 94);
      pdf.rect(QR_START_X, 45, 50, 50);
      pdf.addImage(qrImage, "PNG", QR_START_X + 2, 47, 46, 46);
    }

    let y = 85;

    pdf.setFontSize(13);
    pdf.setTextColor(34, 197, 94);
    pdf.text("TEAM MEMBERS", LEFT_MARGIN, y);
    y += 8;

    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);

    data.members.forEach((m, i) => {
      const line = `${i + 1}. ${m.name} | ${m.regNo} | ${m.department} | ${m.mobile}`;
      const wrapped = pdf.splitTextToSize(line, TEXT_WIDTH);
      pdf.text(wrapped, LEFT_MARGIN, y);
      y += wrapped.length * 7;
    });

    pdf.setTextColor(180, 180, 180);
    pdf.setFontSize(10);
    pdf.text(
      "Present this ticket (printed or digital) at the entry gate.",
      LEFT_MARGIN,
      y + 10
    );

    pdf.save(`${data.teamName}_INNOVERSE_26_TICKET.pdf`);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-white mt-10">
      <Particle />
      <div className="w-full max-w-md bg-black border border-green-400/40 rounded-3xl p-8 space-y-6 shadow-[0_0_80px_rgba(34,197,94,0.25)]">
        <h2 className="text-center text-green-400 text-xl font-bold tracking-widest">
          INNOVERSE ’26
        </h2>

        <div className="text-center">
          <p className="text-xs text-green-300/60 tracking-widest">TEAM NAME</p>
          <h3 className="text-lg font-semibold tracking-widest">
            {data.teamName}
          </h3>
        </div>

        <div ref={qrRef} className="flex justify-center py-4">
          <QRCodeCanvas
            value={qrText}
            size={200}
            bgColor="#000000"
            fgColor="#22c55e"
            level="H"
          />
        </div>

        <div className="border-t border-green-400/20 pt-4 text-center text-xs text-green-300/60 tracking-widest">
          TICKET ID: {ticketId}
        </div>
      </div>

      <button
        onClick={downloadPDF}
        className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-black font-bold tracking-widest hover:scale-105 transition"
      >
        DOWNLOAD TICKET (PDF)
      </button>
    </div>
  );
};

export default Ticket;
