<!--
Filename: course-stats.vue
Use: Provide User Stats
Author: cmc
Date: October 27, 2020
Dependencies:
  axios,
  @/mixins/locale.vue
-->

<template>
  <div class="row mt-5">
    <div class="col">
      <b-button
        block
        variant="success"
        @click="$bvModal.show('author-courseStats')"
      >
        <i class="fas fa-info-circle"></i> {{ i18n['stats.seeStats'] }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ i18n['stats.statsTip'] }}
    </div>

    <b-modal
      id="author-courseStats"
      ok-only
      :title="i18n['stats.modal.title']"
      centered
    >
      <p>
        {{ i18n['stats.modal.users'] }}: {{ courseStats.count }}
      </p>
      <p>
        {{ i18n['stats.modal.time'] }}: {{ courseStats.averageTime }}
      </p>
      <p>
        {{ i18n['stats.modal.flags'] }}: 0
      </p>
      <p>
        {{ i18n['stats.modal.stoppedAt'] }}: {{ courseStats.lostUsersAt }}
      </p>
      <p>
        {{ i18n['stats.modal.totalLosses'] }}: {{ courseStats.usersLost }}
      </p>
      <p>
        {{ i18n['stats.modal.feedback'] }}: {{ courseStats.feedbackAverage }}
      </p>
    </b-modal>
  </div>
</template>

<script>
import http from 'axios'
import { locale } from '@/mixins'

export default {
  name: 'CourseStats',

  mixins: [
    locale
  ],

  data () {
    return {
      courseStats: {}
    }
  },

  methods: {

    /**
     * Function fetchCourseStats: get stats for all users
     *
     * Author: cmc
     *
     * Last Updated: October 27,2020
     */
    async fetchCourseStats () { // FIXME: not productive yet
      const ctx = this
      let listEnr = []

      // get data from enrollments
      await http.get('enrollments/getAllByCourseId', {
        params: {
          createDate: this.name
        }
      })
        .then(({ data }) => {
          console.log(data.subs)
          listEnr = data.subs
        })
        .catch(err => {
          console.error(err)
        })

      let stats = (Object)
      stats = { ...stats, count: listEnr.length } // all enrolled users

      // get avg time to completion
      let timeSpent = 0
      let finished = 0
      let notFinished = 0
      const lostAt = []
      const avgFeedback = []

      for (const enrol of listEnr) {
        console.log(enrol)
        if (enrol.finished) {
          const userTime = Date.parse(enrol.lastActivity) - Date.parse(enrol.created)
          console.log(`User time: ${userTime} `)
          timeSpent += userTime
          finished++
        } else { // count as lost if user didn't take action for more than a week
          console.log(`User ${enrol.studentId} didn't finish!`)
          notFinished++
          const lastAct = Date.parse(enrol.lastActivity)
          if (lastAct >= 604800000) {
            lostAt.push(enrol.progress)
          }
        }

        if (enrol.feedback) { // get average of feedback if applicable
          for (const token of enrol.feedback) {
            const highScore = token.options.answers.length
            const avgScore = Number((token.choice.reduce((a, b) => (a + b)) / token.choice.length).toFixed(1))
            console.log(`Score: ${avgScore} of ${highScore} `)
            avgFeedback.push(avgScore)
          }
        }
      }

      console.log(`time spent: ${timeSpent} by ${finished} users who finished`)
      const avgTime = (finished !== 0) ? this.verbalizeTime(timeSpent / finished) : this.verbalizeTime(0)

      console.log(`${notFinished} users didn't finish`)
      const lossCnt = Array(ctx.course.content.length).fill(0)
      console.log(lostAt)
      for (const p of lostAt) { // count where not finished users stopped
        lossCnt[p]++
      }
      const bigLoss = lossCnt.indexOf(Math.max(...lossCnt)) + 1 // Index of Content that lost most users
      console.log(`We lost most users at Content #${bigLoss}`)

      const lostUsers = notFinished - lostAt.length // only count users that didn't do anythin for over a week
      console.log(`We lost ${lostUsers} in total`)

      const fbAvg = avgFeedback
        ? (avgFeedback.reduce((a, b) => (a + b)) / avgFeedback.length).toFixed(1)
        : null // calculate average of averages

      stats = {
        ...stats,
        averageTime: avgTime,
        lostUsersAt: bigLoss,
        usersLost: lostUsers,
        feedbackAverage: fbAvg
      }

      // TODO: get data for flags
      console.log(stats)
      this.courseStats = stats
    },

    /**
     * Function storeFeedback: store feedback
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    storeFeedback () {
      const self = this
      http.patch(`enrollments/${self.enrollment.id}`, { feedback: self.enrollment.feedback })
        .catch(err => console.error('Failed storing course feedback:', err))
        .finally(function () {
        // this.$bvToast.show('author-toast')
        })
    },

    /**
     * Function saveFeedback: save feedback
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    saveFeedback (feedback) {
      const cfb = this.enrollment.feedback
      for (const i in cfb) {
        if (cfb[i].step === this.step) {
          this.updateFeedback(feedback, i)
          return
        }
      }
      this.enrollment.feedback.push(feedback)
      this.storeFeedback()
    },

    /**
     * Function updateFeedback: update Feedback at given index
     *
     * Author: cmc
     *
     * Last Updated: October 27, 2020
     */
    updateFeedback (updatedFeedback, index) {
      this.enrollment.feedback[index] = {
        ...this.enrollment.feedback[index],
        ...updatedFeedback
      }
      console.log('Feedback for step ' + updatedFeedback.step + ' updated!')
      this.storeFeedback()
    }
  }

}
</script>
