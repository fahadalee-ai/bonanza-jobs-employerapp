import findJobsImage from "@/img/onboarding-find-jobs.jpg";
import applyImage from "@/img/onboarding-apply.jpg";
import referredImage from "@/img/onboarding-referred.jpg";

export type ThemeMode = "light" | "dark" | "system";
export type JobStatus = "Active" | "Paused" | "Draft" | "Closed";
export type ApplicationStatus = "New" | "Shortlisted" | "Under Review" | "Interview" | "Offer" | "Hired" | "Rejected";
export type ReferralStatus =
  | "Submitted"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Interview"
  | "Offer"
  | "Hired"
  | "90-Day Retention"
  | "Referral Fee Earned"
  | "Paid";
export type MilestoneStatus = "Pending" | "Due" | "Paid";
export type TeamRole = "Admin" | "Recruiter" | "Viewer";
export type PayType = "annual" | "hourly";

export const DEMO_EMAIL = "jordan.hale@northline.io";
export const DEMO_PASSWORD = "Employer123";
export const PENDING_EMAIL = "review@summitcare.com";
export const OWNER_ID = "emp-northline";

export const COMPANY_SIZES = ["1–10", "11–50", "51–200", "201–500", "501–1,000", "1,000+"];
export const INDUSTRIES = [
  "Healthcare Technology",
  "Software",
  "Finance",
  "Retail",
  "Manufacturing",
  "Education",
  "Professional Services",
];
export const US_STATES = ["AZ", "CA", "CO", "FL", "IL", "NY", "TX", "WA"];
export const SKILL_SUGGESTIONS = [
  "TypeScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "Figma",
  "Epic EHR",
  "Critical Care",
  "Salesforce",
  "Stakeholder Management",
];

export const ONBOARDING = [
  {
    title: "Post Jobs in Minutes",
    body: "Create requisitions, set requirements, and reach qualified US candidates instantly.",
    image: findJobsImage,
    alt: "Hiring manager at a desk with a laptop",
  },
  {
    title: "Discover Top Talent",
    body: "Search profiles, review resumes, and shortlist candidates from direct applications and referrals.",
    image: applyImage,
    alt: "Team reviewing candidates in a meeting room",
  },
  {
    title: "Pay Only for Successful Hires",
    body: "Review recruiter referrals and manage referral fees through a transparent two-milestone process.",
    image: referredImage,
    alt: "Professionals shaking hands after an offer",
  },
];

export type TeamMember = { id: string; name: string; email: string; role: TeamRole };
export type PayMethod = { id: string; label: string; detail: string; kind: "card" | "ach" };
export type Invoice = { id: string; date: string; amount: number; status: "Paid" | "Due"; label: string };
export type SavedSearch = { id: string; label: string; query: string };

export type Employer = {
  id: string;
  companyName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  password: string;
  companySize: string;
  industry: string;
  website: string;
  description: string;
  logoLetter: string;
  address: string;
  city: string;
  state: string;
  founded: string;
  linkedin: string;
  hiringStates: string[];
  hiringRoles: string;
  hiringVolume: string;
  setupDone: boolean;
  pendingApproval: boolean;
  plan: string;
  renewal: string;
  shortlist: string[];
  savedSearches: SavedSearch[];
  notes: Record<string, string>;
  team: TeamMember[];
  prefs: { applications: boolean; referrals: boolean; interviews: boolean; payments: boolean; expiring: boolean };
  twoFactor: boolean;
  defaultWorkMode: string;
  defaultVisible: boolean;
  language: string;
  methods: PayMethod[];
  invoices: Invoice[];
};

export type Requisition = {
  id: string;
  ownerId: string;
  title: string;
  department: string;
  employmentType: string;
  workMode: string;
  city: string;
  state: string;
  openings: number;
  description: string;
  responsibilities: string[];
  benefits: string[];
  skills: string[];
  experience: string;
  education: string;
  certifications: string;
  authorization: string;
  salaryMin: number;
  salaryMax: number;
  payType: PayType;
  bonus: boolean;
  referralFee: number;
  feeIsPercent: boolean;
  visibleToAgents: boolean;
  deadline: string;
  questions: string[];
  status: JobStatus;
  posted: string;
  lastEdited: string;
};

