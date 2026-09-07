import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CreateFundraiserView from './CreateFundraiserView.vue'

const routerLinkStub = {
  template: '<a><slot /></a>',
}

const mountView = () =>
  mount(CreateFundraiserView, {
    global: {
      stubs: {
        RouterLink: routerLinkStub,
      },
    },
  })

const continueButton = (wrapper) =>
  wrapper.findAll('button.continue-button').at(-1)

const goToStep2 = async (wrapper) => {
  await wrapper.get('button.category-tile').trigger('click')
  await continueButton(wrapper).trigger('click')
}

const goToStep3 = async (wrapper) => {
  await goToStep2(wrapper)
  await wrapper.get('#fundraiser-title').setValue('Pot de départ')
  await wrapper.get('#fundraiser-goal').setValue('1500')
  await wrapper.get('form').trigger('submit')
}

const goToStep4 = async (wrapper) => {
  await goToStep3(wrapper)
  await continueButton(wrapper).trigger('click')
}

const selectFile = async (wrapper, file) => {
  const input = wrapper.get('#fundraiser-photo')
  Object.defineProperty(input.element, 'files', {
    configurable: true,
    value: [file],
  })
  await input.trigger('change')
}

describe('CreateFundraiserView', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:fundraiser-photo'),
      revokeObjectURL: vi.fn(),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('affiche la première étape avec la catégorie obligatoire', () => {
    const wrapper = mountView()

    expect(wrapper.get('h1').text()).toBe('Créer une cagnotte')
    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 1/4')
    expect(wrapper.get('h2').text()).toContain('Choisissez votre catégorie')
    expect(wrapper.get('button.continue-button').attributes('disabled')).toBe(
      '',
    )
    expect(wrapper.findAll('.category-tile')).toHaveLength(19)
    expect(wrapper.findAll('.progress .active')).toHaveLength(1)
  })

  it('sélectionne une catégorie et passe à l’étape du projet', async () => {
    const wrapper = mountView()
    const category = wrapper.get('button.category-tile')

    await category.trigger('click')

    expect(category.attributes('aria-pressed')).toBe('true')
    expect(wrapper.get('button.continue-button').attributes('disabled')).toBe(
      undefined,
    )

    await wrapper.get('button.continue-button').trigger('click')

    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 2/4')
    expect(wrapper.get('h2').text()).toContain('Présenter mon projet')
    expect(wrapper.findAll('.progress .active')).toHaveLength(2)
  })

  it('désactive la suite si le titre ou l’objectif est invalide', async () => {
    const wrapper = mountView()
    await goToStep2(wrapper)
    const next = continueButton(wrapper)

    expect(next.attributes('disabled')).toBe('')

    await wrapper.get('#fundraiser-title').setValue('Cagnotte')
    expect(next.attributes('disabled')).toBe('')

    await wrapper.get('#fundraiser-goal').setValue('0')
    expect(next.attributes('disabled')).toBe('')

    await wrapper.get('#fundraiser-goal').setValue('1000')
    expect(next.attributes('disabled')).toBeUndefined()
  })

  it('permet de créer un projet sans objectif', async () => {
    const wrapper = mountView()
    await goToStep2(wrapper)

    await wrapper.get('#fundraiser-title').setValue('Projet solidaire')
    await wrapper.get('.switch input').setValue(false)
    await wrapper.get('form').trigger('submit')

    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 3/4')
    expect(wrapper.get('h2').text()).toContain('Personnaliser ma cagnotte')
  })

  it('conserve les options du projet et les champs optionnels', async () => {
    const wrapper = mountView()
    await goToStep2(wrapper)

    await wrapper.get('#fundraiser-title').setValue('Anniversaire de Léa')
    await wrapper.get('#fundraiser-goal').setValue('800')
    await wrapper.findAll('.switch input').at(1).setValue(true)
    await wrapper.get('#fundraiser-date').setValue('2026-09-30')
    expect(wrapper.get('#fundraiser-date').element.value).toBe('2026-09-30')
    expect(wrapper.findAll('.switch input').at(1).element.checked).toBe(true)
    await wrapper.get('form').trigger('submit')
  })

  it('affiche la personnalisation par défaut', async () => {
    const wrapper = mountView()
    await goToStep3(wrapper)

    expect(wrapper.get('#fundraiser-description').element.value).toContain(
      'Bienvenue sur cette cagnotte',
    )
    expect(wrapper.get('input[value="public"]').element.checked).toBe(true)
    expect(wrapper.find('.photo-dropzone img').exists()).toBe(false)
  })

  it('met à jour la description et la visibilité', async () => {
    const wrapper = mountView()
    await goToStep3(wrapper)

    await wrapper
      .get('#fundraiser-description')
      .setValue('Une description personnalisée')
    await wrapper.get('input[value="private"]').setValue(true)

    expect(wrapper.get('#fundraiser-description').element.value).toBe(
      'Une description personnalisée',
    )
    expect(wrapper.get('input[value="private"]').element.checked).toBe(true)
    expect(wrapper.find('.visibility-options label.selected').text()).toContain(
      'Privée',
    )
  })

  it('accepte une image et affiche son aperçu', async () => {
    const wrapper = mountView()
    await goToStep3(wrapper)
    const file = new File(['photo'], 'souvenir.png', { type: 'image/png' })

    await selectFile(wrapper, file)

    expect(URL.createObjectURL).toHaveBeenCalledWith(file)
    expect(wrapper.get('.photo-dropzone').classes()).toContain('has-photo')
    expect(wrapper.get('.photo-dropzone img').attributes('src')).toBe(
      'blob:fundraiser-photo',
    )
  })

  it('ignore les fichiers qui ne sont pas des images', async () => {
    const wrapper = mountView()
    await goToStep3(wrapper)
    const file = new File(['document'], 'document.pdf', {
      type: 'application/pdf',
    })

    await selectFile(wrapper, file)

    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(wrapper.find('.photo-dropzone img').exists()).toBe(false)
  })

  it('passe à l’étape 4 et affiche le récapitulatif', async () => {
    const wrapper = mountView()
    await goToStep4(wrapper)

    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 4/4')
    expect(wrapper.get('h2').text()).toContain('Définissez vos identifiants')
    expect(wrapper.get('.summary-box').text()).toContain('Pot de départ')
    expect(wrapper.get('.summary-box').text()).toContain('1500')
    expect(wrapper.get('.summary-box').text()).toContain('Cagnotte publique')
    expect(wrapper.findAll('.progress .active')).toHaveLength(4)
  })

  it('met à jour le récapitulatif avec une cagnotte privée et sans objectif', async () => {
    const wrapper = mountView()
    await goToStep2(wrapper)
    await wrapper.get('#fundraiser-title').setValue('Projet collectif')
    await wrapper.get('.switch input').setValue(false)
    await wrapper.get('form').trigger('submit')
    await wrapper.get('input[value="private"]').setValue(true)
    await continueButton(wrapper).trigger('click')

    expect(wrapper.get('.summary-box').text()).toContain('Projet collectif')
    expect(wrapper.get('.summary-box').text()).toContain('Cagnotte privée')
  })

  it('désactive la création tant que les identifiants sont incomplets', async () => {
    const wrapper = mountView()
    await goToStep4(wrapper)
    const create = wrapper.get('button[type="submit"]')

    expect(create.attributes('disabled')).toBe('')

    await wrapper.get('#fundraiser-first-name').setValue('Alice')
    await wrapper.get('#fundraiser-last-name').setValue('Martin')
    await wrapper.get('#fundraiser-email').setValue('alice@example.com')
    expect(create.attributes('disabled')).toBe('')

    await wrapper.get('#fundraiser-phone').setValue('612345678')
    expect(create.attributes('disabled')).toBeUndefined()
  })

  it('permet de revenir en arrière depuis chaque étape', async () => {
    const wrapper = mountView()
    await goToStep4(wrapper)

    await wrapper.get('.identity-form .previous-button').trigger('click')
    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 3/4')

    await wrapper.get('.customize-form .previous-button').trigger('click')
    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 2/4')

    await wrapper.get('.project-form .previous-button').trigger('click')
    expect(wrapper.get('.wizard-heading p').text()).toContain('Étape 1/4')
  })

  it('révoque l’aperçu de la photo au remplacement et au démontage', async () => {
    const wrapper = mountView()
    await goToStep3(wrapper)
    const firstFile = new File(['first'], 'first.png', { type: 'image/png' })
    const secondFile = new File(['second'], 'second.png', { type: 'image/png' })

    await selectFile(wrapper, firstFile)
    await selectFile(wrapper, secondFile)

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:fundraiser-photo')
    wrapper.unmount()
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  })
})
