// Verified competitor data for the youth sports app market
export const COMPETITORS = [
  {
    name: 'TeamSnap',
    url: 'teamsnap.com',
    type: 'Incumbent',
    pricing: 'Free tier + $70–130/season premium',
    strengths: ['Largest installed base in US youth sports', 'Multi-sport, mobile-first', 'Recently launched TeamSnap ONE (streaming + coaching)'],
    weaknesses: ['Practice planning minimal', 'Premium pricing high for volunteer coaches', 'Complex for single-team use'],
    aso_notes: 'Rotates iOS subtitle seasonally (NFL→NBA→MLB). Heavy keyword optimization.',
    source: 'teamsnap.com, App Store listing',
  },
  {
    name: 'Spond',
    url: 'spond.com',
    type: 'Fast-growing free',
    pricing: 'Free (no premium tier for teams)',
    strengths: ['2M+ MAU, grown entirely by word of mouth', '1M+ MAU in UK alone', 'NAYS partnership in US', 'Strong safeguarding (no 1:1 adult-minor messaging)'],
    weaknesses: ['Norwegian origin — US brand awareness still building', 'No coaching/drill content', 'No stats or scoring'],
    aso_notes: 'Ranks well on "free sports team app". Youth soccer content marketing in US.',
    source: 'spond.com/news-and-blog, PR Newswire',
  },
  {
    name: 'Heja',
    url: 'heja.io',
    type: 'Community-first',
    pricing: 'Free + Heja Pro (in-app purchase)',
    strengths: ['500K+ teams across 50 countries', '91% of parents report higher engagement', '18% uplift in participation rate', '$1.2M revenue in 2023 (65% YoY growth)'],
    weaknesses: ['Small team (~50 employees)', 'Revenue still modest vs. competitors', 'Limited league-level features'],
    aso_notes: 'Strong organic growth. 4.6 App Store rating. Focus on "team communication app" keywords.',
    source: 'heja.io/about, ideausher.com analysis, AlternativeTo',
  },
  {
    name: 'GameChanger',
    url: 'gc.com',
    type: 'Stats & scoring',
    pricing: 'Free tier + GameChanger+ subscription',
    strengths: ['Owned by DICK\'S Sporting Goods', '4.9 rating with 800K+ reviews on iOS', 'Dominant in baseball/softball scoring', 'Live game streaming'],
    weaknesses: ['Focused on scoring, not team management', 'Baseball/softball heavy', 'Less useful for non-game activities'],
    aso_notes: 'Massive review volume drives rankings. Sport-specific keywords.',
    source: 'App Store listing, marlvel.ai analysis',
  },
  {
    name: 'TeamLinkt',
    url: 'teamlinkt.com',
    type: 'Free disruptor',
    pricing: 'Free (ad-supported)',
    strengths: ['500K+ MAU', '3,500+ sports organizations', '3M users total', '$8.3M CAD Series A', '59% direct traffic — pure word of mouth'],
    weaknesses: ['Ad-supported (banner ads)', 'Strongest in Canada (hockey, basketball)', '~3 employees — lean but limited'],
    aso_notes: '83% of traffic is direct — minimal ASO investment. Niche dominance in Canadian market.',
    source: 'cbinsights.com, techlist.ai, youthsportsbusinessreport.com',
  },
];

export const MARKET = {
  global_2025: '$2.1B',
  global_2034: '$6.4B',
  cagr: '13.2%',
  north_america_share: '38.6%',
  north_america_2025: '$810M',
  team_mgmt_segment: '41.5%',
  coach_app_usage: '78%',   // of coaches use smartphone apps
  parent_app_usage: '82%',  // of parents use smartphone apps
  search_discovery: '70%',  // of App Store visitors use search
  post_search_install: '65%', // of downloads happen after a search
  source: 'Market Intelo 2025, Eltima Software 2025',
};
