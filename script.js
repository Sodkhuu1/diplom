const measurements = [
  {
    id: "chest",
    title: "Chest Circumference",
    description: "Wrap tape around the fullest chest area, level with the floor.",
    hint: "Arms relaxed, normal breathing, keep tape snug not tight.",
    rangeCm: [70, 150],
    tapeY: -18
  },
  {
    id: "waist",
    title: "Waist Circumference",
    description: "Measure the natural waistline above the hips.",
    hint: "Do not hold your breath. Measure after exhale.",
    rangeCm: [55, 140],
    tapeY: 8
  },
  {
    id: "hips",
    title: "Hip Circumference",
    description: "Measure around the fullest point of hips and seat.",
    hint: "Stand with feet together for consistency.",
    rangeCm: [75, 165],
    tapeY: 30
  },
  {
    id: "shoulder",
    title: "Shoulder Width",
    description: "Measure from one shoulder point to the other across upper back.",
    hint: "Ask someone to help for better accuracy.",
    rangeCm: [30, 60],
    tapeY: -42
  },
  {
    id: "sleeve",
    title: "Sleeve Length",
    description: "From shoulder point to wrist with elbow slightly bent.",
    hint: "Keep a natural arm bend while measuring.",
    rangeCm: [45, 75],
    tapeY: -5
  },
  {
    id: "height",
    title: "Body Height",
    description: "Measure from top of head to floor without shoes.",
    hint: "Stand straight with heels to wall.",
    rangeCm: [140, 210],
    tapeY: -60
  }
];

const state = {
  index: 0,
  valuesCm: {},
  unit: "cm"
};

const els = {
  unitCm: document.getElementById("unit-cm"),
  unitIn: document.getElementById("unit-in"),
  progressFill: document.getElementById("progress-fill"),
  progressText: document.getElementById("progress-text"),
  title: document.getElementById("measure-title"),
  description: document.getElementById("measure-description"),
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
  wizard: document.getElementById("wizard"),
  tape: document.getElementById("diagram-tape")
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
    return `${rangeCm[0]}-${rangeCm[1]} cm`;
  }
  return `${round1(cmToIn(rangeCm[0]))}-${round1(cmToIn(rangeCm[1]))} in`;
}

function setUnit(unit) {
  state.unit = unit;
  els.unitCm.classList.toggle("active", unit === "cm");
  els.unitIn.classList.toggle("active", unit === "in");
  els.unitLabel.textContent = unit;
  renderStep();
}

function renderStep() {
  const spec = getCurrentSpec();
  const step = state.index + 1;
  const progress = (step / measurements.length) * 100;

  els.progressFill.style.width = `${progress}%`;
  els.progressText.textContent = `Step ${step} of ${measurements.length}`;
  els.title.textContent = spec.title;
  els.description.textContent = spec.description;
  els.hint.textContent = `${spec.hint} Typical range: ${getDisplayRange(spec.rangeCm)}.`;
  els.input.value = valueForDisplay(state.valuesCm[spec.id]);
  els.error.textContent = "";
  els.prevBtn.disabled = state.index === 0;
  els.nextBtn.textContent = step === measurements.length ? "Finish" : "Next";
  els.tape.style.transform = `translateY(${spec.tapeY}px)`;
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
  els.sizeSuggestion.textContent = `Estimated ready-size reference: ${size}. Final fit still depends on garment style.`;

  els.wizard.hidden = true;
  els.summary.hidden = false;
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
els.restartBtn.addEventListener("click", () => {
  state.index = 0;
  state.valuesCm = {};
  els.summary.hidden = true;
  els.wizard.hidden = false;
  renderStep();
});

renderStep();
