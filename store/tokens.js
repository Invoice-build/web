export const state = () => ({
  all: [
    {
      id: 1,
      address: '0x0000000000000000000000000000000000000000',
      network: 'mainnet',
      code: 'ETH',
      standard: 'native'
    }
  ],
  loading: true
})

export const actions = {
  async get ({ commit }) {
    try {
      commit('setLoading', true)
      const tokens = await this.$axios.$get('/tokens')
      commit('setAll', tokens)
      commit('setLoading', false)
      return tokens
    } catch (error) {
      throw error.response
    }
  }
}

export const mutations = {
  setAll (state, tokens) {
    state.all = tokens
  },

  setLoading (state, val) {
    state.loading = val
  }
}
