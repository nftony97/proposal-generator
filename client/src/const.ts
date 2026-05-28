export interface Connection {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'warning';
  lastChecked: string;
  activeFile?: string;
  iconType: 'salesforce' | 'onedrive' | 'database' | 'api' | 'file';
}

export interface AgentStep {
  id: number;
  name: string;
  agentName: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'warning';
  outputFile?: string;
  lastRun?: string;
}

export interface ThemeConfig {
  template: 'editorial' | 'swiss' | 'modern';
  primaryColor: string;
  secondaryColor: string;
  headerFooterStyle: 'standard' | 'minimal' | 'bold';
  headingFont: string;
  bodyFont: string;
}

export interface OutputTemplate {
  id: string;
  name: string;
  description: string;
  slides: { id: string; title: string; enabled: boolean }[];
}

export const INITIAL_CONNECTIONS: Connection[] = [
  { id: 'sf', name: 'Salesforce CRM', type: 'OAuth API', status: 'connected', lastChecked: 'Just now', activeFile: 'Evans_Client_History_v4.sf', iconType: 'salesforce' },
  { id: 'od', name: 'OneDrive Storage', type: 'Microsoft Graph', status: 'connected', lastChecked: 'Just now', activeFile: 'Evans_Bundled_Final05122026.pdf', iconType: 'onedrive' },
  { id: '1', name: 'Census Excel Parser', type: 'File Stream', status: 'connected', lastChecked: '2 mins ago', activeFile: 'Acme_Census_2026.xlsx', iconType: 'file' },
  { id: '2', name: 'BCBS Quote Extractor', type: 'PDF Parser', status: 'connected', lastChecked: '5 mins ago', activeFile: 'BCBS_Quote_S663.pdf', iconType: 'file' },
  { id: '3', name: 'Beam Quote Extractor', type: 'PDF Parser', status: 'connected', lastChecked: '10 mins ago', activeFile: 'Beam_Quote_D981.pdf', iconType: 'file' },
  { id: '4', name: 'Equitable Extractor', type: 'PDF Parser', status: 'warning', lastChecked: '15 mins ago', activeFile: 'Equitable_Dental_Quote.pdf', iconType: 'file' },
];

export const INITIAL_STEPS: AgentStep[] = [
  { id: 1, name: 'Census Parser', agentName: 'AGENT 1', description: 'Extract and normalize employee enrollment data from varied formats.', status: 'completed', outputFile: 'census_normalized.json', lastRun: '10 mins ago' },
  { id: 2, name: 'Quote Extractor', agentName: 'AGENT 2', description: 'Extract structured rate and plan data from carrier quote documents.', status: 'completed', outputFile: 'quotes_extracted.json', lastRun: '8 mins ago' },
  { id: 3, name: 'Validator & Audit', agentName: 'AGENT 3', description: 'Verify mathematical accuracy and logical consistency of extracted quote data.', status: 'warning', outputFile: 'validation_report.json', lastRun: '5 mins ago' },
  { id: 4, name: 'Proposal Generator', agentName: 'AGENT 4', description: 'Produce professional, client-ready benefits renewal proposals.', status: 'running', lastRun: 'Running now...' },
  { id: 5, name: 'Quality Control', agentName: 'AGENT 5', description: 'Perform final quality control on generated proposals.', status: 'pending' },
];

