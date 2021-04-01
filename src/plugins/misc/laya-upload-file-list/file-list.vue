<template>
  <div class="file-list">

    <div class="file-explorer">
      <div class="row">
        <h2>DATEIEN IN KURS</h2>
      </div>
      <ul 
        class="explorer"
        v-if="courseFiles"
        >
        <li
          v-for="file of courseFiles"
          :key="file.name"
        >

          <div class="row">

            <div class="col-0">
              <i 
              :class="fileIcon(file.type)"
              title="File Type"
              v-b-tooltip.left></i>
            </div>

            <div class="col-5">
              {{ file.originalFilename }}
            </div>

            <div class="col-2 size">
              {{ fileSize(file.size) }}
            </div>
            
            <div class="col">
              <i 
                class="fas fa-copy copy"
                title="Copy File URL"
                v-b-tooltip.right
                @click="copyUrl(file.name)"
              ></i>
            </div>
          </div>
        </li>
      </ul>

    
    </div>
    <hr>
    <div class="file-list-upload">
      <div class="drag-upload">

        <ul v-if="files.length">
          <li 
            v-for="(file, i) in files" 
            :key="file.id"
          >
            <div class="row">
              <div class="col-auto"> {{ file.name }} </div>
              <div class="col-auto"> {{ fileSize(file.size) }} </div>
              <div class="col-auto" v-if="file.error"> {{ file.error }} </div>
              <div class="col-auto" v-else-if="file.success"> {{ i18n.success }} </div>
              <div class="col-auto" v-else-if="file.active"> {{ i18n.active }} </div>
              <div class="col-auto" v-else></div>
              <div class="col-auto align-self-center">
                <button 
                  type="button"
                  class="btn btn-danger btn-sm remove-file"
                  @click="_removeFile(i)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </li>
        </ul>

        <ul v-else>
          <div class="text-center p-5">
            <h4 v-html="i18n.dropOr"></h4>
            <label 
              for="file"
              class="btn btn-lg btn-primary"
            >
              {{ i18n.selectFiles }}
            </label>
          </div>
        </ul>

        <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
          <h3>{{ i18n.dropToUpload }}</h3>
        </div>

        <div class="example-btn">
          <file-upload
            class="btn btn-primary"
            :custom-action="uploadFile"
            :post-action="uploadUrl"
            :multiple="true"
            :drop="true"
            :drop-directory="true"
            v-model="files"
            ref="upload">
            <i class="fas fa-plus"></i>
            {{ i18n.selectFiles }}
          </file-upload>
          <button 
            type="button" 
            class="btn btn-success" 
            v-if="!$refs.upload || !$refs.upload.active" 
            @click.prevent="$refs.upload.active = true"
          >
            <i class="fas fa-arrow-up" aria-hidden="true"></i>
            {{ i18n.startUpload }}
          </button>
          <button 
            type="button" 
            class="btn btn-danger"  
            v-else 
            @click.prevent="$refs.upload.active = false"
          >
            <i class="fas fa-stop" aria-hidden="true"></i>
            {{ i18n.stopUpload }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FileUpload from 'vue-upload-component'
import * as i18n from '@/i18n/plugins/misc/laya-upload-file-list'
import api from '@/backend-url'
import fileSize from '@/misc/utils.js'

export default {
  name: 'laya-upload-file-list',

  components: {
    FileUpload
  },

  computed: {
    ...mapGetters([
        'profileLang',
        'courseFiles',
        'courseStorage'
      ]),

    /**
     * i18n: Load translation files depending on user language
     * 
     * Author: cmc
     * 
     * Last updated: March 29, 2021
     * 
     */
    i18n() {
      return i18n[this.profileLang]
    },

    /**
     * step: return step of current content block
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     */
    step() {
      return this.$route.params.step
    },

    /**
     * upload: make refs available
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     */
    upload() {
      return this.$refs.upload
    },

    /**
     * uploadUrl: return course storage URL for upload
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021 
     */
    uploadUrl() {
      return `${api}/storage/${this.courseStorage}/upload`
    }
  },

  data() {
    return {
      files: [],
      uploaded: false,
      uploadedFiles: []
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
    files() {
      this.uploaded = this.$refs.upload.uploaded

    },

    /**
     * watcher uploaded: fire updateFileList() if uploaded is true
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     */
    uploaded(val) {
      if(val) {
        this.updateFileList()
      }
      else {
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
    uploadedFiles() {
      this.$nextTick( () => {
        this.updateCourseFiles()
      })
    }
  },

  beforeDestroy() {
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
    async uploadFile(file, component) {
      //let component = this.upload
      let ctx = this
      let duplicateFile = this.checkBeforeUpload(file)
      if (!duplicateFile) {
        console.log('starting upload...')
        return await component.uploadHtml5(file)
      }
      else return false
    },

    /**
     * function checkBeforeUpload: check if file with same name 
     *  and size already exists in a course
     * 
     * Author: cmc
     * 
     * Last updated: March 29, 2021
     * 
     * @param {object} file file to be uploaded
     * @returns true if no file with same name and size exists
     */
    checkBeforeUpload(file){
      if(file.success) {
        console.log('This file has already been uploaded!')
        file.error = 'duplicate file!'
        return true
      }

      const attrs = { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      }
      // check if file with the same parameters already 
      // exists in the course
      for (let entry of this.courseFiles ) {
        if (entry.originalFilename === attrs.name && 
          entry.size == attrs.size &&
          entry.type === attrs.type ) {
            console.log('This file already exists in this course!')
            file.error = 'duplicate file!'
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
    _removeFile(idx) {
      this.files.splice(idx, 1)
    },

    /**
     * function updateCourseFiles: store new files in vuex store
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     * 
     * @param {array} fileList list of files 
     */
    updateCourseFiles() {
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
    updateFileList() {
      for (let file of this.files) {
        if (file.success) {
          const fileEntry = { ...file.response.result.files.file[0]} 
          this.uploadedFiles.push(fileEntry)
        }
      }
    },

    fileIcon(type){
      // List of official MIME Types: http://www.iana.org/assignments/media-types/media-types.xhtml
      var iconClasses = {
        // Media
        image: 'fas fa-file-image',
        audio: 'fas fa-file-audio',
        video: 'fas fa-file-video',
        // Documents
        'application/pdf': 'fas fa-file-pdf',
        'application/msword': 'fas fa-file-word',
        'application/vnd.ms-word': 'fas fa-file-word',
        'application/vnd.oasis.opendocument.text': 'fas fa-file-word',
        'application/vnd.openxmlformatsfficedocument.wordprocessingml':
          'fas fa-file-word',
        'application/vnd.ms-excel': 'fas fa-file-excel',
        'application/vnd.openxmlformatsfficedocument.spreadsheetml':
          'fas fa-file-excel',
        'application/vnd.oasis.opendocument.spreadsheet': 'fas fa-file-excel',
        'application/vnd.ms-powerpoint': 'fas fa-file-powerpoint',
        'application/vnd.openxmlformatsfficedocument.presentationml':
          'fas fa-file-powerpoint',
        'application/vnd.oasis.opendocument.presentation': 'fas fa-file-powerpoint',
        'text/plain': 'fas fa-file-alt',
        'text/html': 'fas fa-file-code',
        'application/json': 'fas fa-file-code',
        // Archives
        'application/gzip': 'fas fa-file-archive',
        'application/zip': 'fas fa-file-archive'
      };

      for (var key in iconClasses) {
        if (iconClasses.hasOwnProperty(key)) {
          if (type.search(key) === 0) {
            // Found it
            return iconClasses[key]
          }
        }
      }
      return 'fas fa-file'
    }
  }

}
</script>

<style scoped>
.draggable {
  cursor: move;
}
.explorer {
  list-style-type: none;
}
.explorer .size {
  text-align: right;
}

.explorer .copy {
  cursor: copy;
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
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>
