// src/components/register/BookingFormPage.jsx
import React, { useState } from "react";
import "./register.css";

export default function BookingFormPage() {
  const currentYear = new Date().getFullYear();

  const [form, setForm] = useState({
    // Personal
    fullName: "",
    dob: "",
    nationality: "",
    emiratesId: "",
    // Contact
    mobile: "",
    city: "",
    // Driving
    licenseNo: "",
    licenseExpiry: "",
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
    // Safety (yes/no)
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

  const setField = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    // Browser required validations will handle the rest for now.
    // You can wire your API here later.
    console.log("Registration:", form);
    alert("Submitted (check console)");
  };

  return (
    <div className="bk-page">
      <div className="bk-container">
        <div className="bk-frame">
          <header className="bk-header">
            <h1 className="bk-title">Register your details</h1>
            <p className="bk-sub">Please complete all fields</p>
          </header>

          {/* ===== GRID ===== */}
          <form className="bk-grid" onSubmit={submit} noValidate>
            {/* PERSONAL */}
            <section className="bk-card" data-area="personal">
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

              <label className="bk-label">
                Emirates ID No
                <input
                  className="bk-input"
                  name="emiratesId"
                  value={form.emiratesId}
                  onChange={setField}
                  required
                />
              </label>
            </section>

            {/* DRIVING */}
            <section className="bk-card" data-area="driving">
              <h4 className="bk-card-title">Driving Details</h4>

              <label className="bk-label">
                Driver’s License No.
                <input
                  className="bk-input"
                  name="licenseNo"
                  value={form.licenseNo}
                  onChange={setField}
                  required
                />
              </label>

              <label className="bk-label">
                License Expiry
                <input
                  type="date"
                  className="bk-input"
                  name="licenseExpiry"
                  value={form.licenseExpiry}
                  onChange={setField}
                  required
                />
              </label>

              <div className="bk-label">
                Off-Road Level<span className="bk-asterisk">*</span>
                <div className="bk-chips">
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

            {/* MEDICAL */}
            <section className="bk-card" data-area="medical">
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

            {/* CONTACT */}
            <section className="bk-card" data-area="contact">
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
                />
              </label>
            </section>

            {/* VEHICLE */}
            <section className="bk-card" data-area="vehicle">
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

              <label className="bk-label">
                Year
                <input
                  type="number"
                  min="1980"
                  max={currentYear + 1}
                  className="bk-input"
                  name="year"
                  value={form.year}
                  onChange={setField}
                  required
                />
              </label>

              <div className="bk-row2">
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
              </div>

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
            </section>

            {/* EMERGENCY */}
            <section className="bk-card" data-area="emergency">
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

            {/* SAFETY */}
            <section className="bk-card" data-area="safety">
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
                  <span className="bk-yn-label">{label}:</span>

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

            {/* SUBMIT */}
            <div className="bk-actions" data-area="submit">
              <button type="submit" className="bk-submit">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
