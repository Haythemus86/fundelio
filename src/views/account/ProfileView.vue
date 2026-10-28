<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Camera,
  Check,
  LockKeyhole,
  Save,
  ShieldAlert,
  Trash2,
  UserRound,
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/authStore'
import {
  changeMyPassword,
  deleteMyAccount,
  deleteMyProfilePhoto,
  fetchMyProfile,
  fetchMyProfilePhoto,
  updateMyProfile,
  uploadMyProfilePhoto,
} from '../../services/fundelioApi'

const auth = useAuthStore()
const router = useRouter()
const profile = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  salutation: '',
  birthDate: '',
  birthCity: '',
  nationality: '',
  countryOfBirth: '',
  countryOfResidence: '',
  profession: '',
  incomeRange: '',
  streetAddress: '',
  city: '',
  postalCode: '',
})

const isLoading = ref(true)
const isSavingProfile = ref(false)
const isChangingPassword = ref(false)
const isUploadingPhoto = ref(false)
const isDeletingPhoto = ref(false)
const isDeletingAccount = ref(false)
const showDeleteConfirmation = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const passwordError = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const deletePassword = ref('')
const profilePhotoInput = ref(null)
const profilePhotoUrl = ref('')

const getErrorMessage = (error, fallback) => {
  const message = error.response?.data?.message
  return Array.isArray(message) ? message.join(' ') : message || fallback
}

const setProfile = (user) => {
  for (const key of Object.keys(profile)) {
    profile[key] = user[key] ?? ''
  }
  profile.birthDate = user.birthDate?.slice(0, 10) || ''
  auth.saveUser(user)
}

const setProfilePhoto = (url) => {
  if (profilePhotoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(profilePhotoUrl.value)
  }
  profilePhotoUrl.value = url
}

const loadProfilePhoto = async () => {
  const photo = await fetchMyProfilePhoto()
  setProfilePhoto(URL.createObjectURL(photo))
}

const loadProfile = async () => {
  errorMessage.value = ''
  isLoading.value = true
  try {
    const user = await fetchMyProfile()
    setProfile(user)
    if (user.hasProfilePhoto) {
      try {
        await loadProfilePhoto()
      } catch {
        errorMessage.value =
          'Le profil est chargé, mais la photo de profil est indisponible.'
      }
    } else {
      setProfilePhoto('')
    }
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      'Impossible de charger votre profil.',
    )
  } finally {
    isLoading.value = false
  }
}

onMounted(loadProfile)
onBeforeUnmount(() => {
  if (profilePhotoUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(profilePhotoUrl.value)
  }
})

const saveProfile = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isSavingProfile.value = true
  try {
    const user = await updateMyProfile({
      ...profile,
      birthDate: profile.birthDate || null,
    })
    setProfile(user)
    successMessage.value = 'Votre profil a été mis à jour.'
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      'Impossible de mettre à jour votre profil.',
    )
  } finally {
    isSavingProfile.value = false
  }
}

const uploadPhoto = async (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  errorMessage.value = ''
  successMessage.value = ''
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'La photo doit faire 5 Mo maximum.'
    return
  }

  isUploadingPhoto.value = true
  try {
    const user = await uploadMyProfilePhoto(file)
    setProfile(user)
    await loadProfilePhoto()
    successMessage.value = 'Votre photo de profil a été mise à jour.'
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      'Impossible de charger cette photo.',
    )
  } finally {
    isUploadingPhoto.value = false
  }
}

const removePhoto = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isDeletingPhoto.value = true
  try {
    const user = await deleteMyProfilePhoto()
    setProfile(user)
    setProfilePhoto('')
    successMessage.value = 'Votre photo de profil a été supprimée.'
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      'Impossible de supprimer la photo de profil.',
    )
  } finally {
    isDeletingPhoto.value = false
  }
}

const savePassword = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  passwordError.value = ''
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = 'Les nouveaux mots de passe ne correspondent pas.'
    return
  }

  isChangingPassword.value = true
  try {
    await changeMyPassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    successMessage.value = 'Votre mot de passe a été modifié.'
  } catch (error) {
    passwordError.value = getErrorMessage(
      error,
      'Impossible de modifier le mot de passe.',
    )
  } finally {
    isChangingPassword.value = false
  }
}

