// Node.js test runner for the GTM lab model and data
import { DEFAULTS, run, AGENTS, PLAN_WEEKS, METRICS } from '../site/lib/model.js';
import { COMPETITORS, MARKET } from '../site/lib/competitors.js';

let passed = 0, failed = 0, assertions = 0;

function assert(condition, msg, detail = '') {
  assertions++;
  if (condition) { passed++; console.log(`  ✓ ${msg} ${detail ? '(' + detail + ')' : ''}`); }
  else { failed++; console.log(`  ✗ ${msg} ${detail ? '(' + detail + ')' : ''}`); }
}

console.log('Model tests');
const r = run(DEFAULTS);
assert(r.total_installs > 0, 'Positive total installs', r.total_installs);
assert(r.channels.length === 5, 'Five channels', r.channels.length);
assert(r.channels.every(c => c.installs >= 0), 'No negative installs');
assert(r.total_hours === DEFAULTS.hours_per_week * DEFAULTS.weeks, 'Hours match budget', `${r.total_hours}h`);
assert(r.total_installs === r.channels.reduce((s, c) => s + c.installs, 0), 'Total = sum of channels');
assert(r.cost_per_install === 0, 'Zero CPI (organic)');
assert(r.total_posts === DEFAULTS.content_posts_week * DEFAULTS.weeks, 'Post count correct', r.total_posts);
assert(r.new_ratings > 0, 'Produces new ratings', r.new_ratings);

console.log('\nEdge cases');
const zero = run({ ...DEFAULTS, aso_impressions_day: 0, content_posts_week: 0, community_leagues_contacted: 0, webinar_count: 0 });
assert(zero.total_installs === 0, 'Zero inputs → zero installs', zero.total_installs);
const high = run({ ...DEFAULTS, aso_impressions_day: 500, community_leagues_contacted: 100, webinar_count: 6 });
assert(high.total_installs > r.total_installs, 'Higher inputs → more installs');
assert(high.total_installs < 10000, 'Still reasonable', high.total_installs);
// Single channel
const asoOnly = run({ ...DEFAULTS, content_posts_week: 0, community_leagues_contacted: 0, webinar_count: 0 });
assert(asoOnly.aso_installs > 0, 'ASO-only works', asoOnly.aso_installs);
assert(asoOnly.content_installs === 0, 'Content is zero when posts=0');

console.log('\nCompetitor data');
assert(COMPETITORS.length === 5, 'Five competitors');
assert(COMPETITORS.every(c => c.url.includes('.')), 'All have valid URLs');
assert(COMPETITORS.every(c => c.strengths.length >= 3), 'All have ≥3 strengths');
assert(COMPETITORS.every(c => c.weaknesses.length >= 2), 'All have ≥2 weaknesses');
assert(COMPETITORS.every(c => c.aso_notes.length > 10), 'All have ASO notes');
assert(COMPETITORS.every(c => c.pricing.length > 0), 'All have pricing');
assert(COMPETITORS.every(c => c.source.length > 0), 'All have sources');
assert(COMPETITORS.some(c => c.name === 'TeamSnap'), 'TeamSnap included');
assert(COMPETITORS.some(c => c.name === 'Spond'), 'Spond included');

console.log('\nMarket data');
assert(MARKET.global_2025 === '$2.1B', 'Market size correct');
assert(parseFloat(MARKET.cagr) === 13.2, 'CAGR correct');
assert(MARKET.source.length > 0, 'Market data sourced');

console.log('\nAgent architecture');
assert(AGENTS.length === 6, 'Six agents');
assert(AGENTS[0].id === 'coordinator', 'First agent is coordinator');
assert(AGENTS.every(a => a.tool.length > 0), 'All have tools');
assert(AGENTS.every(a => a.inputs.length > 0), 'All have inputs');
assert(AGENTS.every(a => a.outputs.length > 0), 'All have outputs');
assert(AGENTS.every(a => a.role.length > 0), 'All have roles');

console.log('\n90-day plan');
assert(PLAN_WEEKS.length === 13, 'Thirteen weeks');
assert(PLAN_WEEKS.every(w => w.tasks.length >= 4), 'Every week has ≥4 tasks');
assert(new Set(PLAN_WEEKS.map(w => w.phase)).size === 3, 'Three phases');
assert(PLAN_WEEKS[0].phase === 'Foundation', 'Starts with Foundation');
assert(PLAN_WEEKS[12].phase === 'Handoff', 'Ends with Handoff');
assert(PLAN_WEEKS[4].phase === 'Launch', 'Week 5 is Launch');

console.log('\nMetrics');
assert(METRICS.length === 10, 'Ten KPIs');
assert(METRICS.every(m => m.target.length > 0), 'All have targets');
assert(METRICS.every(m => m.source.length > 0), 'All have sources');
assert(METRICS.some(m => m.name.includes('Founder')), 'Founder time metric exists');

console.log(`\n${'═'.repeat(50)}`);
console.log(`${passed}/${passed + failed} tests passing · ${assertions} assertions`);
if (failed > 0) process.exit(1);

// Write results for the site
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
writeFileSync(join(__dirname, '..', 'site', 'data', 'tests.json'), JSON.stringify({
  passed, failed, assertions,
  timestamp: new Date().toISOString()
}, null, 2));
