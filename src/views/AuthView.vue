<script setup>
import { computed, ref } from 'vue'
import { ArrowLeft, ArrowRight, Check, LockKeyhole, Mail } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import AppNavbar from '../components/layout/AppNavbar.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const mode = ref(route.query.mode === 'signup' ? 'signup' : 'login')
const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const mockMessage = ref('')

const isSignup = computed(() => mode.value === 'signup')

const submit = async () => {
  mockMessage.value = ''
  try {
    if (isSignup.value) {
      await auth.register({
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value || undefined,
      })
    } else {
      await auth.login({ email: email.value, password: password.value })
    }
    await router.push(route.query.redirect || '/projects')
  } catch {
    // The store exposes the API error in the form.
  }
}

const useMockProvider = (provider) => {
  auth.error = ''
  mockMessage.value = `Connexion ${provider} simulée pour le développement.`
}

const switchMode = (nextMode) => {
  mode.value = nextMode
  auth.error = ''
  mockMessage.value = ''
}
</script>

<template>
  <AppNavbar />
  <main class="auth-page">
    <section class="auth-layout" aria-labelledby="auth-title">
      <div class="auth-intro">
        <p class="eyebrow">VOTRE ESPACE FUNDELIO</p>
        <h1 id="auth-title">
          {{ isSignup ? 'Créez un espace pour vos projets.' : 'Ravi de vous revoir.' }}
        </h1>
        <p>
          Retrouvez vos cagnottes, partagez vos projets et gardez chaque contribution
          au même endroit.
        </p>
        <div class="auth-proof"><Check :size="16" /> Vos données restent liées à votre compte.</div>
      </div>

      <form class="auth-card" @submit.prevent="submit">
        <div class="auth-card-heading">
          <span class="auth-lock"><LockKeyhole :size="18" /></span>
          <div>
            <h2>{{ isSignup ? 'Créer un compte' : 'Se connecter' }}</h2>
            <p>{{ isSignup ? 'Commencez en moins d’une minute.' : 'Accédez à votre espace Fundelio.' }}</p>
          </div>
        </div>

        <div class="provider-list" aria-label="Fournisseurs de connexion">
          <button type="button" class="provider-button" @click="useMockProvider('Google')">
            <strong>G</strong><span>Continuer avec Google</span>
          </button>
          <button type="button" class="provider-button" @click="useMockProvider('Apple')">
            <strong></strong><span>Continuer avec Apple</span>
          </button>
          <button type="button" class="provider-button" @click="useMockProvider('Microsoft')">
            <strong>▦</strong><span>Continuer avec Microsoft</span>
          </button>
        </div>

        <div class="auth-divider"><span>ou avec votre email</span></div>

        <div v-if="isSignup" class="name-grid">
          <label>Prénom<input v-model="firstName" type="text" autocomplete="given-name" required /></label>
          <label>Nom<input v-model="lastName" type="text" autocomplete="family-name" required /></label>
        </div>
        <label>Email<div class="input-with-icon"><Mail :size="16" /><input v-model="email" type="email" autocomplete="email" required placeholder="vous@exemple.com" /></div></label>
        <label v-if="isSignup">Téléphone <span class="optional">Optionnel</span><input v-model="phone" type="tel" autocomplete="tel" /></label>
        <label>Mot de passe<input v-model="password" type="password" autocomplete="current-password" minlength="8" required placeholder="8 caractères minimum" /></label>

        <p v-if="auth.error" class="form-message error-state" role="alert">{{ auth.error }}</p>
        <p v-if="mockMessage" class="form-message mock-state" role="status">{{ mockMessage }}</p>

        <button class="submit-button" type="submit" :disabled="auth.isLoading">
          {{ auth.isLoading ? 'Patientez…' : isSignup ? 'Créer mon compte' : 'Se connecter' }}
          <ArrowRight :size="17" />
        </button>

        <p class="auth-switch">
          {{ isSignup ? 'Vous avez déjà un compte ?' : 'Pas encore de compte ?' }}
          <button type="button" @click="switchMode(isSignup ? 'login' : 'signup')">
            {{ isSignup ? 'Se connecter' : 'S’inscrire' }}
          </button>
        </p>
        <RouterLink class="back-link" to="/"><ArrowLeft :size="15" /> Retour à l’accueil</RouterLink>
      </form>
    </section>
  </main>
