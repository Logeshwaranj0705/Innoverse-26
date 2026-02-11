import React, { useEffect, useMemo, useState } from "react";
import Particles from "./particles";
import Ticket from "./Ticket";
import { api } from "../../../public/api.js";
import scanner3 from "../../assets/scanner-3.jpeg";
import scanner4 from "../../assets/scanner-4.jpeg";
import toast, { Toaster } from "react-hot-toast";

const NAME_RE = /^[A-Za-z\s.'-]{2,60}$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const TXN_RE = /^[A-Za-z0-9_-]{6,40}$/;
const DEPT_RE = /^[A-Za-z\s&().,'-]{2,60}$/;

const normalizeSpaces = (v) => String(v || "").replace(/\s+/g, " ").trim();
const normLower = (v) => normalizeSpaces(v).toLowerCase();

const YEARS = ["1", "2", "3", "4"];
const GENDERS = ["Male", "Female", "Other"];
const DEGREES = ["B.E", "B.Tech", "B.Sc", "BCA", "M.E", "M.Tech", "M.Sc", "MCA", "MBA", "PhD", "Other"];

const SATHYABAMA = "Sathyabama Institute of Science and Technology";

export default function FormField() {
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

  const [satState, setSatState] = useState({ loading: false, filled: false, count: 0, limit: 0 });

  const [errors, setErrors] = useState({
    teamName: "",
    teamSize: "",
    member: {},
    transactionId: "",
    paymentImage: "",
  });

  const sizeNum = useMemo(() => Number(teamSize || 0), [teamSize]);

  const scanImg = useMemo(() => {
    if (sizeNum === 3) return scanner3;
    if (sizeNum === 4) return scanner4;
    return scanner3;
  }, [sizeNum]);

  const loadingTexts = useMemo(
    () => ["PLEASE WAIT MAY TAKE A WHILE", "DO NOT CLOSE THE TAB", "GENERATING TICKET"],
    []
  );
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setLoadingTextIndex(0);
      return;
    }
    const id = setInterval(() => setLoadingTextIndex((i) => (i + 1) % loadingTexts.length), 1900);
    return () => clearInterval(id);
  }, [loading, loadingTexts]);

  const validateTeamName = (v) => {
    const value = normalizeSpaces(v);
    if (!value) return "Team name is required";
    if (value.length < 2) return "Team name is too short";
    if (value.length > 60) return "Team name is too long";
    if (!/^[A-Za-z0-9\s.'-]+$/.test(value)) return "Team name contains invalid characters";
    return "";
  };

  const validateField = (field, rawValue, ctx = {}) => {
    const value =
      field === "mobile" || field === "email" ? String(rawValue || "").trim() : String(rawValue || "");

    if (field === "name") {
      const v = normalizeSpaces(value);
      if (!v) return "Full name is required";
      if (!NAME_RE.test(v)) return "Name must contain only letters and spaces";
      return "";
    }

    if (field === "clg") {
      const clean = normalizeSpaces(value);
      if (!clean) return "College name is required";
      if (clean.length < 2) return "College name is too short";
      if (clean.length > 120) return "College name is too long";
      if (ctx?.clgMode === "OTHER" && normLower(clean) === normLower(SATHYABAMA))
        return "Select Sathyabama from dropdown (don’t type it in Others)";
      return "";
    }

    if (field === "dept") {
      const v = normalizeSpaces(value);
      if (!v) return "Department is required";
      if (!DEPT_RE.test(v)) return "Enter a valid department";
      return "";
    }

    if (field === "email") {
      const v = String(rawValue || "").trim();
      if (!v) return "Email is required";
      if (!EMAIL_RE.test(v)) return "Enter a valid email address";
      return "";
    }

    if (field === "mobile") {
      const phone = String(rawValue || "").replace(/\s+/g, "");
      if (!phone) return "Mobile number is required";
      if (!PHONE_RE.test(phone)) return "Enter a valid 10-digit Indian mobile number";
      return "";
    }

    if (field === "gender") {
      const v = normalizeSpaces(value);
      if (!v) return "Gender is required";
      if (!GENDERS.includes(v)) return "Select a valid gender";
      return "";
    }

    if (field === "degree") {
      const v = normalizeSpaces(value);
      if (!v) return "Degree is required";
      if (!DEGREES.includes(v)) return "Select a valid degree";
      return "";
    }

    if (field === "year") {
      const v = normalizeSpaces(value);
      if (!v) return "Year is required";
      if (!YEARS.includes(v)) return "Select a valid year";
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

  const fetchSathyabamaStatus = async () => {
    try {
      setSatState({ loading: true, filled: false, count: 0, limit: 0 });

      const res = await fetch(`${api}/slots/sathyabama`);
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) throw new Error(data?.error || "Failed to check slots");

      const next = {
        loading: false,
        filled: !!data.filled,
        count: Number(data.count || 0),
        limit: Number(data.limit || 0),
      };

      setSatState(next);
      return next.filled;
    } catch (e) {
      setSatState({ loading: false, filled: false, count: 0, limit: 0 });
      toast.error(e?.message || "Unable to check Sathyabama slots");
      return false;
    }
  };

  const handleTeamSize = (sizeStr) => {
    setTeamSize(sizeStr);
    const size = Number(sizeStr || 0);

    setCurrentIndex(1);
    setShowSummary(false);
    setPaymentImage(null);
    setTransactionId("");
    setSatState({ loading: false, filled: false, count: 0, limit: 0 });
    setErrors({ teamName: "", teamSize: "", member: {}, transactionId: "", paymentImage: "" });

    if (!size) {
      setMembers([]);
      return;
    }

    setMembers(
      Array.from({ length: size }, (_, i) => ({
        role: i === 0 ? "Leader" : `Member ${i}`,
        name: "",
        clgMode: "",
        clg: "",
        dept: "",
        email: "",
        mobile: "",
        gender: "",
        degree: "",
        year: "",
      }))
    );
  };

  const handleChange = (field, value) => {
    let v = value;

    if (field === "name" || field === "teamName" || field === "dept") v = v.replace(/\s+/g, " ");
    if (field === "mobile") v = v.replace(/[^\d]/g, "").slice(0, 10);
    if (field === "email") v = v.trim();

    const updated = [...members];
    const idx = currentIndex - 1;
    if (!updated[idx]) return;

    updated[idx][field] = v;
    setMembers(updated);

    const msg = validateField(field, v, updated[idx]);
    if (msg) setMemberError(field, msg);
    else clearMemberError(field);
  };

  const handleCollegeMode = async (mode) => {
    const updated = [...members];
    const idx = currentIndex - 1;
    if (!updated[idx]) return;

    updated[idx].clgMode = mode;

    if (mode === "SIST") {
      const filled = await fetchSathyabamaStatus();
      if (filled) {
        updated[idx].clgMode = "";
        updated[idx].clg = "";
        setMembers(updated);
        setMemberError("clg", "Slot filled for Sathyabama");
        toast.error("Slot filled for Sathyabama");
        return;
      }
      updated[idx].clg = SATHYABAMA;
      setMembers(updated);
      clearMemberError("clg");
      return;
    }

    if (mode === "OTHER") {
      updated[idx].clg = "";
      setMembers(updated);
      const msg = validateField("clg", "", updated[idx]);
      if (msg) setMemberError("clg", msg);
      return;
    }

    updated[idx].clg = "";
    setMembers(updated);
    const msg = validateField("clg", "", updated[idx]);
    if (msg) setMemberError("clg", msg);
  };

  const handleOtherCollege = (val) => {
    const updated = [...members];
    const idx = currentIndex - 1;
    if (!updated[idx]) return;

    updated[idx].clg = val;
    setMembers(updated);

    const msg = validateField("clg", val, updated[idx]);
    if (msg) setMemberError("clg", msg);
    else clearMemberError("clg");
  };

  const validateCurrentMember = () => {
    const idx = currentIndex - 1;
    const m = members[idx];
    const requiredFields = ["name", "clg", "dept", "email", "mobile", "gender", "degree", "year"];

    const fieldErrors = {};
    requiredFields.forEach((f) => {
      const msg = validateField(f, m?.[f] ?? "", m);
      if (msg) fieldErrors[f] = msg;
    });

    if (!m?.clgMode) fieldErrors.clg = fieldErrors.clg || "Select college option";

    setErrors((prev) => ({ ...prev, member: fieldErrors }));
    return Object.keys(fieldErrors).length === 0;
  };

  const handleNext = async () => {
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

    const idx = currentIndex - 1;
    const m = members[idx];

    if (m?.clgMode === "SIST") {
      const filled = await fetchSathyabamaStatus();
      if (filled) {
        const updated = [...members];
        updated[idx].clgMode = "";
        updated[idx].clg = "";
        setMembers(updated);
        setMemberError("clg", "Slot filled for Sathyabama");
        toast.error("Slot filled for Sathyabama");
        return;
      }
    }

    if (!validateCurrentMember()) {
      toast.error("Please fix highlighted fields");
      return;
    }

    if (currentIndex < sizeNum) {
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

    const sathyabamaTypedInOther = members.some(
      (m) => m?.clgMode === "OTHER" && normLower(m?.clg) === normLower(SATHYABAMA)
    );
    const leaderIsSathyabama = normLower(members?.[0]?.clg) === normLower(SATHYABAMA);

    let clgErr = "";
    if (sathyabamaTypedInOther) clgErr = "Do not type Sathyabama in Other college field";
    if (leaderIsSathyabama && satState.filled) clgErr = "Slot filled for Sathyabama";

    setErrors((prev) => ({
      ...prev,
      teamName: tnErr,
      transactionId: txnErr,
      paymentImage: imgErr,
      member: clgErr ? { ...(prev.member || {}), clg: clgErr } : prev.member,
    }));

    if (tnErr) toast.error(tnErr);
    if (imgErr) toast.error(imgErr);
    if (txnErr) toast.error(txnErr);
    if (clgErr) toast.error(clgErr);

    return !tnErr && !txnErr && !imgErr && !clgErr;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaderIsSathyabama = normLower(members?.[0]?.clg) === normLower(SATHYABAMA);
    if (leaderIsSathyabama) {
      const filled = await fetchSathyabamaStatus();
      if (filled) {
        toast.error("Slot filled for Sathyabama");
        return;
      }
    }

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
        teamSize: sizeNum,
        members: members.map((m) => ({
          ...m,
          name: normalizeSpaces(m.name),
          clg: normalizeSpaces(m.clg),
          dept: normalizeSpaces(m.dept),
          email: (m.email || "").trim(),
          mobile: String(m.mobile || "").replace(/\s+/g, ""),
          gender: (m.gender || "").trim(),
          degree: (m.degree || "").trim(),
          year: String(m.year || "").trim(),
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
        const msg = data?.error || data?.message || `Server error (${res.status}). Please try again.`;
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
  const isSistSelected = normLower(currentMember?.clg) === normLower(SATHYABAMA);

  const canProceed = useMemo(() => {
    if (!sizeNum || !members.length) return false;
    const req = ["name", "clg", "dept", "email", "mobile", "gender", "degree", "year"];
    const fieldsOk = req.every((f) => !validateField(f, currentMember?.[f] ?? "", currentMember));
    if (!currentMember?.clgMode) return false;
    if (currentMember?.clgMode === "SIST" && satState.loading) return false;
    if (currentMember?.clgMode === "SIST" && satState.filled) return false;
    return fieldsOk;
  }, [sizeNum, members.length, currentIndex, satState.loading, satState.filled, currentMember]);

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
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85">
          <div className="flex flex-col items-center gap-4 px-6">
            <div className="w-14 h-14 rounded-full border-4 border-green-400 border-t-transparent animate-spin" />
            <p className="text-green-300 tracking-[0.35em] text-sm text-center font-semibold">
              {loadingTexts[loadingTextIndex]}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full bg-green-400 transition-opacity ${
                  loadingTextIndex === 0 ? "opacity-100" : "opacity-25"
                }`}
              />
              <span
                className={`h-2 w-2 rounded-full bg-green-400 transition-opacity ${
                  loadingTextIndex === 1 ? "opacity-100" : "opacity-25"
                }`}
              />
              <span
                className={`h-2 w-2 rounded-full bg-green-400 transition-opacity ${
                  loadingTextIndex === 2 ? "opacity-100" : "opacity-25"
                }`}
              />
            </div>
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
              <h2 className="text-2xl font-bold tracking-widest text-green-400">TEAM REGISTRATION</h2>
              <p className="mt-1 text-sm text-green-300/60">Enter team and participant details carefully</p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-green-300 font-semibold tracking-widest">TEAM DETAILS</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-green-300/60 tracking-widest">TEAM NAME</label>
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
                {errors.teamName && <p className="text-xs text-red-400/90">{errors.teamName}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-green-300/60 tracking-widest">TEAM SIZE</label>
                <select
                  value={teamSize}
                  onChange={(e) => handleTeamSize(e.target.value)}
                  className={`p-3 rounded-xl bg-black border ${
                    errors.teamSize ? "border-red-500/60" : "border-green-400/30"
                  }`}
                  required
                >
                  <option value="">Select Team Size</option>
                  <option value="3">3 Members</option>
                  <option value="4">4 Members</option>
                </select>
                {errors.teamSize && <p className="text-xs text-red-400/90">{errors.teamSize}</p>}
              </div>
            </div>
          </div>

          {!teamSize && (
            <div className="flex justify-center">
              <div className="w-full max-w-xl text-center border border-green-400/30 rounded-2xl p-10 bg-black/50">
                <h3 className="text-green-400 text-xl font-bold tracking-widest">MAKE YOUR FIRST MOVE</h3>
                <p className="mt-3 text-green-300/60 text-sm">Select a team size to begin your Innoverse journey</p>
              </div>
            </div>
          )}

          {teamSize && !showSummary && (
            <div className="space-y-6">
              <h3 className="text-green-400 font-semibold tracking-widest">
                {currentIndex === 1 ? "LEADER" : `MEMBER ${currentIndex - 1}`} DETAILS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-green-300/60 tracking-widest">FULL NAME</label>
                  <input
                    value={currentMember.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("name", currentMember.name || "", currentMember);
                      if (msg) setMemberError("name", msg);
                      else clearMemberError("name");
                    }}
                    className={`p-3 rounded-xl bg-transparent border ${
                      memberErr.name ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  />
                  {memberErr.name && <p className="text-xs text-red-400/90">{memberErr.name}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-green-300/60 tracking-widest">DEPARTMENT</label>
                  <input
                    value={currentMember.dept || ""}
                    onChange={(e) => handleChange("dept", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("dept", currentMember.dept || "", currentMember);
                      if (msg) setMemberError("dept", msg);
                      else clearMemberError("dept");
                    }}
                    className={`p-3 rounded-xl bg-transparent border ${
                      memberErr.dept ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  />
                  {memberErr.dept && <p className="text-xs text-red-400/90">{memberErr.dept}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-green-300/60 tracking-widest">MOBILE NUMBER</label>
                  <input
                    inputMode="numeric"
                    type="tel"
                    value={currentMember.mobile || ""}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("mobile", currentMember.mobile || "", currentMember);
                      if (msg) setMemberError("mobile", msg);
                      else clearMemberError("mobile");
                    }}
                    className={`p-3 rounded-xl bg-transparent border ${
                      memberErr.mobile ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  />
                  {memberErr.mobile && <p className="text-xs text-red-400/90">{memberErr.mobile}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] text-green-300/60 tracking-widest">GENDER</label>
                  <div
                    className={`rounded-xl border p-3 ${
                      memberErr.gender ? "border-red-500/60" : "border-green-400/30"
                    }`}
                  >
                    <div className="flex flex-wrap gap-4">
                      {GENDERS.map((g) => (
                        <label key={g} className="flex items-center gap-2 text-sm text-green-100/90 cursor-pointer">
                          <input
                            type="radio"
                            name={`gender-${currentIndex}`}
                            value={g}
                            checked={currentMember.gender === g}
                            onChange={(e) => handleChange("gender", e.target.value)}
                          />
                          <span className="tracking-wide">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {memberErr.gender && <p className="text-xs text-red-400/90">{memberErr.gender}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-green-300/60 tracking-widest">DEGREE</label>
                  <select
                    value={currentMember.degree || ""}
                    onChange={(e) => handleChange("degree", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("degree", currentMember.degree || "", currentMember);
                      if (msg) setMemberError("degree", msg);
                      else clearMemberError("degree");
                    }}
                    className={`p-3 rounded-xl bg-black border ${
                      memberErr.degree ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  >
                    <option value="">Select Degree</option>
                    {DEGREES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {memberErr.degree && <p className="text-xs text-red-400/90">{memberErr.degree}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-green-300/60 tracking-widest">YEAR</label>
                  <select
                    value={currentMember.year || ""}
                    onChange={(e) => handleChange("year", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("year", currentMember.year || "", currentMember);
                      if (msg) setMemberError("year", msg);
                      else clearMemberError("year");
                    }}
                    className={`p-3 rounded-xl bg-black border ${
                      memberErr.year ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  >
                    <option value="">Select Year</option>
                    {YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y} Year
                      </option>
                    ))}
                  </select>
                  {memberErr.year && <p className="text-xs text-red-400/90">{memberErr.year}</p>}
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[11px] text-green-300/60 tracking-widest">COLLEGE</label>

                  <select
                    value={currentMember.clgMode || ""}
                    onChange={(e) => handleCollegeMode(e.target.value)}
                    className={`p-3 rounded-xl bg-black border ${
                      memberErr.clg ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  >
                    <option value="">Select College</option>
                    <option value="SIST">
                      {SATHYABAMA}
                      {satState.limit ? ` (${satState.count}/${satState.limit})` : ""}
                      {satState.filled ? " - SLOT FILLED" : ""}
                    </option>
                    <option value="OTHER">Others</option>
                  </select>

                  {currentMember.clgMode === "OTHER" && (
                    <input
                      value={currentMember.clg || ""}
                      onChange={(e) => handleOtherCollege(e.target.value)}
                      onBlur={() => {
                        const msg = validateField("clg", currentMember.clg || "", currentMember);
                        if (msg) setMemberError("clg", msg);
                        else clearMemberError("clg");
                      }}
                      placeholder="Enter your college name"
                      className={`mt-3 p-3 rounded-xl bg-transparent border ${
                        memberErr.clg ? "border-red-500/60" : "border-green-400/30"
                      }`}
                      required
                    />
                  )}

                  {currentMember.clgMode === "SIST" && (
                    <div className="mt-2 text-xs text-green-300/60 tracking-widest">
                      {satState.loading ? "Checking slots..." : isSistSelected ? "Selected: Sathyabama" : ""}
                    </div>
                  )}

                  {memberErr.clg && <p className="text-xs text-red-400/90">{memberErr.clg}</p>}
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-[11px] text-green-300/60 tracking-widest">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    value={currentMember.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => {
                      const msg = validateField("email", currentMember.email || "", currentMember);
                      if (msg) setMemberError("email", msg);
                      else clearMemberError("email");
                    }}
                    className={`p-3 rounded-xl bg-transparent border ${
                      memberErr.email ? "border-red-500/60" : "border-green-400/30"
                    }`}
                    required
                  />
                  {memberErr.email && <p className="text-xs text-red-400/90">{memberErr.email}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="text-xs text-green-300/60 tracking-widest">
                  {currentIndex}/{sizeNum}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={`px-8 py-2 rounded-full font-bold tracking-widest transition ${
                    canProceed ? "bg-green-400 text-black" : "bg-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  {currentIndex === sizeNum ? "REVIEW TEAM" : "NEXT"}
                </button>
              </div>
            </div>
          )}

          {showSummary && (
            <>
              <div className="space-y-8">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <h3 className="text-green-400 font-semibold tracking-widest">TEAM SUMMARY</h3>
                    <p className="mt-2 text-sm text-green-300/60">Review the details before generating your ticket</p>
                  </div>

                  <div className="hidden md:flex items-center gap-3 text-xs tracking-widest text-green-300/60">
                    <span className="px-3 py-1 rounded-full border border-green-400/20 bg-white/5">TEAM: {teamName || "—"}</span>
                    <span className="px-3 py-1 rounded-full border border-green-400/20 bg-white/5">SIZE: {sizeNum || "—"}</span>
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
                            <div className="text-green-200 font-semibold tracking-wide">{i === 0 ? "Leader" : `Member ${i}`}</div>
                            <div className="text-xs text-green-300/60 tracking-widest uppercase">
                              {(m.degree || "—") + (m.year ? ` • ${m.year} Year` : "")}
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
                          <span className="text-green-100 text-right font-medium">{m.name || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">College</span>
                          <span className="text-green-100 text-right font-medium">{normalizeSpaces(m.clg) || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Department</span>
                          <span className="text-green-100 text-right font-medium">{m.dept || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Gender</span>
                          <span className="text-green-100 text-right font-medium">{m.gender || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Degree</span>
                          <span className="text-green-100 text-right font-medium">{m.degree || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Email</span>
                          <span className="text-green-100 text-right font-medium break-all">{m.email || "—"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className="text-green-300/60">Mobile</span>
                          <span className="text-green-100 text-right font-medium">{m.mobile || "—"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/40 border border-green-400/20 rounded-2xl p-6 text-center text-white backdrop-blur-xl shadow-[0_0_60px_rgba(34,197,94,0.08)]">
                  <p className="font-semibold tracking-widest text-green-300">SCAN & PAY</p>
                  <img src={scanImg} alt={`QR for team size ${sizeNum || ""}`} className="mx-auto w-[260px] h-[300px] object-contain mt-3" />
                  <p className="mt-2 text-xs text-green-300/60 tracking-widest">UPLOAD SCREENSHOT AFTER PAYMENT</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="relative border border-green-400/20 bg-black/40 backdrop-blur-xl rounded-2xl h-[420px] flex items-center justify-center cursor-pointer overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.08)]">
                    {!paymentImage ? (
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-2xl border border-green-400/20 bg-white/5 flex items-center justify-center text-green-300 font-bold">
                          ⇪
                        </div>
                        <h1 className="mt-3 text-green-300 text-sm tracking-widest">UPLOAD</h1>
                        <span className="text-green-300/60 text-xs tracking-widest">PAYMENT SCREENSHOT</span>
                      </div>
                    ) : (
                      <img src={URL.createObjectURL(paymentImage)} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
                    )}

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setPaymentImage(file);
                        setErrors((prev) => ({ ...prev, paymentImage: file ? "" : "Payment screenshot is required" }));
                      }}
                      required
                    />

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-green-500/10 via-transparent to-transparent" />
                  </label>
                  {errors.paymentImage && <p className="text-xs text-red-400/90">{errors.paymentImage}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-green-300 font-semibold tracking-widest">TRANSACTION ID</label>
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
                {errors.transactionId && <p className="text-xs text-red-400/90">{errors.transactionId}</p>}
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
}

