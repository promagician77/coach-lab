// Acquisition model for youth sports coaching app
// 90-day plan, organic + community channels

export const DEFAULTS = {
  // ASO
  aso_impressions_day: 120,    // conservative for niche app
  aso_tap_rate: 0.08,          // 8% tap-through
  aso_install_rate: 0.30,      // 30% of product page views install

  // Content marketing (blog + social)
  content_posts_week: 3,
  content_reach_per_post: 400,
  content_click_rate: 0.02,
  content_install_rate: 0.10,

  // Community / partnerships
  community_leagues_contacted: 40,
  community_response_rate: 0.15,
  community_teams_per_league: 6,
  community_install_rate: 0.25,

  // Referral / word of mouth
  referral_rate: 0.12,         // 12% of active users invite others
  referral_accept_rate: 0.35,

  // Webinars / demos
  webinar_count: 3,            // over 90 days
  webinar_registrants: 30,
  webinar_attend_rate: 0.40,
  webinar_install_rate: 0.50,

  // App Store ratings push
  rating_prompt_eligible: 200, // users eligible for rating prompt
  rating_response_rate: 0.15,
  avg_rating: 4.6,

  // Hours
  hours_per_week: 15,          // contractor hours
  weeks: 13,
  founder_hours_week: 4,       // post-handoff target
};

export function run(d = DEFAULTS) {
  const days = d.weeks * 7;

  // ASO installs over 90 days
  const aso_taps = d.aso_impressions_day * d.aso_tap_rate * days;
  const aso_installs = Math.round(aso_taps * d.aso_install_rate);

  // Content installs
  const total_posts = d.content_posts_week * d.weeks;
  const content_clicks = total_posts * d.content_reach_per_post * d.content_click_rate;
  const content_installs = Math.round(content_clicks * d.content_install_rate);

  // Community / league partnerships
  const leagues_yes = Math.round(d.community_leagues_contacted * d.community_response_rate);
  const teams_reached = leagues_yes * d.community_teams_per_league;
  // ~15 people per team (coaches + parents)
  const community_people = teams_reached * 15;
  const community_installs = Math.round(community_people * d.community_install_rate);

  // Webinars
  const webinar_attendees = d.webinar_count * d.webinar_registrants * d.webinar_attend_rate;
  const webinar_installs = Math.round(webinar_attendees * d.webinar_install_rate);

  // Referrals (compound, simplified to one pass)
  const base_installs = aso_installs + content_installs + community_installs + webinar_installs;
  const referral_installs = Math.round(base_installs * d.referral_rate * d.referral_accept_rate);

  const total_installs = base_installs + referral_installs;

  // New ratings
  const new_ratings = Math.round(d.rating_prompt_eligible * d.rating_response_rate);

  // Hours
  const total_hours = d.hours_per_week * d.weeks;

  return {
    aso_installs,
    content_installs,
    community_installs,
    webinar_installs,
    referral_installs,
    total_installs,
    new_ratings,
    avg_rating: d.avg_rating,
    total_hours,
    total_posts,
    leagues_yes,
    teams_reached,
    webinar_attendees: Math.round(webinar_attendees),
    cost_per_install: 0, // organic, no ad spend
    channels: [
      { name: 'ASO', installs: aso_installs },
      { name: 'Content', installs: content_installs },
      { name: 'Community', installs: community_installs },
      { name: 'Webinars', installs: webinar_installs },
      { name: 'Referrals', installs: referral_installs },
    ]
  };
}

// Agent architecture
export const AGENTS = [
  {
    id: 'coordinator',
    name: 'Lead Coordinator',
    tool: 'Claude + Make',
    role: 'Routes tasks, checks quality, enforces approval gate',
    inputs: ['Weekly brief', 'Founder feedback'],
    outputs: ['Task queue', 'Approval requests'],
  },
  {
    id: 'research',
    name: 'Audience Research',
    tool: 'Claude + Apify',
    role: 'Monitors competitor listings, review sentiment, keyword trends',
    inputs: ['Competitor app IDs', 'Keyword list'],
    outputs: ['Weekly keyword report', 'Competitor change alerts'],
  },
  {
    id: 'content',
    name: 'Content Creator',
    tool: 'Claude + Zapier',
    role: 'Drafts blog posts, social captions, email sequences',
    inputs: ['Content calendar', 'Brand voice guide'],
    outputs: ['Draft posts (pending approval)', 'Image briefs'],
  },
  {
    id: 'aso',
    name: 'ASO Manager',
    tool: 'Claude + App Store Connect API',
    role: 'Generates metadata variants, seasonal keyword rotation, screenshot copy',
    inputs: ['Keyword report', 'Seasonal calendar'],
    outputs: ['Metadata update proposals', 'A/B test plans'],
  },
  {
    id: 'distribution',
    name: 'Distribution Agent',
    tool: 'Make + SendGrid + Buffer',
    role: 'Schedules approved content, sends emails, posts to social',
    inputs: ['Approved content queue'],
    outputs: ['Published posts', 'Send confirmations'],
  },
  {
    id: 'analytics',
    name: 'Performance Tracker',
    tool: 'Claude + Google Sheets + App Store Connect',
    role: 'Pulls install data, tracks KPIs, generates weekly report',
    inputs: ['App Store Connect data', 'UTM tracking'],
    outputs: ['Weekly dashboard', 'Anomaly alerts'],
  },
];

