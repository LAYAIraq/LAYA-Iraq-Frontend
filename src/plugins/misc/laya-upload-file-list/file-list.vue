<!--suppress XmlInvalidId --> <!-- id reference for label used for file drag & drop -->
<template>
  <div
    class="file-list"
    :class="langIsAr? 'text-right' : 'text-left'"
  >
    <!-- title, tooltip-->
    <div class="file-explorer">
      <div class="d-flex">
        <h2>
          {{ i18n['layaUploadFileList.filesInCourse'] }}
        </h2>
        <i
          id="questionmark"
          v-b-tooltip.left
          class="fas fa-question-circle align-right"
          :class="langIsAr? 'mr-auto': 'ml-auto'"
          :title="i18n['showTip']"
          @click="toggleTip"
        >
        </i>
        <b-jumbotron
          v-if="tooltipOn"
          :header="i18n['layaUploadFileList.addUpload']"
          :lead="i18n['tipHeadline']"
        >
          <hr>
          <span>
            {{ i18n['layaUploadFileList.tooltip'] }}
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
            {{ i18n['layaUploadFileList.fileType'] }}
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
            {{ i18n['layaUploadFileList.fileName'] }}
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
            {{ i18n['layaUploadFileList.fileSize'] }}
          </span>
        </div>
        <div class="col-1">
          {{ i18n['layaUploadFileList.url'] }}
        </div>
        <div class="col">
          {{ i18n['layaUploadFileList.deleteFile'] }}
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
                :title="i18n['layaUploadFileList.fileType']"
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
                :title="i18n['layaUploadFileList.copyUrl']"
                @click="copyUrl(getUrl(file.name))"
              ></i>
            </div>

            <div class="col align-self-center">
              <button
                v-b-tooltip.top
                type="button"
                class="btn btn-danger btn-sm"
                :title="i18n['layaUploadFileList.deleteFile']"
                @click="deleteFile(file)"
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
        {{ i18n['layaUploadFileList.noFiles'] }}
      </div>
    </div>
    <hr>

    <!-- list upload drag & drop -->
    <div
      v-if="!addUpload"
      class="show-uploader"
    >
      <button
        type="button"
        class="btn btn-primary btn-large"
        @click="addUpload = true"
      >
        <i class="fas fa-upload"></i>
        {{ i18n['addUpload'] }}
      </button>
    </div>
    <div
      v-else
      class="file-list-upload"
    >
      <div class="drag-upload">
        <ul v-if="files.length">
          <li
            v-for="(file, i) in files"
            :key="file.id"
          >
            <div class="row">
              <div class="col-5">
                {{ file.name }}
              </div>
              <div class="col-2 size">
                {{ fileSize(file.size) }}
              </div>
              <div
                v-if="file.error"
                class="col-auto"
              >
                {{ file.error }}
              </div>
              <div
                v-else-if="file.success"
                class="col-auto"
              >
                {{ i18n['layaUploadFileList.success'] }}
              </div>
              <div
                v-else-if="file.active"
                class="col-auto"
              >
                {{ i18n['layaUploadFileList.active'] }}
              </div>
              <div
                v-else
                class="col-auto"
              ></div>
              <div
                v-if="!file.success"
                class="col-0 align-self-center"
              >
                <button
                  v-b-tooltip.right
                  type="button"
                  class="btn btn-danger btn-sm"
                  :title="i18n['layaUploadFileList.removeUpload']"
                  @click="_removeFile(i)"
                >
                  <i
                    class="fas fa-times"
                  >
                  </i>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <ul v-else>
          <li>
            <div class="text-center p-5">
              <h4>
                {{ i18n['layaUploadFileList.dropOr'] }}
              </h4>
              <label
                class="btn btn-lg btn-primary"
                for="file"
              >
                <i class="fas fa-plus"></i>
                {{ i18n['layaUploadFileList.selectFiles'] }}
              </label>
            </div>
          </li>
        </ul>

        <div
          v-show="$refs.upload && $refs.upload.dropActive"
          class="drop-active"
        >
          <h3>{{ i18n['layaUploadFileList.dropToUpload'] }}</h3>
        </div>

        <div class="button-group">
          <b-button-group>
            <file-upload
              ref="upload"
              v-model="files"
              class="btn btn-primary"
              :custom-action="uploadFile"
              :post-action="uploadUrl"
              :multiple="true"
              :drop="true"
              :drop-directory="true"
            >
              <i class="fas fa-plus"></i>
              {{ i18n['layaUploadFileList.selectFiles'] }}
            </file-upload>
            <button
              v-if="!$refs.upload || !$refs.upload.active"
              type="button"
              class="btn btn-success"
              @click.prevent="$refs.upload.active = true"
            >
              <i
                class="fas fa-arrow-up"
                aria-hidden="true"
              ></i>
              {{ i18n['startUpload'] }}
            </button>
            <button
              v-else
              type="button"
              class="btn btn-danger"
              @click.prevent="$refs.upload.active = false"
            >
              <i
                class="fas fa-stop"
                aria-hidden="true"
              ></i>
              {{ i18n['stopUpload'] }}
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="addUpload = false"
            >
              <i class="fas fa-minus"></i>
              {{ i18n['layaUploadFileList.hideUploader'] }}
            </button>
          </b-button-group>
        </div>
      </div>
    </div>

    <b-modal
      id="file-delete-confirm"
      :title="i18n['layaUploadFileList.deleteFile']"
      centered
      header-bg-variant="danger"
      ok-variant="danger"
      @ok="confirmedFileDelete"
      @cancel="fileToDelete = null"
    >
      {{ i18n['layaUploadFileList.deleteFileConfirm'] }}
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listSort, locale, mimeTypes, tooltipIcon } from '@/mixins'
import api from '@/backend-url'
import fileSize from '@/misc/utils.js'