export const OUTPUT_TEMPLATES: OutputTemplate[] = [
  {
    id: 'large_group',
    name: 'Large Group Renewal',
    description: 'Fully detailed deck designed for corporate clients with complex benefit lines and tiered pricing.',
    slides: [
      { id: 'lg_cover', title: 'Cover Page (Evans Branded)', enabled: true },
      { id: 'lg_team', title: 'Agency Service Team Contacts', enabled: true },
      { id: 'lg_overview', title: 'Group Size & Current Coverage Summary', enabled: true },
      { id: 'lg_quotes', title: 'Quotes Received Summary Grid', enabled: true },
      { id: 'lg_med_comp', title: 'Medical Plan Side-by-Side Comparisons', enabled: true },
      { id: 'lg_dent_comp', title: 'Dental Plan Options & Rates', enabled: true },
      { id: 'lg_vis_comp', title: 'Vision Plan Benefits & Rates', enabled: true },
      { id: 'lg_life_comp', title: 'Life/AD&D Options Summary', enabled: true },
      { id: 'lg_cost_sum', title: 'Total Cost Scenario Bundles (3 Scenarios)', enabled: true },
      { id: 'lg_next', title: 'Recommendation & Actionable Next Steps', enabled: true }
    ]
  },
  {
    id: 'small_group',
    name: 'Small Group (Excel Upgrade)',
    description: 'A streamlined, highly legible layout upgraded from traditional spreadsheet rate grids.',
    slides: [
      { id: 'sg_cover', title: 'Cover Page & Renewal Timeline', enabled: true },
      { id: 'sg_overview', title: 'Current vs Proposed Plan Highlights', enabled: true },
      { id: 'sg_med_comp', title: 'Simplified Medical Plan Options', enabled: true },
      { id: 'sg_anc_comp', title: 'Ancillary Benefits Package (Dental/Vision)', enabled: true },
      { id: 'sg_cost_sum', title: 'Total Monthly & Annual Cost Comparison', enabled: true },
      { id: 'sg_next', title: 'Enrollment Instructions & Next Steps', enabled: true }
    ]
  },
  {
    id: 'level_funded',
    name: 'Level Funded Proposal',
    description: 'Highlights claims fund tracking, stop-loss premium breakdowns, and refund opportunities.',
    slides: [
      { id: 'lf_cover', title: 'Level Funded Executive Cover', enabled: true },
      { id: 'lf_how_it_works', title: 'How Level Funding Works (Educational)', enabled: true },
      { id: 'lf_funding_break', title: 'Claims Fund vs Administrative Fees vs Stop-Loss', enabled: true },
      { id: 'lf_quotes', title: 'Carrier Level-Funded Plan Designs', enabled: true },
      { id: 'lf_cost_sum', title: 'Expected vs Maximum Monthly Exposure', enabled: true },
      { id: 'lf_refund', title: 'Potential Year-End Refund Scenarios', enabled: true }
    ]
  },
  {
    id: 'ancillary_benefits',
    name: 'Ancillary Benefits Package',
    description: 'Dedicated solely to specialty lines including Dental, Vision, Life, Disability, and voluntary benefits.',
    slides: [
      { id: 'ab_cover', title: 'Ancillary & Specialty Benefits Cover', enabled: true },
      { id: 'ab_dent', title: 'Dental Benefit Highlights & Rates', enabled: true },
      { id: 'ab_vis', title: 'Vision Care Network & Allowances', enabled: true },
      { id: 'ab_life', title: 'Basic & Voluntary Life Options', enabled: true },
      { id: 'ab_dis', title: 'Short & Long-Term Disability Plans', enabled: true },
      { id: 'ab_cost_sum', title: 'Employer vs Employee Contribution Cost Summary', enabled: true }
    ]
  }
];

export const STATE_OBJECT = {
  client_name: "Acme Corporation",
  effective_date: "2026-07-01",
  group_size: 48,
  medical_enrollment: { ee: 24, es: 8, ec: 6, ef: 10 },
  dental_enrollment: { ee: 20, es: 5, ec: 8, ef: 7 },
  vision_enrollment: { ee: 18, es: 4, ec: 6, ef: 5 },
  employer_contribution: {
    medical_ee: "80%",
    medical_dep: "50%",
    dental: "50%",
    vision: "0% (Voluntary)"
  },
  funding_type: "fully_insured",
  medical_plans: [
    { name: "BCBS Blue Choice PPO 100", carrier: "BCBS", total_monthly_premium: 24500.00 },
    { name: "BCBS Blue Choice Select HMO", carrier: "BCBS", total_monthly_premium: 21200.00 }
  ],
  dental_plans: [
    { name: "Beam Dental Smart PPO 1500", carrier: "Beam", total_monthly_premium: 1383.12 }
  ],
  vision_plans: [
    { name: "Beam Vision Bright 150", carrier: "Beam", total_monthly_premium: 280.40 }
  ],
  life_plans: [
    { name: "Colonial Basic Life $50k", carrier: "Colonial", total_monthly_premium: 450.00 }
  ],
  validation_status: "warn",
  errors: [
    "Equitable quoted 4 EE-only ($147/mo) vs Beam quoted 10 lives ($1,383/mo) — enrollment mismatch."
  ]
};

