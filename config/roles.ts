export const ROLES = ['superadmin', 'admin', 'cashier'] as const
export type Role = typeof ROLES[number]
export type RoleRequirement = Role[] | 'all' | undefined

const ALLOWED = new Set<Role>(ROLES)

export function isRole(v: string): v is Role {
  return (ROLES as readonly string[]).includes(v)
}

export function normalizeRolesFromUser(u: any): Role[] {
  if (!u || u.active === 0) return []
  const raw = Array.isArray(u?.roles) ? u.roles : (u?.role ? [u.role] : [])
  const canon = raw
    .filter((v: unknown): v is string => typeof v === 'string')
    .map((r: string) => r.toLowerCase().replace(/\s+/g, '').replace(/-/g, ''))
    .filter(isRole)
  return Array.from(new Set(canon))
}

// (optional) hierarchy so superadmin can access admin/cashier pages automatically
const ROLE_IMPLIES: Record<Role, Role[]> = {
  superadmin: ['admin','cashier'],
  admin: ['cashier'],
  cashier: [],
}
export function expandWithHierarchy(userRoles: Role[]): Role[] {
  const out = new Set<Role>(userRoles)
  userRoles.forEach(r => ROLE_IMPLIES[r].forEach(ir => out.add(ir)))
  return Array.from(out)
}

export function hasAccess(user: Role[], required: RoleRequirement): boolean {
  if (!required || required === 'all') return true
  return required.some(r => user.includes(r))
}
