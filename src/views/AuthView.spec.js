import { flushPromises, mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthView from './AuthView.vue'

const { push, registerUser, loginUser } = vi.hoisted(() => ({
  push: vi.fn(),
  registerUser: vi.fn(),
  loginUser: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
  useRoute: () => ({ query: {} }),
}))

vi.mock('../services/fundelioApi', () => ({
  registerUser,
  loginUser,
}))

const mountView = () =>
  mount(AuthView, {
    global: {
      plugins: [createPinia()],
      stubs: {
        RouterLink: { template: '<a><slot /></a>' },
      },
    },
  })

beforeEach(() => {
  vi.clearAllMocks()
  registerUser.mockResolvedValue({
    accessToken: 'register-token',
    user: { id: 'user-1', firstName: 'Alice' },
  })
  loginUser.mockResolvedValue({
    accessToken: 'login-token',
    user: { id: 'user-1', firstName: 'Alice' },
  })
})

describe('AuthView', () => {
  it('connecte un utilisateur avec son email et son mot de passe', async () => {
    const wrapper = mountView()

    await wrapper.get('input[type="email"]').setValue('alice@example.com')
    await wrapper.get('input[type="password"]').setValue('motdepasse')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(loginUser).toHaveBeenCalledWith({
      email: 'alice@example.com',
      password: 'motdepasse',
    })
    expect(push).toHaveBeenCalledWith('/projects')
  })

  it('propose une inscription email et mot de passe', async () => {
    const wrapper = mountView()
    await wrapper.get('.auth-switch button').trigger('click')

    await wrapper.get('input[autocomplete="given-name"]').setValue('Alice')
    await wrapper.get('input[autocomplete="family-name"]').setValue('Martin')
    await wrapper.get('input[type="email"]').setValue('alice@example.com')
    await wrapper.get('input[type="password"]').setValue('motdepasse')
    await wrapper.get('form').trigger('submit')

    expect(registerUser).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'alice@example.com',
      password: 'motdepasse',
      phone: undefined,
    })
  })

  it('signale que les fournisseurs sociaux sont encore simulés', async () => {
    const wrapper = mountView()

    await wrapper.get('.provider-button').trigger('click')

    expect(wrapper.get('[role="status"]').text()).toContain(
      'Connexion Google simulée',
    )
    expect(loginUser).not.toHaveBeenCalled()
  })
})
