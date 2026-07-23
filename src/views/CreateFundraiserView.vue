<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { ArrowLeft, ArrowRight, Globe2, Lock, Upload } from 'lucide-vue-next'
import AppNavbar from '../components/layout/AppNavbar.vue'

const selectedCategory = ref('')
const step = ref(1)
const title = ref('')
const hasGoal = ref(true)
const goal = ref('')
const hideContributions = ref(false)
const endDate = ref('')
const description = ref(
  'Bienvenue sur cette cagnotte !\nParticipez en un clic.\nChacun participe du montant qu’il souhaite.\nTous les paiements sont sécurisés.\nMerci à tous !',
)
const visibility = ref('public')
const photoPreview = ref('')

const formIsValid = computed(() => {
  const amount = Number(goal.value)
  return (
    title.value.trim().length > 0 &&
    (!hasGoal.value || (Number.isFinite(amount) && amount > 0))
  )
})

const goBack = () => {
  if (step.value > 1) step.value -= 1
}

const goToProject = () => {
  step.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToCustomize = () => {
  if (!formIsValid.value) return
  step.value = 3
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const setPhoto = (file) => {
  if (!file?.type.startsWith('image/')) return
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
  photoPreview.value = URL.createObjectURL(file)
}

const onPhotoChange = (event) => setPhoto(event.target.files?.[0])
const onPhotoDrop = (event) => setPhoto(event.dataTransfer.files?.[0])

onBeforeUnmount(() => {
  if (photoPreview.value) URL.revokeObjectURL(photoPreview.value)
})

const groups = [
  {
    title: 'Festivité et partage',
    icon: '🎉',
    items: [
      ['Anniversaire', 0],
      ['Pot de départ / Retraite', 1],
      ['Naissance', 2],
      ['Mariage', 3],
      ['Remerciements', 4],
      ['Évènements', 5],
      ['Autre dépense à plusieurs', 6],
    ],
  },
  {
    title: 'Solidarité et entraide',
    icon: '🤝',
    items: [
      ['Entraide', 7],
      ['Animaux', 8],
      ['Obsèques', 9],
      ['Santé', 10],
      ['Environnement', 11],
      ['Autre projet solidaire', 12],
    ],
  },
  {
    title: 'Entreprise',
    icon: '💼',
    items: [
      ['Séminaire', 13],
      ['Afterwork / Pot', 14],
      ['Autre évènement', 15],
    ],
  },
  {
    title: 'Association & ONG',
    icon: '🌍',
    items: [
      ['Cause sociale', 16],
      ['Humanitaire', 17],
      ['Autre projet ONG', 18],
    ],
  },
]

const tileStyle = (index) => ({
  backgroundPosition: `${(index % 5) * 25}% ${Math.floor(index / 5) * (100 / 3)}%`,
})
</script>

<template>
  <AppNavbar />
  <main class="create-page">
    <section class="wizard" aria-labelledby="page-title">
      <RouterLink v-if="step === 1" class="back-link" to="/">
        <ArrowLeft :size="16" />
        Retour
      </RouterLink>
      <button
        v-else
        class="back-link back-button"
        type="button"
        @click="goBack"
      >
        <ArrowLeft :size="16" />
        Retour
      </button>

      <header class="wizard-heading">
        <h1 id="page-title">Créer une cagnotte</h1>
        <p>
          Étape {{ step }}/4 —
          {{
            step === 1
              ? 'Catégorie'
              : step === 2
                ? 'Mon projet'
                : 'Personnaliser'
          }}
        </p>
        <div class="progress" :aria-label="`Étape ${step} sur 4`">
          <span :class="{ active: step >= 1 }"></span>
          <span :class="{ active: step >= 2 }"></span>
          <span :class="{ active: step >= 3 }"></span><span></span>
        </div>
      </header>

      <div v-if="step === 1" class="category-card">
        <div class="card-intro">
          <h2>Choisissez votre catégorie</h2>
          <p>Pour quel type de projet créez-vous cette cagnotte ?</p>
        </div>

        <section
          v-for="group in groups"
          :key="group.title"
          class="category-group"
        >
          <h3>
            <span aria-hidden="true">{{ group.icon }}</span> {{ group.title }}
          </h3>
          <div class="category-grid">
            <button
              v-for="[label, imageIndex] in group.items"
              :key="label"
              type="button"
              class="category-tile"
              :class="{ selected: selectedCategory === label }"
              :style="tileStyle(imageIndex)"
              :aria-pressed="selectedCategory === label"
              @click="selectedCategory = label"
            >
              <span>{{ label }}</span>
            </button>
          </div>
        </section>

        <footer class="card-footer">
          <button
            class="continue-button"
            type="button"
            :disabled="!selectedCategory"
            @click="goToProject"
          >
            Continuer <ArrowRight :size="17" />
          </button>
        </footer>
      </div>

      <form
        v-else-if="step === 2"
        class="category-card project-form"
        @submit.prevent="goToCustomize"
      >
        <div class="card-intro">
          <h2>Présenter mon projet</h2>
        </div>

        <div class="field title-field">
          <label for="fundraiser-title">
            Titre de la cagnotte <span aria-hidden="true">*</span>
            <small>/ 80</small>
          </label>
          <input
            id="fundraiser-title"
            v-model="title"
            maxlength="80"
            type="text"
            placeholder="Titre de la cagnotte"
            required
          />
          <span class="character-count" aria-live="polite"
            >{{ title.length }}/80</span
          >
        </div>

        <div class="option-row">
          <div>
            <strong>Définir un montant à atteindre</strong>
            <span
              >Vous pourrez toujours modifier votre objectif plus tard.</span
            >
          </div>
          <label class="switch">
            <input v-model="hasGoal" type="checkbox" />
            <span></span>
            <b class="sr-only">Définir un montant à atteindre</b>
          </label>
        </div>

        <div v-if="hasGoal" class="field">
          <label for="fundraiser-goal">Objectif (€)</label>
          <input
            id="fundraiser-goal"
            v-model="goal"
            type="number"
            min="1"
            inputmode="numeric"
            placeholder="Ex: 1000"
            required
          />
        </div>

        <div class="option-row">
          <div>
            <strong>Cacher le montant des participations</strong>
            <span>Les montants ne seront pas visibles publiquement.</span>
          </div>
          <label class="switch">
            <input v-model="hideContributions" type="checkbox" />
            <span></span>
            <b class="sr-only">Cacher le montant des participations</b>
          </label>
        </div>

        <div class="field">
          <label for="fundraiser-date">Date de fin (optionnelle)</label>
          <input id="fundraiser-date" v-model="endDate" type="date" />
        </div>

        <footer class="form-footer">
          <button class="previous-button" type="button" @click="step = 1">
            <ArrowLeft :size="17" /> Précédent
          </button>
          <button
            class="continue-button"
            type="submit"
            :disabled="!formIsValid"
          >
            Continuer <ArrowRight :size="17" />
          </button>
        </footer>
      </form>

      <form v-else class="category-card customize-form" @submit.prevent>
        <div class="card-intro">
          <h2>Personnaliser ma cagnotte <span aria-hidden="true">✏️</span></h2>
        </div>

        <div class="custom-field">
          <label for="fundraiser-photo">Ajouter une photo</label>
          <label
            class="photo-dropzone"
            :class="{ 'has-photo': photoPreview }"
            for="fundraiser-photo"
            @dragover.prevent
            @drop.prevent="onPhotoDrop"
          >
            <img
              v-if="photoPreview"
              :src="photoPreview"
              alt="Aperçu de la photo"
            />
            <span v-else>
              <Upload :size="27" />
              Télécharger une photo
            </span>
          </label>
          <input
            id="fundraiser-photo"
            class="sr-only"
            type="file"
            accept="image/*"
            @change="onPhotoChange"
          />
        </div>

        <div class="custom-field">
          <label for="fundraiser-description">Ajouter une description</label>
          <textarea
            id="fundraiser-description"
            v-model="description"
            rows="6"
          ></textarea>
        </div>

        <fieldset class="visibility-field">
          <legend>Visibilité</legend>
          <div class="visibility-options">
            <label :class="{ selected: visibility === 'public' }">
              <input v-model="visibility" type="radio" value="public" />
              <Globe2 :size="17" />
              <span
                ><strong>Publique</strong><small>Visible par tous</small></span
              >
            </label>
            <label :class="{ selected: visibility === 'private' }">
              <input v-model="visibility" type="radio" value="private" />
              <Lock :size="17" />
              <span
                ><strong>Privée</strong
                ><small>Accès par lien uniquement</small></span
              >
            </label>
          </div>
        </fieldset>

        <footer class="form-footer">
          <button class="previous-button" type="button" @click="step = 2">
            <ArrowLeft :size="17" /> Précédent
          </button>
          <button class="continue-button" type="submit">
            Continuer <ArrowRight :size="17" />
          </button>
        </footer>
      </form>
    </section>
  </main>
</template>

<style scoped>
.create-page {
  min-height: calc(100vh - 64px);
  padding: 48px 20px;
  background: #fdfbf8;
}

.wizard {
  width: min(640px, 100%);
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-text);
}
.back-button {
  padding: 0;
  border: 0;
  background: transparent;
  font: inherit;
  cursor: pointer;
}

.wizard-heading {
  margin-top: 26px;
}
.wizard-heading h1 {
  margin: 0;
  font-size: 1.65rem;
  line-height: 1.15;
}
.wizard-heading p {
  margin: 5px 0 13px;
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

.progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
}
.progress span {
  height: 6px;
  border-radius: 999px;
  background: #f8ddd5;
}
.progress .active {
  background: var(--color-primary);
}

.category-card {
  margin-top: 32px;
  padding: 34px 34px 30px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(64, 43, 33, 0.04);
}

.card-intro h2 {
  margin: 0;
  font-size: 1.2rem;
}
.card-intro p {
  margin: 7px 0 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
.category-group {
  margin-top: 24px;
}
.category-group h3 {
  margin: 0 0 13px;
  color: #606060;
  font-size: 0.77rem;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.category-tile {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 11px;
  background-image: url('../assets/categories/category-sprite.png');
  background-size: 500% 400%;
  cursor: pointer;
  transition:
    transform 0.16s ease,
    border-color 0.16s ease,
    box-shadow 0.16s ease;
}
.category-tile::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.72), transparent 55%);
  pointer-events: none;
}
.category-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(45, 30, 25, 0.16);
}
.category-tile:focus-visible {
  outline: 3px solid rgba(255, 102, 104, 0.3);
  outline-offset: 2px;
}
.category-tile.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 102, 104, 0.18);
}
.category-tile span {
  position: absolute;
  right: 8px;
  bottom: 8px;
  left: 8px;
  color: #fff;
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.2;
  text-align: left;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  z-index: 1;
}

