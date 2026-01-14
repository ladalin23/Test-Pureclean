<template>
  <div ref="telegramWrapper"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const telegramWrapper = ref(null);

// Define the callback function on the window object 
// so the external Telegram script can find it
onMounted(() => {
  window.onTelegramAuth = (user) => {
    alert(`Logged in as ${user.first_name} (${user.id})`);
    console.log('User data:', user);
    // You can emit an event or push to your store here
  };

  // Create the script element dynamically
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  
  // Set the attributes from your snippet
  script.setAttribute('data-telegram-login', 'testpurecleanbot');
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-onauth', 'onTelegramAuth(user)');
  script.setAttribute('data-request-access', 'write');

  // Append it to the wrapper
  telegramWrapper.value.appendChild(script);
});
</script>