const deleteAccount = async () => {
  errorMessage.value = ''
  isDeletingAccount.value = true
  try {
    await deleteMyAccount({ currentPassword: deletePassword.value })
    auth.logout()
    await router.push('/')
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      'Impossible de supprimer le compte.',
    )
  } finally {
    isDeletingAccount.value = false
  }
}
</script>

<template>
  <div v-if="isLoading" class="profile-loading" role="status">
    Chargement de votre profil…
  </div>

  <div v-else class="profile-page">
    <header class="page-heading">
      <span class="section-icon"><UserRound :size="19" /></span>
      <div>
        <p class="eyebrow">MES INFORMATIONS</p>
        <h2>Mon profil</h2>
        <p class="section-description">
          Gérez les informations personnelles liées à votre compte.
        </p>
      </div>
    </header>

    <p v-if="errorMessage" class="notice error-notice" role="alert">
      {{ errorMessage }}
    </p>
    <p v-if="successMessage" class="notice success-notice" role="status">
      <Check :size="16" /> {{ successMessage }}
    </p>

    <form class="profile-form" @submit.prevent="saveProfile">
      <div class="photo-row">
        <div class="avatar" aria-label="Photo de profil">
          <img
            v-if="profilePhotoUrl"
            :src="profilePhotoUrl"
            alt="Votre photo de profil"
          />
          <UserRound v-else :size="30" aria-hidden="true" />
        </div>
        <div class="photo-actions">
          <strong>Photo de profil</strong>
          <p>JPEG, PNG ou WebP, 5 Mo maximum.</p>
          <div class="button-row">
            <button
              class="button-secondary"
              type="button"
              :disabled="isUploadingPhoto"
              @click="profilePhotoInput?.click()"
            >
              <Camera :size="16" />
              {{ isUploadingPhoto ? 'Envoi…' : 'Choisir une photo' }}
            </button>
            <button
              v-if="auth.user?.hasProfilePhoto"
              class="button-text"
              type="button"
              :disabled="isDeletingPhoto"
              @click="removePhoto"
            >
              Supprimer
            </button>
          </div>
          <input
            ref="profilePhotoInput"
            class="visually-hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Choisir une photo de profil"
            @change="uploadPhoto"
          />
        </div>
      </div>

      <div class="form-grid">
        <label>
          Civilité
          <select v-model="profile.salutation">
            <option value="">Non renseignée</option>
            <option value="Monsieur">Monsieur</option>
            <option value="Madame">Madame</option>
            <option value="Autre">Autre</option>
          </select>
        </label>
        <label>
          Prénom
          <input
            v-model="profile.firstName"
            type="text"
            autocomplete="given-name"
            maxlength="100"
            required
          />
        </label>
        <label>
          Nom
          <input
            v-model="profile.lastName"
            type="text"
            autocomplete="family-name"
            maxlength="100"
            required
          />
        </label>
        <label>
          Nationalité <span class="optional">Facultatif</span>
          <input v-model="profile.nationality" type="text" maxlength="100" />
        </label>
        <label>
          Pays de résidence <span class="optional">Facultatif</span>
          <input
            v-model="profile.countryOfResidence"
            type="text"
            autocomplete="country-name"
            maxlength="100"
          />
        </label>
        <label>
          Téléphone portable <span class="optional">Facultatif</span>
          <input
            v-model="profile.phone"
            type="tel"
            autocomplete="tel"
            maxlength="30"
          />
        </label>
        <label>
          Email <span class="optional">Non modifiable</span>
          <input :value="auth.user?.email || ''" type="email" readonly />
        </label>
        <label>
          Date de naissance <span class="optional">Facultatif</span>
          <input v-model="profile.birthDate" type="date" />
        </label>
        <label>
          Ville de naissance <span class="optional">Facultatif</span>
          <input v-model="profile.birthCity" type="text" maxlength="120" />
        </label>
        <label>
          Pays de naissance <span class="optional">Facultatif</span>
          <input v-model="profile.countryOfBirth" type="text" maxlength="100" />
        </label>
        <label>
          Profession <span class="optional">Facultatif</span>
          <input v-model="profile.profession" type="text" maxlength="120" />
        </label>
        <label>
          Revenu <span class="optional">Facultatif</span>
          <input
            v-model="profile.incomeRange"
            type="text"
            maxlength="100"
            placeholder="Tranche de revenu"
          />
        </label>
      </div>

      <section class="address-section" aria-labelledby="address-title">
        <div class="subsection-heading">
          <h3 id="address-title">Mon adresse</h3>
          <span>Facultatif</span>
        </div>
        <div class="form-grid">
          <label class="wide-field">
            Rue et numéro
            <input
              v-model="profile.streetAddress"
              type="text"
              autocomplete="street-address"
              maxlength="255"
            />
          </label>
          <label>
            Ville
            <input
              v-model="profile.city"
              type="text"
              autocomplete="address-level2"
              maxlength="120"
            />
          </label>
          <label>
            Code postal
            <input
              v-model="profile.postalCode"
              type="text"
              autocomplete="postal-code"
              maxlength="20"
            />
          </label>
        </div>
      </section>

      <div class="form-footer">
        <p class="privacy-note">
          <ShieldAlert :size="16" />
          Seules les informations nécessaires au compte sont obligatoires.
        </p>
        <button
          class="button-primary"
          type="submit"
          :disabled="isSavingProfile"
        >
          <Save :size="16" />
          {{ isSavingProfile ? 'Enregistrement…' : 'Enregistrer mon profil' }}
        </button>
      </div>
    </form>

    <section class="security-section" aria-labelledby="password-title">
      <header class="subsection-heading">
        <div>
          <p class="eyebrow">SÉCURITÉ</p>
          <h3 id="password-title">
            <LockKeyhole :size="18" /> Mon mot de passe
          </h3>
        </div>
      </header>
      <form class="password-form" @submit.prevent="savePassword">
        <label>
          Mot de passe actuel
          <input
            v-model="currentPassword"
            type="password"
            autocomplete="current-password"
            minlength="8"
            required
          />
        </label>
        <label>
          Nouveau mot de passe
          <input
            v-model="newPassword"
            type="password"
            autocomplete="new-password"
            minlength="8"
            maxlength="72"
            required
          />
        </label>
        <label>
          Confirmer le nouveau mot de passe
          <input
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            minlength="8"
            maxlength="72"
            required
          />
        </label>
        <p v-if="passwordError" class="notice error-notice" role="alert">
          {{ passwordError }}
        </p>
        <button
          class="button-primary"
          type="submit"
          :disabled="isChangingPassword"
        >
          <LockKeyhole :size="16" />
          {{
            isChangingPassword ? 'Modification…' : 'Modifier mon mot de passe'
          }}
        </button>
      </form>
    </section>

    <section class="danger-section" aria-labelledby="delete-title">
      <div>
        <p class="eyebrow">SUPPRESSION DU COMPTE</p>
        <h3 id="delete-title">Supprimer mon compte</h3>
        <p>
          Vos informations personnelles seront anonymisées. Les cagnottes et
          contributions resteront dans l’historique.
        </p>
      </div>
      <button
        class="button-danger"
        type="button"
        @click="showDeleteConfirmation = true"
      >
        <Trash2 :size="16" /> Supprimer mon compte
      </button>

      <div
        v-if="showDeleteConfirmation"
        class="dialog-backdrop"
        role="presentation"
        @click.self="showDeleteConfirmation = false"
      >
        <section
          class="delete-dialog"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <span class="danger-icon"><ShieldAlert :size="22" /></span>
          <h3 id="delete-dialog-title">Confirmer la suppression</h3>
          <p>
            Cette action est définitive. Saisissez votre mot de passe pour
            anonymiser le compte.
          </p>
          <form @submit.prevent="deleteAccount">
            <label>
              Mot de passe actuel
              <input
                v-model="deletePassword"
                type="password"
                autocomplete="current-password"
                minlength="8"
                required
              />
            </label>
            <div class="dialog-actions">
              <button
                class="button-secondary"
                type="button"
                :disabled="isDeletingAccount"
                @click="showDeleteConfirmation = false"
              >
                Annuler
              </button>
              <button
                class="button-danger"
                type="submit"
                :disabled="isDeletingAccount"
              >
                {{
                  isDeletingAccount
                    ? 'Suppression…'
                    : 'Confirmer la suppression'
                }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  display: grid;
  gap: 28px;
}

