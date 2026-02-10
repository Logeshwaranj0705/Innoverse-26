import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import Particle from "./particles";
import { FaWhatsapp } from "react-icons/fa";

const RULES = [
  "MANDATORY REQUIREMENT",
  "All participants must carry their college ID card throughout the event.",
  "Participants must complete registration and fee payment prior to the event.",

  "1. TEAM FORMATION & REGISTRATION",
  "Each team must consist of 3 to 4 members.",
  "Team members must belong to the same institution.",
  "Registration fee is ₹300 per person.",
  "Registration is confirmed only after successful payment.",
  "No changes in team members will be allowed after registration closure.",

  "2. CODE OF CONDUCT",
  "All participants must maintain strict discipline and professional behaviour throughout the event.",
  "Participants are expected to behave respectfully with faculty members, coordinators, volunteers, and fellow participants.",
  "Any form of misconduct, misbehaviour, or violation of rules will lead to immediate disqualification.",
  "College property and equipment must be handled responsibly.",
  "Participants are responsible for their personal belongings; the organizing committee will not be liable for any loss or damage.",

  "3. VENUE RULES & SCHEDULE",
  "Participants must be present at the venue for the entire 24-hour duration.",
  "Teams are not permitted to leave the venue without prior permission from the organizing committee.",
  "Participants must adhere strictly to the event schedule and instructions given by coordinators.",
  "Cooperation with volunteers and security personnel is mandatory.",

  "4. HACKATHON RULES",
  "Teams must work only on the problem statements provided by the organizers.",
  "All development work must be done during the hackathon period only.",
  "Use of pre-built projects, copied code, or plagiarism is strictly prohibited.",
  "Any unfair practices will result in immediate disqualification.",

  "5. FOOD, REFRESHMENTS & FACILITIES",
  "Evening snacks will be provided by the organizing committee.",
  "Mess and college canteen food will be available for participants during designated hours.",
  "Tea and coffee will be provided during the night hours.",
  "Participants must be on time at the venue and strictly adhere to the food and break schedules.",
  "Late arrival to the venue or dining areas will not be entertained.",
  "Participants must maintain cleanliness and discipline in food and dining areas.",

  "6. TECHNICAL ESSENTIALS",
  "Teams are advised to carry their own laptops, chargers, and required accessories.",
  "Participants must ensure proper care of electrical equipment.",
  "Any additional technical requirements should be arranged by the teams themselves.",

  "7. SAFETY & SECURITY MEASURES",
  "Participants must follow all safety instructions provided by faculty members and volunteers.",
  "Any safety concerns must be reported immediately to the organizing committee.",
  "Emergency instructions must be followed without delay.",

  "8. JUDGING & EVALUATION",
  "Projects will be evaluated based on innovation, technical implementation, problem relevance, teamwork, and presentation.",
  "The decision of the judging panel will be final and binding.",

  "9. DISCIPLINARY POLICY",
  "Failure to comply with event rules, discipline, or guidelines will result in penalties or disqualification.",
  "The organizing committee reserves the right to take appropriate action at any stage of the event.",

  "10. HELP & ASSISTANCE",
  "For any technical or event-related assistance, participants may contact:",
  "Student Coordinators",
  "Faculty Coordinators on duty",
  "Volunteer Help Desk",
];

