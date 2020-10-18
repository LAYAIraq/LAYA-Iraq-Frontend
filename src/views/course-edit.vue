<template>
    <!-- author view -->
    <div class="ly-bg-author py-4">
        <course-edit-header
        :name="name" :step="step">
        </course-edit-header> 

        <router-view
            :content="content()"
            :onupdate="updateStep"
            :course="edit.course"
            :onnavupdate="updateContent">
        </router-view>

        <div class="container" v-if="$route.name == 'course-detail-view'">

            <!-- edit content -->
            <div class="row mb-2" v-if="content()">
                <div class="col">
                    <b-button variant="primary" block append
                            :to="{path: 'edit', params: {type: content.name}}">
                    <i class="fas fa-edit"></i> {{ i18n.authTools.editContent }}
                    </b-button>
                </div>

                <div class="col text-dark">
                    {{ i18n.authTools.editContentTip.replace("{step}", this.step) }}
                </div>
            </div>

            <course-edit-type :content="content()" :i18n="i18n"></course-edit-type>
            
            <course-new-block :name="name" :step="step" :i18n="i18n" :nextId="nextId()"> </course-new-block>

            <!-- Edit Course Navigation -->
            <div class="row mb-2" v-if="$store.state.edit.course.content.length > 0">
            <div class="col">
                <b-button block variant="primary" append :to="{path: 'editNav'}">
                <i class="fas fa-project-diagram"></i> {{ i18n.authTools.editNav }}
                </b-button>
            </div>

            <div class="col text-dark">
                <span v-if="courseNavIncomplete()"
                    class="bg-warning mr-1 rounded"
                    style="padding: 2px 5px">
                <i class="fas fa-exclamation-triangle"></i> {{ i18n.authTools.editNavIncomplete }}
                </span>
                {{ i18n.authTools.editNavTip.replace("{steps}", $store.state.edit.course.content.length ) }}
            </div>
            </div>

            <!-- rename course -->
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
            </div>

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
            </div>

            <!-- Delete content -->
            <div class="row mt-5" v-if="content()">
                <div class="col">
                    <b-button size="sm"
                            variant="danger"
                            class="float-right"
                            @click="$bvModal.show('author-delContent-confirm')">
                    <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.deleteContent }}
                    </b-button>
                </div>

                <div class="col text-dark">
                    {{ i18n.authTools.deleteContentTip }}
                </div>
            </div>

            <!-- delete course-->
            <div class="row mt-3">
                <div class="col">
                    <b-button size="sm"
                            variant="danger"
                            class="float-right"
                            @click="$bvModal.show('author-delCourse-confirm')">
                    <i class="fas fa-exclamation-circle"></i> {{ i18n.authTools.deleteCourse }}
                    </b-button>
                </div>

                <div class="col text-dark" v-html="i18n.authTools.deleteCourseTip">
                    
                </div>
            </div>

            <!-- View Course Statistics -->
            <div class="row mt-5">
                <div class="col">
                    <b-button block variant="success" @click="$bvModal.show('author-courseStats')">
                    <i class="fas fa-info-circle"></i> {{ i18n.authTools.seeStats }}
                    </b-button>
                </div>

                <div class="col text-dark">
                    {{ i18n.authTools.statsTip }}
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import * as i18n from "@/i18n/course-detail/"
import { mapState, mapGetters } from "vuex"
import { courseEditHeader, courseEditType, courseNewBlock } from "./course-edit-tools/"


export default {
    name: "course-edit",
    components: {
        courseEditHeader,
        courseEditType,
        courseNewBlock
    },
    props: {
        name: String,
        step: String
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapState(["edit"]),
        ...mapGetters(["profileLang"]),
        i18n () {
            return i18n[this.profileLang]
        }
    },
    methods: {
        content() {
            return this.edit.course.content[this.step-1]
        },
        updateStep(changedStep) {
            this.course.content[this.step-1] = {
                ...this.course.content[this.step-1], ...changedStep
            }
            this.storeCourse()
            this.$forceUpdate()
        },
        updateContent(changedContent) {
            this.course.content = [...changedContent]
            this.storeCourse()
            this.$forceUpdate()
        },
        nextId() {
            return this.$store.state.edit.course.content.length+1
        },
        getLocale(comp) {
            let lang = this.$store.state.profile.lang
            if(comp.i18n.hasOwnProperty(lang)) return comp.i18n[lang]
            else return comp.i18n.de
        }
    }
    
}
</script>

<style scoped>

</style>