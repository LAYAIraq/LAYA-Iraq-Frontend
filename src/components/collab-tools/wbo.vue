<!--
  Filename: wbo.vue
  Use: wbo instance
  Creator: nv
  Since: v1.3.0
-->

<template>
  <div class="centering">
    <div
      id="wbo-container"
    >
      <iframe
        :src="link"
        width="1000px"
        height="700px"
      >
      </iframe>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Wbo',
  props: {
    boardName: {
      type: String,
      default: 'laya-iraq'
    },
    domain: {
      type: String,
      default: process.env.VUE_APP_WHITEBOARD
    }
  },

  data () {
    return {
      link: process.env.VUE_APP_WHITEBOARD + '/boards/laya-iraq'
    }
  },

  mounted () {
    this.link = this.domain + '/boards/' + this.boardName
  }

}

</script>

<style>
.centering {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
