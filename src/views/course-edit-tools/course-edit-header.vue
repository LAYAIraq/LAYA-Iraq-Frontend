<template>
    <div class="container mb-4">
        <div class="row">
            <div class="col">
                <!-- back to author tools view TODO: only show when not already there--> 
                <b-button
                    v-if="$route.name != 'course-detail'"
                    variant="outline-secondary"
                    size="sm"
                    active-class="active" 
                    :to="{name: 'course-detail-view', params: {name, step}}"
                    exact> 
                    
                <i class="fas fa-chevron-left"></i> {{ i18n.toolsNav.overview }}
                </b-button>

                <!-- jump to content number -->
                <span class="content-nav float-right" style="font-size: 120%">
                    <b-dropdown id="cid-dd"
                                :text="i18n.toolsNav.jumpTo"
                                size="sm"
                                variant="secondary"
                                no-flip
                                right>
                        <b-dropdown-item v-for="(c,id) in course.content" :key="id"
                                        :to="{name: 'course-detail-view',
                                        params: {name, step: id+1+''}}">
                            {{ i18n.toolsNav.listContent }} <b>{{ id+1 }}</b>
                        </b-dropdown-item>
                    </b-dropdown>
                </span>

            </div>
        </div>
    </div>
</template>

<script>

import {
    BDropdown,
    BDropdownItem,
} from "bootstrap-vue"

import * as i18n from "@/i18n/course-detail/"

export default {
    name: "course-edit-header",
    props: {
        name: String,
        step: String,
        course: Object,
        i18n: Object
    },
    methods: {
        
    }
    
}
</script>