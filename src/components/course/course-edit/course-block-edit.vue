<!--
Filename: course-block-edit.vue
Use: Reroute to edit content block
Creator: cmc
Date: October 27, 2020
Dependencies:
  vuex,
  @/mixins/locale.vue
-->

<template>
  <div
    v-if="contentToDisplay"
    class="row mb-2"
  >
    <div class="col">
      <b-button
        variant="primary"
        block
        append
        :to="{path: 'edit', params: {type: contentToDisplay.name}}"
      >
        <i class="fas fa-edit"></i> {{ y18n('content.editContent') }}
      </b-button>
    </div>

    <div class="col text-dark">
      {{ y18n('content.editContentTip').replace('{step}', step) }}
    </div>
  </div>
</template>

<script>
import { locale, routes } from '@/mixins'

export default {
  name: 'CourseBlockEdit',

  mixins: [
    locale,
    routes
  ]

}
</script>
