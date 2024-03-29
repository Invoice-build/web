<template>
  <base-form ref="invoiceForm" class="bg-white w-full rounded-none md:rounded shadow-none md:shadow-lg" @submit="submit">
    <div class="p-6">
      <invoice-form-header
        v-model="form"
        :selected-token="selectedToken"
        :editable="editable"
        @change="handleNewForm"
      />

      <div class="flex flex-wrap mt-12 -mx-4">
        <div class="w-full md:w-1/2 px-4">
          <div class="border-b border-gray-300">
            <h2 class="font-medium text-gray-600">
              {{ $t('labels.from') }}
            </h2>
          </div>
          <contact-details
            v-model="form.issuer_contact_attributes"
            :editable="editable"
            @change="(newContact) => { form.issuer_contact_attributes = newContact }"
          />
        </div>
        <div class="w-full md:w-1/2 px-4 mt-8 md:mt-0">
          <div class="border-b border-gray-300">
            <h2 class="font-medium text-gray-600">
              {{ $t('labels.to') }}
            </h2>
          </div>
          <contact-details
            v-model="form.client_contact_attributes"
            :editable="editable"
            @change="(newContact) => { form.client_contact_attributes = newContact }"
          />
        </div>
      </div>

      <div class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.summary') }}
          </h2>
        </div>
        <line-items-card-list
          v-if="$mq === 'sm'"
          v-model="form.line_items_attributes"
          :invoice="form"
          :currency-code="selectedToken.code"
          :editable="editable"
          @change="(newLineItems) => { form.line_items_attributes = newLineItems }"
          @tax-change="taxChangeHandler"
        />
        <line-items-table
          v-else
          v-model="form.line_items_attributes"
          :invoice="form"
          :currency-code="selectedToken.code"
          :editable="editable"
          @change="(newLineItems) => { form.line_items_attributes = newLineItems }"
          @tax-change="taxChangeHandler"
        />
      </div>

      <div v-if="editable || !!form.description" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.information') }}
          </h2>
        </div>
        <div class="mt-4">
          <base-textarea
            v-model="form.description"
            :placeholder="$t('labels.any_additional_info')"
            :disabled="!editable"
          />
        </div>
      </div>

      <invoice-form-payment-details
        v-model="form"
        :editable="editable"
        :invalid-address="invalidPaymentAddress"
        @change="(newForm) => { form = newForm }"
      />

      <invoice-form-settings
        v-model="form"
        :editable="editable"
        @change="(newForm) => { form = newForm }"
      />

      <div v-if="hasTransactions" class="mt-12">
        <div class="border-b border-gray-300">
          <h2 class="text-xl font-medium text-gray-600">
            {{ $t('labels.payments') }}
          </h2>
        </div>
        <transaction-list :transactions="transactions" class="mt-4" />
      </div>

      <invoice-form-actions
        :invoice="form"
        :editable="editable"
        :submitting="submitting"
        :submit-error="submitError"
        :has-pending-tx="hasPendingTx"
        :error="error"
        @signed-tx="$emit('signed-tx')"
      />
    </div>
  </base-form>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapState, mapActions, mapGetters } from 'vuex'
import InvoiceFormHeader from './invoice_form/InvoiceFormHeader.vue'
import InvoiceFormPaymentDetails from './invoice_form/InvoiceFormPaymentDetails.vue'
import InvoiceFormSettings from './invoice_form/InvoiceFormSettings.vue'
import InvoiceFormActions from './invoice_form/InvoiceFormActions.vue'
import ContactDetails from '~/components/data/ContactDetails.vue'
import LineItemsTable from '~/components/tables/line_items_table/LineItemsTable.vue'
import LineItemsCardList from '~/components/lists/line_items_card_list/LineItemsCardList.vue'
import TransactionList from '~/components/lists/transaction_list/TransactionList.vue'
import { isRequired, isEthAddrCheck } from '~/lib/validations'
import { mergeDeep } from '~/lib/utils'

