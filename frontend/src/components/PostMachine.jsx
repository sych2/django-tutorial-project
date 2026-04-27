import { useState, useRef } from "react";

const RATE_TYPES = ["daily", "hourly", "weekly"];
const RATE_SUFFIX = { daily: "per day", hourly: "per hour", weekly: "per week" };
const STEPS = ["Machine details", "Pricing & availability", "Photos & contact", "Review & submit"];

const CATEGORIES = [
  "Forklift", "Concrete mixer", "Excavator", "Crane",
  "Bulldozer", "Generator", "Compressor", "Other",
];

const initialForm = {
  name: "", category: "", make: "", model: "", year: "", description: "",
  rate: "", rateType: "daily",
  availFrom: "", availTo: "", location: "", minRental: "1 day",
  owner: "", phone: "", email: "", whatsapp: false,
  photos: [],
};

export default function PostMachine() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    set("photos", previews);
  };

  const validate = () => {
    if (!form.name.trim()) return "Machine name is required.";
    if (!form.category) return "Category is required.";
    if (!form.rate) return "Rate is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.owner.trim()) return "Contact name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);

    const payload = {
      name: form.name,
      category: form.category,
      make: form.make,
      model: form.model,
      year: form.year,
      description: form.description,
      rate: { amount: form.rate, type: form.rateType },
      location: form.location,
      availability: { from: form.availFrom, to: form.availTo },
      minRental: form.minRental,
      contact: {
        name: form.owner,
        phone: form.phone,
        email: form.email,
        whatsapp: form.whatsapp,
      },
      photoCount: form.photos.length,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    try {
      // ── SWAP THIS with your real API call ──────────────────────────────
      // const res = await fetch("/api/listings", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("Failed to save listing");
      // ──────────────────────────────────────────────────────────────────

      // Simulated delay (remove once real API is wired up)
      await new Promise((r) => setTimeout(r, 1400));
      console.log("[IronGrid] Listing saved:", payload);
      setSubmitted(true);
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setStep(0);
    setSubmitted(false);
    setError("");
  };

  if (submitted) return <SuccessScreen onReset={reset} />;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Progress bar */}
      <ProgressBar current={step} onNavigate={setStep} />

      {step === 0 && <StepDetails form={form} set={set} onNext={() => setStep(1)} />}
      {step === 1 && <StepPricing form={form} set={set} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && (
        <StepPhotos
          form={form} set={set}
          fileRef={fileRef} handlePhotos={handlePhotos}
          onBack={() => setStep(1)} onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <StepReview
          form={form} error={error} loading={loading}
          onBack={() => setStep(2)} onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* ── Progress Bar ───────────────────────────────────────────────── */
function ProgressBar({ current, onNavigate }) {
  return (
    <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "0.5px solid #d1d5db", marginBottom: "2rem" }}>
      {STEPS.map((label, i) => (
        <button
          key={i}
          onClick={() => i < current && onNavigate(i)}
          style={{
            flex: 1, padding: "10px 8px", fontSize: 12, textAlign: "center",
            border: "none", borderRight: i < STEPS.length - 1 ? "0.5px solid #d1d5db" : "none",
            cursor: i < current ? "pointer" : "default",
            background: i < current ? "#0F6E56" : i === current ? "#185FA5" : "#f9fafb",
            color: i <= current ? (i < current ? "#E1F5EE" : "#E6F1FB") : "#6b7280",
            fontWeight: i === current ? 500 : 400,
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ── Step 1: Machine details ────────────────────────────────────── */
function StepDetails({ form, set, onNext }) {
  return (
    <div>
      <h2 style={styles.title}>Tell us about your machine</h2>
      <p style={styles.sub}>Accurate details help renters find and trust your listing.</p>

      <Field label="Machine name">
        <input style={styles.input} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Caterpillar 950M Wheel Loader" />
      </Field>

      <div style={styles.twoCol}>
        <Field label="Category">
          <select style={styles.input} value={form.category} onChange={(e) => set("category", e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Year of manufacture">
          <input style={styles.input} type="number" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="e.g. 2019" min={1980} max={2026} />
        </Field>
      </div>

      <div style={styles.twoCol}>
        <Field label="Make / Brand">
          <input style={styles.input} value={form.make} onChange={(e) => set("make", e.target.value)} placeholder="e.g. Caterpillar" />
        </Field>
        <Field label="Model">
          <input style={styles.input} value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="e.g. 950M" />
        </Field>
      </div>

      <Field label="Description">
        <textarea style={{ ...styles.input, minHeight: 90, resize: "vertical" }} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Condition, capacity, special features or attachments..." />
      </Field>

      <NavRow onNext={onNext} nextLabel="Next: pricing ›" />
    </div>
  );
}

/* ── Step 2: Pricing & availability ─────────────────────────────── */
function StepPricing({ form, set, onBack, onNext }) {
  return (
    <div>
      <h2 style={styles.title}>Pricing & availability</h2>
      <p style={styles.sub}>Set your rate and when the machine is available.</p>

      <Field label="Rate type">
        <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "0.5px solid #d1d5db", marginBottom: 10 }}>
          {RATE_TYPES.map((t) => (
            <button key={t} onClick={() => set("rateType", t)} style={{
              flex: 1, padding: "8px", fontSize: 13, border: "none", cursor: "pointer",
              background: form.rateType === t ? "#185FA5" : "#f9fafb",
              color: form.rateType === t ? "#E6F1FB" : "#6b7280",
              fontWeight: form.rateType === t ? 500 : 400,
              transition: "background 0.15s",
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15, color: "#6b7280" }}>KES</span>
          <input style={{ ...styles.input, maxWidth: 180 }} type="number" min={0} value={form.rate} onChange={(e) => set("rate", e.target.value)} placeholder="0" />
          <span style={{ fontSize: 13, color: "#6b7280" }}>{RATE_SUFFIX[form.rateType]}</span>
        </div>
      </Field>

      <Field label="Availability window">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input style={{ ...styles.input, maxWidth: 170 }} type="date" value={form.availFrom} onChange={(e) => set("availFrom", e.target.value)} />
          <span style={{ color: "#6b7280", fontSize: 13 }}>to</span>
          <input style={{ ...styles.input, maxWidth: 170 }} type="date" value={form.availTo} onChange={(e) => set("availTo", e.target.value)} />
        </div>
      </Field>

      <Field label="Location">
        <input style={styles.input} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Town, county or region — e.g. Nairobi, Westlands" />
      </Field>

      <Field label="Minimum rental period">
        <select style={styles.input} value={form.minRental} onChange={(e) => set("minRental", e.target.value)}>
          {["1 day", "2 days", "3 days", "1 week", "2 weeks"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Next: photos ›" />
    </div>
  );
}

/* ── Step 3: Photos & contact ───────────────────────────────────── */
function StepPhotos({ form, set, fileRef, handlePhotos, onBack, onNext }) {
  return (
    <div>
      <h2 style={styles.title}>Photos & contact info</h2>
      <p style={styles.sub}>Listings with photos get significantly more inquiries.</p>

      <Field label="Machine photos (up to 8)">
        <div
          onClick={() => fileRef.current.click()}
          style={{ border: "1.5px dashed #d1d5db", borderRadius: 12, padding: "2rem 1rem", textAlign: "center", color: "#6b7280", fontSize: 13, cursor: "pointer" }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>🖼</div>
          <div style={{ fontWeight: 500, color: "#111", marginBottom: 4 }}>Click to upload photos</div>
          <div>JPG, PNG or WEBP · Max 10 MB each</div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhotos} />
        </div>
        {form.photos.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1rem" }}>
            {form.photos.map((p, i) => (
              <img key={i} src={p.url} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, border: "0.5px solid #e5e7eb" }} />
            ))}
          </div>
        )}
      </Field>

      <div style={styles.twoCol}>
        <Field label="Owner / contact name">
          <input style={styles.input} value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Your full name" />
        </Field>
        <Field label="Phone number">
          <input style={styles.input} type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+254 7XX XXX XXX" />
        </Field>
      </div>

      <Field label="Email (optional)">
        <input style={styles.input} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" />
      </Field>

      <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "#374151" }}>
        <input type="checkbox" checked={form.whatsapp} onChange={(e) => set("whatsapp", e.target.checked)} style={{ accentColor: "#185FA5" }} />
        Renters can contact me on WhatsApp
      </label>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Review listing ›" />
    </div>
  );
}

/* ── Step 4: Review & submit ────────────────────────────────────── */
function StepReview({ form, error, loading, onBack, onSubmit }) {
  const rate = form.rate ? `KES ${parseInt(form.rate).toLocaleString()} ${RATE_SUFFIX[form.rateType]}` : "—";
  return (
    <div>
      <h2 style={styles.title}>Review your listing</h2>
      <p style={styles.sub}>Double-check everything before publishing.</p>

      <SummaryCard items={[
        { label: "Machine", value: form.name },
        { label: "Category", value: form.category },
        { label: "Make / model", value: [form.make, form.model].filter(Boolean).join(" ") || "—" },
        { label: "Year", value: form.year },
      ]} />
      <SummaryCard items={[
        { label: "Rate", value: rate },
        { label: "Location", value: form.location },
        { label: "Available from", value: form.availFrom || "—" },
        { label: "Available to", value: form.availTo || "—" },
      ]} />
      <SummaryCard items={[
        { label: "Contact", value: form.owner },
        { label: "Phone", value: form.phone },
      ]}>
        <div style={{ marginTop: 10 }}>
          <div style={styles.summaryLabel}>Photos</div>
          <div style={{ marginTop: 4, fontSize: 13, color: form.photos.length ? "#0C447C" : "#9ca3af" }}>
            {form.photos.length > 0 ? `${form.photos.length} photo${form.photos.length > 1 ? "s" : ""} selected` : "No photos added"}
          </div>
        </div>
      </SummaryCard>

      {error && (
        <div style={{ color: "#991b1b", fontSize: 13, marginBottom: "1rem", padding: 10, background: "#fef2f2", borderRadius: 8, border: "0.5px solid #fca5a5" }}>
          {error}
        </div>
      )}

      <NavRow
        onBack={onBack}
        onNext={onSubmit}
        nextLabel={loading ? "Publishing..." : "Publish listing"}
        nextStyle={{ background: "#185FA5", color: "#E6F1FB", borderColor: "#185FA5", opacity: loading ? 0.7 : 1 }}
        disabled={loading}
      />
    </div>
  );
}

/* ── Success screen ─────────────────────────────────────────────── */
function SuccessScreen({ onReset }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <div style={{ fontSize: 48, marginBottom: "1rem" }}>✅</div>
      <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>Your machine is live!</h2>
      <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
        Your listing has been saved and is now visible to renters on Iron Grid.<br />
        You'll be notified when someone makes an inquiry.
      </p>
      <button onClick={onReset} style={{ marginTop: "1.5rem" }}>Post another machine</button>
    </div>
  );
}

/* ── Shared helpers ─────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function SummaryCard({ items, children }) {
  return (
    <div style={{ background: "#f9fafb", borderRadius: 12, border: "0.5px solid #e5e7eb", padding: "1.25rem", marginBottom: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map(({ label, value }) => (
          <div key={label}>
            <div style={styles.summaryLabel}>{label}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "#111" }}>{value || "—"}</div>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

function NavRow({ onBack, onNext, nextLabel = "Next ›", nextStyle = {}, disabled = false }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem" }}>
      {onBack
        ? <button onClick={onBack} style={{ background: "transparent", border: "0.5px solid #d1d5db", padding: "9px 18px", borderRadius: 8, cursor: "pointer" }}>‹ Back</button>
        : <span />}
      <button onClick={onNext} disabled={disabled} style={{ padding: "9px 18px", borderRadius: 8, border: "0.5px solid #d1d5db", cursor: disabled ? "not-allowed" : "pointer", ...nextStyle }}>
        {nextLabel}
      </button>
    </div>
  );
}

const styles = {
  title: { fontSize: 18, fontWeight: 500, marginBottom: 4 },
  sub: { fontSize: 13, color: "#6b7280", marginBottom: "1.5rem" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "0.5px solid #d1d5db", fontSize: 14, outline: "none", boxSizing: "border-box" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  summaryLabel: { fontSize: 12, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 },
};
