<!--
Filename: course-edit-header.vue 
Use: Provide navigation buttons on top of edit tools
Creator: cmc
Date: October 27, 2020
Dependencies: 
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div class="container mb-4">

    <div class="row">

      <div class="col">
        
        <b-button
          v-if="$route.name != 'course-detail-view'"
          variant="outline-secondary"
          size="sm"
          active-class="active" 
          :to="{name: 'course-detail-view', params: {name, step}}"
          exact> 
          <i class="fas fa-chevron-left"></i> 
          {{ i18n['header.overview'] }}
        </b-button>

          <!-- jump to content number -->
          <span class="content-nav float-right" style="font-size: 120%">
            
            <b-dropdown id="cid-dd"
              :text="i18n['header.jumpTo']"
              size="sm"
              variant="secondary"
              no-flip
              right>
              
              <b-dropdown-item v-for="(c,id) in content" :key="id"
                :to="{name: 'course-detail-view',
                params: {name, step: id+1+''}}"
              >
                {{ i18n['header.listContent'] }} 
                <b>
                  {{ id+1 }}
                </b>
              </b-dropdown-item>

            </b-dropdown>
          </span>
      </div>
    </div>

  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'course-edit-header',

  mixins: [
    locale 
  ],

  computed: {
    ...mapGetters(['content']),

  },

  props: {
    name: String,
    step: String,
  }
    
}
</script>