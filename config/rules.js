// ~/config/rules.js
export const useValidationRules = () => {
  // --- primitive validators ---
  const required = (msg = 'This field is required.') =>
    (v) => (v || v === 0 || v === false) ? true : msg
  const minLen  = (n, msg = `Must be at least ${n} characters.`) =>
    (v) => (v == null || String(v).length >= n) || msg
  const maxLen  = (n, msg = `Must be at most ${n} characters.`) =>
    (v) => (v == null || String(v).length <= n) || msg
  const pattern = (re, msg = 'Invalid format.') =>
    (v) => (v == null || re.test(String(v))) || msg
  const numeric = (msg = 'Must be a number.') =>
    (v) => (v == null || !isNaN(Number(v))) || msg

  // presets
  const email = (msg = 'E-mail must be valid.') =>
    pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg)
  const phone = (msg = 'Use 7–15 digits (optionally prefixed with +).') =>
    pattern(/^\+?\d{7,15}$/, msg)

  // --- tiny DSL parser ---
  // Syntax: "required|min:3|max:100|email|phone|numeric|trim|noEdge|noDouble"
  // Custom messages: min:3:"Too short", max:100:"Too long"
  const parse = (spec) => {
    const tokens = String(spec || '').split('|').map(s => s.trim()).filter(Boolean)
    const transforms = [] // only "trim" for now
    const rules = []

    const applyTransforms = (fn) => (v) => {
      let val = v
      for (const tr of transforms) val = tr(val)
      return fn(val)
    }

    const addRule = (fn) => rules.push(applyTransforms(fn))

    for (const token of tokens) {
      // match forms like min:3 or min:3:"msg with : inside"
      const m = token.match(/^(\w+)(?::([^:]+))?(?::\"([\s\S]*)\")?$/)
      const key = m ? m[1] : token
      const arg = m && m[2]
      const msg = m && m[3]

      switch (key) {
        case 'required': addRule(required(msg || 'This field is required.')); break
        case 'min':      addRule(minLen(Number(arg), msg || undefined)); break
        case 'max':      addRule(maxLen(Number(arg), msg || undefined)); break
        case 'email':    addRule(email(msg || undefined)); break
        case 'phone':    addRule(phone(msg || undefined)); break
        case 'numeric':  addRule(numeric(msg || undefined)); break
        case 'regex':    // usage: regex:^[A-Z]+$:"Only caps"
          try { addRule(pattern(new RegExp(arg), msg || undefined)) } catch {}
          break
        case 'trim':     transforms.push((v) => (v == null ? v : String(v).trim())); break
        case 'noEdge':   addRule((v) => (v == null || String(v).trim() === String(v)) || (msg || 'Cannot start or end with spaces.')); break
        case 'noDouble': addRule((v) => (v == null || !/\s{2,}/.test(String(v))) || (msg || 'No consecutive spaces.')); break
        default: /* ignore unknown */ break
      }
    }
    return rules
  }

  // Build rule arrays from a map of { field: "spec string" }
  const build = (schema) => {
    const out = {}
    for (const k in (schema || {})) out[k] = parse(schema[k])
    return out
  }

  // Keep your old presets (optional)
  const usernameRules = build({ u: 'required|min:3|max:100' }).u
  const emailRulesArr = build({ e: 'required|email' }).e
  const phoneRulesArr = build({ p: 'required|phone' }).p
  const passwordRules = (isEditMode = false) =>
    isEditMode
      ? build({ pw: 'min:8|max:50' }).pw
      : build({ pw: 'required|min:8|max:50' }).pw

  return {
    build, // <-- main new API
    // legacy-like exports if you want them
    usernameRules: usernameRules,
    emailRules: emailRulesArr,
    phoneRules: phoneRulesArr,
    passwordRules,
  }
}
