<script setup>
import { ref } from 'vue'
import { ArrowLeft, ArrowRight } from 'lucide-vue-next'
import AppNavbar from '../components/layout/AppNavbar.vue'

const selectedCategory = ref('')

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
      <RouterLink class="back-link" to="/">
        <ArrowLeft :size="16" />
        Retour
      </RouterLink>

      <header class="wizard-heading">
        <h1 id="page-title">Créer une cagnotte</h1>
        <p>Étape 1/4 — Catégorie</p>
        <div class="progress" aria-label="Étape 1 sur 4">
          <span class="active"></span><span></span><span></span><span></span>
        </div>
      </header>

      <div class="category-card">
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
          >
            Continuer <ArrowRight :size="17" />
          </button>
        </footer>
      </div>
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
}
</style>
