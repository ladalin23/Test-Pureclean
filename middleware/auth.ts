import { defineNuxtRouteMiddleware, navigateTo } from "#app";
import { userAuth } from "~/store/userAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = userAuth();

  // init once
  await auth.initializeSession();

  // single validity check (may refresh once)
  const hasToken = !!auth.getToken();
  const isValid = hasToken ? await auth.checkTokenExpired() : false;

  if (isValid && to.path === "/auth") {
    return navigateTo("/");
  }

  if (!isValid && to.path !== "/auth") {
    return navigateTo("/auth");
  }
});