</template>

<style scoped>
.auth-page { min-height: calc(100vh - 64px); padding: 64px 20px 80px; background: radial-gradient(circle at 12% 12%, #fff0e9 0, transparent 34%), #fffdfb; }
.auth-layout { width: min(1060px, 100%); margin: 0 auto; display: grid; grid-template-columns: 0.9fr 1fr; align-items: center; gap: clamp(36px, 7vw, 92px); }
.auth-intro { max-width: 440px; }
.eyebrow { margin: 0 0 12px; color: var(--color-primary-dark); font-size: .72rem; font-weight: 800; letter-spacing: .1em; }
.auth-intro h1 { margin: 0; font-size: clamp(2.15rem, 5vw, 3.7rem); line-height: 1.02; letter-spacing: -.03em; }
.auth-intro > p:not(.eyebrow) { margin: 22px 0 0; color: var(--color-text-muted); font-size: 1.05rem; line-height: 1.65; }
.auth-proof { display: inline-flex; align-items: center; gap: 8px; margin-top: 28px; color: #318b7d; font-size: .88rem; font-weight: 700; }
.auth-card { padding: clamp(24px, 4vw, 38px); border: 1px solid var(--color-border); border-radius: 18px; background: #fff; box-shadow: 0 18px 45px rgba(73, 43, 33, .08); }
.auth-card-heading { display: flex; gap: 13px; align-items: flex-start; }
.auth-lock { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 12px; color: var(--color-primary-dark); background: #ffebe6; }
.auth-card h2 { margin: 0; font-size: 1.45rem; }
.auth-card-heading p { margin: 4px 0 0; color: var(--color-text-muted); font-size: .88rem; }
.provider-list { display: grid; gap: 9px; margin-top: 25px; }
.provider-button { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 43px; border: 1px solid var(--color-border); border-radius: 10px; background: #fff; color: var(--color-text); font: inherit; font-size: .88rem; font-weight: 700; cursor: pointer; }
.provider-button:hover { border-color: var(--color-primary); background: var(--color-background-soft); }
.provider-button strong { width: 20px; font-size: 1rem; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 22px 0 18px; color: #9b8e88; font-size: .75rem; }
.auth-divider::before, .auth-divider::after { content: ''; height: 1px; flex: 1; background: var(--color-border); }
.auth-card label { display: block; margin-top: 14px; color: var(--color-text); font-size: .8rem; font-weight: 700; }
.auth-card input { display: block; width: 100%; min-height: 43px; margin-top: 7px; padding: 10px 12px; border: 1px solid var(--color-border); border-radius: 9px; background: #fff; color: var(--color-text); font: inherit; outline: none; }
.auth-card input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(255, 102, 104, .12); }
.name-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.input-with-icon { position: relative; }
.input-with-icon svg { position: absolute; top: 21px; left: 12px; color: var(--color-text-muted); }
.input-with-icon input { padding-left: 36px; }
.optional { color: var(--color-text-muted); font-weight: 400; }
.form-message { margin: 14px 0 0; padding: 10px 12px; border-radius: 8px; font-size: .82rem; }
.error-state { color: #b84d4f; background: #fff0ef; }
.mock-state { color: #2d7c72; background: #eaf7f3; }
.submit-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 45px; margin-top: 20px; border: 0; border-radius: 10px; background: var(--color-primary); color: #fff; font: inherit; font-weight: 800; cursor: pointer; }
.submit-button:hover { background: var(--color-primary-dark); }
.submit-button:disabled { opacity: .6; cursor: wait; }
.auth-switch { margin: 18px 0 0; text-align: center; color: var(--color-text-muted); font-size: .83rem; }
.auth-switch button { border: 0; padding: 0; background: none; color: var(--color-primary-dark); font: inherit; font-weight: 800; cursor: pointer; }
.back-link { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 20px; color: var(--color-text-muted); font-size: .8rem; text-decoration: none; }
@media (max-width: 760px) { .auth-layout { grid-template-columns: 1fr; gap: 30px; } .auth-intro { max-width: none; text-align: center; } .auth-proof { margin-top: 18px; } }
@media (max-width: 420px) { .name-grid { grid-template-columns: 1fr; gap: 0; } }
</style>
