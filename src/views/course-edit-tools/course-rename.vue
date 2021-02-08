<template>
    
    <div class="row mt-3">
        <div class="col">
            <b-button size="sm"
                    variant="warning"
                    class="float-right"
                    @click="$bvModal.show('author-rename-course-confirm')">
            <i class="fas fa-exclamation-circle"></i> {{ i18n.renameCourse }}
            </b-button>
        </div>

        <div class="col text-dark">
                {{ i18n.renameCourseTip }}
        </div>
    
        <b-modal id="author-rename-course-confirm"
                :title="i18n.modal.title"
                header-bg-variant="warning"
                ok-variant="warning"
                :ok-title="i18n.modal.ok"
                :cancel-title="i18n.modal.cancel"
                @ok="duplicateCheck"
                centered>
            <p>
                {{ i18n.modal.text }}<input
                type="text"
                v-model="rename"
                class="form-control"
                :placeholder="i18n.modal.placeholder">
            </p>
            <p class="text-danger form-control-plaintext text-right" v-if="dupeName"> 
                {{ i18n.modal.dupeName}} 
            </p>
        </b-modal>
    </div>

</template>

<script>
import * as i18n from "@/i18n/course-edit/rename/"
import { mapGetters, mapState } from "vuex"

export default {
    name: "courseRename",
    data() {
        return {
            rename: "",
            oldName: "",
            dupeName: false      
        }
    },
    computed: {
        ...mapGetters(["profileLang", "courseList"]),
        ...mapState(["edit"]),
        i18n()  {
            return i18n[this.profileLang]
        }

    },
    methods: {
        renameCourse() {
                    
            let newName = this.rename
            let step = this.$route.params.step
            let oldId = this.edit.course.courseId
            this.$store.commit("renameCourse", newName)
            this.$store.dispatch("updateRenamedCourse", oldId)
            this.$router.replace(`/courses/${newName}/${step}`)
            this.$emit("renamed")
            this.$nextTick( () => {
                    this.$bvModal.hide('author-rename-course-confirm')
                })
            
        },
        duplicateCheck(click) {
            click.preventDefault()
            if(!this.rename) {
                this.$nextTick( () => {
                    this.$bvModal.hide('author-rename-course-confirm')
                })
                return
            }
            if(!this.courseList) this.$store.dispatch("fetchCourseList")
            if(this.courseList.some( e => e.name == this.rename)) {
                this.dupeName = true
            }
            else {
                this.dupeName = false
                this.renameCourse()
            }
        }

    }
}
</script>