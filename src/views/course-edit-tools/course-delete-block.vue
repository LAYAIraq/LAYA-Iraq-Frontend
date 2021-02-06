<template>
    <div class="row mt-5" v-if="content">
        <div class="col">
            <b-button size="sm"
                    variant="danger"
                    class="float-right"
                    @click="$bvModal.show('author-delContent-confirm')">
                <i class="fas fa-exclamation-circle"></i> {{ i18n.deleteContent }}
            </b-button>
        </div>

        <div class="col text-dark">
            {{ i18n.deleteContentTip }}
        </div>

        <b-modal id="author-delContent-confirm"
             :title="i18n.modal.title"
             header-bg-variant="danger"
             ok-variant="danger"
             :ok-title="i18n.modal.ok"
             :cancel-title="i18n.modal.cancel"
             @ok="delContent"
             centered>
            <p>{{ i18n.modal.text }}</p>
        </b-modal>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import * as i18n from "@/i18n/course-edit/delete-block"

export default {
    name: "course-delete-block",
    props: {
        name: String,
        step: String
    },
    computed: {
        ...mapGetters(["hasContent", "profileLang"]),
        ...mapState(["edit"]),
        i18n() {
            return i18n[this.profileLang]
        }

    },
    methods: {
        content() {
            return this.hasContent[this.step-1]
        },
        delContent() {
            this.$store.commit("delContent", this.step-1) 
            this.$store.dispatch("storeCourse")
        }
    }
}
</script>