// utils/scan-qr.js

/** @returns {boolean} */
export function isUuidLike(s) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    .test(s?.trim?.() || '')
}

/** Extract numeric id from "PCL-1001" or "1001" */
export function extractNumericId(text) {
  const t = String(text || '')
  if (t.includes('-')) {
    const parts = t.split('-')
    const digits = parts[1]?.match(/\d+/)?.[0]
    return digits ? Number(digits) : null
  }
  const digits = t.match(/^\d+$/)?.[0]
  return digits ? Number(digits) : null
}

/** Build server params for /users */
export function buildUserParams(q) {
  const base = { page: 1, limit: 10, sort_by: 'created_at', sort_dir: 'desc' }
  const text = String(q || '').trim()
  if (!text) return base

  const id = extractNumericId(text)
  if (id) return { ...base, filter_by: { u_id: id } }

  if (isUuidLike(text)) return { ...base, filter_by: { global_id: text } }

  return { ...base, search: text, columns: ['username', 'u_id'] }
}

/**
 * Normalize various list shapes to an array of user objects
 * Accepts Axios response .data or the full Axios response; handles {data}, {data:{data:[]}}, or [].
 */
export function normalizeUserResponse(payload) {
  const d = payload?.data !== undefined ? payload.data : payload
  const arr =
    Array.isArray(d) ? d :
    Array.isArray(d?.data) ? d.data :
    Array.isArray(d?.data?.data) ? d.data.data :
    []
  return arr.map(r => ({
    id: r.id ?? r._id ?? null,
    global_id: r.global_id || r.gid || r.id || '',
    u_id: Number(r.u_id ?? r.uid ?? r.user_id ?? 0),
    username: r.username ?? r.name ?? '',
  })).filter(u => u.global_id && u.username)
}

/** Parse QR payloads: "gid:uid:username", JSON, or "k:v,k:v" */
export function parseQRPayload(input) {
  if (!input) throw new Error('Empty QR payload')
  let text = String(input).trim().replace(/^Last result:\s*/i, '')

  // URL-decoded JSON support
  if (/%[0-9A-Fa-f]{2}/.test(text)) { try { text = decodeURIComponent(text) } catch {} }

  // gid:uid:username
  const parts = text.split(':')
  if (parts.length >= 3 && !text.startsWith('{')) {
    const [gid, uid, ...rest] = parts
    if (isUuidLike(gid)) {
      const parsedUid = Number(uid)
      return { global_id: gid.trim(), u_id: Number.isFinite(parsedUid) ? parsedUid : null, username: rest.join(':').trim() }
    }
  }

  // bare global_id (UUID) — treat as valid payload containing only the gid
  if (isUuidLike(text) && !text.startsWith('{')) {
    return { global_id: text.trim(), u_id: null, username: '' }
  }

  // JSON
  if (text.startsWith('{')) {
    const obj = JSON.parse(text)
    const parsedUid = Number(obj.u_id ?? obj.uid)
    return {
      global_id: obj.global_id || obj.gid || '',
      u_id: Number.isFinite(parsedUid) ? parsedUid : null,
      username: obj.username ?? obj.u ?? '',
    }
  }

  // legacy k:v,k:v
  if (text.includes(':') && text.includes(',')) {
    const obj = {}
    text.split(',').forEach(p => {
      const [k, ...v] = p.split(':')
      obj[k.trim()] = v.join(':').trim()
    })
    const parsedUid = Number(obj.u_id ?? obj.uid)
    return {
      global_id: obj.global_id || obj.gid || '',
      u_id: Number.isFinite(parsedUid) ? parsedUid : null,
      username: obj.username ?? obj.u ?? '',
    }
  }

  throw new Error('Unsupported QR payload format')
}

/** Format date safely */
export function formatDate(iso) {
    try {
        const d = new Date(iso)
        if (isNaN(d)) return iso
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        return `${day}/${month}/${year} ${hours}:${minutes}`
    } catch {
        return iso
    }
}

/** Call /users and return normalized + labeled items */
export async function fetchUsers(api, q) {
  const text = (q || '').trim()
  if (!text) return []
  const params = buildUserParams(text)
  const res = await api.get('/users', { params })
  return normalizeUserResponse(res?.data).map(u => ({
    ...u,
    label: `${u.username} (PCL-${u.u_id})`,
  }))
}

/** Fetch and return array of DB ids matching the query */
export async function fetchUserIds(api, q) {
  const text = (q || '').trim()
  if (!text) return []
  const params = buildUserParams(text)
  const res = await api.get('/users', { params })
  const users = normalizeUserResponse(res?.data)
  return users.map(u => u.id).filter(Boolean)
}

/** Fetch loyalty cards for a given user global_id */
export async function fetchLoyaltyCardsByUser(api, userGlobalId) {
  if (!userGlobalId) return []
  const url = `/loyalty-cards/user/${encodeURIComponent(userGlobalId)}`
  const res = await api.get(url)
  return res?.data?.data ?? []
}

/** Default 10-spot layout tuned for your artwork */
export const DEFAULT_HOTSPOTS_10 = [
  { x: 12, y: 45 }, 
  { x: 26, y: 45 }, 
  { x: 40, y: 45 }, 
  { x: 54, y: 45 },
  { x: 69, y: 45 }, 
  { x: 12, y: 68 }, 
  { x: 26, y: 68 }, 
  { x: 40, y: 68 },
  { x: 54, y: 68 }, 
  { x: 69, y: 68 },
]