export type Talent = {
  id: string;
  name: string;
  headline: string;
  location: string;
  experienceYears: string;
  match: number;
  skills: string[];
  availability: string;
  salary: string;
  authorization: string;
  summary: string;
  photo: string;
  experience: { role: string; company: string; dates: string; body: string }[];
  education: { school: string; degree: string; year: string }[];
  certifications: string[];
  preferences: string;
};

export type Application = {
  id: string;
  ownerId: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  applied: string;
  notes: string;
  offerSalary: string;
  startDate: string;
  rejectReason: string;
  statusDate: string;
};

export type Referral = {
  id: string;
  ownerId: string;
  jobId: string;
  candidateId: string;
  agentName: string;
  agentRating: number;
  agentPlacement: string;
  recommendation: string;
  submitted: string;
  status: ReferralStatus;
  milestone1: number;
  milestone2: number;
  m1Status: MilestoneStatus;
  m2Status: MilestoneStatus;
  m2Due: string;
  notes: string;
  offerSalary: string;
  startDate: string;
  rejectReason: string;
  statusDate: string;
};

export type Interview = {
  id: string;
  ownerId: string;
  jobId: string;
  candidateId: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  place: string;
  notes: string;
  today?: boolean;
};

export type Activity = { id: string; ownerId: string; jobId: string; text: string; time: string };
export type Notice = {
  id: string;
  ownerId: string;
  title: string;
  body: string;
  time: string;
  group: "Today" | "Earlier";
  read: boolean;
  href: string;
};

export type JobDraft = {
  title: string;
  department: string;
  employmentType: string;
  workMode: string;
  city: string;
  state: string;
  openings: number;
  description: string;
  responsibilities: string;
  benefits: string;
  skills: string[];
  experience: string;
  education: string;
  certifications: string;
  authorization: string;
  salaryMin: string;
  salaryMax: string;
  payType: PayType;
  bonus: boolean;
  referralFee: string;
  feeIsPercent: boolean;
  visibleToAgents: boolean;
  deadline: string;
  questions: string[];
};

