import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import HelpView from './HelpView.vue'

const mountView = () =>
  mount(HelpView, {
    global: {
      stubs: {
        RouterLink: {
          template: '<a v-bind="$attrs"><slot /></a>',
        },
      },
    },
  })

describe('HelpView', () => {
  it("affiche le centre d'aide et ses six catégories", () => {
    const wrapper = mountView()

    expect(wrapper.get('h1').text()).toBe("Centre d'aide")
    expect(wrapper.get('.help-hero > p').text()).toContain(
      'Utilisez la barre ci-dessous',
    )
    expect(wrapper.findAll('.help-card')).toHaveLength(6)
    expect(wrapper.get('.support-card h2').text()).toContain(
      "Vous n'avez pas trouvé",
    )
  })

  it('expose une recherche accessible avec un placeholder', () => {
    const wrapper = mountView()
    const input = wrapper.get('input[type="search"]')

    expect(input.attributes('placeholder')).toBe('Rechercher...')
    expect(input.attributes('aria-label')).toBe(
      "Rechercher dans le centre d'aide",
    )
  })

  it('filtre les catégories par titre', async () => {
    const wrapper = mountView()

    await wrapper.get('input[type="search"]').setValue('mon compte')

    expect(wrapper.findAll('.help-card')).toHaveLength(1)
    expect(wrapper.get('.help-card-title').text()).toBe('Mon compte')
  })

  it('filtre aussi les catégories par description', async () => {
    const wrapper = mountView()

    await wrapper.get('input[type="search"]').setValue('transactions')

    expect(wrapper.findAll('.help-card')).toHaveLength(1)
    expect(wrapper.get('.help-card-title').text()).toBe('Sécurité & protection')
  })

  it("affiche un état vide lorsqu'aucune catégorie ne correspond", async () => {
    const wrapper = mountView()

    await wrapper.get('input[type="search"]').setValue('inconnu')

    expect(wrapper.find('.help-grid').exists()).toBe(false)
    expect(wrapper.get('.help-empty h2').text()).toBe('Aucun résultat')
    expect(wrapper.get('.support-card').exists()).toBe(true)
  })

  it('réaffiche toutes les catégories quand la recherche est vidée', async () => {
    const wrapper = mountView()
    const input = wrapper.get('input[type="search"]')

    await input.setValue('inconnu')
    await input.setValue('')

    expect(wrapper.findAll('.help-card')).toHaveLength(6)
  })

  it('propose les bons moyens de contacter le support', () => {
    const wrapper = mountView()
    const email = wrapper.get('.support-email')
    const phone = wrapper.get('.support-phone')

    expect(email.attributes('href')).toBe('mailto:support@fundelio.fr')
    expect(phone.attributes('href')).toBe('tel:+33180000000')
    expect(wrapper.get('.support-card > p').text()).toContain('7j/7')
  })

  it('rend chaque catégorie interactive et navigable au clavier', () => {
    const wrapper = mountView()

    wrapper.findAll('.help-card').forEach((card) => {
      expect(card.element.tagName).toBe('BUTTON')
      expect(card.attributes('type')).toBe('button')
    })
  })
})
