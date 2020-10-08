<template>
    <!-- author view -->
    <div class="ly-bg-author py-4">
       <course-edit-header></course-edit-header> 

        <router-view
            :content="content()"
            :onupdate="updateStep"
            :course="course"
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

            <course-edit-type></course-edit-type>
            

            <!-- new content -->
            <div class="row mb-2">
            <div class="col">

                <b-dropdown id="new-content-dd"
                            variant="primary"
                            class="w-100"
                            dropright>
                <template slot="button-content">
                    <i class="fas fa-plus"></i> {{ i18n.authTools.newContent }}
                </template>

                <b-dropdown-header>{{ i18n.authTools.newContentBlock }}</b-dropdown-header>
                <b-dropdown-item v-for="block in $laya.lb"
                                :key="block.id"
                                :to="'/courses/'+name+'/'+nextId()+'/new/'+block.id">
                    {{ getLocale(block).name }} | {{ getLocale(block).cpation }}
                </b-dropdown-item>

                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-header>{{ i18n.authTools.newContentAssmnt }}</b-dropdown-header>
                <b-dropdown-item v-for="ass in $laya.la"
                                :key="ass.id"
                                :to="'/courses/'+name+'/'+nextId()+'/new/'+ass.id">
                    {{ getLocale(ass) }}
                </b-dropdown-item>
                </b-dropdown>

            </div>

            <div class="col text-dark">
                {{ i18n.authTools.newContentTip }}
                <b>{{nextId()}}</b>.
            </div>
            </div>

            <!-- Edit Course Navigation -->
            <div class="row mb-2" v-if="course.content.length > 0">
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
                {{ i18n.authTools.editNavTip.replace("{steps}", course.content.length ) }}
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
import {courseEditHeader, courseEditType} from "./course-edit-tools/"


export default {
    name: "course-edit",
    components: {
        courseEditHeader,
        courseEditType
    },
    props: {
        name: String,
        step: String,
        course: Object,
        userEnrolled: Boolean,
        enrollment: Object,
    },
    data() {
        return {

        }
    },
    computed: {
        i18n () {
            return i18n[this.store.state.profile.lang]
        }
    },
    methods: {
        
    }
    
}
</script>

<style scoped>

</style>