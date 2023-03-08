<template>
  <div class="py-0 md:py-16">
    <div class="invoice-container mx-auto">
      <div class="bg-blue-100 border border-blue-300 text-blue-500 p-2 rounded mb-4">
        <i class="fas fa-info-circle" />
        V2 coming soon,
        <a
          href="https://invoicebuild.substack.com/"
          target="_blank"
          rel="noreferrer"
          class="underline"
        >
          drop your email
        </a>
        to get early access.
      </div>
      <invoice-form :editable="true" @saved="successHandler" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import CryptoJS from 'crypto-js'
import InvoiceForm from '~/components/forms/InvoiceForm.vue'

export default {
  components: {
    InvoiceForm
  },

  data () {
    return {
      editable: true,
      prefillHash: ''
    }
  },

  computed: {
    ...mapState({
      tokens: state => state.tokens.all
    })
  },

  beforeMount () {
    this.setInvoice({})
    this.setTransactions([])
    this.parsePrefill()
  },

  methods: {
    ...mapMutations({
      showSnackbar: 'snackbars/setCurrent',
      setInvoice: 'invoices/setCurrent',
      setTransactions: 'invoices/eth_transactions/setAll'
    }),

    successHandler (invoice) {
      window.fathom.trackGoal('F7GYUN9K', 0)
      this.$router.push(this.localePath(`/invoices/${invoice.id}`))
      this.showSnackbar({ label: this.$t('alerts.invoice_created'), icon: 'fas fa-check-circle', type: 'success' })
    },

    parsePrefill () {
      try {
        this.prefillHash = decodeURI(this.$route.query.prefill)
        if (this.prefillHash !== 'undefined') {
          const bytes = CryptoJS.AES.decrypt(this.prefillHash, 'invoice.build')
          const prefillData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
          this.setInvoice(prefillData)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="css" scoped>
.invoice-container {
  max-width: 800px;
}
</style>
