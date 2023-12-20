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
          {{ y18n('uploadFile.filesInCourse') }}
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
          :header="y18n('uploadFile.addUpload')"
          :lead="y18n('tipHeadline')"
        >
          <hr>
          <p
            v-for="str in y18n('uploadFile.tooltip').split(';')"
            :key="str.length"
          >
            <!-- eslint-disable-next-line vue/no-v-html --> <!-- TODO: find a way to avoid v-html -->
            <span v-html="replacePattern(str, /###([\w\s\-]+)###([A-Z0-9a-z\/.:#]+)###/, linkReplacement(true))"></span>
          </p>
        </b-jumbotron>
      </div>

      <b-table
        :items="sortedFiles"
        :fields="fields"
        responsive
        stacked="sm"
      >
        <!-- Type Column -->
        <template #cell(type)="data">
          <i :class="fileIcon(data.item.type)"></i>
          {{ fileTypeString(data.item.type) }}
        </template>

        <!-- Filename Column -->
        <template #cell(originalFilename)="data">
          {{ data.item.originalFilename }}
        </template>

        <!-- File Size Column -->
        <template #cell(size)="data">
          {{ fileSize(data.item.size) }}
        </template>

        <!-- URL Column -->
        <template #cell(url)="data">
          <i
            class="fas fa-copy copy"
            @click="urlCopy(urlGet(data.item.name))"
          ></i>
        </template>

        <!-- Actions Column -->
        <template #cell(actions)="data">
          <b-button
            variant="danger"
            size="sm"
            @click="fileDeleteConfirm(data.item)"
          >
            <i class="fas fa-times"></i>
          </b-button>
        </template>
      </b-table>

      <div
        v-if="sortedFiles.length === 0"
        class="col-7"
      >
        {{ y18n('uploadFile.noFiles') }}
      </div>
    </div>
    <hr>
    <upload-file></upload-file>
    <b-modal
      id="file-delete-confirm"
      :title="y18n('uploadFile.deleteFile')"
      centered
      header-bg-variant="danger"
      ok-variant="danger"
      cancel-variant="primary"
      @ok="fileDelete"
      @cancel="fileToDelete = null"
    >
      {{ y18n('uploadFile.deleteFileConfirm') }}
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
      uploadedFiles: [],
      fields: []
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

  created () {
    this.fields = [
      { key: 'type', sortable: true, label: this.y18n('uploadFile.fileType') },
      { key: 'originalFilename', sortable: true, label: this.y18n('uploadFile.fileName') },
      { key: 'size', sortable: true, label: this.y18n('uploadFile.fileSize') },
      { key: 'url', label: this.y18n('uploadFile.url') },
      { key: 'actions', label: this.y18n('uploadFile.deleteFile') }
    ]
  },

  beforeDestroy () {
    // persist course files in database
    this.$store.dispatch('courseFilesStore')
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
      this.$store.dispatch('courseFilesDeleteSingle', file)
        .then(() => { this.fileToDelete = null })
        .catch(err => {
          console.log(err)
          // TODO: create error toast
        })
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
        alert(this.y18n('uploadFile.fileNameError'))
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
