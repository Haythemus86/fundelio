<script setup>
import { computed, ref } from 'vue'
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleHelp,
  Eye,
  Filter,
  Globe2,
  LayoutGrid,
  Plus,
  Search,
  Target,
} from 'lucide-vue-next'
import AppNavbar from '../components/layout/AppNavbar.vue'

const search = ref('')
const statusFilter = ref('all')

const fundraisers = [
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
    raised: 800,
    goal: 800,
    endDate: '2026-05-20',
    visibility: 'private',
    emoji: '🎉',
    color: 'lavender',
  },
]

const formatAmount = (amount) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (date) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))

const progress = (fundraiser) =>
  Math.min(100, Math.round((fundraiser.raised / fundraiser.goal) * 100))

const isCompleted = (fundraiser) => fundraiser.raised >= fundraiser.goal

const visibleFundraisers = computed(() => {
  const query = search.value.trim().toLowerCase()

  return fundraisers.filter((fundraiser) => {
    const matchesSearch = [fundraiser.title, fundraiser.category].some(
      (value) => value.toLowerCase().includes(query),
    )
    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active' && !isCompleted(fundraiser)) ||
      (statusFilter.value === 'completed' && isCompleted(fundraiser))

    return matchesSearch && matchesStatus
  })
})

const totalRaised = computed(() =>
  fundraisers.reduce((total, fundraiser) => total + fundraiser.raised, 0),
)

const activeCount = computed(
  () => fundraisers.filter((fundraiser) => !isCompleted(fundraiser)).length,
)

const resetFilters = () => {
  search.value = ''
  statusFilter.value = 'all'
}
</script>

