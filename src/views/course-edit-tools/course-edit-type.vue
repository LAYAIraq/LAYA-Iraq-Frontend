<template>

<!-- change content type -->
    <div class="row mb-2" v-if="contentToDisplay">
        <div class="col">
            <b-button variant="warning" block
                    @click="$bvModal.show('author-changeContentType-confirm')">
            <i class="fas fa-edit"></i> {{ i18n.changeType }}
            </b-button>
        </div>

        <div class="col text-dark" v-html="i18n.changeTypeTip">
        </div>

        <b-modal id="author-changeContentType-confirm"
             :title="i18n.modal.title"
             header-bg-variant="warning"
             ok-variant="warning"
             :ok-title="i18n.modal.ok"
             :cancel-title="i18n.modal.cancel"
             @ok="changeContentType"
             centered>
            <p>
                {{ i18n.modal.text }}<b-form-select
                v-model="changetype"
                :options="plugins">
                </b-form-select>
            </p>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import * as  i18n from "@/i18n/course-edit/type"

export default {
    name: "course-edit-type",
    props: {
        name: String,
        step: String
    },
    data() {
        return {
            changetype: null,
        }
    },
    
    computed: {
        ...mapGetters(["profileLang", "content"]),
        ...mapState(["edit"]),
        contentToDisplay() {
            return this.content[this.step-1]
        },
        i18n() {
            return i18n[this.profileLang]
        },
        plugins() {
            const la = this.$laya.la
            const lb = this.$laya.lb
            let lalb = [{value: null, text: this.i18n.changeTypeText, disabled: true}]
            let lang = this.profileLang
            for(const id in lb) {
                if (lb[id].i18n.hasOwnProperty(lang))
                lalb.push({value: id, text: lb[id].i18n[lang].name})
                else lalb.push({value: id, text: lb[id].i18n.de.name})
            }
            for(const id in la)
                if (la[id].i18n.hasOwnProperty(lang))
                lalb.push({value: id, text: la[id].i18n[lang].name})
                else lalb.push({value: id, text: la[id].i18n.de.name})
            return lalb
        }
    },
    methods: {
        changeContentType() {
            if(!this.changetype) return
            
            let step = this.step-1
            const updatedStep = {
                name: this.changetype,
                input: null,
                nextStep: null
            }
            // console.log(`Change type of step ${step} to ${updatedStep.name}`)
            this.$store.commit("updateStep", { step , updatedStep } )
            this.$emit("changedType")
        },
    },
    
    
    
}
</script>