export default {
  name: 'LayaUploadFileList',

  components: {
    FileUpload: () => import('vue-upload-component')
  },

  mixins: [
    listSort,
    locale,
    mimeTypes,
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
    },

    /**
     * upload: make refs available
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    upload () {
      return this.$refs.upload
    },

    /**
     * uploadUrl: return course storage URL for upload
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    uploadUrl () {
      return `${api}/storage/${this.courseStorage}/upload`
    }
  },

  watch: {

    /**
     * watcher files: watch for changes in files data prop,
     *  change uploaded property if an action happened in
     *  upload
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    files () {
      this.uploaded = this.$refs.upload.uploaded
    },

    /**
     * watcher uploaded: fire updateFileList() if uploaded is true
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    uploaded (val) {
      if (val) {
        this.updateFileList()
      } else {
        console.log('neue files!')
      }
    },

    /**
     * watcher uploadedFiles: watch for changes in uploadedFiles,
     *  fire updateCourseFiles() when there are any
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    uploadedFiles () {
      this.$nextTick(() => {
        this.updateCourseFiles()
      })
    }
  },

  beforeDestroy () {
    // persist course files in database
    this.$store.dispatch('storeCourseFiles')
  },

  methods: {
    ...fileSize,
    /**
     * function upLoadFile: proceed a duplicate check,
     *  then upload the file to uploadUrl()
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    async uploadFile (file, component) {
      // let component = this.upload
      // let ctx = this
      const duplicateFile = this.checkForDuplicate(file)
      const tooLarge = this.checkforSizeExcess(file)
      if (!duplicateFile && !tooLarge) {
        // console.log('starting upload...')
        return await component.uploadHtml5(file)
      } else return false
    },

    /**
     * function checkForSizeExcess: check if a file is too large
     *
     * Author: cmc
     *
     * Last Updated: April 6, 2021
     *
     * @param file the file to be checked
     * @returns true if file is too large!
     */
    checkforSizeExcess (file) {
      const maxFileSize = process.env.VUE_APP_MAX_FILE_SIZE || 500000000
      if (file.size > maxFileSize) {
        // console.log('File too large!')
        file.error = this.i18n['layaUploadFileList.fileTooLarge']
        return true
      }
      return false
    },

    /**
     * function checkForDuplicate: check if file with same name
     *  and size already exists in a course
     *
     * Author: cmc
     *
     * Last updated: March 29, 2021
     *
     * @param {object} file file to be uploaded
     * @returns true if a file with same name and size exists
     */
    checkForDuplicate (file) {
      if (file.success) {
        // console.log('This file has already been uploaded!')
        file.error = this.i18n['layaUploadFileList.duplicateFile']
        return true
      }

      const attrs = {
        name: file.name,
        size: file.size,
        type: file.type
      }
      // check if file with the same parameters already
      // exists in the course
      for (const entry of this.courseFiles) {
        if (entry.originalFilename === attrs.name &&
          entry.size === attrs.size &&
          entry.type === attrs.type) {
          // console.log('This file already exists in this course!')
          file.error = this.i18n['layaUploadFileList.duplicateFile']
          return true
        }
      }
      return false
    },

    /**
     * function _removeFiles: remove file from list at index idx
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     *
     * @param {number} idx index of file object
     */
    _removeFile (idx) {
      this.files.splice(idx, 1)
    },

    /**
     * function updateCourseFiles: store new files in vuex store
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    updateCourseFiles () {
      this.$store.commit('updateCourseFiles', this.uploadedFiles)
    },

    /**
     * function updateFileList: update list of files
     *  that have been added in this component
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    updateFileList () {
      for (const file of this.files) {
        if (file.success) {
          const fileEntry = { ...file.response.result.files.file[0] }
          this.uploadedFiles.push(fileEntry)
        }
      }
    },

    /**
     * function copyUrl: copy URL for that file
     *
     * Author: cmc
     *
     * Last Updated: April 6, 2021
     *
     * @param url file URL
     */
    copyUrl (url) {
      if (!url) {
        alert(this.i18n['layaUploadFileList.fileNameError'])
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
     * function getUrl: get store download URL for file
     *
     * Author: cmc
     *
     * Last Updated: April 6, 2021
     *
     * @param name file name
     * @return url for the file
     */
    getUrl (name) {
      return `${api}/storage/${this.courseStorage}/download/${name}`
    },

    /**
     * Function deleteFile: mark file as to delete, show prompt
     *
     * Author: cmc
     *
     * Last Updated: April 9, 2021
     *
     * @param file the file to delete
     */
    deleteFile (file) {
      this.fileToDelete = file
      this.$bvModal.show('file-delete-confirm')
    },

    /**
     * Function confirmedFileDelete: propagate file to delete to vuex,
     *  nullify the global variable
     *
     * Author: cmc
     *
     * Last Updated: April 9, 2021
     */
    confirmedFileDelete () {
      const file = this.fileToDelete
      this.$store.commit('delFile', file)
      this.fileToDelete = null
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
