<!--
Filename: course-edit-type.vue
Use: edit type of current content block
Author: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <!-- change content type -->
  <div
    v-if="contentToDisplay"
    class="row mb-2"
  >
    <div class="col">
      <b-button
        variant="warning"
        block
        @click="$bvModal.show('author-changeContentType-confirm')"
      >
        <i class="fas fa-edit"></i> {{ i18n['type.changeType'] }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ i18n['type.changeTypeTip'] }}
    </div>

    <b-modal
      id="author-changeContentType-confirm"
      :title="i18n['type.changeType']"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="i18n['type.modal.ok']"
      :cancel-title="i18n['cancel']"
      centered
      @ok="changeContentType"
    >
      <p>
        {{ i18n['type.modal.text'] }}
        <b-form-select
          v-model="changetype"
          :options="plugins"
        >
        </b-form-select>
      </p>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { locale, routeProps } from '@/mixins'

export default {
  name: 'CourseEditType',

  mixins: [
    locale,
    routeProps
  ],

  data () {
    return {
      changetype: null
    }
  },

  computed: {
    ...mapGetters(['profileLang', 'content']),
    ...mapState(['edit']),

    /**
     * contentToDisplay: return current content block
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    contentToDisplay () {
      return this.content[this.step - 1]
    },

    /**
     * plugins: make localized names of laya plugins available
     *  as computed property
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    plugins () {
      const la = this.$laya.la
      const lb = this.$laya.lb
      const lalb = [
        {
          value: null,
          text: this.i18n['type.changeTypeText'],
          disabled: true
        }
      ]

      // add lb elements by name and id
      for (const id in lb) {
        lalb.push({
          value: id,
          text: this.i18n[lb[id].name + '.name']
        })
      }
      // add la elements by name and id
      for (const id in la) {
        lalb.push({
          value: id,
          text: this.i18n[la[id].name + '.name']
        })
      }

      return lalb
    }
  },
  methods: {

    /**
     * Function changeContentType: change content type, remove all
     *  input for old type
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    changeContentType () {
      if (!this.changetype) return

      const step = this.step - 1
      const updatedStep = {
        name: this.changetype,
        input: null,
        nextStep: null
      }
      // console.log(`Change type of step ${step} to ${updatedStep.name}`)
      this.$store.commit('updateStep', {
        step,
        updatedStep
      })
      this.$emit('changedType')
    }
  }
}
</script>