.card-footer {
  margin-top: 34px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
  text-align: right;
}
.continue-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 17px;
  border: 0;
  border-radius: 11px;
  background: var(--color-primary);
  color: #fff;
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.continue-button:disabled {
  background: #ffacad;
  cursor: not-allowed;
}

.project-form {
  padding: 37px 32px 31px;
}
.project-form .card-intro {
  margin-bottom: 27px;
}
.field {
  margin-top: 24px;
}
.field label {
  display: block;
  margin-bottom: 8px;
  color: #242424;
  font-size: 0.88rem;
  font-weight: 700;
}
.field label small {
  color: var(--color-text-muted);
  font-size: 0.76rem;
  font-weight: 500;
}
.field input {
  width: 100%;
  height: 39px;
  padding: 0 13px;
  border: 1px solid #ead8d1;
  border-radius: 11px;
  background: #fff;
  color: var(--color-text);
  font: inherit;
  font-size: 0.9rem;
  outline: none;
  box-shadow: 0 1px 2px rgba(65, 42, 30, 0.04);
}
.field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 102, 104, 0.13);
}
.title-field {
  position: relative;
  margin-top: 0;
  padding-bottom: 18px;
}
.character-count {
  position: absolute;
  right: 1px;
  bottom: 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}
.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 68px;
  margin-top: 20px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #fff0eb;
}
.option-row strong,
.option-row > div > span {
  display: block;
}
.option-row strong {
  font-size: 0.87rem;
}
.option-row > div > span {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}
.switch {
  position: relative;
  flex: 0 0 auto;
  width: 38px;
  height: 22px;
  cursor: pointer;
}
.switch input {
  position: absolute;
  opacity: 0;
}
.switch > span {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: #eadeda;
  transition: background 0.18s ease;
}
.switch > span::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.18s ease;
}
.switch input:checked + span {
  background: var(--color-primary);
}
.switch input:checked + span::after {
  transform: translateX(16px);
}
.switch input:focus-visible + span {
  outline: 3px solid rgba(255, 102, 104, 0.25);
  outline-offset: 2px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 31px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border);
}
.previous-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 0;
  border: 0;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}