export default {
  name: 'InvoiceForm',

  components: {
    InvoiceFormHeader,
    InvoiceFormPaymentDetails,
    InvoiceFormSettings,
    InvoiceFormActions,
    ContactDetails,
    LineItemsTable,
    LineItemsCardList,
    TransactionList
  },

  props: {
    editable: { type: Boolean, required: true },
    transactions: { type: Array, default: () => [] }
  },

  data () {
    return {
      submitting: false,
      submitError: false,
      invalidPaymentAddress: false,
      error: '',
      form: {
        number: null,
        token_id: null,
        due_at: null,
        description: null,
        tax_bps: 0,
        payment_address: null,
        network: 'mainnet',
        encrypted: false,
        line_items_attributes: [{}],
        issuer_contact_attributes: {
          address_attributes: {}
        },
        client_contact_attributes: {
          address_attributes: {}
        }
      }
    }
  },

  computed: {
    ...mapState({
      invoice: state => state.invoices.current,
      tokens: state => state.tokens.all,
      tokensLoading: state => state.tokens.loading,
      provider: state => state.provider
    }),

    ...mapGetters({
      hasTransactions: 'invoices/eth_transactions/any',
      hasPendingTx: 'invoices/eth_transactions/hasPending'
    }),

    isClient () {
      return !!process.client
    },

    selectedToken () {
      const tokenId = this.invoice?.token_id || this.form?.token_id || 1
      return this.tokens.find(t => t.id === tokenId)
    },

    params () {
      if (this.form.encrypted) return {
        data_hash: this.generateInvoiceHash(),
        password: this.form.password,
        network: this.form.network,
        token_id: this.form.token_id
      }
      return this.form
    }
  },

  watch: {
    invoice: {
      handler (newInvoice) {
        if (!this.editable) this.form = mergeDeep({}, this.form, newInvoice)
      },
      deep: true
    },

    tokensLoading (isLoading) {
      if (!isLoading && Object.keys(this.invoice).length === 0) {
        this.setDefaultToken()
      }
    }
  },

  beforeMount () {
    this.form = mergeDeep({}, this.form, this.invoice)
    if (Object.keys(this.invoice).length === 0) {
      this.setDefaultToken()
    }
  },

  methods: {
    isRequired,

    ...mapActions({
      create: 'invoices/create'
    }),

    async submit () {
      try {
        this.submitting = true
        if (!this.isValidForm()) throw new Error('Please check errors above')

        const invoice = await this.create(this.params)
        this.$emit('saved', invoice)
      } catch (error) {
        this.handleSubmitError(error)
      } finally {
        this.submitting = false
      }
    },

    async handleSubmitError (error) {
      this.error = error.message
      this.submitError = true
      await this.$utils.sleep(2000)
      this.submitError = false
    },

    isValidForm () {
      const validInputs = this.$refs.invoiceForm.validate()
      const validAddress = this.validatePaymentAddress()
      return validInputs && validAddress
    },

    validatePaymentAddress () {
      this.invalidPaymentAddress = false
      if (isEthAddrCheck(this.form.payment_address)) return true
      this.invalidPaymentAddress = true
      return false
    },

    taxChangeHandler (newTaxBps) {
      this.form.tax_bps = newTaxBps
    },

    setDefaultToken (tokenId = null) {
      if (this.$route.query.token) {
        const tokenId = this.parseToken()
        if (tokenId) {
          this.form.token_id = tokenId
          return
        }
      }
      if (this.form.token_id && this.form.token_id !== 1) return
      if (tokenId) {
        this.form.token_id = tokenId
      } else {
        this.form.token_id = this.tokens.find(token => token.code === 'ETH').id
      }
    },

    generateInvoiceHash () {
      return CryptoJS.AES.encrypt(JSON.stringify(this.form), this.form.password).toString()
    },

    handleNewForm (newForm) {
      this.form = newForm
    },

    parseToken () {
      try {
        if (this.$route.query.token) {
          const token = this.tokens.find(token => token.address === this.$route.query.token.toLowerCase())
          return token?.id
        }
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
  }
}
</script>