<template>
  <AppNavbar />
  <main class="projects-page">
    <section class="projects-container" aria-labelledby="projects-title">
      <header class="projects-header">
        <div>
          <p class="eyebrow">MON ESPACE</p>
          <h1 id="projects-title">Mes cagnottes</h1>
          <p class="projects-intro">
            Retrouvez toutes vos cagnottes et suivez leur progression en un coup
            d’œil.
          </p>
        </div>
        <RouterLink class="create-project-button" to="/creer-une-cagnotte">
          <Plus :size="17" /> Créer une cagnotte
        </RouterLink>
      </header>

      <section class="stats-grid" aria-label="Résumé de vos cagnottes">
        <article class="stat-card">
          <span class="stat-icon coral-icon"><LayoutGrid :size="18" /></span>
          <div>
            <strong>{{ fundraisers.length }}</strong>
            <span>Cagnottes créées</span>
          </div>
        </article>
        <article class="stat-card">
          <span class="stat-icon mint-icon"><Target :size="18" /></span>
          <div>
            <strong>{{ activeCount }}</strong>
            <span>Encore actives</span>
          </div>
        </article>
        <article class="stat-card">
          <span class="stat-icon lavender-icon"><Check :size="18" /></span>
          <div>
            <strong>{{ formatAmount(totalRaised) }}</strong>
            <span>Montant collecté</span>
          </div>
        </article>
      </section>

      <section class="projects-toolbar" aria-label="Filtrer les cagnottes">
        <label class="search-field">
          <Search :size="17" />
          <span class="sr-only">Rechercher une cagnotte</span>
          <input
            v-model="search"
            type="search"
            aria-label="Rechercher une cagnotte"
            placeholder="Rechercher une cagnotte"
          />
        </label>
        <div class="filter-tabs" role="tablist" aria-label="Statut">
          <button
            v-for="filter in [
              ['all', 'Toutes'],
              ['active', 'En cours'],
              ['completed', 'Terminées'],
            ]"
            :key="filter[0]"
            class="filter-tab"
            :class="{ selected: statusFilter === filter[0] }"
            type="button"
            role="tab"
            :aria-selected="statusFilter === filter[0]"
            @click="statusFilter = filter[0]"
          >
            {{ filter[1] }}
          </button>
        </div>
        <span class="filter-label"><Filter :size="15" /> Filtrer</span>
      </section>

      <section class="fundraisers-section" aria-labelledby="list-title">
        <div class="section-heading">
          <h2 id="list-title">Vos cagnottes</h2>
          <span
            >{{ visibleFundraisers.length }} résultat<span
              v-if="visibleFundraisers.length !== 1"
              >s</span
            ></span
          >
        </div>

        <div v-if="visibleFundraisers.length" class="fundraisers-grid">
          <article
            v-for="fundraiser in visibleFundraisers"
            :key="fundraiser.id"
            class="fundraiser-card"
          >
            <div
              class="fundraiser-visual"
              :class="`visual-${fundraiser.color}`"
            >
              <span class="fundraiser-emoji" aria-hidden="true">{{
                fundraiser.emoji
              }}</span>
              <span
                class="status-badge"
                :class="{ completed: isCompleted(fundraiser) }"
              >
                <Check v-if="isCompleted(fundraiser)" :size="13" />
                {{ isCompleted(fundraiser) ? 'Terminée' : 'En cours' }}
              </span>
            </div>
            <div class="fundraiser-body">
              <div class="fundraiser-title-row">
                <div>
                  <p class="fundraiser-category">{{ fundraiser.category }}</p>
                  <h3>{{ fundraiser.title }}</h3>
                </div>
                <span
                  class="visibility-icon"
                  :title="
                    fundraiser.visibility === 'public' ? 'Publique' : 'Privée'
                  "
                >
                  <Globe2
                    v-if="fundraiser.visibility === 'public'"
                    :size="16"
                  />
                  <CircleHelp v-else :size="16" />
                  <span class="sr-only">{{
                    fundraiser.visibility === 'public' ? 'Publique' : 'Privée'
                  }}</span>
                </span>
              </div>

              <div class="amount-row">
                <strong>{{ formatAmount(fundraiser.raised) }}</strong>
                <span>sur {{ formatAmount(fundraiser.goal) }}</span>
              </div>
              <div
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
                  ><CalendarDays :size="14" /> Jusqu’au
                  {{ formatDate(fundraiser.endDate) }}</span
                >
                <strong>{{ progress(fundraiser) }} %</strong>
              </div>

              <div class="fundraiser-actions">
                <button type="button" class="secondary-action">
                  <Eye :size="15" /> Voir
                </button>
                <button type="button" class="detail-action">
                  Gérer <ArrowRight :size="15" />
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon"><Search :size="22" /></span>
          <h3>Aucune cagnotte trouvée</h3>
          <p>Essayez une autre recherche ou modifiez le filtre sélectionné.</p>
          <button type="button" @click="resetFilters">
            Réinitialiser les filtres
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.projects-page {
  min-height: calc(100vh - 64px);
  padding: 54px 20px 72px;
  background: #fdfbf8;
}

.projects-container {
  width: min(1080px, 100%);
  margin: 0 auto;
}

.projects-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.projects-header h1 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(2rem, 4vw, 2.65rem);
  line-height: 1.1;
}

.projects-intro {
  max-width: 560px;
  margin-top: 11px;
  color: var(--color-text-muted);
  font-size: 0.96rem;
}

.create-project-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 12px 16px;
  border-radius: 11px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.87rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 7px 16px rgba(239, 85, 88, 0.16);
}

.create-project-button:hover {
  background: var(--color-primary-dark);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 34px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 18px;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(64, 43, 33, 0.03);
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 11px;
}

.coral-icon {
  background: #ffebe6;
  color: #e45c5e;
}
.mint-icon {
  background: #e7f5f1;
  color: #3b9b8c;
}
.lavender-icon {
  background: #eeeaff;
  color: #8373c3;
}

.stat-card strong,
.stat-card span {
  display: block;
}

.stat-card strong {
  color: var(--color-text);
  font-size: 1.12rem;
}

.stat-card div span {
  margin-top: 2px;
  color: var(--color-text-muted);
  font-size: 0.76rem;
}

.projects-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 43px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-border);
}

