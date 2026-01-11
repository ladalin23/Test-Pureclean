// plugins/alert.client.ts
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

type Mode = 'ok' | 'error' | 'update'
type LaravelErrorPayload = { message?: string; errors?: Record<string, string[]> }

export default defineNuxtPlugin(() => {
  const escapeHtml = (s: string) => String(s ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  const collectErrorValues = (payload?: any): string[] => {
    const errs = payload?.errors
    if (!errs || typeof errs !== 'object') return []
    return Array.from(new Set(Object.values(errs).flat().filter(Boolean).map((s) => String(s).trim())))
  }

  const normalizeError = (err: any) => {
    const status = err?.response?.status ?? err?.status ?? null
    const data: LaravelErrorPayload | string =
      err?.response?.data && typeof err.response.data === 'object'
        ? err.response.data
        : err?.response?.data || err

    if (typeof data === 'string') return { status, message: data, details: [] as string[] }
    const message = (data as LaravelErrorPayload)?.message || err?.message || 'Request failed'
    const details = collectErrorValues(data)
    return { status, message, details }
  }

  // Build centered, line-by-line HTML (no bullets)
  const buildCenteredLines = (lines: string[]) => {
    const safe = lines.map(escapeHtml)
    return `<div class="swal-lines">${safe.map((m) => `<div class="swal-line">${m}</div>`).join('')}</div>`
  }

  // Base with nicer defaults
  const base = (lines: string[], mode: Mode = 'ok', title?: string) => {
    const modeOpts =
      mode === 'ok'
        ? { icon: 'success' as const, title: title || 'Success', confirmButtonColor: '#16a34a' }
        : mode === 'error'
        ? { icon: 'error' as const, title: title || 'Validation error', confirmButtonColor: '#dc2626' }
        : { icon: 'info' as const, title: title || 'Done', confirmButtonColor: '#2563eb' }

    return Swal.fire({
      ...modeOpts,
      html: buildCenteredLines(lines),
      allowOutsideClick: true,
      allowEscapeKey: true,
      focusConfirm: true,
      confirmButtonText: 'OK',
      heightAuto: false, // avoid layout jump
      showClass: { popup: 'swal2-show swal-zoom-in' },
      hideClass: { popup: 'swal2-hide swal-zoom-out' },
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        htmlContainer: 'swal-html',
        confirmButton: 'swal-confirm',
      },
    })
  }

  // public API
  const $alert = (payload: any, mode: Mode = 'ok', title?: string) => {
    // axios/Laravel error → extract details, fall back to message
    if (payload && (payload.response || payload.errors || payload.message)) {
      const n = normalizeError(payload)
      const lines = n.details.length ? n.details : [n.message]
      return base(lines, 'error', title)
    }
    // string or string[]
    const lines = Array.isArray(payload) ? payload : [String(payload ?? '')]
    return base(lines, mode, title)
  }

  $alert.ok = (text: string | string[], title?: string) =>
    base(Array.isArray(text) ? text : [text], 'ok', title)
  $alert.error = (what: any, title?: string) => $alert(what, 'error', title)
  $alert.update = (text: string | string[], title?: string) =>
    base(Array.isArray(text) ? text : [text], 'update', title)

  $alert.confirm = async (
    text = 'Are you sure?',
    title = 'Confirm',
    confirmText = 'Yes',
    cancelText = 'Cancel'
  ) => {
    const res = await Swal.fire({
      icon: 'question',
      title,
      html: buildCenteredLines([text]),
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#6b7280',
      focusCancel: true,
      heightAuto: false,
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        htmlContainer: 'swal-html',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel',
      },
    })
    return res.isConfirmed
  }

  $alert.toast = (title = 'Saved', icon: 'success' | 'error' | 'info' | 'warning' = 'success') =>
    Swal.fire({
      toast: true,
      position: 'top-end',
      timer: 2400,
      showConfirmButton: false,
      icon,
      title,
      customClass: { popup: 'swal-toast' },
    })

  return { provide: { alert: $alert } }
})
