<template>
  <div class="ly-video position-relative">
    <div v-if="data.src">
      <div v-if="isUpload">
        <video
          :id="id('vid')"
          @play="onMainPlay"
          @pause="onMainPause"
          @seeked="onMainSeek"
          crossorigin
        >
          <source :src="url('src')" type="video/mp4">
          <track
            v-if="data.sub"
            kind="subtitles"
            :src="url('sub')"
            srclang="de"
            label="Deutsch"
            default
          >
        </video>
        <div class="hidden">
          <audio v-if="data.ad" :id="id('audiod')" :src="url('ad')" crossorigin></audio>
        </div>
      </div>
      <div v-else :id="id('vid')" :data-plyr-provider="data.type" :data-plyr-embed-id="embedId"></div>
    </div>

    <!-- additional videos -->
    <div :id="id('adds')" class="adds">
      <div v-for="add in data.adds" class="add-vid-container" :key="'add'+add">
        <video :src="src(add)" class="add-vid" crossorigin></video>
      </div>
    </div>
  </div>
</template>

<script>
import Plyr from "plyr";
import "plyr/dist/plyr.css";

import api from "../backendURL.ts";

export default {
  name: "ly-video",
  mounted() {
    if (this.data.src) {
      this.main = new Plyr(`#${this.id("vid")}`);
    }

    if (this.data.ad) {
      this.audiod = new Plyr(`#${this.id("audiod")}`);
    }

    if (this.data.adds.length > 0) {
      this.adds = Array.from(
        document.querySelectorAll(`#${this.id("adds")} .add-vid`)
      ).map(player => new Plyr(player));
    }
  },
  data() {
    return {
      main: {},
      audiod: {},
      adds: []
    };
  },
  props: {
    data: Object
  },
  computed: {
    isUpload: function() {
      return this.data.type === "upload";
    },
    uuid: function() {
      return Date.now();
    }
  },
  methods: {
    onMainPlay: function() {
      if (this.data.ad) this.audiod.play();
      if (this.data.adds) this.adds.forEach(vid => vid.play());
    },
    onMainPause: function() {
      if (this.data.ad) this.audiod.pause();
      if (this.data.adds) this.adds.forEach(vid => vid.pause());
    },
    onMainSeek: function(event) {
      const time = event.target.currentTime;
      if (this.data.ad) {
        this.audiod.currentTime = time;
      }
      if (this.data.adds)
        this.adds.forEach(vid => {
          vid.currentTime = time;
        });
    },

    id: function(pref) {
      return `${pref}-${this.uuid}`;
    },
    emptyVid: function({ src }) {
      return src === null || src === "";
    },
    isChosen: function({ type }) {
      return type !== "0";
    },

    /*
     * media output */
    url: function(type) {
      if (this.emptyVid(this.data)) return;
      /*
       * vid | sub | ad */
      let media = this.data[type];
      if (media === null) return;

      if (typeof media === "string") {
        /* file in backend */
        return `${api()}/storage/${this.$route.params.id}/download/${media}`;
      }

      if (typeof media === "object") {
        /* file in cache */
        return URL.createObjectURL(media);
      }
    },
    src: function(name) {
      if (!name) return "";

      return `${api()}/storage/${this.$route.params.id}/download/${name}`;
    },
    embedId: function() {
      const { type, src } = this.data;
      if (type === "youtube") {
        return src.split("v=")[1].split("&")[0];
      }

      if (type === "vimeo") {
        return src.split("/").slice(-1)[0];
      }
    }
  },
  components: {}
};
</script>

<style scoped>
.adds {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 5px;
  z-index: 20;
}

.add-vid-container {
  border: 1px solid black;
  box-shadow: inset 0px 0px 5px black;
  background-color: #00000077;
}

.add-vid {
  width: 15rem;
}

.hidden {
  height: 0px;
  visibility: hidden;
}
</style>
