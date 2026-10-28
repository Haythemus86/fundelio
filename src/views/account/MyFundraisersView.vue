<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  CalendarDays,
  Check,
  Globe2,
  LockKeyhole,
  Pencil,
  Plus,
  Target,
} from 'lucide-vue-next'
import {
  fetchMyFundraisers,
  updateFundraiser,
} from '../../services/fundelioApi'

const fundraisers = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const loadError = ref('')
const editError = ref('')
const editTarget = ref(null)
const form = reactive({
  title: '',
  description: '',
  hasGoal: true,
  goalAmount: '',
  visibility: 'public',
  endDate: '',
})

const totalRaised = computed(() =>
  fundraisers.value.reduce((sum, item) => sum + item.raised, 0),
)

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(new Date(`${date}T12:00:00`))
    : 'Sans date de fin'

const progress = (fundraiser) =>
  fundraiser.goal > 0
    ? Math.min(100, Math.round((fundraiser.raised / fundraiser.goal) * 100))
    : 0

const loadFundraisers = async () => {
  loadError.value = ''
  isLoading.value = true
  try {
    fundraisers.value = await fetchMyFundraisers()
  } catch (error) {
    loadError.value =
      error.response?.data?.message ||
      'Impossible de charger vos cagnottes pour le moment.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadFundraisers)

const openEditor = (fundraiser) => {
  editTarget.value = fundraiser
  editError.value = ''
  Object.assign(form, {
    title: fundraiser.title,
    description: fundraiser.description || '',
    hasGoal: fundraiser.hasGoal,
    goalAmount: fundraiser.goal ? String(fundraiser.goal) : '',
    visibility: fundraiser.visibility,
    endDate: fundraiser.endDate || '',
  })
}

const closeEditor = () => {
  if (isSaving.value) return
  editTarget.value = null
  editError.value = ''
}

const saveFundraiser = async () => {
  editError.value = ''
  isSaving.value = true
  try {
    await updateFundraiser(editTarget.value.id, {
      title: form.title.trim(),
      description: form.description.trim(),
      hasGoal: form.hasGoal,
      goalAmount: form.hasGoal ? Number(form.goalAmount) : null,
      visibility: form.visibility.toUpperCase(),
      endDate: form.endDate || null,
    })
    editTarget.value = null
    await loadFundraisers()
  } catch (error) {
    editError.value =
      error.response?.data?.message || 'Impossible de modifier cette cagnotte.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="my-fundraisers" aria-labelledby="my-fundraisers-title">
    <header class="page-heading">
      <div>
        <p class="eyebrow">MES PROJETS</p>
        <h2 id="my-fundraisers-title">Mes cagnottes</h2>
        <p class="section-description">
          Retrouvez et modifiez les cagnottes créées avec votre compte.
        </p>
      </div>
      <RouterLink class="button-primary" to="/creer-une-cagnotte">
        <Plus :size="17" /> Créer une cagnotte
      </RouterLink>
    </header>

    <div v-if="!isLoading && !loadError" class="summary-grid">
      <article class="summary-card">
        <span class="summary-icon coral"><Target :size="18" /></span>
        <div>
          <strong>{{ fundraisers.length }}</strong
          ><span>Cagnottes</span>
        </div>
      </article>
      <article class="summary-card">
        <span class="summary-icon mint"><Check :size="18" /></span>
        <div>
          <strong>{{ formatAmount(totalRaised) }}</strong>
          <span>Contributions confirmées</span>
        </div>
      </article>
    </div>

    <p v-if="isLoading" class="state-message" role="status">
      Chargement de vos cagnottes…
    </p>
    <p v-else-if="loadError" class="state-message error-state" role="alert">
      {{ loadError }}
      <button class="text-button" type="button" @click="loadFundraisers">
        Réessayer
      </button>
    </p>
    <div v-else-if="fundraisers.length" class="fundraiser-grid">
      <article
        v-for="fundraiser in fundraisers"
        :key="fundraiser.id"
        class="fundraiser-card"
      >
        <div class="fundraiser-art" :class="`art-${fundraiser.color}`">
          <span class="fundraiser-emoji" aria-hidden="true">
            {{ fundraiser.emoji }}
          </span>
          <span
            class="visibility-badge"
            :aria-label="
              fundraiser.visibility === 'public'
                ? 'Cagnotte publique'
                : 'Cagnotte privée'
            "
          >
            <Globe2 v-if="fundraiser.visibility === 'public'" :size="14" />
            <LockKeyhole v-else :size="14" />
            {{ fundraiser.visibility === 'public' ? 'Publique' : 'Privée' }}
          </span>
        </div>

        <div class="fundraiser-body">
          <p class="category-label">{{ fundraiser.category }}</p>
          <h3>{{ fundraiser.title }}</h3>
          <div class="raised-row">
            <strong>{{ formatAmount(fundraiser.raised) }}</strong>
            <span v-if="fundraiser.hasGoal">
              sur {{ formatAmount(fundraiser.goal) }}
            </span>
            <span v-else>collectés</span>
          </div>
          <div
            v-if="fundraiser.hasGoal"
            class="progress-track"
            role="progressbar"
            :aria-valuenow="progress(fundraiser)"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-label="`Progression de ${fundraiser.title}`"
          >
            <span :style="{ width: `${progress(fundraiser)}%` }"></span>
          </div>
          <div class="fundraiser-meta">
            <span
              ><CalendarDays :size="14" />
              {{ formatDate(fundraiser.endDate) }}</span
            >
            <span
              v-if="fundraiser.status === 'COMPLETED'"
              class="status-complete"
            >
              <Check :size="13" /> Terminée
            </span>
          </div>
          <div class="card-actions">
            <button
              class="button-primary"
              type="button"
              @click="openEditor(fundraiser)"
            >
              <Pencil :size="15" /> Modifier
            </button>
          </div>
        </div>
      </article>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon"><Target :size="22" /></span>
      <h3>Vous n’avez pas encore de cagnotte</h3>
      <p>
        Créez un projet pour le retrouver ici et le gérer depuis votre compte.
      </p>
      <RouterLink class="button-primary" to="/creer-une-cagnotte">
        <Plus :size="16" /> Créer ma première cagnotte
      </RouterLink>
    </div>

    <div
      v-if="editTarget"
      class="dialog-backdrop"
      role="presentation"
      @click.self="closeEditor"
    >
      <section
        class="edit-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
      >
        <header class="dialog-heading">
          <div>
            <p class="eyebrow">MODIFICATION</p>
            <h3 id="edit-title">Modifier ma cagnotte</h3>
          </div>
          <button
            class="close-button"
            type="button"
            aria-label="Fermer"
            :disabled="isSaving"
            @click="closeEditor"
          >
            ×
          </button>
        </header>

        <form class="edit-form" @submit.prevent="saveFundraiser">
          <label>
            Titre
            <input v-model="form.title" type="text" maxlength="80" required />
          </label>
          <label>
            Description
            <textarea v-model="form.description" rows="4" />
          </label>
          <label class="checkbox-label">
            <input v-model="form.hasGoal" type="checkbox" />
            Définir un objectif de collecte
          </label>
          <label v-if="form.hasGoal">
            Objectif (€)
            <input
              v-model="form.goalAmount"
              type="number"
              min="1"
              step="0.01"
              required
            />
          </label>
          <label>
            Visibilité
            <select v-model="form.visibility">
              <option value="public">Publique</option>
              <option value="private">Privée</option>
            </select>
          </label>
          <label>
            Date de fin <span class="optional">Facultatif</span>
            <input v-model="form.endDate" type="date" />
          </label>

          <p v-if="editError" class="error-state" role="alert">
            {{ editError }}
          </p>
          <div class="dialog-actions">
            <button
              class="button-secondary"
              type="button"
              :disabled="isSaving"
              @click="closeEditor"
            >
              Annuler
            </button>
            <button class="button-primary" type="submit" :disabled="isSaving">
              {{ isSaving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </section>
</template>

<style scoped>
.my-fundraisers {
  display: grid;
  gap: 22px;
}

.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--color-primary-dark);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

h2,
h3,
p {
  margin-top: 0;
}

.page-heading h2 {
  margin-bottom: 5px;
  color: var(--color-text);
  font-size: 1.55rem;
}

.section-description {
  margin-bottom: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

.button-primary,
.button-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 9px 13px;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 0.83rem;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
}

.button-primary {
  color: #fff;
  background: var(--color-primary);
}

.button-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.button-secondary {
  border-color: var(--color-border);
  color: var(--color-text);
  background: #fff;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 13px;
  background: #fff;
}

.summary-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 12px;
}

.summary-icon.coral {
  color: var(--color-primary-dark);
  background: #fff0eb;
}

.summary-icon.mint {
  color: #19826f;
  background: #e8f6f0;
}

.summary-card div {
  display: grid;
  gap: 2px;
}

.summary-card strong {
  color: var(--color-text);
  font-size: 1.1rem;
}

.summary-card span:not(.summary-icon) {
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.state-message {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 15px;
  border-radius: 12px;
  color: var(--color-text-muted);
  background: var(--color-background-soft);
}

.error-state {
  color: #a52c36;
  background: #fff0f0;
}

.text-button {
  border: 0;
  color: var(--color-primary-dark);
  background: transparent;
  font: inherit;
  font-weight: 750;
  text-decoration: underline;
  cursor: pointer;
}

.fundraiser-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.fundraiser-card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 15px;
  background: #fff;
}

.fundraiser-art {
  position: relative;
  display: grid;
  min-height: 138px;
  place-items: center;
  background: #fff0eb;
}

.art-mint {
  background: #e9f7f1;
}

.art-lavender {
  background: #f1ecf8;
}

.art-blue {
  background: #e9f2f8;
}

.fundraiser-emoji {
  font-size: 3.3rem;
}

.visibility-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--color-text-muted);
  background: rgb(255 255 255 / 90%);
  font-size: 0.73rem;
  font-weight: 700;
}

.fundraiser-body {
  display: grid;
  gap: 12px;
  padding: 16px;
}

.category-label {
  margin: 0;
  color: var(--color-primary-dark);
  font-size: 0.75rem;
  font-weight: 750;
}

.fundraiser-body h3 {
  min-height: 2.8em;
  margin: -7px 0 0;
  color: var(--color-text);
  font-size: 1.02rem;
  line-height: 1.4;
}

.raised-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.raised-row strong {
  color: var(--color-text);
  font-size: 1.05rem;
}

.raised-row span {
  color: var(--color-text-muted);
  font-size: 0.81rem;
}

.progress-track {
  height: 7px;
  overflow: hidden;
  border-radius: 99px;
  background: #f0e9e4;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-progress);
}

.fundraiser-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.fundraiser-meta > span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.status-complete {
  color: #19826f;
  font-weight: 700;
}

.card-actions {
  display: flex;
  gap: 9px;
  padding-top: 5px;
  border-top: 1px solid var(--color-border);
}

.card-actions > * {
  flex: 1;
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 11px;
  padding: 42px 18px;
  border: 1px dashed #ded1ca;
  border-radius: 15px;
  background: #fffdfa;
  text-align: center;
}

.empty-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 15px;
  color: var(--color-primary-dark);
  background: #fff0eb;
}

.empty-state h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.08rem;
}

