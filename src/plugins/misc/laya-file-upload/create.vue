<template>
    <div>
        <file-upload>
        </file-upload>
    </div>
    
</template>

<script>
import { mapState, mapGetters } from "vuex"
import VueUploadComponent from "vue-upload-component"
import * as i18n from "@/i18n/plugins/misc/laya-file-upload"
export default {
    name: "laya-file-upload-create",
    components: {
        fileUpload: VueUploadComponent
    },
    data() {
        return {
            files: []
        }
    },
    computed: {
        ...mapGetters(["course"]),
        i18n() {
            return i18n[this.$store.state.profile.lang]
        }
    }
    
}
</script>

<style scoped>

</style>