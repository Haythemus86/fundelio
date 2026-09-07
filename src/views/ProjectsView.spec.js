import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProjectsView from './ProjectsView.vue'

const mountView = () =>
  mount(ProjectsView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a v-bind="$attrs"><slot /></a>',
        },
      },
    },
  })

describe('ProjectsView', () => {
  it('affiche l’espace Mes cagnottes et ses statistiques', () => {
    const wrapper = mountView()

    expect(wrapper.get('h1').text()).toBe('Mes cagnottes')
    expect(wrapper.get('.projects-intro').text()).toContain(
      'Retrouvez toutes vos cagnottes',
    )
    expect(wrapper.findAll('.stat-card')).toHaveLength(3)
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(3)
    expect(wrapper.get('.stat-card strong').text()).toBe('3')
  })

  it('propose un lien pour créer une nouvelle cagnotte', () => {
    const wrapper = mountView()
    const createLink = wrapper.get('.create-project-button')

    expect(createLink.attributes('to')).toBe('/creer-une-cagnotte')
    expect(createLink.text()).toContain('Créer une cagnotte')
  })

  it('affiche la progression et les informations de chaque cagnotte', () => {
    const wrapper = mountView()
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
    const wrapper = mountView()
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
    const wrapper = mountView()
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
    const wrapper = mountView()
    await wrapper.get('input[type="search"]').setValue('inexistant')
    await wrapper.get('.empty-state button').trigger('click')

    expect(wrapper.get('input[type="search"]').element.value).toBe('')
    expect(wrapper.findAll('.fundraiser-card')).toHaveLength(3)
    expect(wrapper.get('.filter-tab').attributes('aria-selected')).toBe('true')
  })

  it('expose les actions Voir et Gérer sur chaque carte', () => {
    const wrapper = mountView()

    wrapper.findAll('.fundraiser-card').forEach((card) => {
      expect(card.find('.secondary-action').text()).toContain('Voir')
      expect(card.find('.detail-action').text()).toContain('Gérer')
    })
  })

  it('reste responsive avec la recherche et les filtres accessibles', () => {
    const wrapper = mountView()

    expect(wrapper.get('input[type="search"]').attributes('aria-label')).toBe(
      'Rechercher une cagnotte',
    )
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.findAll('[role="progressbar"]')).toHaveLength(3)
  })
})
