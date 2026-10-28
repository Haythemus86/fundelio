import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '../stores/authStore'
import router from './index'

beforeEach(async () => {
  setActivePinia(createPinia())
  localStorage.clear()
  await router.push('/')
})

describe('account route access', () => {
  it('redirects signed-out visitors to sign-in with the requested destination', async () => {
    await router.push('/compte/profil')

    expect(router.currentRoute.value.fullPath).toBe(
      '/connexion?redirect=/compte/profil',
    )
  })

  it('allows authenticated visitors to open account pages', async () => {
    useAuthStore().saveSession({
      accessToken: 'signed-token',
      user: { id: 'user-1', firstName: 'Alice' },
    })

    await router.push('/compte/cagnottes')

    expect(router.currentRoute.value.name).toBe('account-fundraisers')
  })
})
