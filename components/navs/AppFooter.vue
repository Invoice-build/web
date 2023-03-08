<template>
  <footer class="text-center border p-4 bg-gray-300">
    <div class="flex justify-center items-center gap-8">
      <component
        v-for="(link, i) in links"
        :key="`footer-link-${i}`"
        :is="link.tag"
        v-bind="link.attrs"
        class="text-sm text-gray-600 hover:text-black transition-all duration-300">
        {{  link.label }}
      </component>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',

  data () {
    return {
      links: [
        { label: 'about', tag: 'nuxt-link', attrs: { to: '/about' } },
        { label: 'blog', tag: 'nuxt-link', attrs: { to: '/blog' } },
        { label: 'bip', tag: 'nuxt-link', attrs: { to: '/bip' } },
        { label: 'github', tag: 'a', attrs: { href: 'https://github.com/Invoice-build', target: '_blank', rel: 'noreferrer' } },
        { label: 'discord', tag: 'a', attrs: { href: 'https://discord.gg/ymKtqwPjcP', target: '_blank', rel: 'noreferrer' } },
        { label: 'twitter', tag: 'a', attrs: { href: 'https://twitter.com/invoicebuild', target: '_blank', rel: 'noreferrer' } }
      ]
    }
  }
}
</script>

<style>
</style>
