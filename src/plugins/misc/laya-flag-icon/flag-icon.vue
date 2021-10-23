<template>
  <div
    class="laya-flag-icon"
    :class="{
      'flagged': refData.flagged,
      'unflagged': !refData.flagged,
      'interactive': interactive
    }"
  >
    <div class="flag-interface">
      <router-link
        :to="{ name: 'flag-view', params: { id: refData.id } }"
        class="flag-link"
      >
        <div
          class="flag-icon expanded"
          :title="refData.flagged? i18n['flag.seeDiscussion'] : i18n['flag.title']"
          v-b-tooltip.bottom
          tabindex="0"
        >
          <i class="fas fa-flag"></i>
        </div>
      </router-link>
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
  .laya-flag-icon.interactive {
    z-index: -1;
  }

  .laya-flag-icon.unflagged:hover {
    background-color: rgba(108, 117, 125, 0.25);
    border-radius: 5px;
    width: 100%;
    height: 100%;
  }
  .flag-interface {
    width: 100%;
    height: 100%;
  }

  .flag-icon {
    cursor: pointer;
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

  .unflagged:hover>.flag-interface>*>.flag-icon {
    margin-left: calc(100% - 25px);
    /*margin-top: auto;*/
    border: 1px solid tomato;
    background-color: tomato;
    display: block !important;
    vertical-align: middle; /* doesn't do anything */
  }

  .unflagged>.flag-interface>.flag-link>.flag-icon {
   display: none;
 }
  .flagged>.flag-interface>*>.flag-icon {
    height: 60px;
    width: 60px;
    border-radius: 30px;
    /*border: 1px solid fuchsia;*/
    background-color: #470047;
    margin-left: calc(100% - 25px);
    display: block;
  }

  .flagged>.flag-interface>*>.flag-icon:hover,
  .flagged>.flag-interface>*> .flag-icon:focus {
    /*border: 1px solid fuchsia;*/
    background: #b900b9 ;
  }

  .flag-icon>i {
    color: whitesmoke;
    font-size: 2rem;
    padding: 12px;
  }

</style>