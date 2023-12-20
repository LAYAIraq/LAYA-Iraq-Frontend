<!--
Filename: course-edit.vue
Use: wrap all course edit tools
Creator: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue,
  ./course-edit-tools
-->
<template>
  <!-- author view -->
  <div class="bg-author py-4">
    <course-edit-header
      :name="name"
      :course-path="coursePath"
      @save="changesToSave = true"
    >
    </course-edit-header>

    <!-- mounts course-edit-wrapper & edit-course-nav -->
    <router-view
      :save-changes="changesToSave"
      :show-toast="() => $bvToast.show('author-toast')"
      @saved="storeCourse"
    ></router-view>

    <course-edit-tools
      v-if="$route.name==='course'"
      :name="name"
      :course-path="coursePath"
      @save="changesToSave = true"
    ></course-edit-tools>

    <b-toast
      id="author-toast"
      :title="y18n('authorTools')"
      static
      variant="success"
      auto-hide-delay="1500"
      class="author-toast"
    >
      {{ y18n('successfulSave') }}
    </b-toast>
  </div>
</template>

<script>
import { locale, routes } from '@/mixins'
import CourseEditHeader from '@/components/course/course-edit/course-edit-header.vue'
import CourseEditTools from '@/components/course/course-edit/course-edit-tools.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CourseEdit',
  components: {
    CourseEditHeader,
    CourseEditTools
  },
  mixins: [
    locale,
    routes
  ],

  data () {
    return {
      changesToSave: false
    }
  },

  computed: {
    ...mapGetters(['course', 'courseContent'])
  },

  watch: {
    courseContent: {
      handler () {
        console.log('courseContent changed, updating routes...')
        this.$store.commit('courseRoutesUpdate')
      },
      deep: true
    }
  },

  methods: {

    /**
     * Function storeCourse: store course in database
     *
     * Author: cmc
     *
     * Last Updated: January 11, 2021
     *  */
    storeCourse () {
      this.$store.dispatch('courseUpdate')
        .then(() => this.$bvToast.show('author-toast'))
        .catch((err) => console.error(err))
    }

  }
}
</script>

<style scoped>
.author-toast {
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11002;
}
</style>
