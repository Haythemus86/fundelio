import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../../stores/authStore'
import ProfileView from './ProfileView.vue'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  fetchMyProfile: vi.fn(),
  fetchMyProfilePhoto: vi.fn(),
  updateMyProfile: vi.fn(),
  changeMyPassword: vi.fn(),
  deleteMyAccount: vi.fn(),
  uploadMyProfilePhoto: vi.fn(),
  deleteMyProfilePhoto: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('../../services/fundelioApi', () => ({
  fetchMyProfile: mocks.fetchMyProfile,
  fetchMyProfilePhoto: mocks.fetchMyProfilePhoto,
  updateMyProfile: mocks.updateMyProfile,
  changeMyPassword: mocks.changeMyPassword,
  deleteMyAccount: mocks.deleteMyAccount,
  uploadMyProfilePhoto: mocks.uploadMyProfilePhoto,
  deleteMyProfilePhoto: mocks.deleteMyProfilePhoto,
}))

const profile = {
  id: 'user-1',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Martin',
  phone: '',
  salutation: '',
  birthDate: null,
  birthCity: null,
  nationality: null,
  countryOfBirth: null,
  countryOfResidence: null,
  profession: null,
  incomeRange: null,
  streetAddress: null,
  city: null,
  postalCode: null,
  hasProfilePhoto: false,
}

const mountView = async () => {
  const pinia = createPinia()
  setActivePinia(pinia)
  useAuthStore().saveSession({ accessToken: 'token', user: profile })
  const wrapper = mount(ProfileView, { global: { plugins: [pinia] } })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
  mocks.fetchMyProfile.mockResolvedValue(profile)
  mocks.updateMyProfile.mockResolvedValue(profile)
  mocks.deleteMyAccount.mockResolvedValue({})
})

describe('ProfileView', () => {
  it('charge et affiche le profil avec une adresse email en lecture seule', async () => {
    const wrapper = await mountView()

    expect(mocks.fetchMyProfile).toHaveBeenCalledOnce()
    expect(wrapper.get('h2').text()).toBe('Mon profil')
    expect(wrapper.get('input[type="email"]').element.readOnly).toBe(true)
    expect(wrapper.get('input[autocomplete="given-name"]').element.value).toBe(
      'Alice',
    )
  })

  it('enregistre les informations facultatives du profil', async () => {
    const wrapper = await mountView()
    await wrapper.get('input[autocomplete="given-name"]').setValue('Alicia')
    await wrapper.get('input[autocomplete="country-name"]').setValue('France')
    await wrapper.get('.profile-form').trigger('submit')
    await flushPromises()

    expect(mocks.updateMyProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Alicia',
        countryOfResidence: 'France',
      }),
    )
    expect(wrapper.get('[role="status"]').text()).toContain(
      'Votre profil a été mis à jour',
    )
  })

  it('refuse la modification du mot de passe si la confirmation diffère', async () => {
    const wrapper = await mountView()
    const forms = wrapper.findAll('form')
    const passwordForm = forms.find((form) =>
      form.text().includes('Nouveau mot de passe'),
    )

    await passwordForm
      .get('input[autocomplete="current-password"]')
      .setValue('old-password')
    await passwordForm
      .get('input[autocomplete="new-password"]')
      .setValue('new-password')
    await passwordForm
      .findAll('input[autocomplete="new-password"]')[1]
      .setValue('different-password')
    await passwordForm.trigger('submit')

    expect(mocks.changeMyPassword).not.toHaveBeenCalled()
    expect(passwordForm.get('[role="alert"]').text()).toContain(
      'ne correspondent pas',
    )
  })

  it('demande le mot de passe avant anonymisation puis déconnecte le compte', async () => {
    const wrapper = await mountView()
    await wrapper.get('.button-danger').trigger('click')
    await wrapper
      .get('[role="alertdialog"] input[type="password"]')
      .setValue('current-password')
    await wrapper.get('[role="alertdialog"] form').trigger('submit')
    await flushPromises()

    expect(mocks.deleteMyAccount).toHaveBeenCalledWith({
      currentPassword: 'current-password',
    })
    expect(mocks.push).toHaveBeenCalledWith('/')
    expect(useAuthStore().isAuthenticated).toBe(false)
  })
})
