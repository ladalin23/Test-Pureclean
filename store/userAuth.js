import { defineStore } from "pinia";
import { useNuxtApp, navigateTo, useRoute } from "#app";
import Cookies from "js-cookie";

export const userAuth = defineStore("userAuth", {
  state: () => ({
    token: Cookies.get("token") || null,
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    setUser(user) {
      this.user = user;
    },

    setToken(token) {
      this.token = token;
      if (token) Cookies.set("token", token, { sameSite: "lax", secure: true, path: "/" });
      else Cookies.remove("token");
    },

    getToken() {
      return Cookies.get("token");
    },

    getUser() {
      return this.user;
    },

    logout() {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;
      Cookies.remove("token");
      navigateTo("/auth");
    },

    async loginWithTelegram(telegramUser) {
      const nuxtApp = useNuxtApp();
      const $axios = nuxtApp.$AdminPublicAxios;
      if (!$axios) throw new Error("Axios not initialized");

      if (process.client && !localStorage.getItem("device_token")) {
        localStorage.setItem("device_token", crypto.randomUUID());
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
      };

      try {
        const resp = await $axios.post("/auth/telegram/verify", payload);

        console.log("Telegram verify response:", resp.data); // <--- important

        const token = resp.data.token; // make sure this matches Laravel response
        const user = resp.data.user;  // make sure this exists

        if (!token || !user) throw new Error("Invalid response from server");

        this.setToken(token);
        this.setUser(user);
        this.isLoggedIn = true;

        const route = useRoute();
        navigateTo(route.query.next || "/");

      } catch (err) {
        console.error("Telegram login failed:", err);

        // SweetAlert
        import("sweetalert2").then(({ default: Swal }) => {
          Swal.fire({
            title: "Login failed",
            text: "Telegram authentication error",
            icon: "error",
            timer: 2000,
          });
        });
      }
    },

    async refreshToken() {
      try {
        const nuxtApp = useNuxtApp();
        const $axios = nuxtApp.$AdminPrivateAxios;
        if (!$axios) throw new Error("Axios not initialized");

        const resp = await $axios.post("/refresh-token");
        const token = resp.data?.data;
        if (!token) {
          this.logout();
          return;
        }

        this.setToken(token);
        this.isLoggedIn = true;
      } catch {
        this.logout();
      }
    },

    async checkTokenExpired() {
      this.token = this.getToken();
      if (!this.token) {
        this.logout();
        return false;
      }

      try {
        const payloadBase64 = this.token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        const currentTime = Date.now() / 1000;

        if (payload.exp && payload.exp < currentTime) {
          this.logout();
          return false;
        }

        this.isLoggedIn = true;
        return true;
      } catch {
        this.logout();
        return false;
      }
    },

    initializeSession() {
      this.token = this.getToken();

      if (!this.token) {
        this.logout();
        return;
      }

      this.checkTokenExpired().then((isValid) => {
        if (!isValid) this.logout();
      });
    },
  },
});