export const PLAN_WEEKS = [
  // Phase 1: Foundation (Weeks 1-4)
  { week: 1, phase: 'Foundation', tasks: ['Brand audit & positioning workshop', 'Competitor ASO teardown (TeamSnap, Spond, Heja, GameChanger)', 'Keyword research: iOS keyword field + Google Play long description', 'Set up analytics baseline (installs, impressions, conversion rate)'] },
  { week: 2, phase: 'Foundation', tasks: ['Rewrite App Store metadata (title, subtitle, keyword field, screenshots)', 'Google Play: optimize title, short desc, full description with keywords', 'Draft brand voice guide & content pillars', 'Configure Make/Zapier accounts, connect to App Store Connect API'] },
  { week: 3, phase: 'Foundation', tasks: ['Build Agent 1: Audience Research (competitor monitoring)', 'Build Agent 2: Content Creator (blog drafts + social)', 'Create content calendar for months 2-3', 'First 3 blog posts drafted and in approval queue'] },
  { week: 4, phase: 'Foundation', tasks: ['Build Agent 3: ASO Manager (keyword rotation proposals)', 'Build Agent 4: Distribution (scheduled publishing)', 'Build Agent 5: Performance Tracker (weekly report)', 'Wire coordinator agent to route tasks between agents'] },

  // Phase 2: Launch & Learn (Weeks 5-8)
  { week: 5, phase: 'Launch', tasks: ['Publish optimized App Store listings (both platforms)', 'Launch blog with first 3 posts', 'Begin community outreach: 10 leagues contacted', 'Social accounts active, 5 posts/week'] },
  { week: 6, phase: 'Launch', tasks: ['A/B test App Store screenshots (iOS)', 'Google Play Store Listing Experiments started', 'Community: 10 more leagues contacted', 'First email sequence drafted for league partnerships'] },
  { week: 7, phase: 'Launch', tasks: ['First webinar: "5 drills every volunteer coach needs"', 'Review agent outputs: tune prompts based on approval rate', 'Partnership outreach to 2 youth sports bloggers/podcasters', 'Keyword performance review: drop underperformers, add new'] },
  { week: 8, phase: 'Launch', tasks: ['Checkpoint: review installs, ASO conversion, content engagement', 'Adjust agent workflows based on 4-week data', 'Second batch of 10 leagues contacted', 'Implement in-app rating prompt (SKStoreReviewController / Google In-App Review API)'] },

  // Phase 3: Scale & Handoff (Weeks 9-13)
  { week: 9, phase: 'Handoff', tasks: ['Second webinar: season-specific topic', 'Handoff documentation: agent playbooks started', 'Community: partnerships bearing fruit, referral program live', 'Content: shift to user-generated stories (coach spotlights)'] },
  { week: 10, phase: 'Handoff', tasks: ['Record Loom walkthroughs of each agent workflow', 'Founder runs content approval cycle solo (shadowed)', 'ASO: seasonal keyword rotation for upcoming sport season', 'Performance: cost-per-install by channel benchmarked'] },
  { week: 11, phase: 'Handoff', tasks: ['Third webinar or podcast guest appearance', 'Founder runs full weekly cycle independently', 'Troubleshooting guide for common agent failures', 'Optimize underperforming channels, double down on winners'] },
  { week: 12, phase: 'Handoff', tasks: ['Final documentation review and gap-fill', 'Template library: 20+ reusable content templates', 'Agent health checks: error rates, API limits, cost tracking', 'Transition meeting: 90-day results and 6-month roadmap'] },
  { week: 13, phase: 'Handoff', tasks: ['Buffer week: fix loose ends, answer questions', 'Deliver: complete playbook, all agent configs, credentials', 'Final weekly report with benchmarks for ongoing measurement', 'Post-engagement support plan (optional retainer terms)'] },
];

export const METRICS = [
  { name: 'App Store Impressions', baseline: '~120/day', target: '300+/day', source: 'App Store Connect' },
  { name: 'Product Page Conversion', baseline: 'Unknown', target: '30%+', source: 'App Store Connect' },
  { name: 'Weekly Installs', baseline: 'Unknown', target: '50+/week by week 8', source: 'App Store Connect' },
  { name: 'Keyword Rankings (top 10)', baseline: '0', target: '5+ keywords', source: 'ASO tool' },
  { name: 'Blog Traffic', baseline: '0', target: '500 visits/week', source: 'Analytics' },
  { name: 'Content Approval Rate', baseline: 'N/A', target: '80%+ first-pass', source: 'Agent logs' },
  { name: 'League Partnerships', baseline: '0', target: '6+ active', source: 'CRM' },
  { name: 'App Store Rating', baseline: 'Current', target: '4.6+ with 30+ new ratings', source: 'App Store' },
  { name: 'Founder Weekly Time', baseline: 'N/A', target: '≤4 hours/week', source: 'Time tracking' },
  { name: 'Agent Uptime', baseline: 'N/A', target: '95%+', source: 'Make/Zapier logs' },
];
