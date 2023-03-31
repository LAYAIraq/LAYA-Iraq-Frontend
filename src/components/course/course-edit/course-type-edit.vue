<!--
Filename: course-type-edit.vue
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
        <i class="fas fa-edit"></i> {{ y18n('type.changeType') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('type.changeTypeTip') }}
    </div>

    <b-modal
      id="author-changeContentType-confirm"
      :title="y18n('type.changeType')"
      header-bg-variant="warning"
      ok-variant="warning"
      :ok-title="y18n('type.modal.ok')"
      :cancel-title="y18n('cancel')"
      centered
      @ok="changeContentType"
    >
      <p>
        {{ y18n('type.modal.text') }}
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
import { mapGetters } from 'vuex'
import { locale, routeProps } from '@/mixins'

export default {
  name: 'CourseTypeEdit',

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
    ...mapGetters(['courseContent']),

    /**
     * contentToDisplay: return current content block
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    contentToDisplay () {
      return this.courseContent[this.pathId]
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
      const lalb = []
      lalb.push({
        value: null,
        text: this.y18n('type.changeTypeText'),
        disabled: true
      })

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
     *
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    changeContentType () {
      if (!this.changetype) return

      const updatedStep = {
        id: this.contentToDisplay.id,
        name: this.changetype,
        title: this.contentToDisplay.title
      }
      // console.log(`Change type of step ${step} to ${updatedStep.name}`)
      this.$store.commit('courseContentSet', updatedStep)
      this.$emit('changedType')
    }
  }
}
</script>
