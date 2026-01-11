// utils/pageHelper.js

export function getSort(sortBy, fallback = { key: 'created_at', order: 'desc' }) {
  return Array.isArray(sortBy) && sortBy[0] ? sortBy[0] : fallback
}

/* ---------- Robust date coercion ---------- */
function toDate(val) {
  if (!val && val !== 0) return null
  if (val instanceof Date) return isNaN(val) ? null : val
  if (typeof val === 'number') {
    const ms = val < 1e12 ? val * 1000 : val // allow seconds or ms
    const d = new Date(ms)
    return isNaN(d) ? null : d
  }
  if (typeof val === 'string') {
    // Fast path for 'YYYY-MM-DD'
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val.trim())
    if (m) {
      const y = +m[1], mo = +m[2] - 1, d = +m[3]
      // return a Date in UTC midnight for that calendar day
      return new Date(Date.UTC(y, mo, d, 0, 0, 0, 0))
    }
    // Fallback to Date.parse (handles ISO strings)
    const d = new Date(val)
    return isNaN(d) ? null : d
  }
  return null
}

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

/* ---------- Param builder ---------- */
export function buildParams({
  page = 1,
  itemsPerPage = 10,
  sortBy = [{ key: 'created_at', order: 'desc' }],
  search = '',
  columns = [],
  dateRange = [],
  withRels = [],
  filterBy = {},
} = {}) {
  const s = getSort(sortBy)
  const params = {
    page,
    limit: itemsPerPage,
    sort_by: s.key,
    sort_dir: s.order,
  }

  if (withRels?.length) params.with = withRels
  if (filterBy && Object.keys(filterBy).length) params.filter_by = filterBy

  const txt = String(search || '').trim()
  if (txt) {
    params.search = txt
    if (columns?.length) params.columns = columns
  }

  // Accept: ['from','to'] OR { start, end } OR { 0: from, 1: to }
  let from, to
  if (Array.isArray(dateRange)) {
    ;[from, to] = dateRange
  } else if (dateRange && typeof dateRange === 'object') {
    from = dateRange.start ?? dateRange[0]
    to   = dateRange.end   ?? dateRange[1]
  }

  const fromMs = toStartMs(from)
  const toMs   = toEndMs(to)
  if (fromMs !== undefined) params.date_from = fromMs
  if (toMs   !== undefined) params.date_to   = toMs

  return params
}


// ~/utils/bilingual.js
export const DELIM = '||'; // en||km

export const safePart = (s) => (s ?? '').replaceAll(DELIM, ' ').trim();

export const splitBilingual = (val = '') => {
  if (typeof val !== 'string') return { en: '', km: '' };
  const [en = '', km = ''] = val.split(DELIM);
  return { en: en?.trim() ?? '', km: km?.trim() ?? '' };
};

export const joinBilingual = (en = '', km = '') =>
  `${safePart(en)}${DELIM}${safePart(km)}`;
