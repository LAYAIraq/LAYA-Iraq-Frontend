<template>

<!-- content change type modal -->
    
<!-- change content type -->
    <div class="row mb-2" v-if="content">
        <div class="col">
            <b-button variant="warning" block
                    @click="$bvModal.show('author-changeContentType-confirm')">
            <i class="fas fa-edit"></i> {{ i18n.authTools.changeType }}
            </b-button>
        </div>

        <div class="col text-dark" v-html="i18n.authTools.changeTypeTip">
        </div>

        <b-modal id="author-changeContentType-confirm"
             :title="i18n.bModal.changeType.title"
             header-bg-variant="warning"
             ok-variant="warning"
             :ok-title="i18n.bModal.changeType.ok"
             :cancel-title="i18n.bModal.cancel"
             @ok="changeContentType"
             centered>
            <p>
                {{ i18n.bModal.changeType.text }}<b-form-select
                v-model="changetype"
                :options="plugins">
                </b-form-select>
            </p>
        </b-modal>
    </div>
</template>

<script>
import {
    BModal
} from "bootstrap-vue"

export default {
    name: "course-edit-type",
    props: {
        content: Array,
        i18n: Object
    },
    data() {
        return {
            changetype: null,
        }
    },
    methods: {
        changeContentType() {
            if(!this.changetype) return
            console.log("Change type")
            this.updateStep({name: this.changetype, input: null})
        },
    }
    
    
}
</script>