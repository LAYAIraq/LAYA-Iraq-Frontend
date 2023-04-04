<!--
  Filename: course-files.vue
  Use: List of files uploaded to the course
  Author: cmc
  Since: v1.1.0
--->
<template>
  <div
    class="file-list"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <!-- title, tooltip-->
    <div class="file-explorer">
      <div class="d-flex">
        <h2>
          {{ y18n('layaUploadFileList.filesInCourse') }}
        </h2>
        <i
          id="questionmark"
          v-b-tooltip.left
          class="fas fa-question-circle align-right"
          :class="langIsAr? 'mr-auto': 'ml-auto'"
          :title="y18n('showTip')"
          @click="toggleTip"
        >
        </i>
        <b-jumbotron
          v-if="tooltipOn"
          :header="y18n('layaUploadFileList.addUpload')"
          :lead="y18n('tipHeadline')"
        >
          <hr>
          <span>
            {{ y18n('layaUploadFileList.tooltip') }}
          </span>
        </b-jumbotron>
      </div>
      <!-- List header -->

      <div class="row">
        <div class="col-2">
          <span
            v-b-tooltip.top
            :title="sortTooltip('type')"
            class="sort-list"
            @click="sortByProp('type')"
          >
            <i :class="sortIcon('type')"></i>
            {{ y18n('layaUploadFileList.fileType') }}
          </span>
        </div>
        <div class="col-5">
          <span
            v-b-tooltip.top
            :title="sortTooltip('originalFilename')"
            class="sort-list"
            @click="sortByProp('originalFilename')"
          >
            <i :class="sortIcon('originalFilename')"></i>
            {{ y18n('layaUploadFileList.fileName') }}
          </span>
        </div>
        <div class="col-2">
          <span
            v-b-tooltip.top
            :title="sortTooltip('size')"
            class="sort-list"
            @click="sortByProp('size')"
          >
            <i :class="sortIcon('size')"></i>
            {{ y18n('layaUploadFileList.fileSize') }}
          </span>
        </div>
        <div class="col-1">
          {{ y18n('layaUploadFileList.url') }}
        </div>
        <div class="col">
          {{ y18n('layaUploadFileList.deleteFile') }}
        </div>
      </div>
      <hr>

      <!-- List of files -->
      <ul
        v-if="sortedFiles.length>0"
        class="explorer"
      >
        <li
          v-for="file of sortedFiles"
          :key="file.name"
        >
          <div class="row">
            <div class="col-2">
              <i
                v-b-tooltip.left
                :class="fileIcon(file.type)"
                :title="y18n('layaUploadFileList.fileType')"
              ></i>
              {{ fileTypeString(file.type) }}
            </div>

            <div class="col-5">
              {{ file.originalFilename }}
            </div>

            <div class="col-2 size">
              {{ fileSize(file.size) }}
            </div>

            <div class="col-1">
              <i
                v-b-tooltip.right
                class="fas fa-copy copy"
                :title="y18n('layaUploadFileList.urlCopy')"
                @click="urlCopy(urlGet(file.name))"
              ></i>
            </div>

            <div class="col align-self-center">
              <button
                v-b-tooltip.top
                type="button"
                class="btn btn-danger btn-sm"
                :title="y18n('layaUploadFileList.deleteFile')"
                @click="fileDeleteConfirm(file)"
              >
                <i
                  class="fas fa-trash"
                ></i>
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div
        v-else
        class="row"
      >
        {{ y18n('layaUploadFileList.noFiles') }}
      </div>
    </div>
    <hr>
    <upload-file></upload-file>
    <b-modal
      id="file-delete-confirm"
      :title="y18n('layaUploadFileList.deleteFile')"
      centered
      header-bg-variant="danger"
      ok-variant="danger"
      @ok="fileDelete"
      @cancel="fileToDelete = null"
    >
      {{ y18n('layaUploadFileList.deleteFileConfirm') }}
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listSort, locale, files, tooltipIcon } from '@/mixins'
import api from '@/backend-url'
import UploadFile from '@/components/helpers/upload-file.vue'

export default {
  name: 'CourseFiles',

  components: {
    UploadFile
  },

  mixins: [
    listSort,
    locale,
    files,
    tooltipIcon
  ],

  data () {
    return {
      addUpload: false,
      files: [],
      fileToDelete: null,
      uploaded: false,
      uploadedFiles: []
    }
  },

  computed: {
    ...mapGetters([
      'courseFiles',
      'courseStorage'
    ]),

    sortedFiles () {
      return this.sortList(this.courseFiles)
    },

    /**
     * step: return step of current content block
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    step () {
      return this.$route.params.step
    }
  },

  beforeDestroy () {
    // persist course files in database
    this.$store.dispatch('storeCourseFiles')
  },

  methods: {
    /**
     * Function fileDelete: propagate file to delete to vuex,
     *  nullify the global variable
     *
     * Author: cmc
     *
     * Last Updated: April 9, 2021
     */
    fileDelete () {
      const file = this.fileToDelete
      this.$store.commit('delFile', file)
      this.fileToDelete = null
    },
    /**
     * Function fileDeleteConfirm: mark file as to delete, show prompt
     *
     * Author: cmc
     *
     * Last Updated: April 9, 2021
     *
     * @param file the file to delete
     */
    fileDeleteConfirm (file) {
      this.fileToDelete = file
      this.$bvModal.show('file-delete-confirm')
    },
    /**
     * function urlCopy: copy URL for that file
     *
     * Author: cmc
     *
     * Last Updated: April 6, 2021
     *
     * @param url file URL
     */
    urlCopy (url) {
      if (!url) {
        alert(this.y18n('layaUploadFileList.fileNameError'))
      }
      const dummy = document.createElement('textarea')
      dummy.value = url
      dummy.setAttribute('readonly', '')
      dummy.style.position = 'absolute'
      dummy.style.left = '-9999px'
      document.body.appendChild(dummy)
      const selected = document.getSelection().rangeCount > 0
        ? document.getSelection().getRangeAt(0)
        : false
      dummy.select()
      document.execCommand('copy')
      document.body.removeChild(dummy)
      if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
      }
    },

    /**
     * function urlGet: get store download URL for file
     *
     * Author: cmc
     *
     * Last Updated: April 6, 2021
     *
     * @param name file name
     * @return url for the file
     */
    urlGet (name) {
      return `${api}/storage/${this.courseStorage}/download/${name}`
    }
  }

}
</script>

<style scoped>
#questionmark {
  float: end;
  cursor: pointer;
}

span.sort-list {
  cursor: pointer;
}

.draggable {
  cursor: move;
}
.explorer {
  list-style-type: none;
  margin-top: 20px;
  /* padding: 10px; */
}
.explorer .size {
  text-align: right;
}

.explorer .copy {
  cursor: copy;
}

.file-list {
  padding: 10px;
}

.file-list-upload label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
.file-list-upload .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}
.file-list-upload .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}

</style>
