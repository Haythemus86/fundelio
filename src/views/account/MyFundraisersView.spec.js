import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import MyFundraisersView from './MyFundraisersView.vue'

const { fetchMyFundraisers, updateFundraiser } = vi.hoisted(() => ({
  fetchMyFundraisers: vi.fn(),
  updateFundraiser: vi.fn(),
}))

vi.mock('../../services/fundelioApi', () => ({
  fetchMyFundraisers,
  updateFundraiser,
}))

const fundraiser = {
  id: 'fundraiser-1',
  title: 'Anniversaire Alice',
  description: 'Un beau projet',
  category: 'Anniversaire',
  raised: 250,
  goal: 500,
  hasGoal: true,
  visibility: 'public',
  endDate: '2026-12-31',
  emoji: '🎂',
  color: 'coral',
  status: 'ACTIVE',
}

const mountView = async () => {
  const wrapper = mount(MyFundraisersView, {
    global: {
      stubs: {
        RouterLink: { template: '<a v-bind="$attrs"><slot /></a>' },
      },
    },
  })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
  fetchMyFundraisers.mockResolvedValue([fundraiser])
  updateFundraiser.mockResolvedValue(fundraiser)
})

describe('MyFundraisersView', () => {
  it('affiche les cagnottes du compte', async () => {
    const wrapper = await mountView()

    expect(fetchMyFundraisers).toHaveBeenCalledOnce()
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(1)
    expect(wrapper.get('.fundraiser-card').text()).toContain(
      'Anniversaire Alice',
    )
  })

  it('affiche un état vide si aucune cagnotte n’existe', async () => {
    fetchMyFundraisers.mockResolvedValueOnce([])
    const wrapper = await mountView()

    expect(wrapper.get('.empty-state').text()).toContain(
      'Vous n’avez pas encore de cagnotte',
    )
  })

  it('modifie une cagnotte via l’API dédiée au compte', async () => {
    const wrapper = await mountView()
    await wrapper.get('.fundraiser-card .button-primary').trigger('click')
    await wrapper.get('#edit-title')
    await wrapper.get('.edit-form input[type="text"]').setValue('Nouveau titre')
    await wrapper.get('.edit-form').trigger('submit')
    await flushPromises()

    expect(updateFundraiser).toHaveBeenCalledWith(
      'fundraiser-1',
      expect.objectContaining({ title: 'Nouveau titre' }),
    )
    expect(fetchMyFundraisers).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.edit-dialog').exists()).toBe(false)
  })
})
