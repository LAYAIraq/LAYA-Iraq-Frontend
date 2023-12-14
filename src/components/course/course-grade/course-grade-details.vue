<template>
  <div>
    <div v-if="enrollmentList && enrollmentList.length">
      {{ users }}
      <hr>
      <div v-for="(item, index) in enrollmentList" :key="index">
        {{ item.studentId }}<br>
        {{ getUserById(item.studentId).username }}<br>
        <div :id="'quill-' + index" class="quill-content"></div><br>
        {{ item.freetext }}<br>
        <hr v-if="index !== enrollmentList.length - 1" />
      </div>
    </div>
    <div v-else>
      No enrollment data available.
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Quill from 'quill'

export default {
  data () {
    return {
      FilteredList: [],
      quillInstances: []
    }
  },

  computed: {
    ...mapGetters([
      'users',
      'enrollmentList'
    ])
  },

  watch: {
    enrollmentList: {
      handler (newVal, oldVal) {
        if (newVal.length > 0 && this.enrollmentList) {
          this.initializeQuillEditors()
        }
      },
      immediate: true, // Triggers the handler immediately on component mount
      deep: true // Watches changes deeply in the enrollmentList array
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.initializeQuillEditors()
    })
  },

  created () {
    this.getUserList()
    this.$store.dispatch('getCourseEnrollments', this.$store.getters.course.courseId)
    // console.log('enrollments!')
    // console.log(this.enrollmentList)
    // console.log(this.users)
    // console.log('säää')
    // const listOfIdsToMatch = [3, 4]
    // this.filteredList = this.users.filter(obj => listOfIdsToMatch.includes(obj.id))
    // console.log('FilteredListss:', this.users.filter(obj => listOfIdsToMatch.includes(obj.id)))
    // console.log('FilteredList:', this.filteredList)
    // console.log(this.users)
    // console.log(this.getUserById(3))
  },

  methods: {

    async initializeQuillEditors () {
      await this.$nextTick()
      console.log('tried to load')
      if (this.enrollmentList) {
        this.enrollmentList.forEach((item, index) => {
          console.log(`#quill-${index}`)
          const quill = new Quill(`#quill-${index}`, {
            theme: 'snow',
            readOnly: true
          })
          quill.setContents(item.freetext)
          this.quillInstances.push(quill)
        })
      }
    },

    addQuill (index, content) {
      console.log(`${index}- loading ${content}`)
      const quill = new Quill(`#quill-${index}`, {
        theme: 'snow',
        readOnly: true
      })
      this.quillInstances.push(quill)
    },

    getUserList () {
      if (this.users.length === 0) {
        this.$store.dispatch('userListFetch')
      }
    },

    getUserById (id) {
      if (Array.isArray(this.users)) {
        return this.users.find(user => user.id === id)
      } else {
        console.error('Invalid this.users or it is not an array.')
        return null
      }
    }
  }

}
</script>

<style>
/* Add your table styling here if required */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
