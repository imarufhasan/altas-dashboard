import { dummyDashboardData, dummySettings, dummyUser } from "./dummy-data";
import { AdminUser, DashboardData, SiteSettings } from "@/src/types";
import { PasswordChangePayload, ApiResult } from "@/src/types";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDashboardData(): Promise<DashboardData> {
  await wait(900);
  return dummyDashboardData;
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  await wait(800);
  return dummySettings;
}

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
  success: boolean;
  message: string;
  user?: AdminUser;
  token?: string;
};

export async function loginRequest({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> {
  await wait(1100);

  if (!email.trim() || !password.trim()) {
    return { success: false, message: "Email and password are required." };
  }

  if (!email.includes("@")) {
    return { success: false, message: "Enter a valid email address." };
  }

  if (password.length < 6) {
    return { success: false, message: "Incorrect email or password." };
  }

  return {
    success: true,
    message: "Signed in successfully.",
    user: dummyUser,
    token: "dummy-jwt-token-atlas-admin",
  };
}

export type UpdateSettingsResponse = {
  success: boolean;
  message: string;
  data?: SiteSettings;
};

export async function updateSiteSettings(
  payload: SiteSettings,
): Promise<UpdateSettingsResponse> {
  await wait(1000);

  if (!payload.publicContactEmail.includes("@lmcs")) {
    return { success: false, message: "Invalid institutional email format" };
  }

  return {
    success: true,
    message: "Settings updated successfully.",
    data: payload,
  };
}

export async function updatePassword(
  payload: PasswordChangePayload,
): Promise<ApiResult> {
  await new Promise((r) => setTimeout(r, 900));

  if (payload.currentPassword.length < 4) {
    return { success: false, message: "Current password is incorrect." };
  }

  return { success: true, message: "Your password has been updated." };
}
