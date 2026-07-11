import pluginVue from 'eslint-plugin-vue'
import vueConfigPrettier from '@vue/eslint-config-prettier'

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  ...pluginVue.configs['flat/essential'],
  vueConfigPrettier,
]