export const CENSUS_PARSER_OUTPUT = {
  client_name: "Acme Corporation",
  census_date: "2026-05-15",
  total_eligible_employees: 55,
  total_enrolled_employees: 48,
  enrollment_by_benefit: {
    medical: { ee: 24, es: 8, ec: 6, ef: 10, waived: 7 },
    dental: { ee: 20, es: 5, ec: 8, ef: 7, waived: 8 },
    vision: { ee: 18, es: 4, ec: 6, ef: 5, waived: 15 },
    life: { enrolled: 48, waived: 7 }
  },
  demographics: {
    average_age: 38.4,
    age_bands: [
      { range: "Under 30", count: 12 },
      { range: "30-45", count: 22 },
      { range: "46-60", count: 10 },
      { range: "60+", count: 4 }
    ],
    zip_codes: ["60601", "60611", "60614"]
  },
  flags: [
    "Single tier set provided — dental/vision enrollment may differ"
  ]
};

export const QUOTE_EXTRACTOR_OUTPUT = [
  {
    carrier: "BCBS",
    benefit_type: "medical",
    plan_name: "Blue Choice PPO 100",
    plan_id: "S663CHC",
    network: "PPO",
    funding_type: "fully_insured",
    employer_contribution: "80% EE / 50% Dep",
    tier_enrollment: { ee: 24, es: 8, ec: 6, ef: 10 },
    tier_rates_monthly: { ee: 650.00, es: 1300.00, ec: 1150.00, ef: 1950.00 },
    total_monthly_premium: 45100.00,
    plan_features: {
      deductible_individual: 1500,
      deductible_family: 3000,
      coinsurance: "80%",
      out_of_pocket_max_individual: 4500,
      out_of_pocket_max_family: 9000,
      copay_pcp: "$25",
      copay_specialist: "$50"
    },
    rate_guarantee: "12 Months",
    commission: "5%",
    source_page: "2"
  },
  {
    carrier: "Beam",
    benefit_type: "dental",
    plan_name: "Smart PPO 1500",
    plan_id: "D981BEM",
    network: "PPO",
    funding_type: "fully_insured",
    employer_contribution: "50%",
    tier_enrollment: { ee: 20, es: 5, ec: 8, ef: 7 },
    tier_rates_monthly: { ee: 32.12, es: 64.24, ec: 58.10, ef: 96.36 },
    total_monthly_premium: 1383.12,
    plan_features: {
      annual_maximum: 1500,
      deductible_individual: 50,
      deductible_family: 150
    },
    rate_guarantee: "12 Months",
    commission: "10%",
    source_page: "Cost Summary (p. 4)"
  }
];

export const VALIDATOR_OUTPUT = {
  validation_status: "WARN",
  checks_performed: 14,
  checks_passed: 12,
  checks_failed: 2,
  findings: [
    {
      severity: "WARNING",
      check_type: "enrollment",
      plan_affected: "Beam Dental vs Equitable Dental",
      description: "Equitable quoted 4 EE-only ($147/mo) vs Beam quoted 10 lives ($1,383/mo) — enrollment mismatch. This will make direct premium comparison misleading.",
      expected: "Aligned enrollment counts across quotes",
      actual: "Equitable: 4 lives, Beam: 10 lives",
      recommendation: "Normalize Equitable rates using Beam's tier counts for accurate cost scenario comparison."
    },
    {
      severity: "ERROR",
      check_type: "arithmetic",
      plan_affected: "BCBS Blue Choice PPO 100",
      description: "Sum of (rate × tier_count) across all tiers ($44,400.00) does not equal the carrier stated total_monthly_premium ($45,100.00).",
      expected: "$45,100.00",
      actual: "$44,400.00",
      recommendation: "Verify if there is an unlisted administrative fee or surcharge on page 3 of the BCBS quote."
    }
  ],
  enrollment_reconciliation: {
    note: "Differences in tier counts are due to Beam quoting voluntary dental (enrolled employees only) while Equitable assumed 100% employer-paid dental.",
    medical_basis: { ee: 24, es: 8, ec: 6, ef: 10, total_lives: 48 },
    dental_basis: { ee: 20, es: 5, ec: 8, ef: 7, total_lives: 40 },
    vision_basis: { ee: 18, es: 4, ec: 6, ef: 5, total_lives: 33 },
    apples_to_apples_possible: false,
    normalization_method: "Recalculate Equitable premiums using Beam's 40-life enrollment structure."
  }
};
