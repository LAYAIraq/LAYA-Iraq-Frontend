<template>
    
    <div class="row mt-3">
        <div class="col">
            <b-button size="sm"
                    variant="warning"
                    class="float-right"
                    @click="$bvModal.show('author-renameCourse-confirm')">
            <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.renameCourse }}
            </b-button>
        </div>

        <div class="col text-dark">
                {{ i18n.authTools.renameCourseTip }}
        </div>
    
        <b-modal id="author-renameCourse-confirm"
                :title="i18n.bModal.renameCourse.title"
                header-bg-variant="warning"
                ok-variant="warning"
                :ok-title="i18n.bModal.renameCourse.ok"
                :cancel-title="i18n.bModal.cancel"
                @ok="renameCourse"
                centered>
            <p>
                {{ i18n.bModal.renameCourse.text }}<input
                type="text"
                v-model="rename"
                class="form-control"
                :placeholder="i18n.bModal.renameCourse.placeholder">
            </p>
        </b-modal>
    </div>

</template>

<script>
import * as i18n from "@/i18n/course-detail"
import { bModal } from "bootstrap-vue"
import { mapGetters, mapState } from "vuex"

export default {
    name: "courseRename",
    data() {
        return {
            rename: ""
        }
    },
    computed: {
        ...mapGetters(["profileLang"]),
        ...mapState(["edit"]),
        i18n()  {
            return i18n[this.profileLang]
        }

    },
    methods: {
        renameCourse() {
            if(!this.rename) return
            this.$store.commit("renameCourse", this.rename)
            
            console.log("new name", this.rename)
            http.delete(`courses/${this.name}`)
                .then(function() {
                let renamed_course = {...this.course}
                renamed_course.name = this.rename
                http.post(`courses`, renamed_course)
                    .catch(err => console.error("Failed course rename:", err))
                    .finally(() => {
                    this.$bvToast.show("author-toast")
                    this.$router.push("/courses")
                    })
                })
                .catch(function() {
                })
        
        }

    }
}
</script>