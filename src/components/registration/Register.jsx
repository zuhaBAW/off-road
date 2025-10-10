import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./register.css";
import { createRegistration } from "../../api/registerApi";
import { useNavigate } from "react-router-dom";

/**
 * Usage:
 * const [open, setOpen] = useState(false);
 * <button onClick={() => setOpen(true)}>Register</button>
 * <RegistrationForm isOpen={open} onClose={() => setOpen(false)} />
 */
export default function RegistrationForm({ isOpen, onClose }) {
  const currentYear = new Date().getFullYear();

  // ---- Hooks must always run (before any conditional return)
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // Auth
    username: "",
    email: "",
    password: "",

    // Personal
    fullName: "",
    dob: "",
    nationality: "",

    // Contact
    mobile: "",
    city: "",

    // Driving
    offroadLevel: "",

    // Vehicle
    makeModel: "",
    year: currentYear,
    color: "",
    plateNo: "",
    mods: "",

    // Emergency
    emerName: "",
    emerPhone: "",
    emerRelation: "",

    // Safety
    recGear: "",
    fireExt: "",
    firstAid: "",
    flag: "",
    radio: "",
    recRope: "",
    airComp: "",
    spareTire: "",

    // Medical
    medical: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Lock body scroll & enable Esc to close when open
  useEffect(() => {
    if (!isOpen) return; // effect can be conditional (hooks still called)

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  // ---- After hooks, it’s safe to early return
  if (!isOpen) return null;

  // Helpers
  const setField = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };
  const ynToBool = (v) => (v === "yes" ? true : v === "no" ? false : null);
  const emptyToNull = (v) => (v === "" ? null : v);
  const cap1 = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // Payload for Strapi route
  const buildPayload = () => ({
    username: form.username,
    email: form.email,
    password: form.password,

    DOB: emptyToNull(form.dob),
    Nationality: emptyToNull(form.nationality),
    MobileNo: emptyToNull(form.mobile),
    City: emptyToNull(form.city),

    OffRoadLevel: emptyToNull(cap1(form.offroadLevel)),

    VehicalMakeModel: emptyToNull(form.makeModel),
    Year: form.year === "" ? null : Number(form.year),
    Color: emptyToNull(form.color),
    Mods: emptyToNull(form.mods),
    PlateNo: emptyToNull(form.plateNo),

    EmergencyContactName: emptyToNull(form.emerName),
    EmergencyContactNo: emptyToNull(form.emerPhone),
    Relationship: emptyToNull(form.emerRelation),

    RecoveryGear: ynToBool(form.recGear),
    FireExt: ynToBool(form.fireExt),
    FirstAidKit: ynToBool(form.firstAid),
    Flag: ynToBool(form.flag),
    Radio: ynToBool(form.radio),
    RecoveryRope: ynToBool(form.recRope),
    AirCompressor: ynToBool(form.airComp),
    SpareTire: ynToBool(form.spareTire),

    Medical: emptyToNull(form.medical),
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!formRef.current?.reportValidity()) return;

    setMsg({ type: "", text: "" });
    const payload = buildPayload();

    try {
      setSubmitting(true);
      await createRegistration(payload);
      setMsg({ type: "success", text: "Registration submitted successfully!" });

      // Reset most fields
      setForm((s) => ({
        ...s,
        password: "",
        fullName: "",
        dob: "",
        nationality: "",
        mobile: "",
        city: "",
        offroadLevel: "",
        makeModel: "",
        year: currentYear,
        color: "",
        plateNo: "",
        mods: "",
        emerName: "",
        emerPhone: "",
        emerRelation: "",
        recGear: "",
        fireExt: "",
        firstAid: "",
        flag: "",
        radio: "",
        recRope: "",
        airComp: "",
        spareTire: "",
        medical: "",
      }));

      // Optional: close + navigate
      setTimeout(() => {
        onClose?.();
        navigate("/home");
      }, 1200);
    } catch (err) {
      console.log(err, "error");
      setMsg({
        type: "error",
        text: "Registration failed. This email or username might already be in use.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Click outside should close (but clicks inside shouldn't bubble)
  const stop = (e) => e.stopPropagation();

  const modal = (
    <div
      className="bk-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bk-modal-title"
      onClick={onClose}
    >
      <div className="bk-modal" onClick={stop}>
        <div className="bk-frame" >
          <header className="bk-header">
            <button className="close-btn" onClick={onClose}>
              close
            </button>
            <h1 id="bk-modal-title" className="bk-title">
              Register your details
            </h1>
            <p className="bk-sub">Please fill all fields</p>

            {msg.text ? (
              <div
                className={`bk-alert ${
                  msg.type === "error" ? "bk-alert-error" : "bk-alert-success"
                }`}
                role="alert"
              >
                {msg.text}
              </div>
            ) : null}
          </header>

          <form ref={formRef} className="bk-grid" onSubmit={submit} noValidate>
            {/* Account */}
            <section className="bk-card account">
              <h4 className="bk-card-title">Account</h4>
              <label className="bk-label">
                Username
                <input
                  className="bk-input"
                  name="username"
                  value={form.username}
                  onChange={setField}
                  required
                  placeholder="yourname"
                />
              </label>
              <label className="bk-label">
                Email
                <input
                  className="bk-input"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={setField}
                  required
                  placeholder="you@example.com"
                />
              </label>
              <label className="bk-label">
                Password
                <input
                  className="bk-input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={setField}
                  required
                  placeholder="••••••••"
                />
              </label>
            </section>

            {/* Contact */}
            <section className="bk-card contact">
              <h4 className="bk-card-title">Contact Information</h4>
              <label className="bk-label">
                Mobile No.
                <input
                  className="bk-input"
                  name="mobile"
                  value={form.mobile}
                  onChange={setField}
                  required
                  placeholder="+971 5x xxx xxxx"
                />
              </label>
              <label className="bk-label">
                City
                <input
                  className="bk-input"
                  name="city"
                  value={form.city}
                  onChange={setField}
                  required
                  placeholder="Dubai"
                />
              </label>
            </section>

            {/* Emergency */}
            <section className="bk-card emergency">
              <h4 className="bk-card-title">Emergency Contact</h4>
              <label className="bk-label">
                Name
                <input
                  className="bk-input"
                  name="emerName"
                  value={form.emerName}
                  onChange={setField}
                  required
                />
              </label>
              <label className="bk-label">
                Contact No.
                <input
                  className="bk-input"
                  name="emerPhone"
                  value={form.emerPhone}
                  onChange={setField}
                  required
                />
              </label>
              <label className="bk-label">
                Relationship
                <input
                  className="bk-input"
                  name="emerRelation"
                  value={form.emerRelation}
                  onChange={setField}
                  required
                />
              </label>
            </section>

            {/* Personal */}
            <section className="bk-card personal">
              <h4 className="bk-card-title">Personal Information</h4>
              <label className="bk-label">
                Full Name
                <input
                  className="bk-input"
                  name="fullName"
                  value={form.fullName}
                  onChange={setField}
                  required
                />
              </label>
              <label className="bk-label">
                Date of Birth
                <input
                  type="date"
                  className="bk-input"
                  name="dob"
                  value={form.dob}
                  onChange={setField}
                  required
                />
              </label>
              <label className="bk-label">
                Nationality
                <input
                  className="bk-input"
                  name="nationality"
                  value={form.nationality}
                  onChange={setField}
                  required
                />
              </label>
            </section>

            {/* Driving */}
            <section className="bk-card driving">
              <h4 className="bk-card-title">Off road Experience</h4>
              <div className="bk-label" style={{ alignItems: "center" }}>
                <div className="bk-chips" style={{ marginTop: 0 }}>
                  <input
                    id="lvl-beg"
                    type="radio"
                    name="offroadLevel"
                    value="beginner"
                    checked={form.offroadLevel === "beginner"}
                    onChange={setField}
                    required
                  />
                  <label htmlFor="lvl-beg" className="bk-chip">
                    Beginner
                  </label>

                  <input
                    id="lvl-int"
                    type="radio"
                    name="offroadLevel"
                    value="intermediate"
                    checked={form.offroadLevel === "intermediate"}
                    onChange={setField}
                    required
                  />
                  <label htmlFor="lvl-int" className="bk-chip">
                    Intermediate
                  </label>

                  <input
                    id="lvl-exp"
                    type="radio"
                    name="offroadLevel"
                    value="expert"
                    checked={form.offroadLevel === "expert"}
                    onChange={setField}
                    required
                  />
                  <label htmlFor="lvl-exp" className="bk-chip">
                    Expert
                  </label>
                </div>
              </div>
            </section>

            {/* Vehicle */}
            <section className="bk-card vehicle">
              <h4 className="bk-card-title">Vehicle Information</h4>
              <label className="bk-label">
                Make &amp; Model
                <input
                  className="bk-input"
                  name="makeModel"
                  value={form.makeModel}
                  onChange={setField}
                  required
                  placeholder="Toyota Land Cruiser"
                />
              </label>

              <div className="bk-row2">
                <label className="bk-label">
                  Year
                  <input
                    type="number"
                    min="1980"
                    max={currentYear + 2}
                    className="bk-input"
                    name="year"
                    value={form.year}
                    onChange={setField}
                    required
                  />
                </label>
                <label className="bk-label">
                  Color
                  <input
                    className="bk-input"
                    name="color"
                    value={form.color}
                    onChange={setField}
                    required
                  />
                </label>
              </div>

              <div className="bk-row2">
                <label className="bk-label">
                  Plate No.
                  <input
                    className="bk-input"
                    name="plateNo"
                    value={form.plateNo}
                    onChange={setField}
                    required
                  />
                </label>
                <label className="bk-label">
                  Mods
                  <input
                    className="bk-input"
                    name="mods"
                    value={form.mods}
                    onChange={setField}
                    required
                    placeholder="Lift, tires, winch…"
                  />
                </label>
              </div>
            </section>

            {/* Safety */}
            <section className="bk-card safety">
              <h4 className="bk-card-title">Safety Equipment</h4>
              {[
                ["recGear", "Recovery Gear"],
                ["fireExt", "Fire Ext."],
                ["firstAid", "First Aid Kit"],
                ["flag", "Flag"],
                ["radio", "Radio"],
                ["recRope", "Recovery Rope"],
                ["airComp", "Air Compressor"],
                ["spareTire", "Spare Tire"],
              ].map(([key, label]) => (
                <div className="bk-yn" key={key}>
                  <span className="bk-yn-label">{label}</span>
                  <div className="bk-toggle">
                    <input
                      id={`${key}-y`}
                      type="radio"
                      name={key}
                      value="yes"
                      checked={form[key] === "yes"}
                      onChange={setField}
                      required
                    />
                    <label htmlFor={`${key}-y`} className="bk-toggle-btn">
                      Yes
                    </label>
                    <input
                      id={`${key}-n`}
                      type="radio"
                      name={key}
                      value="no"
                      checked={form[key] === "no"}
                      onChange={setField}
                      required
                    />
                    <label htmlFor={`${key}-n`} className="bk-toggle-btn">
                      No
                    </label>
                  </div>
                </div>
              ))}
            </section>

            {/* Medical */}
            <section className="bk-card medical">
              <h4 className="bk-card-title">Medical Conditions</h4>
              <textarea
                className="bk-textarea"
                name="medical"
                value={form.medical}
                onChange={setField}
                required
                placeholder="List any medical conditions / allergies"
              />
            </section>

            {/* Submit */}
            <div className="bk-actions">
              <button type="submit" className="bk-submit" disabled={submitting}>
                {submitting ? "Submitting…" : "SUBMIT"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // Render above the app with a portal
  return ReactDOM.createPortal(modal, document.body);
}
