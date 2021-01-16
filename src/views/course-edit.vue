<template>
    <!-- author view -->
    <div class="ly-bg-author py-4">
        <course-edit-header
        :name="name" :step="step">
        </course-edit-header> 

        <router-view @saved="$emit('updated')"></router-view> <!-- mounts course-edit-wrapper -->

        <div class="container" v-if="$route.name == 'course-detail-view'">

            <course-edit-content :name="name" :step="step"></course-edit-content>
            
            <course-edit-type :name="name" :step="step" @changedType="storeCourse"></course-edit-type>
            
            <course-new-block :name="name" :step="step"> </course-new-block>

            <course-edit-nav></course-edit-nav>

            <course-rename @renamed="$bvToast.show('author-toast')"></course-rename>

            <course-copy @success="$bvToast.show('author-toast')"></course-copy>

            <course-delete-block :name="name" :step="step"></course-delete-block>

            <course-delete :name="name"></course-delete>

            <course-stats></course-stats>

        </div>

        <b-toast id="author-toast"
             :title="i18n.bToast.title"
             static
             variant="success"
             auto-hide-delay="1500"
             class="author-toast">
            {{ i18n.bToast.text }}
        </b-toast>

    </div>
</template>

<script>
import * as i18n from "@/i18n/course-detail/"
import { mapState, mapGetters } from "vuex"
import { 
    courseCopy,
    courseDelete,
    courseDeleteBlock,
    courseEditContent,
    courseEditHeader, 
    courseEditNav, 
    courseEditType, 
    courseNewBlock,
    courseRename,
    courseStats
    } from "./course-edit-tools/"


export default {
    name: "course-edit",
    components: {
        courseCopy,
        courseDelete,
        courseDeleteBlock,
        courseEditContent,
        courseEditHeader,
        courseEditNav,
        courseEditType,
        courseNewBlock,
        courseRename,
        courseStats
    },
    props: {
        name: String,
        step: String
    },
    created() {
        this.$emit("updated")
    },
    computed: {
        ...mapState(["edit"]),
        ...mapGetters(["profileLang", "hasContent", "hasCourse"]),
        i18n () {
            return i18n[this.profileLang]
        }
    },
    methods: {

        updateContent(changedContent) {
            this.course.content = [...changedContent]
            this.storeCourse()
            this.$forceUpdate()
        },
       
        storeCourse() {
            let ctx = this
            let stored = this.$store.dispatch("storeCourse")
            stored.then( (succ) => {
                // console.log(succ)
                ctx.$bvToast.show("author-toast")
                ctx.$emit("saved")
                })
                .catch( (err) => console.error(err))            
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