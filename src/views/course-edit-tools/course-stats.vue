<template>
    <div class="row mt-5">
        <div class="col">
            <b-button block variant="success" @click="$bvModal.show('author-courseStats')">
            <i class="fas fa-info-circle"></i> {{ i18n.authTools.seeStats }}
            </b-button>
        </div>

        <div class="col text-dark">
            {{ i18n.authTools.statsTip }}
        </div>

        <b-modal ok-only id="author-courseStats"
          :title="i18n.bModal.courseStats.title"
          centered>
            <p>  {{ i18n.bModal.courseStats.users }}: {{ courseStats.count }}</p>
            <p>  {{ i18n.bModal.courseStats.time }}: {{ courseStats.averageTime }} </p>
            <p>  {{ i18n.bModal.courseStats.flags }}: 0</p>
            <p>  {{ i18n.bModal.courseStats.stoppedAt }}: {{courseStats.lostUsersAt}}</p>
            <p>  {{ i18n.bModal.courseStats.totalLosses }}: {{ courseStats.usersLost}} </p>
            <p>  {{ i18n.bModal.courseStats.feedback }}: {{ courseStats.feedbackAverage }} </p>
        </b-modal>

    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import * as i18n from "@/i18n/course-detail"

export default {
    name: "course-stats",
    data() {
        return{
            courseStats: {}
        }
    },
    computed: {
        ...mapState(["edit"]),
        ...mapGetters(["profileLang"]),
        i18n() {
            return i18n[this.profileLang]
        }
    },
    methods: { //FIXME
        async fetchCourseStats() {
            const ctx = this
            let listEnr = []

            //get data from enrollments
            await http.get('enrollments/getAllByCourseId', {params: {createDate: this.name}})
                .then(({data}) => {
                console.log(data.subs)
                listEnr = data.subs
                })
                .catch(err => {
                console.error(err)
                })

            let stats = (Object)
            stats = {...stats, count: listEnr.length} //all enrolled users 

            //get avg time to completion
            let timeSpent = 0
            let finished = 0
            let notFinished = 0
            let lostAt = []
            let now = Date.now()
            let avgFeedback = []

            for (const enrol of listEnr) {
                console.log(enrol)
                if (enrol.finished) {
                let userTime = Date.parse(enrol.lastActivity) - Date.parse(enrol.created)
                console.log(`User time: ${userTime} `)
                timespent += userTime
                finished ++
                }
                else { //count as lost if user didn't take action for more than a week
                console.log(`User ${enrol.studentId} didn't finish!`)
                notFinished++
                let lastAct = Date.parse(enrol.lastActivity)
                lastAct >= 604800000? lostAt.push(enrol.progress) : null
                }

                if (enrol.feedback) { // get average of feedback if applicable
                for(let token of enrol.feedback) {
                    let highScore = token.options.answers.length
                    let avgScore = Number((token.choice.reduce((a,b) => (a+b)) / token.choice.length).toFixed(1))
                    console.log(`Score: ${avgScore} of ${highScore} `)
                    avgFeedback.push(avgScore)
                }
                }
            }

            console.log(`time spent: ${timeSpent} by ${finished} users who finished`)
            let avgTime = (finished != 0)? this.verbalizeTime(timeSpent/finished): this.verbalizeTime(0)
            
            console.log(`${notFinished} users didn't finish`)
            let lossCnt = Array(ctx.course.content.length).fill(0)
            console.log(lostAt)
            for (let p of lostAt) { //count where not finished users stopped
                lossCnt[p]++
            }
            let bigLoss = lossCnt.indexOf(Math.max(...lossCnt)) + 1 // Index of Content that lost most users
            console.log(`We lost most users at Content #${bigLoss}`)

            let lostUsers = notFinished - lostAt.length //only count users that didn't do anythin for over a week
            console.log(`We lost ${lostUsers} in total`)

            let fbAvg = avgFeedback? (avgFeedback.reduce((a,b) => (a+b)) / avgFeedback.length).toFixed(1) : null //calculate average of averages 

            stats = {...stats, averageTime: avgTime, lostUsersAt: bigLoss, usersLost: lostUsers, feedbackAverage: fbAvg}
            
            

            //TODO: get data for flags

            console.log(stats)
            this.courseStats = stats

            },

            storeFeedback() {
                const self = this
                http.patch(`enrollments/${self.enrollment.id}`, {feedback: self.enrollment.feedback})
                .catch(err => console.error("Failed storing course feedback:", err))
                .finally(function() {
                    //this.$bvToast.show("author-toast")
                })
             },

            saveFeedback(feedback) {
                var cfb = this.enrollment.feedback
                for (var i in cfb) {
                    if(cfb[i].step == this.step) {
                    this.updateFeedback(feedback, i)
                    return
                    }
                }
                this.enrollment.feedback.push(feedback)
                this.storeFeedback()
            },

            updateFeedback(updatedFeedback, index) {
                this.enrollment.feedback[index] = {
                    ...this.enrollment.feedback[index], ...updatedFeedback
                    }
                console.log("Feedback for step "+ updatedFeedback.step + " updated!")
                this.storeFeedback()
            },

            /* storeFeedback() {
            const self = this
            http.patch(`enrollments/${self.enrollment.id}`, {feedback: self.enrollment.feedback})
                .catch(err => console.error("Failed storing course feedback:", err))
                .finally(function() {
                //this.$bvToast.show("author-toast")
                })
            }, */
    }

}
</script>