<template>
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
                                :to="'/courses/'+name+'/'+nextId+'/new/'+block.id"
                                >
                    
                    <div class="dropitem">
                        {{ block.i18n[profileLang].name }} 
                        <i class="far fa-question-circle" v-b-tooltip.right :title="block.i18n[profileLang].caption">
                        </i>
                    </div>
                </b-dropdown-item>

                <b-dropdown-divider></b-dropdown-divider>

                <b-dropdown-header>{{ i18n.authTools.newContentAssmnt }}</b-dropdown-header>
                <b-dropdown-item v-for="ass in $laya.la"
                                :key="ass.id"
                                :to="'/courses/'+name+'/'+nextId+'/new/'+ass.id"
                                >
                    <div class="dropitem">
                        {{ ass.i18n[profileLang].name }}
                    
                        <i class="far fa-question-circle" v-b-tooltip.right :title="ass.i18n[profileLang].caption">
                        </i>
                    </div>
                    
                </b-dropdown-item>
            </b-dropdown>

        </div>

        <div class="col text-dark">
            {{ i18n.authTools.newContentTip }}
            <b>{{nextId}}</b>.
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { 
    BDropdown, 
    BDropdownItem, 
    BDropdownDivider, 
    BDropdownHeader, 
    BTooltip } from "bootstrap-vue"
import * as i18n from "@/i18n/course-detail/"

export default {
    name: "course-new-block",
    props: {
       
        name: String,
        step: String,

    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(["profileLang", "hasContent"]),
        i18n() {
            return i18n[this.profileLang]
        },
        nextId() {
            return this.hasContent.length+1
        }
    },
    methods: {
       
    }
}
</script>

<style scoped>

.dropitem i {
    float:inline-end;
}
    
</style>