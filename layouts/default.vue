<template>
  <div>
    <Nuxt />
    <app-footer />
    <app-nav />
    <app-snackbars />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import AppNav from '~/components/navs/AppNav.vue'
import AppSnackbars from '~/components/alerts/AppSnackbars.vue'
import AppFooter from '~/components/navs/AppFooter.vue'

export default {
  components: {
    AppNav,
    AppSnackbars,
    AppFooter
  },

  async beforeMount () {
    try {
      await this.getTokens()
    } catch (error) {
      console.error(error)
    }
  },

  methods: {
    ...mapActions({
      getTokens: 'tokens/get'
    })
  },

  head: {
    bodyAttrs: {
      class: 'bg-gray-100'
    }
  }
}
</script>

<style>
</style>
