import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(localStorage.getItem('fundelio-auth') || 'null')
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
  } catch {
    // Ignore malformed local sessions and let public requests continue.
  }
  return config
})

const toNumber = (value) => (value == null ? 0 : Number(value))

const normalizeFundraiser = (fundraiser) => {
  const raised = (fundraiser.contributions || []).reduce(
    (total, contribution) => total + toNumber(contribution.amount),
    0,
  )

  return {
    ...fundraiser,
    category: fundraiser.category?.name || 'Autre',
    raised,
    goal: toNumber(fundraiser.goalAmount),
    hasGoal: fundraiser.hasGoal,
    visibility: fundraiser.visibility?.toLowerCase() || 'public',
    color: fundraiser.color || 'coral',
    emoji: fundraiser.emoji || '🎁',
    endDate: fundraiser.endDate?.slice(0, 10) || null,
  }
}

export const fetchFundraisers = async () => {
  const { data } = await api.get('/fundraisers')
  return data.map(normalizeFundraiser)
}

export const fetchCategories = async () => {
  const { data } = await api.get('/categories')
  return data
}

export const registerUser = async (payload) => {
  const { data } = await api.post('/auth/register', payload)
  return data
}

export const loginUser = async (payload) => {
  const { data } = await api.post('/auth/login', payload)
  return data
}

export const fetchMyProfile = async () => {
  const { data } = await api.get('/auth/me')
  return data
}

export const updateMyProfile = async (payload) => {
  const { data } = await api.patch('/auth/me', payload)
  return data
}

export const changeMyPassword = async (payload) => {
  const { data } = await api.patch('/auth/me/password', payload)
  return data
}

export const deleteMyAccount = async (payload) => {
  const { data } = await api.delete('/auth/me', { data: payload })
  return data
}

export const uploadMyProfilePhoto = async (file) => {
  const formData = new FormData()
  formData.append('photo', file)
  const { data } = await api.post('/auth/me/profile-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export const fetchMyProfilePhoto = async () => {
  const { data } = await api.get('/auth/me/profile-photo', {
    responseType: 'blob',
  })
  return data
}

export const deleteMyProfilePhoto = async () => {
  const { data } = await api.delete('/auth/me/profile-photo')
  return data
}

export const createFundraiser = async (payload) => {
  const { data } = await api.post('/fundraisers', payload)
  return data
}

export const fetchMyFundraisers = async () => {
  const { data } = await api.get('/fundraisers/mine')
  return data.map(normalizeFundraiser)
}

export const updateFundraiser = async (id, payload) => {
  const { data } = await api.patch(`/fundraisers/${id}`, payload)
  return normalizeFundraiser(data)
}

export const accessGuestFundraisers = async (payload) => {
  const { data } = await api.post('/fundraisers/access', payload)
  return data.map(normalizeFundraiser)
}

export default api
