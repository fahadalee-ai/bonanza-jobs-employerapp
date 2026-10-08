import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { clearStorage, readStorage, writeStorage } from "./storage";
import {
  CANDIDATES,
  PENDING_EMPLOYER,
  SEED_ACTIVITY,
  SEED_APPLICATIONS,
  SEED_EMPLOYER,
  SEED_INTERVIEWS,
  SEED_JOBS,
  SEED_NOTICES,
  SEED_REFERRALS,
  splitFee,
  lines,
  type Activity,
  type Application,
  type ApplicationStatus,
  type Employer,
  type Interview,
  type JobDraft,
  type JobStatus,
  type Notice,
  type Referral,
  type ReferralStatus,
  type Requisition,
  type TeamRole,
  type ThemeMode,
} from "./mock-data";

export const STORAGE_KEY = "bonanza.employer.v1";
export const ONBOARDED_KEY = "bonanza.employer.onboarded";

function seenOnboarding() {
  return readStorage(ONBOARDED_KEY) === "1";
}

function rememberOnboarding() {
  writeStorage(ONBOARDED_KEY, "1");
}

export type Toast = { id: number; title: string; body?: string };

export type SignupInput = {
  companyName: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  password: string;
  companySize: string;
  industry: string;
  website: string;
};

type Snapshot = {
  onboarded: boolean;
  sessionId: string | null;
  users: Employer[];
  jobs: Requisition[];
  applications: Application[];
  referrals: Referral[];
  interviews: Interview[];
  activity: Activity[];
  notifications: Notice[];
  theme: ThemeMode;
};

