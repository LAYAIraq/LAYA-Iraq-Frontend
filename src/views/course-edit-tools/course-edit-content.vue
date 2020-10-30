<template>
    <div class="row mb-2" v-if="content()">
        <div class="col">
            <b-button variant="primary" block append
                    :to="{path: 'edit', params: {type: content().name}}">
            <i class="fas fa-edit"></i> {{ i18n.editContent }}
            </b-button>
        </div>

        <div class="col text-dark">
            {{ i18n.editContentTip.replace("{step}", this.step) }}
        </div>
    </div>
</template>

<script>
import * as i18n from "@/i18n/course-edit/content"
import { mapGetters } from "vuex"
import commonMethods from "./common-methods.js"

export default {
    name: "course-edit-content",
    props: {
        name: String,
        step: String
    },
    computed: {
        ...mapGetters(["profileLang", "hasContent"]),
        i18n() {
            return i18n[this.profileLang]
        }
    },
    methods: {
        ...commonMethods
    }

}
</script>