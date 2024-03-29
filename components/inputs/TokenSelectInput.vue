<template>
  <div class="cursor-pointer">
    <transition name="card">
      <div v-if="active" class="relative z-50">
        <div class="w-64 -mt-2 -ml-2 bg-white absolute shadow-lg rounded" @mouseleave="active = false">
          <div class="flex items-center p-2 border-b border-gray-200">
            <img
              :src="require(`~/assets/images/coins/${selected_.code}.svg`)"
              :alt="selected_.code"
              class="w-8 h-8"
            >
            <span class="text-xl font-bold ml-4">{{ selected_.code }}</span>
          </div>
          <ul>
            <li
              v-for="(token, i) in availableTokens"
              :key="i"
              class="flex items-center p-2 hover:bg-gray-100"
              @click="selectHandler(token)"
            >
              <img
                :src="require(`~/assets/images/coins/${token.code}.svg`)"
                :alt="token.code"
                class="w-6 h-6 ml-1"
              >
              <span class="text-base text-gray-700 font-medium ml-5">{{ token.code }}</span>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <img
      :src="require(`~/assets/images/coins/${selected_.code}.svg`)"
      :alt="selected_.code"
      class="w-8 h-8"
      @mouseover="showMenu"
      @click="showMenu"
    >
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

const defaultToken = {
  id: 1,
  address: '0x0000000000000000000000000000000000000000',
  network: 'mainnet',
  code: 'ETH',
  standard: 'native'
}

export default {
  name: 'TokenSelectInput',

  props: {
    network: { type: String, required: true },
    selected: { type: Object, default: () => (defaultToken) },
    disabled: { type: Boolean, default: false }
  },

  data () {
    return {
      selected_: defaultToken,
      active: false
    }
  },

  computed: {
    ...mapState({
      tokens: state => state.tokens.all
    }),

    availableTokens () {
      return this.tokens.filter(token => token !== this.selected_ && token.network === this.network)
    }
  },

  watch: {
    selected (newToken) {
      this.selected_ = newToken
    },

    selected_ (newToken) {
      this.$emit('change', newToken.id)
    },

    network (_) {
      this.selected_ = this.availableTokens[0]
    }
  },

  beforeMount () {
    this.selected_ = this.selected
  },

  methods: {
    ...mapActions({
      getTokens: 'tokens/get'
    }),

    selectHandler (token) {
      this.selected_ = token
      this.active = false
    },

    showMenu () {
      if (!this.disabled) this.active = true
    }
  }
}
</script>
