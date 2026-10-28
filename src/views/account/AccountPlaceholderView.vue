<script setup>
import { Clock3 } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="placeholder-page" aria-labelledby="placeholder-title">
    <span class="placeholder-icon"><Clock3 :size="22" /></span>
    <p class="eyebrow">ESPACE COMPTE</p>
    <h2 id="placeholder-title">{{ route.meta.title }}</h2>
    <p>{{ route.meta.description }}</p>
    <span class="availability-badge">Bientôt disponible</span>
  </section>
</template>

<style scoped>
.placeholder-page {
  display: grid;
  justify-items: start;
  align-content: center;
  min-height: 470px;
  max-width: 520px;
  margin: 0 auto;
}

.placeholder-icon {
  display: grid;
  width: 48px;
  height: 48px;
  margin-bottom: 20px;
  place-items: center;
  border-radius: 15px;
  color: var(--color-primary-dark);
  background: #fff0eb;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary-dark);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

h2 {
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: clamp(1.5rem, 3vw, 2rem);
}

p:not(.eyebrow) {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}

.availability-badge {
  display: inline-flex;
  margin-top: 22px;
  padding: 8px 12px;
  border-radius: 999px;
  color: #80654d;
  background: #f7efe7;
  font-size: 0.82rem;
  font-weight: 700;
}
</style>
