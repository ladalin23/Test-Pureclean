import { defineNuxtRouteMiddleware } from '#app'
import { userAuth } from '~/store/userAuth'
import { normalizeRolesFromUser, expandWithHierarchy, hasAccess } from '~/config/roles'
import type { RoleRequirement } from '~/config/roles' // type-only (verbatimModuleSyntax)

export default defineNuxtRouteMiddleware((to) => {
  const auth = userAuth()
  const userRoles = expandWithHierarchy(normalizeRolesFromUser(auth.user))

  const required = ((to.meta as any)?.auth?.roles ?? (to.meta as any)?.roles) as RoleRequirement
  if (!hasAccess(userRoles, required)) {
    return abortNavigation(createError({ statusCode: 404, statusMessage: 'Not Found' }))
  }
})



// 5) Example pages

// Super-admin only

// definePageMeta({
//   layout: 'default',
//   middleware: ['roles'],       // file is middleware/roles.ts
//   auth: { roles: ['superadmin'] },
// })


// Admin or Super-admin

// definePageMeta({
//   layout: 'default',
//   middleware: ['roles'],
//   auth: { roles: ['admin','superadmin'] },
// })


// Cashier only

// definePageMeta({
//   layout: 'default',
//   middleware: ['roles'],
//   auth: { roles: ['cashier'] },
// })


// All authenticated

// // explicit
// definePageMeta({ layout: 'default', middleware: ['roles'], auth: { roles: 'all' } })
// // or omit roles
// definePageMeta({ layout: 'default', middleware: ['roles'] })


// Public (no login)

// definePageMeta({ public: true }) // auth.global.ts returns early for public pages