export const EMPTY_DRAFT: JobDraft = {
  title: "",
  department: "Engineering",
  employmentType: "Full-time",
  workMode: "Hybrid",
  city: "Denver",
  state: "CO",
  openings: 1,
  description: "",
  responsibilities: "",
  benefits: "",
  skills: [],
  experience: "Mid",
  education: "Bachelor's degree",
  certifications: "",
  authorization: "US work authorization required",
  salaryMin: "120000",
  salaryMax: "150000",
  payType: "annual",
  bonus: false,
  referralFee: "4500",
  feeIsPercent: false,
  visibleToAgents: true,
  deadline: "",
  questions: [],
};

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=480&h=480&q=80`;

export const SEED_EMPLOYER: Employer = {
  id: OWNER_ID,
  companyName: "Northline Health Systems",
  fullName: "Jordan Hale",
  jobTitle: "Talent Acquisition Lead",
  email: DEMO_EMAIL,
  phone: "(303) 555-0148",
  password: DEMO_PASSWORD,
  companySize: "201–500",
  industry: "Healthcare Technology",
  website: "https://northline.io",
  description:
    "Northline Health Systems builds clinical software for hospitals and outpatient groups across the Mountain West. We hire operators who care about patients and clean product work.",
  logoLetter: "NL",
  address: "1801 Wewatta St, Suite 400",
  city: "Denver",
  state: "CO",
  founded: "2014",
  linkedin: "linkedin.com/company/northline-health",
  hiringStates: ["CO", "TX", "AZ"],
  hiringRoles: "Software engineers, nurses, and customer success",
  hiringVolume: "8–12 hires this quarter",
  setupDone: true,
  pendingApproval: false,
  plan: "Growth",
  renewal: "Nov 1, 2026",
  shortlist: ["c6"],
  savedSearches: [{ id: "ss1", label: "Senior engineers in Denver", query: "software engineer" }],
  notes: { c1: "Strong system design interview. Confirm compensation expectations before the on-site." },
  team: [
    { id: "t1", name: "Jordan Hale", email: DEMO_EMAIL, role: "Admin" },
    { id: "t2", name: "Alicia Nguyen", email: "alicia.nguyen@northline.io", role: "Recruiter" },
    { id: "t3", name: "Chris Patel", email: "chris.patel@northline.io", role: "Viewer" },
  ],
  prefs: { applications: true, referrals: true, interviews: true, payments: true, expiring: true },
  twoFactor: false,
  defaultWorkMode: "Hybrid",
  defaultVisible: true,
  language: "English (US)",
  methods: [
    { id: "pm1", label: "Visa", detail: "•••• 4242", kind: "card" },
    { id: "pm2", label: "Chase ACH", detail: "•••• 1881", kind: "ach" },
  ],
  invoices: [
    { id: "in1", date: "Sep 1, 2026", amount: 299, status: "Paid", label: "Growth plan" },
    { id: "in2", date: "Aug 1, 2026", amount: 299, status: "Paid", label: "Growth plan" },
    { id: "in3", date: "Jul 12, 2026", amount: 2250, status: "Paid", label: "Referral fee · A. Brooks" },
  ],
};

export const PENDING_EMPLOYER: Employer = {
  ...SEED_EMPLOYER,
  id: "emp-summit",
  companyName: "Summit Care Group",
  fullName: "Riley Chen",
  jobTitle: "HR Manager",
  email: PENDING_EMAIL,
  phone: "(720) 555-0194",
  password: DEMO_PASSWORD,
  logoLetter: "SC",
  description: "",
  setupDone: false,
  pendingApproval: true,
  shortlist: [],
  savedSearches: [],
  notes: {},
  team: [],
  invoices: [],
};

export const CANDIDATES: Talent[] = [
  {
    id: "c1",
    name: "Maya Chen",
    headline: "Senior Software Engineer",
    location: "Denver, CO",
    experienceYears: "8 years",
    match: 94,
    skills: ["TypeScript", "React", "Node.js", "AWS"],
    availability: "2 weeks",
    salary: "$140,000",
    authorization: "US citizen",
    summary:
      "Product-minded engineer who has shipped patient-facing tools for two Denver health systems. Comfortable owning services from design review through on-call.",
    photo: photo("photo-1573497019940-1c28c88b4f3e"),
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Peaklight Digital",
        dates: "2021 — Present",
        body: "Led the scheduling API used by 40 clinics. Cut p95 latency from 800ms to 190ms.",
      },
      {
        role: "Software Engineer",
        company: "Front Range Labs",
        dates: "2018 — 2021",
        body: "Built React dashboards for care coordinators and mentored two junior engineers.",
      },
    ],
    education: [{ school: "University of Colorado Boulder", degree: "B.S. Computer Science", year: "2018" }],
    certifications: ["AWS Certified Developer"],
    preferences: "Hybrid in Denver. Open to a 4-day on-site schedule.",
  },
  {
    id: "c2",
    name: "Andre Williams",
    headline: "Full Stack Engineer",
    location: "Boulder, CO",
    experienceYears: "6 years",
    match: 88,
    skills: ["TypeScript", "Python", "SQL", "React"],
    availability: "Immediate",
    salary: "$130,000",
    authorization: "US work authorization",
    summary: "Full stack engineer with a healthcare analytics background and a calm on-site presence.",
    photo: photo("photo-1500648767791-00dcc994a43e"),
    experience: [
      {
        role: "Full Stack Engineer",
        company: "Lumen Chart",
        dates: "2020 — Present",
        body: "Shipped clinician scorecards and partnered with compliance on audit trails.",
      },
    ],
    education: [{ school: "Colorado State University", degree: "B.S. Information Systems", year: "2019" }],
    certifications: [],
    preferences: "Hybrid, Boulder or Denver.",
  },
  {
    id: "c3",
    name: "Priya Shah",
    headline: "Product Designer",
    location: "Austin, TX",
    experienceYears: "7 years",
    match: 91,
    skills: ["Figma", "Design Systems", "User Research"],
    availability: "3 weeks",
    salary: "$125,000",
    authorization: "US citizen",
    summary: "Designs clinical workflows with researchers and engineers. Strong systems thinker.",
    photo: photo("photo-1580489944761-15a19d654956"),
    experience: [
      {
        role: "Senior Product Designer",
        company: "Harbor Health",
        dates: "2019 — Present",
        body: "Owned the referral intake flow used by 12 hospital partners.",
      },
    ],
    education: [{ school: "University of Texas at Austin", degree: "B.F.A. Design", year: "2016" }],
    certifications: [],
    preferences: "Remote, US time zones.",
  },
  {
    id: "c4",
    name: "Elena Vargas",
    headline: "Registered Nurse",
    location: "Aurora, CO",
    experienceYears: "9 years",
    match: 86,
    skills: ["Critical Care", "Epic EHR", "Patient Education"],
    availability: "4 weeks",
    salary: "$92,000",
    authorization: "US citizen",
    summary: "ICU nurse who wants a role that mixes bedside care with clinical operations.",
    photo: photo("photo-1551836022-d5d88e9218df"),
    experience: [
      {
        role: "Registered Nurse, ICU",
        company: "Aurora Memorial",
        dates: "2017 — Present",
        body: "Charge nurse for a 16-bed unit. Precepts new graduates each quarter.",
      },
    ],
    education: [{ school: "Metropolitan State University of Denver", degree: "B.S.N.", year: "2016" }],
    certifications: ["CCRN", "BLS"],
    preferences: "On-site, Denver metro.",
  },
  {
    id: "c5",
    name: "Noah Brooks",
    headline: "Data Analyst",
    location: "Colorado Springs, CO",
    experienceYears: "4 years",
    match: 79,
    skills: ["SQL", "Python", "Tableau"],
    availability: "Immediate",
    salary: "$95,000",
    authorization: "US citizen",
    summary: "Analyst who turns operational data into weekly hiring and capacity reviews.",
    photo: photo("photo-1507003211169-0a1dd7228f2d"),
    experience: [
      {
        role: "Data Analyst",
        company: "Pikes Peak Credit Union",
        dates: "2022 — Present",
        body: "Built executive dashboards for branch staffing.",
      },
    ],
    education: [{ school: "University of Denver", degree: "B.S. Business Analytics", year: "2021" }],
    certifications: [],
    preferences: "Hybrid or remote.",
  },
  {
    id: "c6",
    name: "Camille Ortiz",
    headline: "Engineering Manager",
    location: "Seattle, WA",
    experienceYears: "11 years",
    match: 84,
    skills: ["People Management", "TypeScript", "Stakeholder Management"],
    availability: "6 weeks",
    salary: "$175,000",
    authorization: "US citizen",
    summary: "Manager of platform teams. Looking for a health-tech company with a Denver or remote hub.",
    photo: photo("photo-1531123897727-8f129e1688ce"),
    experience: [
      {
        role: "Engineering Manager",
        company: "North Sound Software",
        dates: "2020 — Present",
        body: "Leads 8 engineers across identity and billing.",
      },
    ],
    education: [{ school: "University of Washington", degree: "B.S. Computer Science", year: "2013" }],
    certifications: [],
    preferences: "Remote-first, quarterly travel.",
  },
  {
    id: "c7",
    name: "Luis Romero",
    headline: "Software Engineer",
    location: "Denver, CO",
    experienceYears: "5 years",
    match: 90,
    skills: ["React", "Node.js", "PostgreSQL"],
    availability: "Hired",
    salary: "$128,000",
    authorization: "US citizen",
    summary: "Accepted an offer for the Software Engineer requisition. Start date is October 20, 2026.",
    photo: photo("photo-1506794778202-cad84cf45f1d"),
    experience: [
      {
        role: "Software Engineer",
        company: "Mile High Clinics",
        dates: "2021 — 2026",
        body: "Built patient messaging and internal admin tools.",
      },
    ],
    education: [{ school: "Colorado School of Mines", degree: "B.S. Computer Science", year: "2020" }],
    certifications: [],
    preferences: "Hybrid, Denver.",
  },
  {
    id: "c8",
    name: "Sofia Nguyen",
    headline: "Backend Engineer",
    location: "San Jose, CA",
    experienceYears: "5 years",
    match: 82,
    skills: ["Node.js", "Python", "AWS"],
    availability: "2 weeks",
    salary: "$145,000",
    authorization: "H-1B, sponsorship needed",
    summary: "Backend engineer focused on reliable integrations. Open to relocating to Denver.",
    photo: photo("photo-1544005313-94ddf0286df2"),
    experience: [
      {
        role: "Backend Engineer",
        company: "Cedar API",
        dates: "2021 — Present",
        body: "Maintained partner webhooks and billing events.",
      },
    ],
    education: [{ school: "San Jose State University", degree: "B.S. Software Engineering", year: "2019" }],
    certifications: [],
    preferences: "Hybrid after relocation.",
  },
  {
    id: "c9",
    name: "James Okonkwo",
    headline: "ICU Nurse",
    location: "Denver, CO",
    experienceYears: "10 years",
    match: 89,
    skills: ["Critical Care", "Epic EHR", "Charge Nurse"],
    availability: "30 days",
    salary: "$98,000",
    authorization: "US citizen",
    summary: "Charge nurse referred for the Aurora unit. Known for calm handoffs and precepting.",
    photo: photo("photo-1506277886164-e25b35d65f02"),
    experience: [
      {
        role: "Charge Nurse, ICU",
        company: "Denver General",
        dates: "2018 — Present",
        body: "Runs night shift staffing and rapid response.",
      },
    ],
    education: [{ school: "University of Colorado Anschutz", degree: "B.S.N.", year: "2015" }],
    certifications: ["CCRN"],
    preferences: "On-site nights or rotating days.",
  },
  {
    id: "c10",
    name: "Hannah Kim",
    headline: "QA Engineer",
    location: "Fort Collins, CO",
    experienceYears: "3 years",
    match: 61,
    skills: ["Test Automation", "Cypress", "SQL"],
    availability: "Immediate",
    salary: "$90,000",
    authorization: "US citizen",
    summary: "QA engineer exploring a move into product engineering.",
    photo: photo("photo-1438761681033-6461ffad8d80"),
    experience: [
      {
        role: "QA Engineer",
        company: "Cache Labs",
        dates: "2023 — Present",
        body: "Automated regression for a billing portal.",
      },
    ],
    education: [{ school: "Colorado State University", degree: "B.A. Computer Science", year: "2022" }],
    certifications: [],
    preferences: "Hybrid, northern Colorado.",
  },
];

export const SEED_JOBS: Requisition[] = [
  {
    id: "j1",
    ownerId: OWNER_ID,
    title: "Software Engineer",
    department: "Engineering",
    employmentType: "Full-time",
    workMode: "Hybrid",
    city: "Denver",
    state: "CO",
    openings: 2,
    description:
      "Build the tools clinicians use between visits. You will own features in our TypeScript platform, pair with design, and help hire the next two engineers.",
    responsibilities: [
      "Ship product features with React and Node.js",
      "Review designs with clinical stakeholders",
      "Improve reliability of the scheduling service",
    ],
    benefits: ["Medical, dental, and vision", "401(k) match", "Hybrid schedule, 3 days in LoDo"],
    skills: ["TypeScript", "React", "Node.js"],
    experience: "Mid",
    education: "Bachelor's degree",
    certifications: "None required",
    authorization: "US work authorization required",
    salaryMin: 120000,
    salaryMax: 150000,
    payType: "annual",
    bonus: false,
    referralFee: 4500,
    feeIsPercent: false,
    visibleToAgents: true,
    deadline: "Oct 31, 2026",
    questions: [
      "Are you authorized to work in the United States?",
      "How many years of TypeScript experience do you have?",
    ],
    status: "Active",
    posted: "Oct 1, 2026",
    lastEdited: "Oct 6, 2026",
  },
  {
    id: "j2",
    ownerId: OWNER_ID,
    title: "Registered Nurse",
    department: "Clinical",
    employmentType: "Full-time",
    workMode: "On-site",
    city: "Aurora",
    state: "CO",
    openings: 3,
    description: "Join the Aurora step-down unit. This role is bedside care with a modern charting stack and a stable night rotation.",
    responsibilities: ["Deliver bedside care for a 4-patient assignment", "Document in Epic", "Precept new hires after 90 days"],
    benefits: ["Shift differential", "Tuition support", "Medical coverage from day one"],
    skills: ["Critical Care", "Epic EHR"],
    experience: "Mid",
    education: "Bachelor's degree",
    certifications: "RN license, BLS",
    authorization: "US citizen or permanent resident",
    salaryMin: 38,
    salaryMax: 48,
    payType: "hourly",
    bonus: true,
    referralFee: 3000,
    feeIsPercent: false,
    visibleToAgents: true,
    deadline: "Nov 15, 2026",
    questions: ["Do you hold an active Colorado RN license?"],
    status: "Active",
    posted: "Sep 18, 2026",
    lastEdited: "Oct 2, 2026",
  },
  {
    id: "j3",
    ownerId: OWNER_ID,
    title: "Product Designer",
    department: "Design",
    employmentType: "Full-time",
    workMode: "Remote",
    city: "Austin",
    state: "TX",
    openings: 1,
    description: "Shape the referral and intake experience used by hospital partners.",
    responsibilities: ["Run weekly research", "Maintain the design system", "Pair with engineering on handoff"],
    benefits: ["Remote stipend", "Medical coverage", "Learning budget"],
    skills: ["Figma", "Design Systems", "User Research"],
    experience: "Senior",
    education: "Bachelor's degree",
    certifications: "None required",
    authorization: "US work authorization required",
    salaryMin: 115000,
    salaryMax: 140000,
    payType: "annual",
    bonus: false,
    referralFee: 4000,
    feeIsPercent: false,
    visibleToAgents: true,
    deadline: "Nov 1, 2026",
    questions: [],
    status: "Paused",
    posted: "Sep 9, 2026",
    lastEdited: "Oct 4, 2026",
  },
  {
    id: "j4",
    ownerId: OWNER_ID,
    title: "Operations Manager",
    department: "Operations",
    employmentType: "Full-time",
    workMode: "Hybrid",
    city: "Denver",
    state: "CO",
    openings: 1,
    description: "Own clinic onboarding operations for the Mountain West region.",
    responsibilities: ["Run onboarding standups", "Track partner SLAs"],
    benefits: ["Medical coverage", "Bonus plan"],
    skills: ["Stakeholder Management"],
    experience: "Senior",
    education: "Bachelor's degree",
    certifications: "",
    authorization: "US work authorization required",
    salaryMin: 110000,
    salaryMax: 135000,
    payType: "annual",
    bonus: true,
    referralFee: 3500,
    feeIsPercent: false,
    visibleToAgents: false,
    deadline: "",
    questions: [],
    status: "Draft",
    posted: "Not posted",
    lastEdited: "Oct 7, 2026",
  },
  {
    id: "j5",
    ownerId: OWNER_ID,
    title: "Data Analyst",
    department: "Analytics",
    employmentType: "Full-time",
    workMode: "Hybrid",
    city: "Colorado Springs",
    state: "CO",
    openings: 1,
    description: "This requisition is closed after an internal transfer.",
    responsibilities: ["Weekly capacity reporting"],
    benefits: ["Medical coverage"],
    skills: ["SQL", "Tableau"],
    experience: "Mid",
    education: "Bachelor's degree",
    certifications: "",
    authorization: "US work authorization required",
    salaryMin: 85000,
    salaryMax: 105000,
    payType: "annual",
    bonus: false,
    referralFee: 2500,
    feeIsPercent: false,
    visibleToAgents: false,
    deadline: "Sep 30, 2026",
    questions: [],
    status: "Closed",
    posted: "Aug 12, 2026",
    lastEdited: "Sep 28, 2026",
  },
  {
    id: "j6",
    ownerId: OWNER_ID,
    title: "Customer Success Manager",
    department: "Customer Success",
    employmentType: "Full-time",
    workMode: "Remote",
    city: "Chicago",
    state: "IL",
    openings: 1,
    description: "Guide hospital administrators through rollout and the first 90 days.",
    responsibilities: ["Own a book of 15 accounts", "Run quarterly business reviews"],
    benefits: ["Remote stipend", "Variable bonus", "Medical coverage"],
    skills: ["Salesforce", "Stakeholder Management"],
    experience: "Mid",
    education: "Bachelor's degree",
    certifications: "",
    authorization: "US work authorization required",
    salaryMin: 90000,
    salaryMax: 115000,
    payType: "annual",
    bonus: true,
    referralFee: 3200,
    feeIsPercent: false,
    visibleToAgents: true,
    deadline: "Nov 20, 2026",
    questions: [],
    status: "Active",
    posted: "Oct 3, 2026",
    lastEdited: "Oct 3, 2026",
  },
];

export const SEED_APPLICATIONS: Application[] = [
  { id: "a1", ownerId: OWNER_ID, jobId: "j1", candidateId: "c1", status: "New", applied: "Oct 6, 2026", notes: "", offerSalary: "", startDate: "", rejectReason: "", statusDate: "Oct 6, 2026" },
  { id: "a2", ownerId: OWNER_ID, jobId: "j1", candidateId: "c2", status: "Shortlisted", applied: "Oct 4, 2026", notes: "", offerSalary: "", startDate: "", rejectReason: "", statusDate: "Oct 5, 2026" },
  { id: "a3", ownerId: OWNER_ID, jobId: "j2", candidateId: "c4", status: "Interview", applied: "Oct 2, 2026", notes: "", offerSalary: "", startDate: "", rejectReason: "", statusDate: "Oct 7, 2026" },
  { id: "a4", ownerId: OWNER_ID, jobId: "j1", candidateId: "c8", status: "Under Review", applied: "Oct 5, 2026", notes: "", offerSalary: "", startDate: "", rejectReason: "", statusDate: "Oct 5, 2026" },
  { id: "a5", ownerId: OWNER_ID, jobId: "j1", candidateId: "c10", status: "Rejected", applied: "Sep 29, 2026", notes: "", offerSalary: "", startDate: "", rejectReason: "Role needs more product engineering experience.", statusDate: "Oct 3, 2026" },
];

export const SEED_REFERRALS: Referral[] = [
  {
    id: "r1",
    ownerId: OWNER_ID,
    jobId: "j1",
    candidateId: "c7",
    agentName: "Marcus Hale",
    agentRating: 4.7,
    agentPlacement: "79% placement rate",
    recommendation:
      "Luis has shipped production React and Node in a clinic setting. He communicates clearly with non-technical stakeholders and is ready to start this month. I would place him again.",
    submitted: "Sep 2, 2026",
    status: "Hired",
    milestone1: 2250,
    milestone2: 2250,
    m1Status: "Due",
    m2Status: "Pending",
    m2Due: "Jan 18, 2027",
    notes: "Offer accepted at $128,000. Start date October 20, 2026.",
    offerSalary: "$128,000 / yr",
    startDate: "Oct 20, 2026",
    rejectReason: "",
    statusDate: "Sep 20, 2026",
  },
  {
    id: "r2",
    ownerId: OWNER_ID,
    jobId: "j3",
    candidateId: "c3",
    agentName: "Dana Brooks",
    agentRating: 4.9,
    agentPlacement: "86% placement rate",
    recommendation:
      "Priya led the intake redesign at Harbor Health. Her portfolio shows the same clinical constraints you have, and she is willing to overlap with the Denver team weekly.",
    submitted: "Oct 7, 2026",
    status: "Submitted",
    milestone1: 2000,
    milestone2: 2000,
    m1Status: "Pending",
    m2Status: "Pending",
    m2Due: "",
    notes: "",
    offerSalary: "",
    startDate: "",
    rejectReason: "",
    statusDate: "Oct 7, 2026",
  },
  {
    id: "r3",
    ownerId: OWNER_ID,
    jobId: "j2",
    candidateId: "c9",
    agentName: "Dana Brooks",
    agentRating: 4.9,
    agentPlacement: "86% placement rate",
    recommendation:
      "James has ten years of ICU charge experience in Denver. He is licensed in Colorado and can start within 30 days. Nurses he precepts stay.",
    submitted: "Oct 3, 2026",
    status: "Under Review",
    milestone1: 1500,
    milestone2: 1500,
    m1Status: "Pending",
    m2Status: "Pending",
    m2Due: "",
    notes: "",
    offerSalary: "",
    startDate: "",
    rejectReason: "",
    statusDate: "Oct 3, 2026",
  },
];

export const SEED_INTERVIEWS: Interview[] = [
  {
    id: "i1",
    ownerId: OWNER_ID,
    jobId: "j1",
    candidateId: "c2",
    type: "Video",
    date: "Today",
    time: "10:30 AM",
    duration: "45 min",
    place: "https://meet.northline.io/andre",
    notes: "System design, scheduling service.",
    today: true,
  },
  {
    id: "i2",
    ownerId: OWNER_ID,
    jobId: "j2",
    candidateId: "c4",
    type: "On-site",
    date: "Fri, Oct 10",
    time: "2:00 PM",
    duration: "60 min",
    place: "Aurora Clinic, 1360 S Potomac St",
    notes: "Unit tour with the charge nurse.",
  },
];

export const SEED_ACTIVITY: Activity[] = [
  { id: "ac1", ownerId: OWNER_ID, jobId: "j1", text: "Maya Chen applied", time: "Oct 6, 2026" },
  { id: "ac2", ownerId: OWNER_ID, jobId: "j1", text: "Sofia Nguyen moved to Under Review", time: "Oct 5, 2026" },
  { id: "ac3", ownerId: OWNER_ID, jobId: "j1", text: "Andre Williams shortlisted", time: "Oct 5, 2026" },
  { id: "ac4", ownerId: OWNER_ID, jobId: "j1", text: "Luis Romero marked Hired", time: "Sep 20, 2026" },
  { id: "ac5", ownerId: OWNER_ID, jobId: "j1", text: "Requisition published", time: "Oct 1, 2026" },
  { id: "ac6", ownerId: OWNER_ID, jobId: "j2", text: "Interview scheduled with Elena Vargas", time: "Oct 7, 2026" },
  { id: "ac7", ownerId: OWNER_ID, jobId: "j2", text: "James Okonkwo referred by Dana Brooks", time: "Oct 3, 2026" },
];

export const SEED_NOTICES: Notice[] = [
  { id: "n1", ownerId: OWNER_ID, title: "New application", body: "Maya Chen applied for Software Engineer.", time: "8:14 AM", group: "Today", read: false, href: "/jobs/j1" },
  { id: "n2", ownerId: OWNER_ID, title: "Interview today", body: "Video interview with Andre Williams at 10:30 AM.", time: "7:02 AM", group: "Today", read: false, href: "/jobs/j1" },
  { id: "n3", ownerId: OWNER_ID, title: "New referral", body: "Dana Brooks referred Priya Shah for Product Designer.", time: "Yesterday", group: "Earlier", read: false, href: "/referrals/r2" },
  { id: "n4", ownerId: OWNER_ID, title: "Payment due", body: "Milestone 1 for Luis Romero is due: $2,250.", time: "Oct 6", group: "Earlier", read: true, href: "/payments" },
  { id: "n5", ownerId: OWNER_ID, title: "Job expiring", body: "Software Engineer closes applications on Oct 31.", time: "Oct 5", group: "Earlier", read: true, href: "/jobs/j1" },
  { id: "n6", ownerId: OWNER_ID, title: "Interview confirmed", body: "Elena Vargas confirmed Friday’s on-site interview.", time: "Oct 4", group: "Earlier", read: true, href: "/jobs/j2" },
];

export function candidateById(id: string) {
  return CANDIDATES.find((item) => item.id === id);
}

export function splitFee(amount: number) {
  const first = Math.round(amount / 2);
  return { m1: first, m2: amount - first };
}

export function draftFromJob(job: Requisition): JobDraft {
  return {
    title: job.title,
    department: job.department,
    employmentType: job.employmentType,
    workMode: job.workMode,
    city: job.city,
    state: job.state,
    openings: job.openings,
    description: job.description,
    responsibilities: job.responsibilities.join("\n"),
    benefits: job.benefits.join("\n"),
    skills: job.skills,
    experience: job.experience,
    education: job.education,
    certifications: job.certifications,
    authorization: job.authorization,
    salaryMin: String(job.salaryMin),
    salaryMax: String(job.salaryMax),
    payType: job.payType,
    bonus: job.bonus,
    referralFee: String(job.referralFee),
    feeIsPercent: job.feeIsPercent,
    visibleToAgents: job.visibleToAgents,
    deadline: job.deadline,
    questions: job.questions,
  };
}

export function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.replace(/^•\s*/, "").trim())
    .filter(Boolean);
}
