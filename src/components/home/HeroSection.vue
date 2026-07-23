<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-content">
        <p class="hero-kicker">
          PLATEFORME DE FINANCEMENT PARTICIPATIF &Eacute;THIQUE
        </p>

        <h1 class="hero-title">
          Cr&eacute;ez votre
          <span class="hero-title-accent">cagnotte en ligne</span>
        </h1>

        <p class="hero-description">
          Simple, &eacute;thique et transparent &mdash; financez vos projets
          familiaux, solidaires, associatifs ou entrepreneuriaux en quelques
          minutes.
        </p>

        <div class="hero-actions">
          <RouterLink class="button button-primary" to="/creer-une-cagnotte"
            >+ Cr&eacute;er ma cagnotte</RouterLink
          >
          <RouterLink class="button button-secondary" to="/projects"
            >D&eacute;couvrir les projets &rarr;</RouterLink
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  background: var(--color-background-soft);
  padding: 70px 0;
}

.hero-container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 20px;
}

.hero-content {
  max-width: 650px;
  text-align: left;
}

.hero-kicker {
  margin: 0;
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-title {
  margin: 16px 0 0;
  font-size: clamp(3.5rem, 5vw, 4rem);
  line-height: 1.02;
  font-weight: 800;
  color: var(--color-text);
}

.hero-title-accent {
  display: block;
  color: var(--color-primary);
}

.hero-description {
  margin: 22px 0 0;
  color: var(--color-text-muted);
  font-size: 1.05rem;
  line-height: 1.6;
}

.hero-actions {
  margin-top: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 0.98rem;
  font-weight: 600;
  transition:
    transform 0.15s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button-primary {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(239, 85, 88, 0.18);
}

.button-primary:hover {
  background: var(--color-primary-dark);
  box-shadow: 0 12px 22px rgba(239, 85, 88, 0.24);
}

.button-secondary {
  background: #ffffff;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.button-secondary:hover {
  background: #fffaf8;
  border-color: #e9dbd4;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 56px 0;
  }

  .hero-title {
    font-size: clamp(2.375rem, 10vw, 2.75rem);
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .button {
    width: 100%;
  }
}
</style>
