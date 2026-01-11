// plugins/sweetalert.client.ts
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export default defineNuxtPlugin((nuxtApp) => {
  // expose as $swalRaw to avoid clashing with $alert
  nuxtApp.provide('swalRaw', Swal)
})
