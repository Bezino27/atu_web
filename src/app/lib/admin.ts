const rawAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

const fallbackAdminUrl =
  process.env.NODE_ENV === "production"
    ? "http://178.104.54.84:4173"
    : "http://localhost:5173";

export const ADMIN_URL = (rawAdminUrl || fallbackAdminUrl).replace(/\/$/, "");
