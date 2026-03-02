const measurements = [
  {
    id: "chest",
    title: "Chest Circumference",
    description: "Wrap the tape measure around the fullest part of your chest, keeping it level with the floor. The Deel's main body panel is cut directly from this measurement.",
    bodyPosition: "Stand upright, arms relaxed at your sides, breathing normally.",
    hint: "Keep tape snug, not tight. Arms should hang naturally.",
    mistake: "Common mistake: lifting arms while measuring — this tightens the chest and gives an inaccurate reading.",
    rangeCm: [70, 150],
    svgRegion: "svg-chest"
  },
  {
    id: "waist",
    title: "Waist Circumference",
    description: "Measure the natural waistline — the narrowest part of your torso, just above the hips. The Büs (traditional belt/sash) is fitted at this point.",
    bodyPosition: "Stand with feet together, posture relaxed, not sucked in.",
    hint: "Measure after exhaling. Do not hold your breath.",
    mistake: "Common mistake: measuring too low over the hips instead of the natural waist.",
    rangeCm: [55, 140],
    svgRegion: "svg-waist"
  },
  {
    id: "hips",
    title: "Hip Circumference",
    description: "Measure around the fullest point of the hips and seat. The Engeri (skirt panel) width is derived from this value.",
    bodyPosition: "Stand straight, feet together, weight evenly distributed.",
    hint: "Keep the tape parallel to the floor all the way around.",
    mistake: "Common mistake: tilting the tape — it must stay level, not angled down at the back.",
    rangeCm: [75, 165],
    svgRegion: "svg-hips"
  },
  {
    id: "shoulder",
    title: "Shoulder Width",
    description: "Measure across the upper back from one shoulder point to the other. This determines the placement of shoulder seams on the Deel.",
    bodyPosition: "Stand relaxed, arms at sides. Measurement is taken across the back.",
    hint: "Ask someone to help — this is difficult to measure accurately alone.",
    mistake: "Common mistake: measuring across the front chest instead of across the back.",
    rangeCm: [30, 60],
    svgRegion: "svg-shoulder"
  },
  {
    id: "sleeve",
    title: "Sleeve Length",
    description: "Measure from the shoulder point down the outer arm to the wrist, with the elbow slightly bent. The Khantaaz (sleeve) is cut from this full arm-length measurement.",
    bodyPosition: "Arm slightly bent at 30°, measured along the outer arm from shoulder bone.",
    hint: "Start exactly at the shoulder bone (the bony tip of the shoulder).",
    mistake: "Common mistake: straightening the arm fully — sleeves end up too short for comfortable movement.",
    rangeCm: [45, 75],
    svgRegion: "svg-arm"
  },
  {
    id: "neck",
    title: "Neck Circumference",
    description: "Measure around the base of the neck where a collar rests. The Zangi (Deel collar) and the center opening are shaped around this measurement.",
    bodyPosition: "Head level, looking straight ahead, jaw relaxed.",
    hint: "Place one finger between tape and neck for a comfortable ease allowance.",
    mistake: "Common mistake: pulling the tape too tight — always leave slight ease for swallowing and movement.",
    rangeCm: [28, 55],
    svgRegion: "svg-neck"
  },
  {
    id: "frontLength",
    title: "Front Body Length",
    description: "Measure from the highest point of the shoulder (near the neck) straight down to the floor. This determines the Deel hem length — full-length Deels reach the floor.",
    bodyPosition: "Stand straight without shoes on a flat, hard surface.",
    hint: "Use a long measuring tape or join two tapes. Stand on a hard floor, not carpet.",
    mistake: "Common mistake: bending over to read the tape — this shortens the measurement. Have someone else read it.",
    rangeCm: [100, 160],
    svgRegion: "svg-full-length"
  },
  {
    id: "wrist",
    title: "Wrist Circumference",
    description: "Measure around the wrist just below the wrist bone. The cuff of the Deel sleeve is fitted closely around this measurement.",
    bodyPosition: "Arm extended forward, palm facing upward, hand relaxed.",
    hint: "Measure over the wrist bone for the correct cuff fit location.",
    mistake: "Common mistake: measuring too far up the forearm — the cuff sits at the wrist, not the forearm.",
    rangeCm: [13, 22],
    svgRegion: "svg-wrist"
  },
  {
    id: "height",
    title: "Body Height",
    description: "Measure full standing height from the top of the head to the floor without shoes. Height is used for proportional scaling of all Deel panels.",
    bodyPosition: "Stand straight: heels, back, and back of head touching a flat wall.",
    hint: "Place a flat book on your head and mark the wall, then measure from floor to mark.",
    mistake: "Common mistake: measuring with shoes or thick socks — always measure barefoot.",
    rangeCm: [140, 210],
    svgRegion: "svg-full-length"
  }
];

