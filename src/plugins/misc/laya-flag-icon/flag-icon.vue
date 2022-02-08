<template>
  <div
    class="laya-flag-icon"
    :class="interactive ? 'interactive' : ''"
  >
    <div class="flag-interface">
      <div
        class="flag-icon"
        :class="refData.flagged ? 'flagged' : 'unflagged'"
        :title="refData.flagged
          ? i18n['flag.seeDiscussion']
          : i18n['flag.title']"
        v-b-tooltip.bottom
        tabindex="0"
      >
        <router-link
          :to="{ name: 'flag-view', params: { id: refData.id } }"
          class="flag-link"
        >
          <i class="fas fa-flag"></i>
        </router-link>
      </div>

    </div>
  </div>
</template>

<script>
// import http from 'axios'
// import { mapGetters } from 'vuex'
import { locale } from '@/mixins'

export default {
  name: 'LayaFlagIcon',

  mixins: [
    locale,
    // time
  ],

  props: {
    refData: Object,
    interactive: Boolean
  }
}
</script>

<style scoped>
  .laya-flag-icon {
    position: absolute;
    box-sizing: border-box;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    font-size: 1rem;
    text-align: center;
    z-index: 0;
    /*max-height: 100px;*/
  }

  .interactive {
    z-index: -1;
  }

  .laya-flag-icon:hover {
    background-color: rgba(108, 117, 125, 0.25);
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }

  .laya-flag-icon:hover .flag-icon {
    margin-left: calc(100% - 25px);
    display: block !important;
  }

  .flag-interface {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .flag-link {
    text-decoration: none;
  }

  .flag-icon {
    cursor: pointer;
    position: relative;
    height: 60px;
    width: 60px;
    border-radius: 30px;
    transform: none;
    transition: transform 0.5s ease-in;
  }

  .flag-icon:focus {
    outline: 2px dashed deepskyblue;
    outline-offset: 5px;
  }

  .flagged {
    height: 60px;
    width: 60px;
    border-radius: 30px;
    /*border: 1px solid fuchsia;*/
    background-color: #470047;
    margin-left: calc(100% - 25px);
    display: block;
  }

  .flagged:hover,
  .flagged:focus {
    /*border: 1px solid fuchsia;*/
    background: #b900b9 ;
  }

  .unflagged {
    display: none;
    border: 1px solid tomato;
    background-color: tomato;
  }

  i {
    display: block;
    color: whitesmoke;
    font-size: 2rem;
    padding: 12px;
  }

</style>
