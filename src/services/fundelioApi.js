import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
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

export const createFundraiser = async (payload) => {
  const { data } = await api.post('/fundraisers', payload)
  return data
}

export default api