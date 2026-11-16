<script setup>
import { computed } from 'vue'
import {
  ChartNoAxesColumn,
  FileText,
  FolderOpen,
  Landmark,
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()

const accountSections = {
  'account-petitions': {
    icon: FileText,
    emptyTitle: 'Aucune pétition disponible',
    emptyDescription: 'Vos pétitions apparaîtront ici lorsqu’elles seront disponibles.',
  },
  'account-surveys': {
    icon: ChartNoAxesColumn,
    emptyTitle: 'Aucun sondage disponible',
    emptyDescription: 'Vos sondages apparaîtront ici lorsqu’ils seront disponibles.',
  },
  'account-transactions': {
    icon: Landmark,
    emptyTitle: 'Aucune transaction disponible',
    emptyDescription:
      'Aucune activité financière n’est disponible pour le moment.',
  },
  'account-documents': {
    icon: FolderOpen,
    emptyTitle: 'Aucun justificatif disponible',
    emptyDescription:
      'Le dépôt sécurisé de justificatifs n’est pas encore disponible.',
  },
}

const page = computed(() => accountSections[route.name])
const isTransactionsPage = computed(
  () => route.name === 'account-transactions',
)
</script>

<template>
  <section class="account-section" :aria-labelledby="`${route.name}-title`">
    <header class="page-heading">
      <span class="section-icon">
        <component :is="page.icon" :size="19" aria-hidden="true" />
      </span>
      <div>
        <p class="eyebrow">ESPACE COMPTE</p>
        <h2 :id="`${route.name}-title`">{{ route.meta.title }}</h2>
        <p class="section-description">{{ route.meta.description }}</p>
      </div>
    </header>

    <div v-if="isTransactionsPage" class="transactions-table-wrapper">
      <table class="transactions-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Statut</th>
            <th scope="col">Montant</th>
            <th scope="col">Solde</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="5">
              <div class="empty-state">
                <component :is="page.icon" :size="24" aria-hidden="true" />
                <strong>{{ page.emptyTitle }}</strong>
                <span>{{ page.emptyDescription }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="empty-state">
      <span class="empty-icon">
        <component :is="page.icon" :size="23" aria-hidden="true" />
      </span>
      <h3>{{ page.emptyTitle }}</h3>
      <p>{{ page.emptyDescription }}</p>
    </div>
  </section>
</template>

<style scoped>
.account-section {
  display: grid;
  gap: 26px;
}

.page-heading {
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.section-icon,
.empty-icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  color: var(--color-primary-dark);
  background: #fff0eb;
}

.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
}

.eyebrow {
  margin: 0 0 5px;
  color: var(--color-primary-dark);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.page-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.45rem;
}

.section-description {
  margin: 7px 0 0;
  color: var(--color-text-muted);
  font-size: 0.88rem;
  line-height: 1.55;
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-height: 300px;
  padding: 38px 20px;
  border: 1px dashed var(--color-border);
  border-radius: 15px;
  color: var(--color-text-muted);
  background: #fffdfa;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
  border-radius: 15px;
}

.empty-state h3,
.empty-state strong {
  margin: 0;
  color: var(--color-text);
  font-size: 1rem;
}

.empty-state p,
.empty-state span {
  max-width: 430px;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.55;
}

.transactions-table-wrapper {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 13px;
}

.transactions-table {
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  text-align: left;
}

.transactions-table th {
  padding: 13px 15px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  background: var(--color-background-soft);
  font-size: 0.8rem;
}

.transactions-table td {
  padding: 0;
}

.transactions-table .empty-state {
  min-height: 240px;
  border: 0;
  border-radius: 0;
  background: var(--color-background);
}
</style>
