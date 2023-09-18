<!--
  Filename: course-nav-follow-set.vue
  Use: This component is used to display the follow set of a course nav item.
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="container">
    <h2 class="row">
      Edit Follow Set
    </h2>
    <div
      v-for="(label, i) in buttonLabels"
      :key="label"
      class="m-2"
    >
      <div class="row">
        <b-button
          size="lg"
          variant="info"
        >
          {{ label }}
        </b-button>
      </div>
      <div class="row">
        <suggesting-input
          class="col"
          :domain="courseContent"
          :keys="['title', 'name', 'id']"
          :inline="false"
          :nested-key="'text'"
          :previous-selection="follow? follow[i]: null"
          :submit-button="false"
          @removed="followEdit(i, null)"
          @tags-selected="followEdit(i, $event)"
        ></suggesting-input>
      </div>
    </div>
    <div>
      <b-button
        variant="success"
        block
        @click="saveFollow"
      >
        <i class="fas fa-save"></i>
        {{ y18n('save') }}
      </b-button>
      <b-button
        variant="warning"
        block
        @click="$router.push({ name: 'course-nav' })"
      >
        {{ y18n('cancel') }}
      </b-button>
    </div>
    <b-modal
      id="follow-incomplete"
      :title="y18n('courseNavEdit.incompleteFollow.title')"
      :cancel-title="y18n('cancel')"
      :ok-title="y18n('courseCreate.modal.ok')"
      header-bg-variant="warning"
      static
      centered
      @ok="$router.push({ name: 'course-nav' })"
    >
      {{ y18n('courseNavEdit.incompleteFollow.msg') }}
    </b-modal>
  </div>
</template>
<script>
import SuggestingInput from '@/components/helpers/suggesting-input.vue'
import { array, locale, routes } from '@/mixins'

export default {
  name: 'CourseNavFollowEdit',
  components: {
    SuggestingInput
  },
  mixins: [array, locale, routes],
  props: {
    contentId: {
      type: String,
      required: true
    },
    follow: {
      type: Array,
      default: () => null
    }
  },
  data () {
    return {
      followSetNew: this.follow.slice()
    }
  },
  computed: {
    /**
     * @function return text of buttons if item is button navigation
     * @author cmc
     * @since v1.3.0
     * @returns {string[]} labels of buttons
     */
    buttonLabels () {
      return this.contentToDisplay.answers.map(el => el.text)
    },
    /**
     * @description return if follow set has been changed
     * @return {boolean}
     */
    followSetChange () {
      for (const i in this.follow) { // forEach does not work correctly
        if (this.follow[i] !== this.followSetNew[i]) {
          return true
        }
      }
      return false
    },
    /**
     * @description returns true if follow set is complete, i.e. has no null values
     * @return {boolean}
     */
    followSetComplete () {
      return this.followSetNew.some(el => !el)
        ? false
        : this.followSetNew.length === this.buttonLabels.length
    }
  },
  methods: {
    /**
     * @description modify followSetNew array so reactivity is intact
     * @param idx index of array
     * @param val new value at index
     */
    followEdit (idx, val) {
      this.followSetNew.splice(idx, 1, val)
    },
    /**
     * @function check if follow set is complete, then store it
     * @author cmc
     * @since v1.3.0
     */
    saveFollow () {
      if (this.followSetComplete) {
        this.$store.commit('courseChapterUpdateFollow', { id: this.contentId, value: this.followSetNew })
        this.$router.push('edit-nav')
      } else {
        this.$bvModal.show('follow-incomplete')
      }
    }
  }
}
</script>
