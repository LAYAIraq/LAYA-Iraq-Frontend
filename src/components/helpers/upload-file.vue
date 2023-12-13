<!--
  Filename: upload-file.vue
  Use: Uploader for files, select from disk or drag & drop
  Author: cmc
  Since: v1.3.0
-->
<template>
  <div id="upload-file">
    <!-- list upload drag & drop -->
    <div
      v-if="!addUpload"
      class="show-uploader"
    >
      <button
        type="button"
        class="btn btn-success btn-large"
        @click="addUpload = true"
      >
        <i class="fas fa-upload"></i>
        {{ y18n('addUpload') }}
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
                {{ y18n('uploadFile.success') }}
              </div>
              <div
                v-else-if="file.active"
                class="col-auto"
              >
                {{ y18n('uploadFile.active') }}
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
                  :title="y18n('uploadFile.removeUpload')"
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
                {{ y18n('uploadFile.dropOr') }}
              </h4>
              <label
                class="btn btn-lg btn-warning"
                for="file"
              >
                <i class="fas fa-plus"></i>
                {{ y18n('uploadFile.selectFiles') }}
              </label>
            </div>
          </li>
        </ul>

        <div
          v-show="$refs.upload && $refs.upload.dropActive"
          class="drop-active"
        >
          <h3>{{ y18n('uploadFile.dropToUpload') }}</h3>
        </div>

        <div class="button-group">
          <b-button-group>
            <file-upload
              ref="upload"
              v-model="files"
              class="btn btn-warning"
              :custom-action="fileUpload"
              :post-action="uploadUrl"
              :headers="headers"
              :multiple="true"
              :drop="true"
              :drop-directory="true"
            >
              <i class="fas fa-plus"></i>
              {{ y18n('uploadFile.selectFiles') }}
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
              {{ y18n('startUpload') }}
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
              {{ y18n('stopUpload') }}
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="addUpload = false"
            >
              <i class="fas fa-minus"></i>
              {{ y18n('uploadFile.hideUploader') }}
            </button>
          </b-button-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/backend-url'
import { mapGetters } from 'vuex'
import { files, locale } from '@/mixins'
export default {
  name: 'UploadFile',
  components: {
    FileUpload: () => import('vue-upload-component')
  },
  mixins: [
    files,
    locale
  ],
  data () {
    return {
      addUpload: false,
      files: [],
      uploaded: false,
      uploadedFiles: []
    }
  },
  computed: {
    ...mapGetters(['courseFiles', 'courseStorage']),
    /**
     * @function return authorization headers for upload
     * @author cmc
     * @return {{Authorization: string}} authorization headers
     */
    headers () {
      const idToken = this.$ls.get('auth').id
      return {
        Authorization: `${idToken}`
      }
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
     * watcher uploaded: watch for changes in uploaded prop,
     *  emit event to parent component
     */
    uploaded (val) {
      if (val) {
        this.fileListUpdate()
      }
    },
    /**
     * watcher uploadedFiles: watch for changes in uploadedFiles,
     *  fire courseFilesUpdate() when there are any
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    uploadedFiles () {
      this.$nextTick(() => {
        this.courseFilesUpdate()
      })
    }
  },
  methods: {
    /**
     * function checkDuplicate: check if file with same name
     *  and size already exists in a course
     *
     * Author: cmc
     *
     * Last updated: March 29, 2021
     *
     * @param {object} file file to be uploaded
     * @returns true if a file with same name and size exists
     */
    checkDuplicate (file) {
      if (file.success) {
        // console.log('This file has already been uploaded!')
        file.error = this.y18n('uploadFile.duplicateFile')
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
          file.error = this.y18n('uploadFile.duplicateFile')
          return true
        }
      }
      return false
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
    checkSizeExcess (file) {
      const maxFileSize = process.env.VUE_APP_MAX_FILE_SIZE || 500000000
      if (file.size > maxFileSize) {
        // console.log('File too large!')
        file.error = this.y18n('uploadFile.fileTooLarge')
        return true
      }
      return false
    },
    /**
     * function courseFilesUpdate: store new files in vuex store
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    courseFilesUpdate () {
      this.$store.commit('courseFilesUpdate', this.uploadedFiles)
    },
    /**
     * function fileListUpdate: update list of files
     *  that have been added in this component
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    fileListUpdate () {
      for (const file of this.files) {
        if (file.success) {
          const fileEntry = { ...file.response.result.files.file[0] }
          this.uploadedFiles.push(fileEntry)
        }
      }
    },
    /**
     * function upLoadFile: proceed a duplicate check,
     *  then upload the file to uploadUrl()
     *
     * Author: cmc
     *
     * Last Updated: March 29, 2021
     */
    async fileUpload (file, component) {
      const duplicateFile = this.checkDuplicate(file)
      const tooLarge = this.checkSizeExcess(file)
      if (!duplicateFile && !tooLarge) {
        // console.log('starting upload...')
        return await component.uploadHtml5(file)
      } else return false
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
    }
  }
}
</script>
