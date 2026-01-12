// ~/store/userAuth.js
import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import Cookies from "js-cookie";
import Swal from "sweetalert2"
import { useRouter, useRoute } from 'vue-router'

function decodeJwtExp(token) {
  if (!token) return null;
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const json =
      typeof window === "undefined"
        ? Buffer.from(base64, "base64").toString("utf-8")
        : atob(base64);
    const payload = JSON.parse(json);
    return typeof payload?.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

// safe getter for localStorage user (client-only)
function getStoredUser() {
  if (process.client) {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }
  return null;
}

export const userAuth = defineStore("userAuth", {
  state: () => ({
    // token stays in cookie so server requests can still be authed if you forward it
    token: Cookies.get("token") || null,

    // IMPORTANT: hydrate user immediately on client so UI can render after refresh
    user: getStoredUser(),

    isLoggedIn: false,

    // internal guards
    _initDone: false,
    _refreshing: false,
    _refreshPromise: null,
  }),

  actions: {
    _syncAxiosAuthHeader(token) {
      const { $AdminPrivateAxios } = useNuxtApp();
      if ($AdminPrivateAxios) {
        if (token) {
          $AdminPrivateAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
          delete $AdminPrivateAxios.defaults.headers.common.Authorization;
        }
      }
    },

    setUser(user) {
      this.user = user || null;
      if (process.client) {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      }
    },

    setToken(token) {
      if (token) {
        Cookies.set("token", token, { sameSite: "lax", secure: true, path: "/" });
      } else {
        Cookies.remove("token");
      }
      this.token = token || null;
      this._syncAxiosAuthHeader(this.token);
    },

    getToken() {
      return Cookies.get("token") || null;
    },

    getUser() {
      // return reactive state first; fallback to storage if needed
      return this.user ?? getStoredUser() ?? null;
    },

    async loginWithTelegram(telegramUser) {
    const { $AdminPublicAxios } = useNuxtApp()

    if (!$AdminPublicAxios) {
      console.error("AdminPublicAxios not initialized")
      return
    }

    // ✅ Ensure device token (client only)
    if (process.client && !localStorage.getItem("device_token")) {
      const uuid =
        crypto?.randomUUID?.() ??
        Math.random().toString(36).substring(2)
      localStorage.setItem("device_token", uuid)
    }

    const payload = {
      id: telegramUser.id,
      first_name: telegramUser.first_name ?? null,
      last_name: telegramUser.last_name ?? null,
      username: telegramUser.username ?? null,
      photo_url: telegramUser.photo_url ?? null,
      auth_date: telegramUser.auth_date,
      hash: telegramUser.hash,
      token: localStorage.getItem("device_token"),
      platform: "web",
    }

    try {
      const resp = await $AdminPublicAxios.post(
        "/auth/telegram/verify",
        payload
      )

      console.log("Telegram verify response:", resp.data)

      const { token, user } = resp.data || {}

      if (!token || !user) {
        throw new Error("Invalid response from server")
      }
      console.log('token')

      // ✅ Save auth state
      this.setToken(token)
      this.setUser(user)
      this.isLoggedIn = true

      navigateTo("/");

    } catch (err) {
      console.error("Telegram login failed:", err?.response?.data || err)

      Swal.fire({
        title: "Login failed",
        text: err?.response?.data?.message || "Telegram authentication error",
        icon: "error",
        timer: 2000,
      })
    }
  },

    async login(email, password) {
      const { $AdminPublicAxios } = useNuxtApp();

      const resp = await $AdminPublicAxios.post("/login", { email, password });
      if (resp.status !== 200) {
        throw new Error(`Error: Received status code ${resp.status}`);
      }

      const token = resp?.data?.data?.token;
      const user = resp?.data?.data?.user;

      this.setUser(user);
      this.setToken(token);
      this.isLoggedIn = true;

      navigateTo("/");
    },

    async logout() {
      const { $AdminPrivateAxios } = useNuxtApp();
      try {
        await $AdminPrivateAxios.post("/logout");
      } catch {
        // ignore
      }
      this.setToken(null);
      this.setUser(null);
      this.isLoggedIn = false;
      navigateTo("/auth");
    },

    async refreshToken() {
      // prevent concurrent refreshes
      if (this._refreshing && this._refreshPromise) return this._refreshPromise;

      const run = async () => {
        const { $AdminPrivateAxios } = useNuxtApp();
        if (!this.token) return null;

        try {
          const resp = await $AdminPrivateAxios.post("/refresh-token");
          // support either {data:"jwt"} or {data:{token:"jwt"}}
          const nextToken =
            typeof resp?.data?.data === "string"
              ? resp.data.data
              : resp?.data?.data?.token;

          if (!nextToken) return null;

          this.setToken(nextToken);
          this.isLoggedIn = true;
          return nextToken;
        } catch (e) {
          this.setToken(null);
          this.isLoggedIn = false;
          return null;
        }
      };

      this._refreshing = true;
      this._refreshPromise = run().finally(() => {
        this._refreshing = false;
        this._refreshPromise = null;
      });
      return this._refreshPromise;
    },

    async checkTokenExpired() {
      // always re-read cookie first
      this.token = this.getToken();
      this._syncAxiosAuthHeader(this.token);

      if (!this.token) {
        this.isLoggedIn = false;
        return false;
      }

      const exp = decodeJwtExp(this.token);
      const now = Math.floor(Date.now() / 1000);

      if (!exp || exp <= now) {
        this.isLoggedIn = false;
        return false;
      }

      // refresh if expiring within 2 days
      const REFRESH_THRESHOLD_SECONDS = 3600 * 24 * 2; // 2 days
      if (exp - now < REFRESH_THRESHOLD_SECONDS) {
        await this.refreshToken();
        const freshExp = decodeJwtExp(this.token);
        if (!freshExp || freshExp <= Math.floor(Date.now() / 1000)) {
          this.isLoggedIn = false;
          return false;
        }
      }

      this.isLoggedIn = true;
      return true;
    },

    async initializeSession() {
      if (this._initDone) return;

      // 1) hydrate from storage immediately (client)
      if (process.client) {
        const storedUser = getStoredUser();
        if (storedUser) this.user = storedUser;

        // keep tabs in sync
        window.addEventListener("storage", (e) => {
          if (e.key === "user") {
            try {
              this.user = e.newValue ? JSON.parse(e.newValue) : null;
            } catch {
              this.user = null;
            }
          }
        });
      }

      // 2) hydrate token and validate it
      this.token = this.getToken();
      this._syncAxiosAuthHeader(this.token);

      if (!this.token) {
        this.isLoggedIn = false;
        this._initDone = true;
        return;
      }

      await this.checkTokenExpired();

      // 3) If token valid but user missing (e.g., storage cleared), optionally fetch profile
      if (this.isLoggedIn && !this.user) {
        try {
          const { $AdminPrivateAxios } = useNuxtApp();
          const me = await $AdminPrivateAxios.get("/me"); // adjust to your profile endpoint
          // accept either {data:{...}} or flat {...}
          const u = me?.data?.data ?? me?.data ?? null;
          if (u) this.setUser(u);
        } catch {
          // if /me fails, consider user not logged in
          this.isLoggedIn = false;
          this.setToken(null);
        }
      }

      this._initDone = true;
    },
  },
});
