export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^1/, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function money(amount: number, unit: "yr" | "hr") {
  if (unit === "hr") return `$${amount}`;
  return `$${amount.toLocaleString("en-US")}`;
}

export function salaryLabel(min: number, max: number, unit: "yr" | "hr") {
  const period = unit === "yr" ? "yr" : "hr";
  return `${money(min, unit)} – ${money(max, unit)} / ${period}`;
}

export function postedLabel(days: number) {
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 14) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function annualMin(min: number, unit: "yr" | "hr") {
  return unit === "hr" ? min * 2080 : min;
}

export function annualMax(max: number, unit: "yr" | "hr") {
  return unit === "hr" ? max * 2080 : max;
}

export function milesBetween(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const lat1 = a.lat * rad;
  const lat2 = b.lat * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * 3958.8 * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function passwordScore(password: string) {
  const rules = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
  ];
  return { rules, score: rules.filter(Boolean).length };
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function haptic() {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(12);
  }
}

export function usd(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function payLabel(min: number, max: number, unit: "annual" | "hourly") {
  const period = unit === "hourly" ? "hr" : "yr";
  const fmt = (value: number) => (unit === "hourly" ? `$${value}` : `$${value.toLocaleString("en-US")}`);
  return `${fmt(min)} – ${fmt(max)} / ${period}`;
}