type Store = Snapshot & {
  hydrated: boolean;
  user: Employer | null;
  jobs: Requisition[];
  applications: Application[];
  referrals: Referral[];
  interviews: Interview[];
  activity: Activity[];
  notifications: Notice[];
  candidates: typeof CANDIDATES;
  toasts: Toast[];
  pendingSignup: SignupInput | null;
  resetEmail: string;
  markOnboarded: () => void;
  login: (
    email: string,
    password: string,
    remember?: boolean,
  ) => { ok: true; setupDone: boolean } | { ok: false; reason: "invalid" | "pending" | "locked" };
  beginSignup: (input: SignupInput) => { ok: true } | { ok: false; reason: "exists" };
  verifyOtp: (code: string) => boolean;
  requestReset: (email: string) => boolean;
  resetPassword: (password: string) => boolean;
  logout: () => void;
  updateUser: (patch: Partial<Employer>) => void;
  saveJob: (draft: JobDraft, intent: "draft" | "publish" | "save", existingId?: string) => string;
  setJobStatus: (id: string, status: JobStatus) => void;
  deleteJob: (id: string) => void;
  duplicateJob: (id: string) => string;
  setApplicationStatus: (id: string, status: ApplicationStatus, extra?: Partial<Application>) => void;
  bulkApplicationStatus: (ids: string[], status: ApplicationStatus) => void;
  setReferralStatus: (id: string, status: ReferralStatus, extra?: Partial<Referral>) => void;
  scheduleInterview: (input: Omit<Interview, "id" | "ownerId">) => void;
  updateNotes: (candidateId: string, notes: string) => void;
  toggleShortlist: (candidateId: string) => void;
  addSavedSearch: (query: string) => void;
  removeSavedSearch: (id: string) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  removeNotification: (id: string) => void;
  inviteMember: (email: string, role: TeamRole) => void;
  removeMember: (id: string) => void;
  setTheme: (theme: ThemeMode) => void;
  payDueFees: () => number;
  addPaymentMethod: (kind: "card" | "ach", label: string, detail: string) => void;
  removePaymentMethod: (id: string) => void;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

const Ctx = createContext<Store | null>(null);
let skipSessionPersist = false;

function fresh(): Snapshot {
  return {
    onboarded: false,
    sessionId: null,
    users: [SEED_EMPLOYER, PENDING_EMPLOYER],
    jobs: SEED_JOBS,
    applications: SEED_APPLICATIONS,
    referrals: SEED_REFERRALS,
    interviews: SEED_INTERVIEWS,
    activity: SEED_ACTIVITY,
    notifications: SEED_NOTICES,
    theme: "light",
  };
}

function loadSnapshot(): Snapshot {
  const seen = seenOnboarding();
  const raw = readStorage(STORAGE_KEY);
  if (!raw) return { ...fresh(), onboarded: seen };
  try {
    const parsed = JSON.parse(raw) as Snapshot;
    if (!parsed.users?.some((user) => user.email === SEED_EMPLOYER.email)) {
      return { ...fresh(), onboarded: seen || Boolean(parsed.onboarded) };
    }
    const onboarded = Boolean(parsed.onboarded) || seen;
    if (onboarded) rememberOnboarding();
    return { ...fresh(), ...parsed, users: parsed.users, onboarded };
  } catch {
    return { ...fresh(), onboarded: seen };
  }
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function blankEmployer(input: SignupInput): Employer {
  const letter = input.companyName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return {
    ...SEED_EMPLOYER,
    id: `emp-${Date.now()}`,
    companyName: input.companyName,
    fullName: input.fullName,
    jobTitle: input.jobTitle,
    email: input.email.trim().toLowerCase(),
    phone: input.phone,
    password: input.password,
    companySize: input.companySize,
    industry: input.industry,
    website: input.website,
    description: "",
    logoLetter: letter || "BJ",
    address: "",
    city: "",
    state: "",
    founded: "",
    linkedin: "",
    hiringStates: [],
    hiringRoles: "",
    hiringVolume: "",
    setupDone: false,
    pendingApproval: false,
    shortlist: [],
    savedSearches: [],
    notes: {},
    team: [{ id: `t-${Date.now()}`, name: input.fullName, email: input.email.trim().toLowerCase(), role: "Admin" }],
    invoices: [],
    methods: [],
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [snap, setSnap] = useState<Snapshot>(fresh);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [pendingSignup, setPendingSignup] = useState<SignupInput | null>(null);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    const loaded = loadSnapshot();
    setSnap(loaded);
    const pending = readStorage("bonanza.employer.pending", true);
    const reset = readStorage("bonanza.employer.reset", true);
    if (pending) setPendingSignup(JSON.parse(pending) as SignupInput);
    if (reset) setResetEmail(reset);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const next = skipSessionPersist ? { ...snap, sessionId: null } : snap;
    const onboarded = next.onboarded || seenOnboarding();
    writeStorage(STORAGE_KEY, JSON.stringify({ ...next, onboarded }));
  }, [snap, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle("dark", dark);
    if (snap.theme === "dark") {
      apply(true);
      return;
    }
    if (snap.theme === "light") {
      apply(false);
      return;
    }
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    apply(media.matches);
    const onChange = () => apply(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [snap.theme, hydrated]);

  const user = snap.users.find((item) => item.id === snap.sessionId) ?? null;
  const ownerId = user?.id ?? "";

  const api = useMemo<Store>(() => {
    const pushToast = (title: string, body?: string) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { id, title, body }]);
      window.setTimeout(() => setToasts((list) => list.filter((item) => item.id !== id)), 3200);
    };

    const updateUser = (patch: Partial<Employer>) => {
      setSnap((current) => {
        if (!current.sessionId) return current;
        return {
          ...current,
          users: current.users.map((item) => (item.id === current.sessionId ? { ...item, ...patch } : item)),
        };
      });
    };

    const log = (jobId: string, text: string, currentOwner: string) => ({
      id: `ac-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ownerId: currentOwner,
      jobId,
      text,
      time: todayLabel(),
    });

    return {
      ...snap,
      hydrated,
      user,
      jobs: snap.jobs.filter((job) => job.ownerId === ownerId),
      applications: snap.applications.filter((item) => item.ownerId === ownerId),
      referrals: snap.referrals.filter((item) => item.ownerId === ownerId),
      interviews: snap.interviews.filter((item) => item.ownerId === ownerId),
      activity: snap.activity.filter((item) => item.ownerId === ownerId),
      notifications: snap.notifications.filter((item) => item.ownerId === ownerId),
      candidates: CANDIDATES,
      toasts,
      pendingSignup,
      resetEmail,
      markOnboarded: () => {
        rememberOnboarding();
        setSnap((current) => ({ ...current, onboarded: true }));
      },
      login: (email, password, remember = true) => {
        if (Date.now() < lockedUntil) return { ok: false, reason: "locked" };
        const found = snap.users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
        if (!found || found.password !== password) {
          const next = attempts + 1;
          setAttempts(next);
          if (next >= 5) setLockedUntil(Date.now() + 2 * 60 * 1000);
          return { ok: false, reason: "invalid" };
        }
        if (found.pendingApproval) return { ok: false, reason: "pending" };
        setAttempts(0);
        skipSessionPersist = !remember;
        setSnap((current) => ({ ...current, sessionId: found.id, onboarded: true }));
        return { ok: true, setupDone: found.setupDone };
      },
      beginSignup: (input) => {
        const email = input.email.trim().toLowerCase();
        if (snap.users.some((item) => item.email === email)) return { ok: false, reason: "exists" };
        setPendingSignup(input);
        writeStorage("bonanza.employer.pending", JSON.stringify(input), true);
        return { ok: true };
      },
      verifyOtp: (code) => {
        if (!pendingSignup || code.trim().length < 6) return false;
        const created = blankEmployer(pendingSignup);
        setSnap((current) => ({
          ...current,
          users: [...current.users, created],
          sessionId: created.id,
          onboarded: true,
        }));
        setPendingSignup(null);
        clearStorage("bonanza.employer.pending", true);
        return true;
      },
      requestReset: (email) => {
        const found = snap.users.some((item) => item.email === email.trim().toLowerCase());
        if (!found) return false;
        const value = email.trim().toLowerCase();
        setResetEmail(value);
        writeStorage("bonanza.employer.reset", value, true);
        return true;
      },
      resetPassword: (password) => {
        const email = resetEmail.trim().toLowerCase();
        const found = snap.users.find((item) => item.email === email);
        if (!found) return false;
        setSnap((current) => ({
          ...current,
          users: current.users.map((item) => (item.email === email ? { ...item, password } : item)),
        }));
        setResetEmail("");
        clearStorage("bonanza.employer.reset", true);
        return true;
      },
      logout: () => setSnap((current) => ({ ...current, sessionId: null })),
      updateUser,
      saveJob: (draft, intent, existingId) => {
        const id = existingId ?? `j-${Date.now()}`;
        const fee = Number(draft.referralFee) || 0;
        const parts = splitFee(fee);
        const next: Requisition = {
          id,
          ownerId,
          title: draft.title.trim(),
          department: draft.department,
          employmentType: draft.employmentType,
          workMode: draft.workMode,
          city: draft.city.trim(),
          state: draft.state,
          openings: draft.openings,
          description: draft.description.trim(),
          responsibilities: lines(draft.responsibilities),
          benefits: lines(draft.benefits),
          skills: draft.skills,
          experience: draft.experience,
          education: draft.education,
          certifications: draft.certifications,
          authorization: draft.authorization,
          salaryMin: Number(draft.salaryMin) || 0,
          salaryMax: Number(draft.salaryMax) || 0,
          payType: draft.payType,
          bonus: draft.bonus,
          referralFee: fee,
          feeIsPercent: draft.feeIsPercent,
          visibleToAgents: draft.visibleToAgents,
          deadline: draft.deadline,
          questions: draft.questions.filter(Boolean),
          status: intent === "publish" ? "Active" : intent === "draft" ? "Draft" : snap.jobs.find((job) => job.id === id)?.status ?? "Draft",
          posted: intent === "publish" ? todayLabel() : snap.jobs.find((job) => job.id === id)?.posted ?? "Not posted",
          lastEdited: todayLabel(),
        };
        void parts;
        setSnap((current) => ({
          ...current,
          jobs: current.jobs.some((job) => job.id === id)
            ? current.jobs.map((job) => (job.id === id ? { ...next, posted: intent === "publish" && job.posted === "Not posted" ? todayLabel() : intent === "save" ? job.posted : next.posted, status: intent === "save" ? job.status : next.status } : job))
            : [next, ...current.jobs],
          activity: [log(id, intent === "publish" ? "Requisition published" : "Requisition saved", ownerId), ...current.activity],
        }));
        return id;
      },
      setJobStatus: (id, status) => {
        const job = snap.jobs.find((item) => item.id === id);
        setSnap((current) => ({
          ...current,
          jobs: current.jobs.map((item) => (item.id === id ? { ...item, status, lastEdited: todayLabel() } : item)),
          activity: job ? [log(id, `${job.title} marked ${status}`, ownerId), ...current.activity] : current.activity,
        }));
      },
      deleteJob: (id) => {
        setSnap((current) => ({
          ...current,
          jobs: current.jobs.filter((job) => job.id !== id),
          applications: current.applications.filter((item) => item.jobId !== id),
          referrals: current.referrals.filter((item) => item.jobId !== id),
          interviews: current.interviews.filter((item) => item.jobId !== id),
        }));
      },
      duplicateJob: (id) => {
        const job = snap.jobs.find((item) => item.id === id);
        if (!job) return id;
        const copyId = `j-${Date.now()}`;
        setSnap((current) => ({
          ...current,
          jobs: [{ ...job, id: copyId, title: `${job.title} (Copy)`, status: "Draft", posted: "Not posted", lastEdited: todayLabel() }, ...current.jobs],
        }));
        return copyId;
      },
      setApplicationStatus: (id, status, extra) => {
        const appItem = snap.applications.find((item) => item.id === id);
        const person = CANDIDATES.find((item) => item.id === appItem?.candidateId);
        setSnap((current) => ({
          ...current,
          applications: current.applications.map((item) =>
            item.id === id ? { ...item, status, statusDate: todayLabel(), ...extra } : item,
          ),
          activity: appItem ? [log(appItem.jobId, `${person?.name ?? "Candidate"} moved to ${status}`, ownerId), ...current.activity] : current.activity,
        }));
      },
      bulkApplicationStatus: (ids, status) => {
        setSnap((current) => ({
          ...current,
          applications: current.applications.map((item) => (ids.includes(item.id) ? { ...item, status, statusDate: todayLabel() } : item)),
        }));
      },
      setReferralStatus: (id, status, extra) => {
        const referral = snap.referrals.find((item) => item.id === id);
        const person = CANDIDATES.find((item) => item.id === referral?.candidateId);
        setSnap((current) => ({
          ...current,
          referrals: current.referrals.map((item) => {
            if (item.id !== id) return item;
            const hired = status === "Hired";
            return {
              ...item,
              status,
              statusDate: todayLabel(),
              m1Status: hired ? "Due" : item.m1Status,
              m2Status: hired ? "Pending" : item.m2Status,
              m2Due: hired ? "90 days after start" : item.m2Due,
              ...extra,
            };
          }),
          activity: referral
            ? [log(referral.jobId, `${person?.name ?? "Referral"} moved to ${status}`, ownerId), ...current.activity]
            : current.activity,
        }));
      },
      scheduleInterview: (input) => {
        const person = CANDIDATES.find((item) => item.id === input.candidateId);
        setSnap((current) => ({
          ...current,
          interviews: [{ ...input, id: `i-${Date.now()}`, ownerId }, ...current.interviews],
          applications: current.applications.map((item) =>
            item.candidateId === input.candidateId && item.jobId === input.jobId && item.status !== "Hired"
              ? { ...item, status: "Interview", statusDate: todayLabel() }
              : item,
          ),
          referrals: current.referrals.map((item) =>
            item.candidateId === input.candidateId && item.jobId === input.jobId && item.status !== "Hired"
              ? { ...item, status: "Interview", statusDate: todayLabel() }
              : item,
          ),
          activity: [log(input.jobId, `Interview requested with ${person?.name ?? "candidate"}`, ownerId), ...current.activity],
        }));
      },
      updateNotes: (candidateId, notes) => {
        if (!user) return;
        updateUser({ notes: { ...user.notes, [candidateId]: notes } });
      },
      toggleShortlist: (candidateId) => {
        if (!user) return;
        const has = user.shortlist.includes(candidateId);
        updateUser({ shortlist: has ? user.shortlist.filter((id) => id !== candidateId) : [candidateId, ...user.shortlist] });
      },
      addSavedSearch: (query) => {
        if (!user) return;
        const trimmed = query.trim();
        if (!trimmed) return;
        updateUser({
          savedSearches: [{ id: `ss-${Date.now()}`, label: trimmed, query: trimmed }, ...user.savedSearches.filter((item) => item.query !== trimmed)],
        });
      },
      removeSavedSearch: (id) => {
        if (!user) return;
        updateUser({ savedSearches: user.savedSearches.filter((item) => item.id !== id) });
      },
      markAllRead: () =>
        setSnap((current) => ({
          ...current,
          notifications: current.notifications.map((item) => (item.ownerId === ownerId ? { ...item, read: true } : item)),
        })),
      markRead: (id) =>
        setSnap((current) => ({
          ...current,
          notifications: current.notifications.map((item) => (item.id === id ? { ...item, read: true } : item)),
        })),
      removeNotification: (id) =>
        setSnap((current) => ({ ...current, notifications: current.notifications.filter((item) => item.id !== id) })),
      inviteMember: (email, role) => {
        if (!user) return;
        const name = email.split("@")[0]?.replace(/\./g, " ") ?? "Teammate";
        updateUser({
          team: [...user.team, { id: `t-${Date.now()}`, name: name.replace(/\b\w/g, (char) => char.toUpperCase()), email, role }],
        });
      },
      removeMember: (id) => {
        if (!user) return;
        updateUser({ team: user.team.filter((item) => item.id !== id) });
      },
      setTheme: (theme) => setSnap((current) => ({ ...current, theme })),
      payDueFees: () => {
        const due = snap.referrals.filter((item) => item.ownerId === ownerId && (item.m1Status === "Due" || item.m2Status === "Due"));
        const total = due.reduce(
          (sum, item) => sum + (item.m1Status === "Due" ? item.milestone1 : 0) + (item.m2Status === "Due" ? item.milestone2 : 0),
          0,
        );
        if (!total) return 0;
        setSnap((current) => ({
          ...current,
          referrals: current.referrals.map((item) => {
            if (item.ownerId !== ownerId) return item;
            let next = item;
            if (item.m1Status === "Due") next = { ...next, m1Status: "Paid", status: next.status === "Hired" ? "Referral Fee Earned" : next.status };
            if (item.m2Status === "Due") next = { ...next, m2Status: "Paid", status: "Paid" };
            return next;
          }),
          users: current.users.map((item) =>
            item.id === ownerId
              ? {
                  ...item,
                  invoices: [{ id: `in-${Date.now()}`, date: todayLabel(), amount: total, status: "Paid" as const, label: "Referral fees" }, ...item.invoices],
                }
              : item,
          ),
        }));
        return total;
      },
      addPaymentMethod: (kind, label, detail) => {
        if (!user) return;
        updateUser({ methods: [...user.methods, { id: `pm-${Date.now()}`, kind, label, detail }] });
      },
      removePaymentMethod: (id) => {
        if (!user) return;
        updateUser({ methods: user.methods.filter((item) => item.id !== id) });
      },
      pushToast,
      dismissToast: (id) => setToasts((list) => list.filter((item) => item.id !== id)),
    };
  }, [snap, hydrated, user, ownerId, toasts, pendingSignup, resetEmail, lockedUntil, attempts]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const value = useContext(Ctx);
  if (!value) throw new Error("useApp must be used within AppProvider");
  return value;
}