.empty-state p {
  max-width: 430px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.88rem;
  line-height: 1.55;
}

.dialog-backdrop {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: grid;
  overflow-y: auto;
  padding: 18px;
  place-items: center;
  background: rgb(34 29 28 / 48%);
}

.edit-dialog {
  display: grid;
  width: min(560px, 100%);
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 20px 70px rgb(0 0 0 / 18%);
}

.dialog-heading,
.dialog-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.dialog-heading h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.2rem;
}

.close-button {
  width: 34px;
  height: 34px;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-text-muted);
  background: #fff;
  font-size: 1.35rem;
  cursor: pointer;
}

.edit-form {
  display: grid;
  gap: 15px;
}

.edit-form label {
  display: grid;
  gap: 7px;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 700;
}

.edit-form input,
.edit-form select,
.edit-form textarea {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #dcd5d0;
  border-radius: 9px;
  color: var(--color-text);
  background: #fff;
  font: inherit;
  font-size: 0.9rem;
}

.edit-form textarea {
  resize: vertical;
}

.edit-form .checkbox-label {
  display: flex;
  align-items: center;
  gap: 9px;
}

.checkbox-label input {
  width: 17px;
  min-height: 17px;
}

.optional {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
}

.dialog-actions {
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .page-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .summary-grid,
  .fundraiser-grid {
    grid-template-columns: 1fr;
  }
}
</style>