const Ticket = ({ data }) => {
  const qrRef = useRef(null);
  const ticketId = data?.ticketId || `INV26-${Date.now()}`;

  const memberLine = (m, i) =>
    `${i + 1}. ${m.name} | ${m.clg} | ${m.dept} | ${m.degree} | ${m.year} Year | ${m.mobile} | ${m.email}`;

  const qrText = `
INNOVERSE 26 ENTRY PASS

Team Name: ${data.teamName}
Team Size: ${data.teamSize}

Members:
${(data.members || []).map(memberLine).join("\n")}

Ticket ID: ${ticketId}
`;

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");

    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;
    const LEFT_MARGIN = 20;
    const RIGHT_MARGIN = 20;
    const TOP_MARGIN = 18;
    const BOTTOM_MARGIN = 18;

    const QR_START_X = 130;
    const TEXT_WIDTH = QR_START_X - LEFT_MARGIN - 5;

    const setPageBg = () => {
      pdf.setFillColor(10, 10, 10);
      pdf.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "F");
    };

    const header = () => {
      pdf.setTextColor(34, 197, 94);
      pdf.setFont("courier", "bold");
      pdf.setFontSize(20);
      pdf.text("INNOVERSE ’26", LEFT_MARGIN, 25);
      pdf.setFontSize(12);
      pdf.text("ENTRY TICKET", LEFT_MARGIN, 33);

      pdf.setDrawColor(34, 197, 94);
      pdf.line(LEFT_MARGIN, 38, PAGE_WIDTH - RIGHT_MARGIN, 38);
    };

    const ensureSpace = (y, needed) => {
      if (y + needed > PAGE_HEIGHT - BOTTOM_MARGIN) {
        pdf.addPage();
        setPageBg();
        header();
        return 45;
      }
      return y;
    };

    setPageBg();
    header();

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("courier", "normal");
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
    pdf.setFont("courier", "bold");
    pdf.text("TEAM MEMBERS", LEFT_MARGIN, y);
    y += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("courier", "normal");

    (data.members || []).forEach((m, i) => {
      const line = memberLine(m, i);
      const wrapped = pdf.splitTextToSize(line, TEXT_WIDTH);
      y = ensureSpace(y, wrapped.length * 6 + 4);
      pdf.text(wrapped, LEFT_MARGIN, y);
      y += wrapped.length * 6 + 2;
    });

    y += 6;
    y = ensureSpace(y, 14);
    pdf.setTextColor(34, 197, 94);
    pdf.setFont("courier", "bold");
    pdf.setFontSize(13);
    pdf.text("RULES & REGULATIONS", LEFT_MARGIN, y);
    y += 8;

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(10);

    const isSection = (t) =>
      /^(MANDATORY REQUIREMENT|(\d+\.)\s)/.test(t.trim());

    RULES.forEach((item) => {
      const text = item.trim();

      if (isSection(text)) {
        y = ensureSpace(y, 10);
        y += 2;
        pdf.setTextColor(34, 197, 94);
        pdf.setFont("courier", "bold");
        pdf.setFontSize(11);
        const wrapped = pdf.splitTextToSize(text, PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN);
        pdf.text(wrapped, LEFT_MARGIN, y);
        y += wrapped.length * 6;
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("courier", "normal");
        pdf.setFontSize(10);
        y += 2;
      } else {
        const bullet = `• ${text}`;
        const wrapped = pdf.splitTextToSize(bullet, PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN);
        y = ensureSpace(y, wrapped.length * 6 + 2);
        pdf.text(wrapped, LEFT_MARGIN, y);
        y += wrapped.length * 6 + 1;
      }
    });

    y += 6;
    y = ensureSpace(y, 10);
    pdf.setTextColor(180, 180, 180);
    pdf.setFont("courier", "normal");
    pdf.setFontSize(10);
    pdf.text("Present this ticket (printed or digital) at the entry gate.", LEFT_MARGIN, y);

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
          <h3 className="text-lg font-semibold tracking-widest">{data.teamName}</h3>
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

        <div className="text-center">
          <a
            href="https://chat.whatsapp.com/JXNrBgpLu5IHZ6kKH6VQtU?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              text-xs tracking-widest
              text-green-400
              px-4 py-2 rounded-full
              border border-green-400/30
              bg-white/5
              shadow-[0_0_12px_rgba(34,197,94,0.35)]
              hover:shadow-[0_0_25px_rgba(34,197,94,0.9)]
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            JOIN WHATSAPP GROUP <FaWhatsapp size={18} />
          </a>
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
