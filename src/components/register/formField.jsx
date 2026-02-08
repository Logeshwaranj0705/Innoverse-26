import React, { useMemo, useState } from "react";
import Particles from "./particles";
import Ticket from "./Ticket";
import { api } from "../../../public/api.js";
import scanner3 from "../../assets/scanner-3.jpeg";
import scanner4 from "../../assets/scanner-4.png";
import toast, { Toaster } from "react-hot-toast";

const NAME_RE = /^[A-Za-z\s.'-]{2,60}$/;
const REGNO_RE = /^[A-Za-z0-9._/-]{2,25}$/;
const DEPT_RE = /^[A-Za-z\s&().,'-]{2,60}$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const TXN_RE = /^[A-Za-z0-9_-]{6,40}$/;

const normalizeSpaces = (v) => v.replace(/\s+/g, " ").trim();

const FormField = () => {
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [members, setMembers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [paymentImage, setPaymentImage] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    teamName: "",
    teamSize: "",
    member: {},
    transactionId: "",
    paymentImage: "",
  });

  const scanImg = useMemo(() => {
    if (Number(teamSize) === 3) return scanner3;
    if (Number(teamSize) === 4) return scanner4;
    return scanner3;
  }, [teamSize]);

  const validateTeamName = (v) => {
    const value = normalizeSpaces(v);
    if (!value) return "Team name is required";
    if (value.length < 2) return "Team name is too short";
    if (value.length > 60) return "Team name is too long";
    if (!/^[A-Za-z0-9\s.'-]+$/.test(value))
      return "Team name contains invalid characters";
    return "";
  };

  const validateField = (field, rawValue) => {
    const value = field === "mobile" ? rawValue.trim() : normalizeSpaces(rawValue);

    if (field === "name") {
      if (!value) return "Full name is required";
      if (!NAME_RE.test(value)) return "Name must contain only letters and spaces";
      return "";
    }

    if (field === "clg") {
      if (!value) return "Register number is required";
      if (!REGNO_RE.test(value)) return "Register number format is invalid";
      return "";
    }

    if (field === "email") {
      const email = rawValue.trim();
      if (!email) return "Email is required";
      if (!EMAIL_RE.test(email)) return "Enter a valid email address";
      return "";
    }

    if (field === "mobile") {
      const phone = rawValue.replace(/\s+/g, "");
      if (!phone) return "Mobile number is required";
      if (!PHONE_RE.test(phone)) return "Enter a valid 10-digit Indian mobile number";
      return "";
    }

    if (field === "department") {
      if (!value) return "Department is required";
      if (!DEPT_RE.test(value)) return "Department must contain only letters";
      return "";
    }

    return "";
  };

  const setMemberError = (field, message) => {
    setErrors((prev) => ({
      ...prev,
      member: { ...(prev.member || {}), [field]: message },
    }));
  };

  const clearMemberError = (field) => {
    setErrors((prev) => {
      const next = { ...(prev.member || {}) };
      delete next[field];
      return { ...prev, member: next };
    });
  };

  const handleTeamSize = (size) => {
    setTeamSize(size);
    setCurrentIndex(1);
    setShowSummary(false);
    setPaymentImage(null);
    setTransactionId("");
    setErrors({ teamName: "", teamSize: "", member: {}, transactionId: "", paymentImage: "" });

    if (!size) {
      setMembers([]);
      return;
    }

    setMembers(
      Array.from({ length: size }, (_, i) => ({
        role: i === 0 ? "Leader" : `Member ${i}`,
        name: "",
        clg: "",
        email: "",
        mobile: "",
        department: "",
      }))
    );
  };

  const handleChange = (field, value) => {
    let v = value;

    if (field === "name" || field === "department" || field === "teamName")
      v = v.replace(/\s+/g, " ");
    if (field === "mobile") v = v.replace(/[^\d]/g, "").slice(0, 10);
    if (field === "email") v = v.trim();

    const updated = [...members];
    const idx = currentIndex - 1;
    if (!updated[idx]) return;
    updated[idx][field] = v;
    setMembers(updated);

    const msg = validateField(field, v);
    if (msg) setMemberError(field, msg);
    else clearMemberError(field);
  };

  const validateCurrentMember = () => {
    const idx = currentIndex - 1;
    const m = members[idx];
    const requiredFields = ["name", "clg", "email", "mobile", "department"];

    const fieldErrors = {};
    requiredFields.forEach((f) => {
      const msg = validateField(f, m?.[f] ?? "");
      if (msg) fieldErrors[f] = msg;
    });

    setErrors((prev) => ({ ...prev, member: fieldErrors }));
    return Object.keys(fieldErrors).length === 0;
  };

  const handleNext = () => {
    const tnErr = validateTeamName(teamName);
    if (tnErr) {
      setErrors((prev) => ({ ...prev, teamName: tnErr }));
      toast.error(tnErr);
      return;
    } else {
      setErrors((prev) => ({ ...prev, teamName: "" }));
    }

    if (!teamSize) {
      setErrors((prev) => ({ ...prev, teamSize: "Please select team size" }));
      toast.error("Please select team size");
      return;
    } else {
      setErrors((prev) => ({ ...prev, teamSize: "" }));
    }

    if (!validateCurrentMember()) {
      toast.error("Please fix highlighted fields");
      return;
    }

    if (currentIndex < teamSize) {
      setCurrentIndex(currentIndex + 1);
      setErrors((prev) => ({ ...prev, member: {} }));
    } else {
      setShowSummary(true);
      setErrors((prev) => ({ ...prev, member: {} }));
    }
  };

  const validateSummary = () => {
    const tnErr = validateTeamName(teamName);
    const tx = transactionId.trim();
    let txnErr = "";
    let imgErr = "";

    if (!paymentImage) imgErr = "Payment screenshot is required";
    if (!tx) txnErr = "Transaction ID is required";
    else if (!TXN_RE.test(tx)) txnErr = "Transaction ID looks invalid";

    setErrors((prev) => ({
      ...prev,
      teamName: tnErr,
      transactionId: txnErr,
      paymentImage: imgErr,
    }));

    if (tnErr) toast.error(tnErr);
    if (imgErr) toast.error(imgErr);
    if (txnErr) toast.error(txnErr);

    return !tnErr && !txnErr && !imgErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSummary()) return;

    try {
      setLoading(true);

      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      const imageBase64 = await toBase64(paymentImage);

      const payload = {
        event: "INNOVERSE 26",
        teamName: normalizeSpaces(teamName),
        teamSize,
        members: members.map((m) => ({
          ...m,
          name: normalizeSpaces(m.name),
          clg: normalizeSpaces(m.clg),
          email: m.email.trim(),
          mobile: m.mobile.replace(/\s+/g, ""),
          department: normalizeSpaces(m.department),
        })),
        transactionId: transactionId.trim(),
        paymentImage: imageBase64,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(`${api}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const msg =
          data?.error ||
          data?.message ||
          `Server error (${res.status}). Please try again.`;
        throw new Error(msg);
      }

      if (!data?.success) {
        throw new Error(data?.error || "Registration failed");
      }

      toast.success("Registration successful 🎉");
      setTicketData(data.data);
      setShowTicket(true);
    } catch (err) {
      toast.error(err?.message || "Network/Server error. Try again");
    } finally {
      setLoading(false);
    }
  };

  const memberErr = errors.member || {};
  const currentMember = members[currentIndex - 1] || {};

  const canProceed = useMemo(() => {
    if (!teamSize || !members.length) return false;
    const req = ["name", "clg", "email", "mobile", "department"];
    return req.every((f) => !validateField(f, currentMember?.[f] ?? ""));
  }, [teamSize, members, currentIndex]);

  if (showTicket && ticketData) return <Ticket data={ticketData} />;

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: "rgba(0,0,0,0.85)",
            color: "#fff",
            border: "1px solid rgba(34,197,94,0.35)",
            backdropFilter: "blur(10px)",
          },
        }}
      />

      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
            <p className="text-green-300 tracking-widest text-sm">GENERATING TICKET</p>
          </div>
        </div>
      )}

      <div className="relative bg-black flex justify-center px-6 py-24">
        <Particles />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-6xl bg-black/60 backdrop-blur-xl border border-green-400/20 rounded-3xl p-10 space-y-12 text-white shadow-[0_0_80px_rgba(34,197,94,0.12)]"
        >
          <div className="flex items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-widest text-green-400">
                TEAM REGISTRATION
              </h2>
              <p className="mt-1 text-sm text-green-300/60">
                Enter team and participant details carefully
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-green-300 font-semibold tracking-widest">TEAM DETAILS</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-green-300/60 tracking-widest">
                  TEAM NAME
                </label>
                <input
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTeamName(v);
                    const msg = validateTeamName(v);
                    setErrors((prev) => ({ ...prev, teamName: msg }));
                  }}
                  className={`p-3 rounded-xl bg-transparent border ${
                    errors.teamName ? "border-red-500/60" : "border-green-400/30"
                  }`}
                  required
                />
                {errors.teamName && (
                  <p className="text-xs text-red-400/90">{errors.teamName}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-green-300/60 tracking-widest">
                  TEAM SIZE
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => handleTeamSize(Number(e.target.value))}
                  className={`p-3 rounded-xl bg-black border ${
                    errors.teamSize ? "border-red-500/60" : "border-green-400/30"
                  }`}
                  required
                >
                  <option value="">Select Team Size</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                </select>
                {errors.teamSize && (
                  <p className="text-xs text-red-400/90">{errors.teamSize}</p>
                )}
              </div>
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
                {currentIndex === 1 ? "LEADER" : `MEMBER ${currentIndex - 1}`} DETAILS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["FULL NAME", "name"],
                  ["COLLEGE NAME", "clg"],
                  ["MOBILE NUMBER", "mobile"],
                  ["DEPARTMENT - YEAR", "department"],
                ].map(([label, field]) => (
                  <div key={field} className="flex flex-col gap-1">
                    <label className="text-[11px] text-green-300/60 tracking-widest">
                      {label}
                    </label>
                    <input
                      value={currentMember[field] || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                      onBlur={() => {
                        const msg = validateField(field, currentMember[field] || "");
                        if (msg) setMemberError(field, msg);
                        else clearMemberError(field);
                      }}
                      inputMode={field === "mobile" ? "numeric" : undefined}
                      type={field === "mobile" ? "tel" : "text"}
                      className={`p-3 rounded-xl bg-transparent border ${
                        memberErr[field] ? "border-red-500/60" : "border-green-400/30"
                      }`}
                      required
                    />
                    {memberErr[field] && (
                      <p className="text-xs text-red-400/90">{memberErr[field]}</p>
                    )}
                  </div>
                ))}

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[11px] text-green-300/60 tracking-widest">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={currentMember.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("email", currentMember.email || "");
                      if (msg) setMemberError("email", msg);
                      else clearMemberError("email");
                    }}
                    className={`p-3 rounded-xl bg-transparent border ${
                      memberErr.email ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  />
                  {memberErr.email && (
                    <p className="text-xs text-red-400/90">{memberErr.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-green-300/60 tracking-widest">
                  {currentIndex}/{teamSize}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`px-8 py-2 rounded-full font-bold tracking-widest transition ${
                    canProceed
                      ? "bg-green-400 text-black"
                      : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {currentIndex === teamSize ? "REVIEW TEAM" : "NEXT"}
                </button>
              </div>
            </div>
          )}

          {showSummary && (
            <>
              <div className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <h3 className="text-green-400 font-semibold tracking-widest">
                      TEAM SUMMARY
                    </h3>
                    <p className="mt-2 text-sm text-green-300/60">
                      Review the details before generating your ticket
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-3 text-xs tracking-widest text-green-300/60">
                    <span className="px-3 py-1 rounded-full border border-green-400/20 bg-white/5">
                      TEAM: {teamName || "—"}
                    </span>
                    <span className="px-3 py-1 rounded-full border border-green-400/20 bg-white/5">
                      SIZE: {teamSize || "—"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="relative overflow-hidden rounded-2xl border border-green-400/20 bg-black/40 backdrop-blur-xl p-6 shadow-[0_0_60px_rgba(34,197,94,0.08)]"
                    >
                      <div className="absolute inset-0 opacity-60 bg-gradient-to-br from-green-500/10 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute -top-24 -right-24 w-56 h-56 rounded-full bg-green-500/10 blur-3xl pointer-events-none" />

                      <div className="relative flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl border border-green-400/20 bg-white/5 flex items-center justify-center text-green-300 font-bold">
                            {i + 1}
                          </div>

                          <div>
                            <div className="text-green-200 font-semibold tracking-wide">
                              {i === 0 ? "Leader" : `Member ${i}`}
                            </div>
                            <div className="text-xs text-green-300/60 tracking-widest uppercase">
                              {m.department || "—"}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setShowSummary(false);
                            setCurrentIndex(i + 1);
                          }}
                          className="text-xs tracking-widest px-3 py-2 rounded-full border border-green-400/20 bg-white/5 hover:bg-green-500/10 hover:border-green-400/40 transition text-green-200"
                        >
                          EDIT
                        </button>
                      </div>

                      <div className="relative mt-5 grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Name</span>
                          <span className="text-green-100 text-right font-medium">
                            {m.name || "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">College</span>
                          <span className="text-green-100 text-right font-medium">
                            {m.clg || "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Email</span>
                          <span className="text-green-100 text-right font-medium break-all">
                            {m.email || "—"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Mobile</span>
                          <span className="text-green-100 text-right font-medium">
                            {m.mobile || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 text-center text-black">
                  <p className="font-semibold">Scan & Pay</p>
                  <img
                    src={scanImg}
                    alt={`QR for team size ${teamSize || ""}`}
                    className="mx-auto w-[260px] h-[300px] object-contain mt-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="relative border-2 border-dashed border-green-400/40 rounded-xl h-[360px] flex items-center justify-center cursor-pointer overflow-hidden">
                    {!paymentImage ? (
                      <div className="text-center">
                        <h1 className="text-gray-400 text-sm tracking-widest">UPLOAD</h1>
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
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setPaymentImage(file);
                        setErrors((prev) => ({
                          ...prev,
                          paymentImage: file ? "" : "Payment screenshot is required",
                        }));
                      }}
                      required
                    />
                  </label>
                  {errors.paymentImage && (
                    <p className="text-xs text-red-400/90">{errors.paymentImage}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-green-300 font-semibold tracking-widest">
                  TRANSACTION ID:
                </label>
                <input
                  value={transactionId}
                  onChange={(e) => {
                    const v = e.target.value;
                    setTransactionId(v);
                    const msg = !v.trim()
                      ? "Transaction ID is required"
                      : !TXN_RE.test(v.trim())
                      ? "Transaction ID looks invalid"
                      : "";
                    setErrors((prev) => ({ ...prev, transactionId: msg }));
                  }}
                  placeholder="Payment Transaction ID"
                  className={`p-3 w-full rounded-xl bg-transparent border text-sm ${
                    errors.transactionId ? "border-red-500/60" : "border-green-400/30"
                  }`}
                  required
                />
                {errors.transactionId && (
                  <p className="text-xs text-red-400/90">{errors.transactionId}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-black font-bold tracking-widest ${
                  loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                GENERATE TICKET
              </button>
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default FormField;
