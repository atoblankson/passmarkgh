export type PaystackApiMode = "test" | "live";

export interface AdminSettings {
  paystackMode: PaystackApiMode;
  testSecretKey: string;
  liveSecretKey: string;
  updatedAt: string;
}

export const ADMIN_SETTINGS_STORAGE_KEY = "passmark_admin_settings";
export const ADMIN_MODE_COOKIE_KEY = "pm_paystack_mode";

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  paystackMode: "test",
  testSecretKey: "",
  liveSecretKey: "",
  updatedAt: new Date().toISOString(),
};

export function getLocalAdminSettings(): AdminSettings {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_SETTINGS;
  }

  try {
    const raw = localStorage.getItem(ADMIN_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      paystackMode: parsed.paystackMode === "live" ? "live" : "test",
      testSecretKey: parsed.testSecretKey || DEFAULT_ADMIN_SETTINGS.testSecretKey,
      liveSecretKey: parsed.liveSecretKey || "",
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export function saveLocalAdminSettings(settings: Partial<AdminSettings>): AdminSettings {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_SETTINGS;
  }

  try {
    const current = getLocalAdminSettings();
    const updated: AdminSettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_SETTINGS_STORAGE_KEY, JSON.stringify(updated));

    // Also sync cookie for server route awareness
    document.cookie = `${ADMIN_MODE_COOKIE_KEY}=${updated.paystackMode}; path=/; max-age=31536000; SameSite=Lax`;

    // Dispatch storage event so topbar updates across tabs or views immediately
    window.dispatchEvent(new Event("admin_settings_changed"));

    return updated;
  } catch (err) {
    console.error("Error saving admin settings:", err);
    return DEFAULT_ADMIN_SETTINGS;
  }
}
