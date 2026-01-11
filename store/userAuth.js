// ~/store/userAuth.js
import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import Cookies from "js-cookie";

/**
 * Decode JWT exp safely (SSR + client)
 */
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

/**
 * Safe localStorage user getter (client-only)
 */
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
    token: Cookies.get("token") || null,
    user: getStoredUser(),
    isLoggedIn: false,

    _initDone: false,
    _refreshing: false,
    _refreshPromise: null,
  }),

  actions: {
    /**
     * Sync axios Authorization header
     */
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
        Cookies.set("token", token, {
          sameSite: "lax",
          secure: true,
          path: "/",
        });
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
      return this.user ?? getStoredUser() ?? null;
    },

    /**
     * EMAIL / PASSWORD LOGIN
     */
    async login(email, password) {
      const { $AdminPublicAxios } = useNuxtApp();

      const resp = await $AdminPublicAxios.post("/login", {
        email,
        password,
      });

      if (resp.status !== 200) {
        throw new Error("Login failed");
      }

      const token = resp?.data?.data?.token;
      const user = resp?.data?.data?.user;

      this.setToken(token);
      this.setUser(user);
      this.isLoggedIn = true;

      navigateTo("/");
    },

    /**
     * TELEGRAM LOGIN (NEW)
     */
    async loginWithTelegram(telegramUser) {
      const { $AdminPublicAxios } = useNuxtApp();

      // Ensure device token exists (web)
      if (process.client && !localStorage.getItem("device_token")) {
        localStorage.setItem("device_token", crypto.randomUUID());
      }

      const payload = {
        id: telegramUser.id,
        first_name: telegramUser.first_name || null,
        last_name: telegramUser.last_name || null,
        username: telegramUser.username || null,
        photo_url: telegramUser.photo_url || null,
        auth_date: telegramUser.auth_date,
        hash: telegramUser.hash,

        // required by backend
        token: localStorage.getItem("device_token"),
        platform: "web",
      };

      const resp = await $AdminPublicAxios.post(
        "/auth/telegram/verify",
        payload
      );

      if (resp.status !== 200) {
        throw new Error("Telegram login failed");
      }

      const token = resp?.data?.token;
      const user = resp?.data?.user;

      this.setToken(token);
      this.setUser(user);
      this.isLoggedIn = true;

      const route = useRoute();
      navigateTo(route.query.next || "/");
    },

    /**
     * LOGOUT
     */
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

    /**
     * TOKEN REFRESH
     */
    async refreshToken() {
      if (this._refreshing && this._refreshPromise) {
        return this._refreshPromise;
      }

      const run = async () => {
        const { $AdminPrivateAxios } = useNuxtApp();
        if (!this.token) return null;

        try {
          const resp = await $AdminPrivateAxios.post("/refresh-token");

          const nextToken =
            typeof resp?.data?.data === "string"
              ? resp.data.data
              : resp?.data?.data?.token;

          if (!nextToken) return null;

          this.setToken(nextToken);
          this.isLoggedIn = true;
          return nextToken;
        } catch {
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

    /**
     * CHECK TOKEN EXPIRATION
     */
    async checkTokenExpired() {
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

      const REFRESH_THRESHOLD = 3600 * 24 * 2;
      if (exp - now < REFRESH_THRESHOLD) {
        await this.refreshToken();
      }

      this.isLoggedIn = true;
      return true;
    },

    /**
     * INITIALIZE SESSION (APP START)
     */
    async initializeSession() {
      if (this._initDone) return;

      if (process.client) {
        const storedUser = getStoredUser();
        if (storedUser) this.user = storedUser;

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

      this.token = this.getToken();
      this._syncAxiosAuthHeader(this.token);

      if (!this.token) {
        this.isLoggedIn = false;
        this._initDone = true;
        return;
      }

      await this.checkTokenExpired();

      if (this.isLoggedIn && !this.user) {
        try {
          const { $AdminPrivateAxios } = useNuxtApp();
          const me = await $AdminPrivateAxios.get("/me");
          const u = me?.data?.data ?? me?.data ?? null;
          if (u) this.setUser(u);
        } catch {
          this.isLoggedIn = false;
          this.setToken(null);
        }
      }

      this._initDone = true;
    },
  },
});
