<template>
  <div class="file-list-upload">
    <div class="drag-upload">

      <ul v-if="files.length">
        <li 
          v-for="(file, i) in files" 
          :key="file.id"
        >
          <div class="row">
            <div class="col-auto"> {{ file.name }} </div>
            <div class="col-auto"> {{ file.size }} </div>
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
          <i class="fa fa-arrow-up" aria-hidden="true"></i>
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
</template>

<script>
import { mapGetters } from 'vuex'
import FileUpload from 'vue-upload-component'
import * as i18n from '@/i18n/plugins/misc/laya-upload-file-list'
import api from '../../../backend-url'

export default {
  name: 'laya-upload-file-list',

  components: {
    FileUpload
  },

  computed: {
    ...mapGetters([
        'profileLang',
        'course',
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
     * uploaded: make uploaded status available
     * 
     * Author: cmc
     * 
     * Last Updated: March 29, 2021
     */
    uploaded() {
      return this.$refs.upload.uploaded
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
      files: [

      ],
      uploadedFiles: null
    }
  },

  watch: {
    uploaded(value) {
      if (!value) {
        console.log('Wert für uploading hat sich geändert')
        this.uploadedFiles = false
      } else {
        console.log('Upload abgeschlossen')
        if (this.uploadedFiles != null) this.uploadedFiles = true
      }
    },

    uploadedFiles(value) {
      if (value) {
        this.$nextTick( () => {
          this.updateCourseFiles()
        })
      }
    }
  },

  methods: {
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
    updateCourseFiles(fileList) {
      this.$store.commit('updateCourseFiles', fileList)
    }
  }

}
</script>

<style scoped>
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
