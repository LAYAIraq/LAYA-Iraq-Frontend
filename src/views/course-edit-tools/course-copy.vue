<template>
    <!-- Copy Course -->
    <div class="row mt-3">
        <div class="col">
            <b-button size="sm"
                    variant="warning"
                    class="float-right"
                    @click="$bvModal.show('author-copyCourse-confirm')">
            <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.copyCourse }}
            </b-button>
        </div>

        <div class="col text-dark">
            {{ i18n.authTools.copyCourseTip }}
        </div>

        
        <b-modal id="author-copyCourse-confirm"
             :title="i18n.bModal.copyCourse.title"
             header-bg-variant="warning"
             ok-variant="warning"
             :ok-title="i18n.bModal.copyCourse.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="copyCourse"
             centered>
            <p>
            {{ i18n.bModal.copyCourse.text }}
            <input
                type="text"
                v-model="copy"
                class="form-control"
                :placeholder="i18n.bModal.copyCourse.placeholder">
            </p>
        </b-modal>

        <b-toast id="name-exists"
            :title="i18n.bToast.title"
             static
             variant="danger"
             auto-hide-delay="1500"
             class="author-toast">
            KURSNAME EXISTIERT!
        </b-toast>

    </div>
</template>

<script>
import http from 'axios'
import * as i18n from "@/i18n/course-detail"
import { bModal } from "bootstrap-vue"
import { mapGetters, mapState } from "vuex"

export default {
    name: "course-copy",
    computed: {
        ...mapGetters(["profileLang"]),
        ...mapState(["edit"]),
        i18n() {
            return i18n[this.profileLang]
        }
    },
    data() {
        return{
            copy: ""
        }
    },
    methods: {
        copyCourse() {
            if(!this.copy) return
            console.log("new copy", this.copy)
            http.head(`courses/${this.copy}`)
                .then( () => {
                // course name already exists
                    this.$bvToast.show("name-exists")
                })
                .catch( () => {
                // course name does not exist
                let now = Date.now()
                let copied_course = {...this.$store.state.edit.course}
                copied_course.name = this.copy
                copied_course.createDate = now
                copied_course.lastChanged = now
                console.log(copied_course)
                http.post(`courses`, copied_course)
                    .catch(err => console.error("Failed course copy:", err))
                    .finally(() => this.$emit("success"))
                })
                
        }
    }

}
</script>

<style scoped>
.name-exists {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11005;
}
</style>