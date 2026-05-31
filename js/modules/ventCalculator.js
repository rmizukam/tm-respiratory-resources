/**
 * Module: Ventilator Settings Calculator Engine (MathJax Fixed)
 */

const INVARIANTS = {
  ML_PER_LITER: 1000,
  CM_PER_IN: 2.54,
  KG_PER_LB: 0.453592
};

const template = `
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-slate-950 border border-slate-800 rounded-lg p-4">
      <h3 class="text-sm font-bold text-cyan-400 font-mono mb-4 border-b border-slate-800 pb-2 uppercase tracking-wide">Patient Parameters</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <label class="text-sm text-slate-300 font-medium">Height</label>
          <div class="flex gap-2 max-w-[200px]">
            <input type="number" id="pi_height_input" value="0" class="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm text-right text-slate-100 focus:outline-none focus:border-cyan-500 font-mono">
            <select id="pi_height_unit" class="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-xs text-slate-300 focus:outline-none font-mono">
              <option value="in" selected>in</option>
              <option value="cm">cm</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between gap-4">
          <label class="text-sm text-slate-300 font-medium">Weight</label>
          <div class="flex gap-2 max-w-[200px]">
            <input type="number" id="pi_weight_input" value="0" class="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm text-right text-slate-100 focus:outline-none focus:border-cyan-500 font-mono">
            <select id="pi_weight_unit" class="bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-xs text-slate-300 focus:outline-none font-mono">
              <option value="lb">lb</option>
              <option value="kg" selected>kg</option>
            </select>
          </div>
        </div>
        <div class="flex items-center justify-between gap-4">
          <label class="text-sm text-slate-300 font-medium">Gender</label>
          <select id="pi_gender_unit" class="w-36 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none font-mono">
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        </div>
      </div>
    </div>

    <div class="bg-slate-950 border border-slate-800 rounded-lg p-4">
      <h3 class="text-sm font-bold text-cyan-400 font-mono mb-3 border-b border-slate-800 pb-2 uppercase tracking-wide">Tidal Volume Selection (mL/kg IBW)</h3>
      <div class="grid grid-cols-2 gap-3 pt-1">
        <div class="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
          <div class="flex items-center gap-2"><input type="radio" id="tv-radio-1" name="choice" value="tvoption1" checked><label for="tv-radio-1" class="text-xs text-slate-400 font-mono cursor-pointer">6 mL/kg</label></div>
          <div class="text-right mt-1"><input type="text" id="tv-value-1" class="w-full bg-transparent border-none text-right font-mono text-slate-100 p-0 text-sm font-bold" readonly value="0.00"></div>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
          <div class="flex items-center gap-2"><input type="radio" id="tv-radio-2" name="choice" value="tvoption2"><label for="tv-radio-2" class="text-xs text-slate-400 font-mono cursor-pointer">7 mL/kg</label></div>
          <div class="text-right mt-1"><input type="text" id="tv-value-2" class="w-full bg-transparent border-none text-right font-mono text-slate-100 p-0 text-sm font-bold" readonly value="0.00"></div>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
          <div class="flex items-center gap-2"><input type="radio" id="tv-radio-3" name="choice" value="tvoption3"><label for="tv-radio-3" class="text-xs text-slate-400 font-mono cursor-pointer">8 mL/kg</label></div>
          <div class="text-right mt-1"><input type="text" id="tv-value-3" class="w-full bg-transparent border-none text-right font-mono text-slate-100 p-0 text-sm font-bold" readonly value="0.00"></div>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded border border-slate-800 flex flex-col justify-between">
          <div class="flex items-center gap-2"><input type="radio" id="tv-radio-4" name="choice" value="tvoption4"><label for="tv-radio-4" class="text-xs text-slate-400 font-mono cursor-pointer">Custom</label></div>
          <div class="text-right mt-1 flex items-baseline gap-1 justify-end"><input type="number" id="tv-value-4" value="0" class="w-16 bg-slate-950 border border-slate-800 rounded text-right font-mono text-slate-100 px-1 py-0.5 text-xs focus:outline-none"><span class="text-[10px] text-slate-500 font-mono">mL</span></div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-slate-950 border border-slate-800 rounded-lg p-4">
    <h3 class="text-sm font-bold text-slate-400 font-mono mb-4 border-b border-slate-800 pb-2 uppercase tracking-wide">Predicted Baseline Output Metrics</h3>
    <div class="grid grid-cols-3 gap-4 font-mono mb-4">
      <div class="bg-slate-900 p-3 rounded text-center"><span class="text-[10px] text-slate-400 block mb-1">BSA</span><span id="pr-bsa" class="text-lg font-bold text-cyan-400">0.00</span> <span class="text-[10px] text-slate-500">m²</span></div>
      <div class="bg-slate-900 p-3 rounded text-center"><span class="text-[10px] text-slate-400 block mb-1">Minute Ventilation</span><span id="pr-mv" class="text-lg font-bold text-cyan-400">0.00</span> <span class="text-[10px] text-slate-500">L/min</span></div>
      <div class="bg-slate-900 p-3 rounded text-center"><span class="text-[10px] text-slate-400 block mb-1">Respiratory Rate</span><span id="pr-rr" class="text-lg font-bold text-cyan-400">0.00</span> <span class="text-[10px] text-slate-500">bpm</span></div>
    </div>

    <div class="border border-slate-800 rounded bg-slate-900/30 overflow-hidden">
      <h4 class="notes-header px-3 py-2 bg-slate-900/70 text-xs font-mono font-bold text-slate-400 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors">
        <span>&#9432; Baseline Equation Notes & Formulas</span>
        <span class="text-[10px] text-slate-500 uppercase">Click to Toggle</span>
      </h4>
      <div class="notes-content p-4 space-y-4 border-t border-slate-800 text-xs text-slate-400 hidden">
        <div>
          <h5 class="font-bold text-slate-200 mb-1">IBW (Ideal Body Weight)</h5>
          <p class="mb-2">Used to calculate predicted Tidal Volume based on patient Height and Gender ($\text{Height} \ge 60 \text{ in}$):</p>
          $$ \\text{IBW (kg)} = \\begin{cases} 50 + 2.3 \\times (\\text{Height (in)} - 60) & \\text{for Males} \\\\ 45.5 + 2.3 \\times (\\text{Height (in)} - 60) & \\text{for Females} \\end{cases} $$
          <p class="mt-2 text-slate-500">Note: When patient height is less than 60 in, a generic formula not gender reliant is utilized:</p>
          $$ \\text{IBW (kg)} = 50 - (0.9 \\times (60 - \\text{Height(in)})) $$
        </div>
        <div>
          <h5 class="font-bold text-slate-200 mb-1">BSA (Body Surface Area)</h5>
          <p class="mb-2">Calculated using the Mosteller Formula, where height is in cm and weight is in kg:</p>
          $$ \\text{BSA (m}^2) = \\sqrt{\\frac{\\text{Height (cm)} \\times \\text{Weight (kg)}}{3600}} $$
        </div>
        <div>
          <h5 class="font-bold text-slate-200 mb-1">Predicted Minute Ventilation (MV)</h5>
          <p class="mb-2">Calculated using gender-specific factors based on BSA:</p>
          $$ \\text{MV (L/min)} = \\text{BSA} \\times \\begin{cases} 4.0 & \\text{for Males} \\\\ 3.5 & \\text{for Females} \\end{cases} $$
        </div>
        <div>
          <h5 class="font-bold text-slate-200 mb-1">Predicted Respiratory Rate (RR)</h5>
          <p class="mb-2">Calculated by dividing the predicted minute ventilation by the selected tidal volume (converted to Liters):</p>
          $$ \\text{RR} = \\frac{\\text{Predicted MV (L/min)}}{\\text{Tidal Volume (L)}} $$
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
      <div>
        <h3 class="text-sm font-bold text-slate-300 font-mono mb-3 border-b border-slate-800 pb-2 uppercase tracking-wide">Adjustment 1: Respiratory Rate</h3>
        <div class="space-y-3 text-xs font-mono">
          <div class="flex justify-between items-center"><label class="text-slate-400">Current RR (bpm)</label><input type="number" id="curr-rr-input" value="0" class="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-slate-100 focus:outline-none"></div>
          <div class="flex justify-between items-center"><label class="text-slate-400">Current PaCO₂ (mmHg)</label><input type="number" id="curr-pac02-rr" value="0" class="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-slate-100 focus:outline-none"></div>
          <div class="flex justify-between items-center"><label class="text-slate-400">Desired PaCO₂ (mmHg)</label><input type="number" id="desired-pac02-rr" value="0" class="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-slate-100 focus:outline-none"></div>
        </div>
      </div>
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between font-mono">
        <span class="text-xs text-cyan-400 uppercase font-bold">Adjusted RR</span>
        <div><span id="result-adjusted-rr" class="text-base font-bold text-slate-100">0.00</span> <span class="text-[10px] text-slate-500">bpm</span></div>
      </div>

      <div class="border border-slate-800 rounded bg-slate-900/30 overflow-hidden">
        <h4 class="notes-header px-2 py-1 bg-slate-900/70 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors">
          <span>&#9432; RR Formula Specs</span> <span class="text-[9px] text-slate-500">+/-</span>
        </h4>
        <div class="notes-content p-3 border-t border-slate-800 text-[11px] text-slate-400 hidden">
          <p class="mb-1.5">Calculated using the relationship between minute ventilation and PaCO2 ($V_E \\times \\text{PaCO}_2 = \\text{constant}$), assuming tidal volume is held constant:</p>
          $$ \\text{RR}_{\\text{adj}} = \\frac{\\text{RR}_{\\text{curr}} \\times \\text{PaCO}_{\\text{2\\_curr}}}{\\text{PaCO}_{\\text{2\\_des}}} $$
        </div>
      </div>
    </div>

    <div class="bg-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between space-y-4">
      <div>
        <h3 class="text-sm font-bold text-slate-300 font-mono mb-3 border-b border-slate-800 pb-2 uppercase tracking-wide">Adjustment 2: Tidal Volume</h3>
        <div class="space-y-3 text-xs font-mono">
          <div class="flex justify-between items-center">
            <label class="text-slate-400">Current TV</label>
            <div class="flex gap-1">
              <input type="number" id="curr-tv-input" value="0" class="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-slate-100 focus:outline-none">
              <select id="tidal-volume-unit-adj-in" class="bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400"><option value="mL" selected>mL</option><option value="L">L</option></select>
            </div>
          </div>
          <div class="flex justify-between items-center"><label class="text-slate-400">Current PaCO₂ (mmHg)</label><input type="number" id="curr-pac02-tv" value="0" class="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-slate-100 focus:outline-none"></div>
          <div class="flex justify-between items-center"><label class="text-slate-400">Desired PaCO₂ (mmHg)</label><input type="number" id="desired-pac02-tv" value="0" class="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-right text-slate-100 focus:outline-none"></div>
        </div>
      </div>
      <div class="pt-3 border-t border-slate-800 flex items-center justify-between font-mono">
        <span class="text-xs text-cyan-400 uppercase font-bold">Adjusted TV</span>
        <div class="flex items-center gap-1">
          <span id="result-adjusted-tv" class="text-base font-bold text-slate-100">0.00</span>
          <select id="tidal-volume-unit-adj-out" class="bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 px-0.5"><option value="mL" selected>mL</option><option value="L">L</option></select>
        </div>
      </div>

      <div class="border border-slate-800 rounded bg-slate-900/30 overflow-hidden">
        <h4 class="notes-header px-2 py-1 bg-slate-900/70 text-[10px] font-mono font-bold text-slate-400 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors">
          <span>&#9432; TV Formula Specs</span> <span class="text-[9px] text-slate-500">+/-</span>
        </h4>
        <div class="notes-content p-3 border-t border-slate-800 text-[11px] text-slate-400 hidden">
          <p class="mb-1.5">Calculated using the relationship between minute ventilation and PaCO2 ($V_E \\times \\text{PaCO}_2 = \\text{constant}$), assuming respiratory rate is held constant:</p>
          $$ \\text{TV}_{\\text{adj}} = \\frac{\\text{TV}_{\\text{curr}} \\times \\text{PaCO}_{\\text{2\\_curr}}}{\\text{PaCO}_{\\text{2\\_des}}} $$
        </div>
      </div>
    </div>
  </div>
`;

