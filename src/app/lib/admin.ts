const rawAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

const fallbackAdminUrl =
  process.env.NODE_ENV === "production"
    ? "https://admin.atukosice.sk"
    : "http://localhost:5173";

export const ADMIN_URL = (rawAdminUrl || fallbackAdminUrl).replace(/\/$/, "");
