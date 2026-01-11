<template>
  <!-- Social Icons -->
  <div class="d-flex align-center mt-6" style="gap: 16px;">
    <a
        v-for="(icon, index) in icons"
        :key="index"
        :href="icon.link"
        target="_blank"
        rel="noopener"
    >
      <img :src="getSvg(icon.name)" width="24" height="24" :alt="icon.name"/>
    </a>
  </div>
</template>

<script setup>
const icons = [
  {name: 'icons8-facebook', link: 'https://www.facebook.com/profile.php?id=61576619556619'},
  {name: 'icons8-telegram', link: 'https://t.me/OneDash168'},
  {name: 'icons8-instagram', link: 'https://www.instagram.com/onedash_kh?igsh=MWl1N2ZveGJwNjhjbQ=='},
  {name: 'icons8-whatsapp', link: 'https://api.whatsapp.com/message/3CPARDI7EEZTJ1?autoload=1&app_absent=0'},
];

function getSvg(name) {
  return `/icons/${name}.svg`;
}
</script>