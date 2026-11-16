import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AccountPlaceholderView from './AccountPlaceholderView.vue'

const { route } = vi.hoisted(() => ({
  route: {
    name: 'account-petitions',
    meta: {
      title: 'Mes pétitions',
      description: 'La gestion des pétitions sera disponible prochainement.',
    },
  },
}))

vi.mock('vue-router', () => ({
  useRoute: () => route,
}))

const setRoute = (name, title, description) => {
  route.name = name
  route.meta = { title, description }
}

describe('AccountPlaceholderView', () => {
  beforeEach(() => {
    setRoute(
      'account-petitions',
      'Mes pétitions',
      'La gestion des pétitions sera disponible prochainement.',
    )
  })

  it.each([
    ['account-petitions', 'Mes pétitions', 'Aucune pétition disponible'],
    ['account-surveys', 'Mes sondages', 'Aucun sondage disponible'],
    ['account-documents', 'Mes justificatifs', 'Aucun justificatif disponible'],
  ])('affiche un état vide honnête pour %s', (name, title, emptyTitle) => {
    setRoute(name, title, 'Contenu indisponible pour le moment.')

    const wrapper = mount(AccountPlaceholderView)

    expect(wrapper.get('h2').text()).toBe(title)
    expect(wrapper.get('.empty-state').text()).toContain(emptyTitle)
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('conserve les colonnes de transaction sans inventer de lignes', () => {
    setRoute(
      'account-transactions',
      'Mes transactions',
      'Aucune transaction financière n’est encore disponible.',
    )

    const wrapper = mount(AccountPlaceholderView)

    expect(wrapper.findAll('thead th').map((header) => header.text())).toEqual([
      'Date',
      'Type',
      'Statut',
      'Montant',
      'Solde',
    ])
    expect(wrapper.get('tbody').text()).toContain(
      'Aucune transaction disponible',
    )
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })
})
