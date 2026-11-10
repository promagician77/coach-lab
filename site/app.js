import { DEFAULTS, run, AGENTS, PLAN_WEEKS, METRICS } from './lib/model.js';
import { COMPETITORS } from './lib/competitors.js';

/* ── Tab navigation ── */
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function activate(hash) {
  const id = (hash || '#overview').replace('#', '');
  panels.forEach(p => p.hidden = p.id !== id);
  tabs.forEach(t => t.classList.toggle('active', t.getAttribute('href') === '#' + id));
  const active = document.querySelector('.tab.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

tabs.forEach(t => t.addEventListener('click', e => {
  e.preventDefault();
  const hash = t.getAttribute('href');
  history.replaceState(null, '', hash);
  activate(hash);
}));
window.addEventListener('hashchange', () => activate(location.hash));
activate(location.hash);

/* ── Competitors ── */
const compGrid = document.getElementById('comp-grid');
if (compGrid) {
  compGrid.innerHTML = COMPETITORS.map(c => `
    <div class="agent-detail">
      <strong>${c.name}</strong> · <a href="https://${c.url}" target="_blank" rel="noopener">${c.url}</a>
      <span style="float:right;font-size:.72rem;background:${c.type === 'Incumbent' ? '#e0ecf8' : c.type === 'Stats & scoring' ? '#f0e8ff' : '#e8f4e8'};padding:2px 10px;border-radius:12px;font-weight:600">${c.type}</span>
      <div class="ad-role"><strong>Pricing:</strong> ${c.pricing}</div>
      <div style="margin:8px 0;font-size:.83rem">
        <strong style="color:var(--accent3)">Strengths:</strong>
        <ul style="margin:4px 0 8px 16px">${c.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        <strong style="color:#d32f2f">Weaknesses:</strong>
        <ul style="margin:4px 0 8px 16px">${c.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
        <strong>ASO notes:</strong> ${c.aso_notes}
      </div>
      <div class="ad-meta">Source: ${c.source}</div>
    </div>
  `).join('');
}

/* ── Agent detail cards ── */
const agentCards = document.getElementById('agent-cards');
if (agentCards) {
  agentCards.innerHTML = AGENTS.map(a => `
    <div class="agent-detail">
      <strong>${a.name}</strong>
      <div class="ad-role">${a.role}</div>
      <div class="ad-meta">
        <span>🔧 ${a.tool}</span>
        <span>📥 ${a.inputs.join(', ')}</span>
        <span>📤 ${a.outputs.join(', ')}</span>
      </div>
    </div>
  `).join('');
}

/* ── 90-day plan ── */
const planGantt = document.getElementById('plan-gantt');
if (planGantt) {
  planGantt.innerHTML = PLAN_WEEKS.map(w => `
    <div class="plan-week ${w.phase}">
      <div class="pw-head">
        <span class="pw-num">Week ${w.week}</span>
        <span class="pw-phase">${w.phase}</span>
      </div>
      <ul class="pw-tasks">${w.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
  `).join('');
}

/* ── Model ── */
const modelControls = document.getElementById('model-controls');
const modelOutput = document.getElementById('model-output');

if (modelControls) {
  const sliders = [
    { key: 'aso_impressions_day', label: 'ASO impressions/day', min: 20, max: 500, step: 10 },
    { key: 'aso_install_rate', label: 'ASO install rate', min: 0.10, max: 0.60, step: 0.01, pct: true },
    { key: 'content_posts_week', label: 'Content posts/week', min: 1, max: 7, step: 1 },
    { key: 'community_leagues_contacted', label: 'Leagues contacted', min: 10, max: 100, step: 5 },
    { key: 'community_response_rate', label: 'League response rate', min: 0.05, max: 0.40, step: 0.01, pct: true },
    { key: 'webinar_count', label: 'Webinars (90 days)', min: 0, max: 6, step: 1 },
    { key: 'webinar_registrants', label: 'Registrants/webinar', min: 10, max: 100, step: 5 },
    { key: 'referral_rate', label: 'Referral rate', min: 0.05, max: 0.30, step: 0.01, pct: true },
  ];

  const state = { ...DEFAULTS };

  function renderModel() {
    const r = run(state);
    const max = Math.max(...r.channels.map(c => c.installs), 1);
    const colors = ['aso', 'content', 'community', 'webinars', 'referrals'];

    modelOutput.innerHTML = `
      <div class="model-chart">
        ${r.channels.map((c, i) => `
          <div class="bar-row">
            <span>${c.name}</span>
            <div class="bar-track"><div class="bar-fill ${colors[i]}" style="width:${(c.installs / max) * 100}%"></div></div>
            <span style="font-family:var(--mono);font-weight:600">${c.installs}</span>
          </div>
        `).join('')}
      </div>
      <div class="model-total">${r.total_installs} installs in 90 days · $0 ad spend</div>
      <div style="margin-top:12px;font-size:.85rem;color:var(--muted)">
        ${r.total_posts} posts · ${r.leagues_yes} league partners · ${r.webinar_attendees} webinar attendees · ${r.total_hours} contractor hours
      </div>
    `;
  }

  modelControls.innerHTML = sliders.map(s => {
    const val = state[s.key];
    const display = s.pct ? (val * 100).toFixed(0) + '%' : val;
    return `
      <div class="slider-row">
        <label>${s.label}</label>
        <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${val}" data-key="${s.key}" data-pct="${!!s.pct}">
        <span class="val" id="val-${s.key}">${display}</span>
      </div>
    `;
  }).join('');

  modelControls.querySelectorAll('input[type=range]').forEach(input => {
    input.addEventListener('input', () => {
      const key = input.dataset.key;
      const isPct = input.dataset.pct === 'true';
      state[key] = parseFloat(input.value);
      document.getElementById('val-' + key).textContent = isPct ? (state[key] * 100).toFixed(0) + '%' : state[key];
      renderModel();
    });
  });

  renderModel();
}

/* ── Metrics ── */
const metricsTable = document.getElementById('metrics-table');
if (metricsTable) {
  metricsTable.innerHTML = METRICS.map(m => `
    <div class="metric-card">
      <div>
        <div class="metric-name">${m.name}</div>
        <div class="metric-baseline">Baseline: ${m.baseline}</div>
      </div>
      <div class="metric-target">${m.target}</div>
      <div class="metric-source">${m.source}</div>
    </div>
  `).join('');
}

/* ── Tests ── */
const testResults = document.getElementById('test-results');
if (testResults) {
  // Run basic tests
  const tests = [];

  // Model tests
  const r = run(DEFAULTS);
  tests.push({ name: 'Model produces positive total installs', pass: r.total_installs > 0, detail: `${r.total_installs} installs` });
  tests.push({ name: 'All 5 channels present', pass: r.channels.length === 5, detail: `${r.channels.length} channels` });
  tests.push({ name: 'No channel produces negative installs', pass: r.channels.every(c => c.installs >= 0), detail: 'All ≥ 0' });
  tests.push({ name: 'Total hours within budget', pass: r.total_hours <= DEFAULTS.hours_per_week * DEFAULTS.weeks, detail: `${r.total_hours}h ≤ ${DEFAULTS.hours_per_week * DEFAULTS.weeks}h` });
  tests.push({ name: 'Total equals sum of channels', pass: r.total_installs === r.channels.reduce((s, c) => s + c.installs, 0), detail: `${r.total_installs} = Σ channels` });
  tests.push({ name: 'Cost per install is zero (organic)', pass: r.cost_per_install === 0, detail: '$0 CPI' });

  // Competitor tests
  tests.push({ name: 'All 5 competitors have URLs', pass: COMPETITORS.every(c => c.url && c.url.includes('.')), detail: COMPETITORS.map(c => c.url).join(', ') });
  tests.push({ name: 'All competitors have ≥3 strengths', pass: COMPETITORS.every(c => c.strengths.length >= 3), detail: 'Min 3 strengths each' });
  tests.push({ name: 'All competitors have ASO notes', pass: COMPETITORS.every(c => c.aso_notes.length > 10), detail: 'All have notes' });

  // Agent tests
  tests.push({ name: 'Six agents defined', pass: AGENTS.length === 6, detail: `${AGENTS.length} agents` });
  tests.push({ name: 'Coordinator agent exists', pass: AGENTS.some(a => a.id === 'coordinator'), detail: 'Found' });
  tests.push({ name: 'All agents have tools specified', pass: AGENTS.every(a => a.tool.length > 0), detail: 'All have tools' });

  // Plan tests
  tests.push({ name: 'Plan covers 13 weeks', pass: PLAN_WEEKS.length === 13, detail: `${PLAN_WEEKS.length} weeks` });
  tests.push({ name: 'Every week has ≥4 tasks', pass: PLAN_WEEKS.every(w => w.tasks.length >= 4), detail: 'Min 4 tasks/week' });
  tests.push({ name: 'Three phases present', pass: new Set(PLAN_WEEKS.map(w => w.phase)).size === 3, detail: [...new Set(PLAN_WEEKS.map(w => w.phase))].join(', ') });

  // Metrics tests
  tests.push({ name: 'Ten KPIs defined', pass: METRICS.length === 10, detail: `${METRICS.length} metrics` });
  tests.push({ name: 'All KPIs have targets', pass: METRICS.every(m => m.target.length > 0), detail: 'All have targets' });

  // Edge case tests
  const zeroModel = run({ ...DEFAULTS, aso_impressions_day: 0, content_posts_week: 0, community_leagues_contacted: 0, webinar_count: 0 });
  tests.push({ name: 'Zero inputs produce zero installs', pass: zeroModel.total_installs === 0, detail: `${zeroModel.total_installs}` });

  const highModel = run({ ...DEFAULTS, aso_impressions_day: 500, community_leagues_contacted: 100, webinar_count: 6 });
  tests.push({ name: 'High inputs still produce reasonable numbers', pass: highModel.total_installs < 10000, detail: `${highModel.total_installs} < 10,000` });

  const passed = tests.filter(t => t.pass).length;

  testResults.innerHTML = `
    <div class="test-summary">
      <strong class="${passed === tests.length ? 'test-pass' : 'test-fail'}">${passed}/${tests.length} tests passing</strong>
      · ${tests.reduce((s, t) => s + (t.pass ? 1 : 0), 0)} assertions verified
    </div>
    ${tests.map(t => `
      <div class="test-item">
        <span>${t.name}</span>
        <span>
          <span class="${t.pass ? 'test-pass' : 'test-fail'}">${t.pass ? '✓' : '✗'}</span>
          <span style="font-size:.75rem;color:var(--muted);margin-left:8px">${t.detail}</span>
        </span>
      </div>
    `).join('')}
  `;
}
