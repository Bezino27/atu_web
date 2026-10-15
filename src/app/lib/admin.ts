const rawAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL;

function getConfiguredAdminUrl() {
  const candidate = rawAdminUrl?.trim();

  if (candidate) {
    try {
      const url = new URL(candidate);

      if (process.env.NODE_ENV !== "production" || url.protocol === "https:") {
        return url.toString().replace(/\/$/, "");
      }
    } catch {
      // Fall through to the environment-specific safe value.
    }
  }

  return process.env.NODE_ENV === "production" ? null : "http://localhost:5173";
}

export const ADMIN_URL = getConfiguredAdminUrl();
