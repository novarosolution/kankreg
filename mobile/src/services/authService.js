import { apiPost } from "./apiClient";

const publicOpts = { auth: false };

export function registerRequest({ name, email, password }) {
  return apiPost("/users/register", { name, email, password }, publicOpts);
}

export function loginRequest({ email, password }) {
  return apiPost("/users/login", { email, password }, publicOpts);
}

export function googleAuthRequest({ idToken }) {
  return apiPost("/users/auth/google", { idToken }, publicOpts);
}

export function appleAuthRequest({ identityToken, fullName }) {
  return apiPost("/users/auth/apple", { identityToken, fullName }, publicOpts);
}