export function initVentCalculator(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Render module markup layout elements safely
  container.innerHTML = template;

  // Scoped Query Selectors Mapping
  const piHeightInput = document.getElementById('pi_height_input');
  const piHeightUnit = document.getElementById('pi_height_unit');
  const piWeightInput = document.getElementById('pi_weight_input');
  const piWeightUnit = document.getElementById('pi_weight_unit');
  const piGenderUnit = document.getElementById('pi_gender_unit');
  const tvCustomInput = document.getElementById('tv-value-4');
  const tvRadios = document.querySelectorAll('input[name="choice"]');
  const currRrInput = document.getElementById('curr-rr-input');
  const currPaco2Rr = document.getElementById('curr-pac02-rr');
  const desiredPaco2Rr = document.getElementById('desired-pac02-rr');
  const currTvInput = document.getElementById('curr-tv-input');
  const tvUnitIn = document.getElementById('tidal-volume-unit-adj-in');
  const currPaco2Tv = document.getElementById('curr-pac02-tv');
  const desiredPaco2Tv = document.getElementById('desired-pac02-tv');
  const tvUnitOut = document.getElementById('tidal-volume-unit-adj-out');

  // Accordion Toggle Logic Linker with typeset queueing
  container.querySelectorAll('.notes-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      content.classList.toggle('hidden');
      
      // Tell MathJax to re-parse the container since its display status shifted
      if (!content.classList.contains('hidden') && window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        window.MathJax.typesetPromise([content]);
      }
    });
  });

  // Scoped Calculation Pipeline Subroutines
  function selectOnFocus(e) {
    if (parseFloat(e.target.value) === 0) e.target.select();
  }

  function getSelectedTidalVolume() {
    const checkedRadio = document.querySelector('input[name="choice"]:checked');
    if (!checkedRadio) return 0;
    if (checkedRadio.value === 'tvoption1') return parseFloat(document.getElementById('tv-value-1').value) || 0;
    if (checkedRadio.value === 'tvoption2') return parseFloat(document.getElementById('tv-value-2').value) || 0;
    if (checkedRadio.value === 'tvoption3') return parseFloat(document.getElementById('tv-value-3').value) || 0;
    if (checkedRadio.value === 'tvoption4') return parseFloat(tvCustomInput.value) || 0;
    return 0;
  }

  function calculatePVS() {
    let height = parseFloat(piHeightInput.value) || 0;
    let weight = parseFloat(piWeightInput.value) || 0;
    let height_in = piHeightUnit.value === 'cm' ? height / INVARIANTS.CM_PER_IN : height;
    let height_cm = piHeightUnit.value === 'in' ? height * INVARIANTS.CM_PER_IN : height;
    let weight_kg = piWeightUnit.value === 'lb' ? weight * INVARIANTS.KG_PER_LB : weight;

    let ibw = 0;
    if (height_in > 0) {
      if (height_in >= 60) {
        ibw = piGenderUnit.value === 'M' ? 50 + 2.3 * (height_in - 60) : 45.5 + 2.3 * (height_in - 60);
      } else {
        ibw = 50 - 0.9 * (60 - height_in);
      }
    }

    if (height_in > 0 && weight_kg > 0) {
      document.getElementById("tv-value-1").value = (ibw * 6).toFixed(2);
      document.getElementById("tv-value-2").value = (ibw * 7).toFixed(2);
      document.getElementById("tv-value-3").value = (ibw * 8).toFixed(2);
    }

    let bsa = 0;
    if (height_cm > 0 && weight_kg > 0) bsa = Math.sqrt((height_cm * weight_kg) / 3600);
    document.getElementById('pr-bsa').textContent = bsa.toFixed(2);

    let mv = bsa * (piGenderUnit.value === 'M' ? 4 : 3.5);
    document.getElementById('pr-mv').textContent = mv.toFixed(2);

    const tv = getSelectedTidalVolume();
    let rr = tv > 0 && mv > 0 ? mv / (tv / INVARIANTS.ML_PER_LITER) : 0;
    document.getElementById('pr-rr').textContent = rr.toFixed(2);
  }

  function convertUnitAndCalculate(inputEl, unitEl, factor, type) {
    let value = parseFloat(inputEl.value) || 0;
    const prevUnit = unitEl.getAttribute('data-previous-unit');
    if (prevUnit && prevUnit !== unitEl.value) {
      if (type === 'height') {
        inputEl.value = unitEl.value === 'cm' ? (value * factor).toFixed(2) : (value / factor).toFixed(2);
      } else if (type === 'weight') {
        inputEl.value = unitEl.value === 'kg' ? (value * factor).toFixed(2) : (value / factor).toFixed(2);
      }
    }
    unitEl.setAttribute('data-previous-unit', unitEl.value);
    calculatePVS();
  }

  function calculateRRAdjustment() {
    let currRR = parseFloat(currRrInput.value) || 0;
    let currCO2 = parseFloat(currPaco2Rr.value) || 0;
    let desCO2 = parseFloat(desiredPaco2Rr.value) || 0;
    let adjRR = currRR > 0 && currCO2 > 0 && desCO2 > 0 ? (currRR * currCO2) / desCO2 : 0;
    document.getElementById('result-adjusted-rr').textContent = adjRR.toFixed(2);
  }

  function calculateTVAdjustment() {
    let currTV = parseFloat(currTvInput.value) || 0;
    if (tvUnitIn.value === 'mL') currTV /= INVARIANTS.ML_PER_LITER;
    let currCO2 = parseFloat(currPaco2Tv.value) || 0;
    let desCO2 = parseFloat(desiredPaco2Tv.value) || 0;
    let adjTV = currTV > 0 && currCO2 > 0 && desCO2 > 0 ? (currTV * currCO2) / desCO2 : 0;
    if (tvUnitOut.value === 'mL') adjTV *= INVARIANTS.ML_PER_LITER;
    document.getElementById('result-adjusted-tv').textContent = adjTV.toFixed(2);
  }

  // Bind Listeners
  const inputs = [piHeightInput, piWeightInput, tvCustomInput, currRrInput, currPaco2Rr, desiredPaco2Rr, currTvInput, currPaco2Tv, desiredPaco2Tv];
  inputs.forEach(input => {
    input.addEventListener('focus', selectOnFocus);
    input.addEventListener('input', () => {
      calculatePVS();
      calculateRRAdjustment();
      calculateTVAdjustment();
    });
  });

  piHeightUnit.addEventListener('change', () => convertUnitAndCalculate(piHeightInput, piHeightUnit, INVARIANTS.CM_PER_IN, 'height'));
  piWeightUnit.addEventListener('change', () => convertUnitAndCalculate(piWeightInput, piWeightUnit, INVARIANTS.KG_PER_LB, 'weight'));
  piGenderUnit.addEventListener('change', calculatePVS);
  tvRadios.forEach(radio => radio.addEventListener('change', calculatePVS));
  tvUnitIn.addEventListener('change', calculateTVAdjustment);
  tvUnitOut.addEventListener('change', calculateTVAdjustment);

  // Initialize Attribute Vectors
  piHeightUnit.setAttribute('data-previous-unit', piHeightUnit.value);
  piWeightUnit.setAttribute('data-previous-unit', piWeightUnit.value);

  // Initial calculation cycle
  calculatePVS();
}