const state = {
  index: 0,
  valuesCm: {},
  unit: "cm",
  submitting: false
};

const API_BASE_URL = "http://localhost:4000";

const els = {
  unitCm: document.getElementById("unit-cm"),
  unitIn: document.getElementById("unit-in"),
  progressFill: document.getElementById("progress-fill"),
  progressText: document.getElementById("progress-text"),
  title: document.getElementById("measure-title"),
  bodyPosition: document.getElementById("measure-body-position"),
  description: document.getElementById("measure-description"),
  mistake: document.getElementById("measure-mistake"),
  hint: document.getElementById("measure-hint"),
  input: document.getElementById("measure-input"),
  unitLabel: document.getElementById("unit-label"),
  error: document.getElementById("measure-error"),
  prevBtn: document.getElementById("prev-btn"),
  nextBtn: document.getElementById("next-btn"),
  summary: document.getElementById("summary"),
  summaryList: document.getElementById("summary-list"),
  sizeSuggestion: document.getElementById("size-suggestion"),
  printBtn: document.getElementById("print-btn"),
  restartBtn: document.getElementById("restart-btn"),
  submitBtn: document.getElementById("submit-btn"),
  submitStatus: document.getElementById("submit-status"),
  customerName: document.getElementById("customer-name"),
  customerEmail: document.getElementById("customer-email"),
  wizard: document.getElementById("wizard"),
  regionLabel: document.getElementById("diagram-region-label")
};

function cmToIn(cm) {
  return cm / 2.54;
}

