import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    appName: 'Fundelio',
    isLoading: false,
  }),
})
