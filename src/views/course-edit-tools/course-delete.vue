<template>
    <div class="row mt-3">
        <div class="col">
            <b-button size="sm"
                    variant="danger"
                    class="float-right"
                    @click="$bvModal.show('author-delCourse-confirm')">
            <i class="fas fa-exclamation-circle"></i> {{ i18n.deleteCourse }}
            </b-button>
        </div>

        <div class="col text-dark" v-html="i18n.deleteCourseTip"></div>
                
        <b-modal id="author-delCourse-confirm"
                :title="i18n.modal.title"
                header-bg-variant="danger"
                ok-variant="danger"
                :ok-title="i18n.modal.ok"
                :cancel-title="i18n.modal.cancel"
                @ok="delCourse"
                centered>
        <p v-html="i18n.modal.text"></p>
        </b-modal>

    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import * as i18n from "@/i18n/course-edit/delete-course"
import http from "axios"

export default {
    name: "course-delete",
    props: {
        name: String
    },
    computed: {
        ...mapState(["edit"]),
        ...mapGetters(["profileLang", "course"]),
        i18n() {
            return i18n[this.profileLang]
        }
    },
    methods: {
        delCourse() {
            http.delete(`courses/${this.course.courseId}`)
                .then( () => {
                this.$router.push("/courses")
                })
                .catch(err => console.error("Failed to delete course:", err))
        }
    }

}
</script>