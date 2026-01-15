// utils/pageHelper.js
import { useNuxtApp } from '#app'


export function formatDate(val) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12; h = h ? h : 12
  const hh = String(h).padStart(2, '0')
  return `${dd}-${mm}-${yyyy} | ${hh}:${m} ${ampm}`
}

export function toStartMs(val) {
    const d = toDate(val)
    if (!d) return undefined
    // normalize to that day's local midnight
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime()
}

export function toEndMs(val) {
    const d = toDate(val)
    if (!d) return undefined
    // end of that day in local time
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime()
}


export function getLangText(val) {
  if (!val) return ''
  const nuxtApp = useNuxtApp()
  const lang = nuxtApp.$currentLang
  const parts = val.split('||')
  const code = (lang && 'value' in lang ? lang.value : lang) || 'en'
  return parts[code === 'km' ? 1 : 0] || parts[0]
}

export function getLangParagraphs(val) {
  const text = getLangText(val)
  if (!text) return []
  return text.split(/\n+/) 
}