.profile-loading {
  display: grid;
  min-height: 440px;
  place-items: center;
  color: var(--color-text-muted);
}

.page-heading {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.section-icon,
.danger-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 14px;
  color: var(--color-primary-dark);
  background: #fff0eb;
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

.section-description,
.danger-section p:not(.eyebrow) {
  margin-bottom: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.55;
}

.notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 11px 13px;
  border-radius: 10px;
  font-size: 0.88rem;
}

.error-notice {
  color: #a52c36;
  background: #fff0f0;
}

.success-notice {
  color: #17684d;
  background: #eaf7ef;
}

.profile-form,
.security-section,
.danger-section {
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: 15px;
  background: #fff;
}

.profile-form,
.password-form {
  display: grid;
  gap: 20px;
}

.photo-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}

.avatar {
  display: grid;
  width: 78px;
  height: 78px;
  flex: 0 0 auto;
  overflow: hidden;
  place-items: center;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-primary-dark);
  background: var(--color-background-soft);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-actions strong {
  color: var(--color-text);
  font-size: 0.95rem;
}

.photo-actions p {
  margin: 4px 0 10px;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.button-row,
.dialog-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 9px;
}

.form-grid,
.password-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px;
}

label {
  display: grid;
  gap: 7px;
  color: var(--color-text);
  font-size: 0.84rem;
  font-weight: 700;
}