.search-field {
  display: flex;
  align-items: center;
  gap: 9px;
  width: min(300px, 100%);
  padding: 9px 12px;
  border: 1px solid #ead8d1;
  border-radius: 10px;
  background: #fff;
  color: var(--color-text-muted);
}

.search-field input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--color-text);
  font: inherit;
  font-size: 0.82rem;
}

.filter-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-tab {
  padding: 8px 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 0.8rem;
  cursor: pointer;
}

.filter-tab.selected {
  background: #fff0eb;
  color: var(--color-primary-dark);
  font-weight: 700;
}

.filter-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  color: var(--color-text-muted);
  font-size: 0.76rem;
}

.fundraisers-section {
  margin-top: 29px;
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.25rem;
}

.section-heading > span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.fundraisers-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 18px;
}

.fundraiser-card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 2px 5px rgba(64, 43, 33, 0.035);
}

.fundraiser-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 128px;
}

.visual-coral {
  background: linear-gradient(135deg, #ffd9d0, #f6aaa2);
}
.visual-mint {
  background: linear-gradient(135deg, #d8f0e9, #9dd8ca);
}
.visual-lavender {
  background: linear-gradient(135deg, #e6e0fa, #c7b9ee);
}

.fundraiser-emoji {
  font-size: 3.3rem;
  filter: drop-shadow(0 5px 4px rgba(85, 51, 42, 0.1));
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #b45b50;
  font-size: 0.68rem;
  font-weight: 700;
}

.status-badge.completed {
  color: #398a77;
}

.fundraiser-body {
  padding: 17px 17px 15px;
}

.fundraiser-title-row,
.amount-row,
.fundraiser-meta,
.fundraiser-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.fundraiser-category {
  margin: 0 0 5px;
  color: var(--color-primary-dark);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
}

.fundraiser-title-row h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.25;
}

.visibility-icon {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--color-text-muted);
}

.amount-row {
  align-items: baseline;
  margin-top: 21px;
}

.amount-row strong {
  color: var(--color-text);
  font-size: 1.03rem;
}

.amount-row span {
  color: var(--color-text-muted);
  font-size: 0.72rem;
}

.progress-track {
  height: 7px;
  margin-top: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: #f8e6e1;
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
}

.fundraiser-meta {
  margin-top: 9px;
  color: var(--color-text-muted);
  font-size: 0.7rem;
}

.fundraiser-meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.fundraiser-meta strong {
  color: var(--color-primary-dark);
}

.fundraiser-actions {
  margin-top: 17px;
  padding-top: 13px;
  border-top: 1px solid #f2e8e4;
}

.secondary-action,
.detail-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 0.77rem;
  cursor: pointer;
}

.secondary-action {
  color: var(--color-text-muted);
}
.detail-action {
  color: var(--color-primary-dark);
  font-weight: 700;
}

.empty-state {
  margin-top: 18px;
  padding: 60px 20px;
  border: 1px dashed #ead8d1;
  border-radius: 15px;
  background: #fff;
  text-align: center;
}

.empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--color-primary-dark);
}

.empty-state h3 {
  margin: 14px 0 5px;
  color: var(--color-text);
  font-size: 1rem;
}

.empty-state p {
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

.empty-state button {
  margin-top: 15px;
  border: 0;
  background: transparent;
  color: var(--color-primary-dark);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

@media (max-width: 850px) {
  .fundraisers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 650px) {
  .projects-page {
    padding: 36px 14px 55px;
  }
  .projects-header {
    align-items: stretch;
    flex-direction: column;
    gap: 20px;
  }
  .create-project-button {
    align-self: flex-start;
  }
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 27px;
  }
  .projects-toolbar {
    align-items: stretch;
    flex-wrap: wrap;
    margin-top: 30px;
  }
  .search-field {
    width: 100%;
  }
  .filter-label {
    display: none;
  }
  .fundraisers-grid {
    grid-template-columns: 1fr;
  }
}
</style>