function inToCm(inches) {
  return inches * 2.54;
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function getCurrentSpec() {
  return measurements[state.index];
}

function valueForDisplay(cmValue) {
  if (cmValue == null) return "";
  return state.unit === "cm" ? round1(cmValue) : round1(cmToIn(cmValue));
}

function getDisplayRange(rangeCm) {
  if (state.unit === "cm") {
    return `${rangeCm[0]}–${rangeCm[1]} cm`;
  }
  return `${round1(cmToIn(rangeCm[0]))}–${round1(cmToIn(rangeCm[1]))} in`;
}

function setUnit(unit) {
  state.unit = unit;
  els.unitCm.classList.toggle("active", unit === "cm");
  els.unitIn.classList.toggle("active", unit === "in");
  els.unitLabel.textContent = unit;
  renderStep();
}

function updateSvgHighlight(svgRegionId) {
  const svg = document.getElementById("body-svg");
  if (!svg) return;
  svg.querySelectorAll(".svg-region").forEach(r => r.classList.remove("active"));
  if (svgRegionId) {
    const region = document.getElementById(svgRegionId);
    if (region) region.classList.add("active");
  }
}

function renderStep() {
  const spec = getCurrentSpec();
  const step = state.index + 1;
  const progress = (step / measurements.length) * 100;

  els.progressFill.style.width = `${progress}%`;
  els.progressText.textContent = `Step ${step} of ${measurements.length}`;
  els.title.textContent = spec.title;
  els.bodyPosition.textContent = spec.bodyPosition || "";
  els.description.textContent = spec.description;
  els.mistake.textContent = spec.mistake || "";
  els.hint.textContent = `${spec.hint} Typical range: ${getDisplayRange(spec.rangeCm)}.`;
  els.input.value = valueForDisplay(state.valuesCm[spec.id]);
  els.error.textContent = "";
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.textContent = step === measurements.length ? "Finish" : "Next";

  updateSvgHighlight(spec.svgRegion);
  if (els.regionLabel) {
    els.regionLabel.textContent = spec.svgRegion ? spec.title : "";
  }

  els.input.focus();
}

function validateCurrent() {
  const spec = getCurrentSpec();
  const raw = Number(els.input.value);

  if (!Number.isFinite(raw) || raw <= 0) {
    return "Enter a valid number greater than 0.";
  }

  const cm = state.unit === "cm" ? raw : inToCm(raw);
  if (cm < spec.rangeCm[0] || cm > spec.rangeCm[1]) {
    return `Value looks unusual. Expected ${getDisplayRange(spec.rangeCm)}.`;
  }

  state.valuesCm[spec.id] = cm;
  return "";
}

function estimateSize(values) {
  const chest = values.chest || 0;
  const waist = values.waist || 0;
  const key = Math.max(chest, waist);

  if (key < 85) return "XS";
  if (key < 92) return "S";
  if (key < 100) return "M";
  if (key < 108) return "L";
  if (key < 118) return "XL";
  return "XXL";
}

function renderSummary() {
  const rows = measurements.map((m) => {
    const cm = state.valuesCm[m.id];
    const value = state.unit === "cm" ? `${round1(cm)} cm` : `${round1(cmToIn(cm))} in`;
    return `<div class="summary-row"><span>${m.title}</span><strong>${value}</strong></div>`;
  }).join("");

  els.summaryList.innerHTML = rows;
  const size = estimateSize(state.valuesCm);
  els.sizeSuggestion.textContent = `Estimated ready-size reference: ${size}. Final fit depends on garment style and tailor adjustments.`;

  els.wizard.hidden = true;
  els.summary.hidden = false;
}

function validateContact() {
  const customerName = (els.customerName.value || "").trim();
  const customerEmail = (els.customerEmail.value || "").trim();

  if (customerName.length < 2) {
    return { ok: false, message: "Enter your full name." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  return { ok: true, customerName, customerEmail };
}

function setSubmitState(isSubmitting, message = "", isHtml = false) {
  state.submitting = isSubmitting;
  els.submitBtn.disabled = isSubmitting;
  els.submitBtn.textContent = isSubmitting ? "Submitting…" : "Submit to Tailor";
  if (isHtml) {
    els.submitStatus.innerHTML = message;
  } else {
    els.submitStatus.textContent = message;
  }
}

async function submitMeasurements() {
  if (state.submitting) return;

  const contact = validateContact();
  if (!contact.ok) {
    setSubmitState(false, contact.message);
    return;
  }

  const payload = {
    customerName: contact.customerName,
    customerEmail: contact.customerEmail,
    unit: state.unit,
    valuesCm: state.valuesCm
  };

  setSubmitState(true);

  try {
    const response = await fetch(`${API_BASE_URL}/api/measurements/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      setSubmitState(false, "Submission failed. Please verify entries and try again.");
      return;
    }

    const id = data.submissionId;
    setSubmitState(
      false,
      `Submitted successfully — Reference <strong>#${id}</strong>. <a href="order-status.html?id=${id}">Track your order →</a>`,
      true
    );
  } catch (_error) {
    setSubmitState(false, "Cannot reach backend API. Make sure server is running on port 4000.");
  }
}

els.nextBtn.addEventListener("click", () => {
  const err = validateCurrent();
  els.error.textContent = err;
  if (err) return;

  if (state.index === measurements.length - 1) {
    renderSummary();
    return;
  }

  state.index += 1;
  renderStep();
});

els.prevBtn.addEventListener("click", () => {
  if (state.index > 0) {
    const spec = getCurrentSpec();
    const raw = Number(els.input.value);
    if (Number.isFinite(raw) && raw > 0) {
      state.valuesCm[spec.id] = state.unit === "cm" ? raw : inToCm(raw);
    }

    state.index -= 1;
    renderStep();
  }
});

els.unitCm.addEventListener("click", () => setUnit("cm"));
els.unitIn.addEventListener("click", () => setUnit("in"));
els.printBtn.addEventListener("click", () => window.print());
els.submitBtn.addEventListener("click", submitMeasurements);
els.restartBtn.addEventListener("click", () => {
  state.index = 0;
  state.valuesCm = {};
  setSubmitState(false, "");
  els.customerName.value = "";
  els.customerEmail.value = "";
  els.summary.hidden = true;
  els.wizard.hidden = false;
  renderStep();
});

renderStep();
