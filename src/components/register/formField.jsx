import React, { useState } from "react";
import Particles from "./particles";
import Ticket from "./Ticket";
import scannerPh from "../../assets/scanner.jpeg";

const FormField = () => {
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [members, setMembers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentImage, setPaymentImage] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);

  const handleTeamSize = (size) => {
    setTeamSize(size);
    setCurrentIndex(0);
    setShowSummary(false);
    setPaymentImage(null);

    if (!size) {
      setMembers([]);
      return;
    }

    setMembers(
      Array.from({ length: size }, (_, i) => ({
        role: i === 0 ? "Leader" : `Member ${i}`,
        name: "",
        regNo: "",
        email: "",
        mobile: "",
        department: "",
      }))
    );
  };

  const handleChange = (field, value) => {
    const updated = [...members];
    updated[currentIndex][field] = value;
    setMembers(updated);
  };

  const handleNext = () => {
    const currentMember = members[currentIndex];
    const requiredFields = ["name", "regNo", "email", "mobile", "department"];
    const isValid = requiredFields.every(
      (field) => currentMember[field]?.trim() !== ""
    );

    if (!isValid) {
      alert("Please fill all fields before continuing");
      return;
    }

    if (currentIndex < teamSize - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!paymentImage || !transactionId.trim()) {
      alert("Please complete payment details");
      return;
    }

    const payload = {
      event: "INNOVERSE 26",
      teamName,
      teamSize,
      members,
      transactionId,
      submittedAt: new Date().toISOString(),
    };

    setTicketData(payload);
    setShowTicket(true);
  };

  if (showTicket && ticketData) {
    return <Ticket data={ticketData} />;
  }

  return (
    <div className="relative bg-black flex justify-center px-6 py-24">
      <Particles />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-6xl bg-black/60 backdrop-blur-xl border border-green-400/20 rounded-3xl p-10 space-y-12 text-white shadow-[0_0_80px_rgba(34,197,94,0.12)]"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-widest text-green-400">
            TEAM REGISTRATION
          </h2>
          <p className="mt-1 text-sm text-green-300/60">
            Enter team and participant details carefully
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-green-300 font-semibold tracking-widest">
            TEAM DETAILS
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="p-3 rounded-xl bg-transparent border border-green-400/30"
              required
            />

            <select
              value={teamSize}
              onChange={(e) => handleTeamSize(Number(e.target.value))}
              className="p-3 rounded-xl bg-black border border-green-400/30"
              required
            >
              <option value="">Select Team Size</option>
              <option value="3">3 Members</option>
              <option value="4">4 Members</option>
            </select>
          </div>
        </div>

        {!teamSize && (
          <div className="flex justify-center">
            <div className="w-full max-w-xl text-center border border-green-400/30 rounded-2xl p-10 bg-black/50">
              <h3 className="text-green-400 text-xl font-bold tracking-widest">
                MAKE YOUR FIRST MOVE
              </h3>
              <p className="mt-3 text-green-300/60 text-sm">
                Select a team size to begin your Innoverse journey
              </p>
            </div>
          </div>
        )}

        {teamSize && !showSummary && (
          <div className="space-y-6">
            <h3 className="text-green-400 font-semibold tracking-widest">
              {members[currentIndex].role.toUpperCase()} DETAILS
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                ["FULL NAME", "name"],
                ["REGISTER NUMBER", "regNo"],
                ["MOBILE NUMBER", "mobile"],
                ["DEPARTMENT", "department"],
              ].map(([label, field]) => (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-[11px] text-green-300/60 tracking-widest">
                    {label}
                  </label>
                  <input
                    value={members[currentIndex][field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="p-3 rounded-xl bg-transparent border border-green-400/30"
                    required
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[11px] text-green-300/60 tracking-widest">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={members[currentIndex].email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="p-3 rounded-xl bg-transparent border border-green-400/30"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2 rounded-full bg-green-400 text-black font-bold tracking-widest"
            >
              {currentIndex === teamSize - 1 ? "REVIEW TEAM" : "NEXT"}
            </button>
          </div>
        )}

        {showSummary && (
          <>
            <div className="space-y-6">
              <h3 className="text-green-400 font-semibold tracking-widest">
                TEAM SUMMARY
              </h3>

              {members.map((m, i) => (
                <div
                  key={i}
                  className="bg-black/50 border border-green-400/20 rounded-2xl p-5 grid grid-cols-2 gap-3 text-sm"
                >
                  <div className="col-span-2 text-green-400 font-semibold">
                    {m.role}
                  </div>
                  <span className="text-green-300/60">Name</span>
                  <span>{m.name}</span>
                  <span className="text-green-300/60">Reg No</span>
                  <span>{m.regNo}</span>
                  <span className="text-green-300/60">Email</span>
                  <span>{m.email}</span>
                  <span className="text-green-300/60">Mobile</span>
                  <span>{m.mobile}</span>
                  <span className="text-green-300/60">Department</span>
                  <span>{m.department}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 text-center text-black">
                <p className="font-semibold">Scan & Pay</p>
                <img
                  src={scannerPh}
                  alt="QR"
                  className="mx-auto w-[260px] h-[300px] object-contain mt-2"
                />
              </div>

              <label className="relative border-2 border-dashed border-green-400/40 rounded-xl h-[360px] flex items-center justify-center cursor-pointer overflow-hidden">
                {!paymentImage ? (
                  <div className="text-center">
                    <h1 className="text-gray-400 text-sm tracking-widest">
                      UPLOAD
                    </h1>
                    <span className="text-gray-400 text-sm tracking-widest">
                      Payment Screenshot
                    </span>
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(paymentImage)}
                    alt="Uploaded"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setPaymentImage(e.target.files[0])}
                  required
                />
              </label>
            </div>

            <div>
              <label className="text-green-300 font-semibold tracking-widest">
                TRANSACTION ID:
              </label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Payment Transaction ID"
                className="p-3 w-full rounded-xl bg-transparent border border-green-400/30 text-sm mt-3"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-black font-bold tracking-widest"
            >
              GENERATE TICKET
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default FormField;