input,
select {
  width: 100%;
  min-height: 43px;
  padding: 10px 12px;
  border: 1px solid #dcd5d0;
  border-radius: 9px;
  color: var(--color-text);
  background: #fff;
  font: inherit;
  font-size: 0.9rem;
}

input:focus,
select:focus {
  outline: 3px solid rgb(255 102 104 / 18%);
  border-color: var(--color-primary);
}

input[readonly] {
  color: var(--color-text-muted);
  background: #f7f5f3;
  cursor: not-allowed;
}

.optional {
  color: var(--color-text-muted);
  font-size: 0.74rem;
  font-weight: 500;
}

.address-section {
  display: grid;
  gap: 13px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border);
}

.subsection-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.subsection-heading h3,
.danger-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 0;
  color: var(--color-text);
  font-size: 1.05rem;
}

.subsection-heading > span {
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.wide-field {
  grid-column: 1 / -1;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border);
}

.privacy-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  max-width: 350px;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.79rem;
  line-height: 1.5;
}

.button-primary,
.button-secondary,
.button-danger,
.button-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 750;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    transform 150ms ease;
}

.button-primary {
  color: #fff;
  background: var(--color-primary);
}

.button-primary:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.button-secondary {
  border-color: var(--color-border);
  color: var(--color-text);
  background: #fff;
}

.button-secondary:hover:not(:disabled) {
  background: var(--color-background-soft);
}

.button-danger {
  color: #fff;
  background: #aa3540;
}

.button-danger:hover:not(:disabled) {
  background: #8e2630;
}

.button-text {
  color: var(--color-text-muted);
  background: transparent;
}

button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.security-section {
  display: grid;
  gap: 18px;
}

.security-section .eyebrow {
  margin-bottom: 5px;
}

.password-form {
  align-items: end;
}

.password-form .notice {
  grid-column: 1 / -1;
}

.password-form .button-primary {
  justify-self: start;
}

.danger-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
  border-color: #f0d7d9;
  background: #fffafa;
}

.danger-section h3 {
  margin-bottom: 7px;
}

.dialog-backdrop {
  position: fixed;
  z-index: 1200;
  inset: 0;
  display: grid;
  padding: 18px;
  place-items: center;
  background: rgb(34 29 28 / 48%);
}

.delete-dialog {
  display: grid;
  width: min(460px, 100%);
  gap: 15px;
  padding: 26px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 20px 70px rgb(0 0 0 / 18%);
}

.delete-dialog h3 {
  margin: 0;
  color: var(--color-text);
}

.delete-dialog p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.dialog-actions {
  justify-content: flex-end;
  margin-top: 5px;
}

@media (max-width: 620px) {
  .profile-page {
    gap: 20px;
  }

  .profile-form,
  .security-section,
  .danger-section {
    padding: 17px;
  }

  .form-grid,
  .password-form {
    grid-template-columns: 1fr;
  }

  .wide-field,
  .password-form .notice {
    grid-column: auto;
  }

  .form-footer {
    align-items: stretch;
  }

  .form-footer .button-primary,
  .password-form .button-primary {
    width: 100%;
  }

  .danger-section {
    align-items: flex-start;
  }

  .danger-section > .button-danger {
    width: 100%;
  }
}
</style>
