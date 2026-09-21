import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProjectsView from './ProjectsView.vue'
import { createPinia } from 'pinia'

const mockFundraisers = [
  {
    id: 1,
    title: 'Test anniv',
    category: 'Anniversaire',
    raised: 875,
    goal: 1500,
    endDate: '2026-09-30',
    visibility: 'public',
    emoji: '🎂',
    color: 'coral',
  },
  {
    id: 2,
    title: 'Un nouveau départ pour Léa',
    category: 'Entraide',
    raised: 2120,
    goal: 3500,
    endDate: '2026-11-15',
    visibility: 'public',
    emoji: '🤝',
    color: 'mint',
  },
  {
    id: 3,
    title: 'Pot de départ de Thomas',
    category: 'Pot de départ / Retraite',
      plugins: [createPinia()],
    raised: 800,
    goal: 800,
    endDate: '2026-05-20',
    visibility: 'private',
    emoji: '🎉',
    color: 'lavender',
  },
]

vi.mock('../services/fundelioApi', () => ({
  accessGuestFundraisers: vi.fn(),
  fetchFundraisers: vi.fn(),
}))

const { accessGuestFundraisers, fetchFundraisers } = await import('../services/fundelioApi')

const mountView = async () => {
  fetchFundraisers.mockResolvedValue(mockFundraisers)
  const wrapper = mount(ProjectsView, {
    global: {
      plugins: [createPinia()],
      stubs: {
        RouterLink: {
          template: '<a v-bind="$attrs"><slot /></a>',
        },
      },
    },
  })
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  vi.clearAllMocks()
  accessGuestFundraisers.mockResolvedValue(mockFundraisers)
})

describe('ProjectsView', () => {
  it('affiche l’espace Mes cagnottes et ses statistiques', async () => {
    const wrapper = await mountView()

    expect(wrapper.get('h1').text()).toBe('Mes cagnottes')
    expect(wrapper.get('.projects-intro').text()).toContain(
      'Retrouvez toutes vos cagnottes',
    )
    expect(wrapper.findAll('.stat-card')).toHaveLength(3)
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(3)
    expect(wrapper.get('.stat-card strong').text()).toBe('3')
  })

  it('propose un lien pour créer une nouvelle cagnotte', async () => {
    const wrapper = await mountView()
    const createLink = wrapper.get('.create-project-button')

    expect(createLink.attributes('to')).toBe('/creer-une-cagnotte')
    expect(createLink.text()).toContain('Créer une cagnotte')
  })

  it('retrouve les cagnottes invitées avec leur email et mot de passe', async () => {
    const wrapper = await mountView()
    await wrapper.get('.guest-access input[type="email"]').setValue('alice@example.com')
    await wrapper.get('.guest-access input[type="password"]').setValue('motdepasse')
    await wrapper.get('.guest-access').trigger('submit')

    expect(accessGuestFundraisers).toHaveBeenCalledWith({
      email: 'alice@example.com',
      password: 'motdepasse',
    })
  })

  it('affiche la progression et les informations de chaque cagnotte', async () => {
    const wrapper = await mountView()
    const cards = wrapper.findAll('.fundraiser-card')

    expect(cards[0].text()).toContain('Test anniv')
    expect(cards[0].text()).toContain('875 €')
    expect(cards[0].text()).toContain('58 %')
    expect(
      cards[0].get('[role="progressbar"]').attributes('aria-valuenow'),
    ).toBe('58')
    expect(cards[0].get('.status-badge').text()).toContain('En cours')
    expect(cards[2].get('.status-badge').text()).toContain('Terminée')
  })

  it('filtre les cagnottes en cours et terminées', async () => {
    const wrapper = await mountView()
    const filters = wrapper.findAll('.filter-tab')

    await filters[1].trigger('click')
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(2)
    expect(wrapper.get('.section-heading').text()).toContain('2 résultats')
    expect(filters[1].attributes('aria-selected')).toBe('true')

    await filters[2].trigger('click')
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(1)
    expect(wrapper.get('.fundraiser-card').text()).toContain(
      'Pot de départ de Thomas',
    )
  })

  it('recherche par titre ou catégorie', async () => {
    const wrapper = await mountView()
    const search = wrapper.get('input[type="search"]')

    await search.setValue('entraide')

    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(1)
    expect(wrapper.get('.fundraiser-card').text()).toContain(
      'Un nouveau départ pour Léa',
    )

    await search.setValue('inexistant')
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.get('.empty-state h3').text()).toBe(
      'Aucune cagnotte trouvée',
    )
  })

  it('réinitialise les filtres depuis l’état vide', async () => {
    const wrapper = await mountView()
    await wrapper.get('input[type="search"]').setValue('inexistant')
    await wrapper.get('.empty-state button').trigger('click')

    expect(wrapper.get('input[type="search"]').element.value).toBe('')
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(3)
    expect(wrapper.get('.filter-tab').attributes('aria-selected')).toBe('true')
  })

  it('expose les actions Voir et Gérer sur chaque carte', async () => {
    const wrapper = await mountView()

    wrapper.findAll('.fundraiser-card').forEach((card) => {
      expect(card.find('.secondary-action').text()).toContain('Voir')
      expect(card.find('.detail-action').text()).toContain('Gérer')
    })
  })

  it('reste responsive avec la recherche et les filtres accessibles', async () => {
    const wrapper = await mountView()

    expect(wrapper.get('input[type="search"]').attributes('aria-label')).toBe(
      'Rechercher une cagnotte',
    )
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.findAll('[role="progressbar"]')).toHaveLength(3)
  })
})
