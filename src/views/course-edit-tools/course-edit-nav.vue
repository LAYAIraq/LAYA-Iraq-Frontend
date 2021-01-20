<template>
    <div class="row mb-2" v-if="hasContent.length > 0">
        <div class="col">
            <b-button block variant="primary" append :to="{path: 'editNav'}">
            <i class="fas fa-project-diagram"></i> {{ i18n.editNav }}
            </b-button>
        </div>

        <div class="col text-dark">
            <span v-if="courseNavIncomplete()"
                class="bg-warning mr-1 rounded"
                style="padding: 2px 5px">
            <i class="fas fa-exclamation-triangle"></i> {{ i18n.editNavIncomplete }}
            </span>
            {{ i18n.editNavTip.replace("{steps}", hasContent.length ) }}
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex"
import * as i18n from "@/i18n/course-edit/nav/"

export default {
    name: "course-edit-nav",
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(["profileLang", "hasContent"]),
        i18n() {
            return i18n[this.profileLang]
        }
    },
    methods: {
        courseNavIncomplete() {
            return this.hasContent.reduce((all, c) => (!c.nextStep || all), false)
        },
    }
}
</script>

<style scoped>

</style>