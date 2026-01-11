import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { watch } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {

            // fire_bush: '#E19B3A',

            // #7BCBFC
            primary     : '#36667d',
            secondary   : '#20334F',
            maya_blue   : '#7BCBFC',
            blue        : '#2237f5',
            accent      : '#82B1FF',
            white       : '#FFFFFF',
            black       : '#000000',
            error       : '#DF3131',
            info        : '#2196F3',
            success     : '#4CAF50',
            warning     : '#FFC107',
            royal_blue  : '#4667E5',
            sonic_silver: '#757575',   //continue text
            mercury     : '#EBEBEB',
            hex         : '#b6b2b2',
            onyx        : '#373737',
            water       : '#EFF2FE',
            Neon_carrot : '#f4a641',
            

          },
        },
        dark: {
          colors: {


            primary: '#90CAF9',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',

          },
        },
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);

  // Automatically apply theme colors as CSS variables
  const theme = vuetify.theme.global;
  function applyThemeColors() {
    const colors = theme.current.value.colors;
    for (const [key, value] of Object.entries(colors)) {
      document.documentElement.style.setProperty(`--v-${key}`, value);
    }
  }

  applyThemeColors(); // Apply on load

  // Watch for theme changes and update CSS variables dynamically
  watch(() => theme.current.value, () => {
    applyThemeColors();
  });
});