<!--
  Filename: course-nav-follow-edit.vue
  Use: This component is used to display the follow edit view of a course nav item.
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="container">
    <h2 class="row p-3">
      {{ y18n('courseNavEdit.followEdit') }}
      <span v-if="!componentIsButtonNavigation">
        : {{ contentToDisplay.title.text }}
      </span>
    </h2>
    <div
      v-if="componentIsButtonNavigation"
    >
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
          <i
            v-b-tooltip.top
            class="fas fa-question-circle p-1"
            :title="y18n('courseNavEdit.followEditToolTipButton')"
          ></i>
        </div>
        <div
          v-b-tooltip.top
          class="row"
          :title="replacePattern(y18n('courseNavEdit.followEditToolTipTags'), '<BL>', label)"
        >
          <suggesting-input
            class="col"
            :domain="courseContent"
            :drop-down-button-text="y18n('courseNavEdit.followEditButtonText')"
            :keys="['title', 'name', 'id']"
            :inline="false"
            :nested-key="'text'"
            :no-results-text="y18n('courseNavEdit.followEditSearchNoResult')"
            :previous-selection="follow? follow[i]: null"
            :search-label-text="y18n('courseNavEdit.followEditSearchLabel')"
            :search-input-placeholder="y18n('courseNavEdit.followEditSearchPlaceholder')"
            :submit-button="false"
            @removed="followEdit(null, i)"
            @tags-selected="followEdit($event, i)"
          ></suggesting-input>
        </div>
      </div>
    </div>
    <div
      v-else
      class="m-2"
    >
      <div class="row">
        <suggesting-input
          class="col"
          :domain="courseContent"
          :keys="['title', 'name', 'id']"
          :inline="false"
          :nested-key="'text'"
          :previous-selection="follow"
          :submit-button="false"
          @removed="followEdit(null)"
          @tags-selected="followEdit($event)"
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
        variant="primary"
        block
        @click="$router.back()"
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
      @ok="$router.back()"
    >
      {{ componentIsButtonNavigation
        ? y18n('courseNavEdit.incompleteFollow.msg.buttons')
        : y18n('courseNavEdit.incompleteFollow.msg.std') }}
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SuggestingInput from '@/components/helpers/suggesting-input.vue'
import { array, locale, routes } from '@/mixins'
import { deepCopy } from '@/mixins/general/helpers'

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
      type: [Array, String],
      default: () => null
    }
  },
  data () {
    return {
      followSetNew: null
    }
  },
  computed: {
    ...mapGetters(['courseContent']),
    /**
     * @function return text of buttons if item is button navigation
     * @author cmc
     * @since v1.3.0
     * @returns {string[]} labels of buttons
     */
    buttonLabels () {
      return this.componentIsButtonNavigation
        ? this.contentToDisplay.answers.map(el => el.text)
        : null
    },
    /**
     * @description return if component for follow change is button navigation
     * @return {boolean}
     */
    componentIsButtonNavigation () {
      return this.contentToDisplay.name === 'button-navigation'
    },
    contentToDisplay () {
      return this.courseContent[this.contentId]
    },
    /**
     * @description returns true if follow set is complete, i.e. has no null values
     * @return {boolean}
     */
    followSetComplete () {
      return this.componentIsButtonNavigation
        ? this.followSetNew.some(el => !el) // followSetNew is array
          ? false
          : this.followSetNew.length === this.buttonLabels.length
        : this.followSetNew // followSetNew is string or null
    }
  },
  created () {
    this.followSetNew = this.componentIsButtonNavigation
      ? Array.isArray(this.follow)
        ? deepCopy(this.follow)
        : this.follow
          ? [this.follow]
          : []
      : this.follow ?? null
  },
  methods: {
    /**
     * @description modify followSetNew array so reactivity is intact
     * @param idx index of array
     * @param val new value at index
     */
    followEdit (val, idx) {
      if (idx || typeof idx === 'number') {
        this.followSetNew.splice(idx, 1, val)
      } else {
        this.followSetNew = val
      }
    },
    /**
     * @function check if follow set is complete, then store it
     * @author cmc
     * @since v1.3.0
     */
    saveFollow () {
      if (this.followSetComplete) {
        this.$store.commit('courseChapterUpdateFollow', { id: this.contentId, value: this.followSetNew })
        this.$root.$bvToast.toast(
          this.y18n('profile.application.saved'),
          {
            title: this.y18n('courseNavEdit.followEdit'),
            toaster: 'b-toaster-bottom-center',
            variant: 'success'
          })
        this.$router.back()
      } else {
        this.$bvModal.show('follow-incomplete')
      }
    }
  }
}
</script>