.customize-form {
  padding: 37px 32px 31px;
}
.customize-form .card-intro {
  margin-bottom: 27px;
}
.custom-field {
  margin-top: 22px;
}
.custom-field > label,
.visibility-field legend {
  display: block;
  margin-bottom: 9px;
  color: #242424;
  font-size: 0.86rem;
  font-weight: 700;
}
.photo-dropzone {
  display: flex !important;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 160px;
  overflow: hidden;
  border: 2px dashed #f0d4cb;
  border-radius: 12px;
  color: var(--color-text-muted) !important;
  font-weight: 500 !important;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}
.photo-dropzone:hover {
  border-color: var(--color-primary);
  background: #fffaf8;
}
.photo-dropzone > span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.photo-dropzone.has-photo {
  border-style: solid;
}
.photo-dropzone img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.custom-field textarea {
  display: block;
  width: 100%;
  min-height: 118px;
  padding: 10px 13px;
  resize: vertical;
  border: 1px solid #ead8d1;
  border-radius: 11px;
  background: #fff;
  color: var(--color-text);
  font: inherit;
  font-size: 0.88rem;
  line-height: 1.45;
  outline: none;
}
.custom-field textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(255, 102, 104, 0.13);
}
.visibility-field {
  min-width: 0;
  margin: 20px 0 0;
  padding: 0;
  border: 0;
}
.visibility-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.visibility-options > label {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 68px;
  padding: 12px 14px;
  border: 2px solid #eadbd5;
  border-radius: 12px;
  cursor: pointer;
}
.visibility-options > label.selected {
  border-color: var(--color-primary);
  background: #fff8f6;
}
.visibility-options input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--color-primary);
}
.visibility-options strong,
.visibility-options small {
  display: block;
}
.visibility-options strong {
  font-size: 0.85rem;
}
.visibility-options small {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 0.72rem;
}

@media (max-width: 600px) {
  .create-page {
    padding: 28px 14px;
  }
  .wizard-heading {
    margin-top: 20px;
  }
  .category-card {
    margin-top: 24px;
    padding: 24px 16px;
  }
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
  }
  .category-tile span {
    font-size: 0.72rem;
  }
  .visibility-options {
    grid-template-columns: 1fr;
  }
  .photo-dropzone {
    height: 145px;
  }
}
</style>
