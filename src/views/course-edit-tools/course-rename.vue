<template>
    
    <div class="row mt-3">
        <div class="col">
            <b-button size="sm"
                    variant="warning"
                    class="float-right"
                    @click="$bvModal.show('author-renameCourse-confirm')">
            <i class="fas fa-exclamation-circle"></i> {{ i18n.renameCourse }}
            </b-button>
        </div>

        <div class="col text-dark">
                {{ i18n.renameCourseTip }}
        </div>
    
        <b-modal id="author-renameCourse-confirm"
                :title="i18n.modal.title"
                header-bg-variant="warning"
                ok-variant="warning"
                :ok-title="i18n.modal.ok"
                :cancel-title="i18n.modal.cancel"
                @ok="renameCourse"
                centered>
            <p>
                {{ i18n.modal.text }}<input
                type="text"
                v-model="rename"
                class="form-control"
                :placeholder="i18n.modal.placeholder">
            </p>
        </b-modal>
    </div>

</template>

<script>
import * as i18n from "@/i18n/course-edit/rename/"
import { bModal } from "bootstrap-vue"
import { mapGetters, mapState } from "vuex"

export default {
    name: "courseRename",
    data() {
        return {
            rename: "",
            oldName: ""        
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
            let newName = this.rename
            let step = this.$route.params.step
            this.oldName = this.edit.course.name
            this.$store.commit("renameCourse", newName)
            this.$store.dispatch("updateRenamedCourse", this.oldName)
            this.$router.replace(`/courses/${newName}/${step}`)
            this.$emit("renamed")
        }

    }
}
</script>