<!--
  Filename: course-nav-follow-set.vue
  Use: This component is used to display the follow set of a course nav item.
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div class="container">
    <div>
      <div>
        Add following content
      </div>
      <div
        v-if="multiple"
      >
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
              :previous-selection="followSet? followSet[i]: null"
              :submit-button="false"
              @removed="_itemDelete(followSetNew, i)"
              @tags-selected="followSetNew[i] = $event"
            ></suggesting-input>
          </div>
        </div>
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
    </div>
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
    coursePath: {
      type: String,
      default: () => ''
    },
    follow: {
      type: [String, Array],
      default: () => null
    }
  },
  data () {
    return {
      followSetChange: null,
      followSetNew: []
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
      return this.multiple
        ? this.contentToDisplay.answers.map(el => el.text)
        : null
    },
    /**
     * @function return follow set as array
     * @author cmc
     * @since v1.3.0
     * @returns {string[] | null} array of follow ids
     */
    followSet () {
      return this.follow
        ? Array.isArray(this.follow) // either array or string
          ? this.follow // return array as is
          : [this.follow] // return string as single item in array
        : null
    },
    /**
     * @function returns false if any value in followSetNew is undefined
     * @author cmc
     * @since v1.3.0
     * @return {boolean} true if followSetNew is filled with non-null values
     */
    followSetNewComplete () {
      this.followSetNew.forEach(el => {
        if (!el) { return false }
      })
      return true
    },
    /**
     * @function return true if content block is button navigation
     * @author cmc
     * @since v1.3.0
     * @return {boolean} true if content block name is 'button-navigation'
     */
    multiple () {
      return this.contentToDisplay.name === 'button-navigation'
    }
  },
  methods: {
    /**
     * @function check if follow set is complete, then store it
     * @author cmc
     * @since v1.3.0
     */
    saveFollow () {
      if (this.followSetNewComplete) {
        this.$store.commit()
      }
    }
  }
}
</script>
