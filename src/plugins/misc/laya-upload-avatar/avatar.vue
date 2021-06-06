<template>
  <div>
    <div v-if="type=='avatar'">
      <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
        {{ i18n['layaUploadAvatar.dragFileHere'] }}
      </div>
      <div class="avatar-upload" v-show="!edit">
        <div class="text-center p-2">
          <label for="file">
            <img :src="files.length ? files[0].url : oldAvatar" 
              class="d-block rounded-circle avatar-preview">
            <br>{{ i18n['layaUploadAvatar.dragAnywhere'] }}
          </label>
        </div>
        <div class="text-center p-2">
          <file-upload ref="upload"
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png,image/gif,image/jpeg,image/webp"
            name="file" class="btn btn-primary"
            :post-action="postAvatar"
            :drop="!edit"
            @input-filter="inputFilter"
            @input-file="inputFile"
            v-model="files"
            >
            {{ i18n['layaUploadAvatar.uploadFile'] }}
          </file-upload>
        </div>
      </div>

      <div class="avatar-edit" v-show="files.length !=0 && edit">
        <div class="avatar-edit-image" v-if="files.length">
          <img ref="editImage" :src="files[0].url">
        </div>
        <div class="text-center p-4">
          <button type="button" class="btn btn-secondary" 
            @click.prevent="$refs.upload.clear">
            {{ i18n['cancel'] }}
          </button>
          <button type="submit" class="btn btn-primary"
            @click.prevent="editSave">
            {{ i18n['save'] }}
          </button>
        </div>
      </div>

    </div>

    <div v-else>
      <file-upload 
        ref="upload"
        v-model="files"
        post-action=""
        @input-file="inputFile"
        @input-filter="inputFilter">
        {{ i18n['layaUploadAvatar.uploadFile'] }} 
      </file-upload>
      <button v-show="!$refs.upload || !$refs.upload.active" 
        @click.prevent="$refs.upload.active = true" type="button">
        {{ i18n['startUpload'] }}
      </button>
      <button v-show="$refs.upload && $refs.upload.active" 
        @click.prevent="$refs.upload.active = false" 
        type="button">
        {{ i18n['stopUpload'] }}
      </button>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import api from '../../../backend-url.ts';
import { locale } from '@/mixins'

export default {
  name: 'laya-upload-avatar',

  components: {
    FileUpload
  },

  mixins: [
    locale
  ],

  props: {
    type: String,
    oldAvatar: String
  },

  data() {
    return {
      files: [],
      edit: false,
      cropper: false
    }
  },

  computed: {
    postAvatar(){
      return `${api}/storage/img/upload`
    }
  },

  watch: {
    edit(value) {
      if(value) {
        this.$nextTick( () => {
          if(!this.$refs.editImage) return ''

          let cropper = new Cropper(this.$refs.editImage, {
            aspectRatio: 1 / 1,
            viewMode: 1
          })
          this.cropper = cropper
          // console.log(cropper)
        })
      }
      else {
        if(this.cropper) {
          this.cropper.destroy()
          this.cropper = false
        }
      }
    }
  },

  methods: {

    editSave() {
      // console.log(`editSave function entered`)
      this.edit = false

      let oldFile = this.files[0]
      let binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1])
      let arr = new Uint8Array(binStr.length)
      for (let i = 0; i<binStr.length; i++) {
        arr[i] = binStr.charCodeAt(i)
      } 

      let file = new File(arr, oldFile.name, {type: oldFile.type})
      this.$refs.upload.update(oldFile.id, {
        file,
        type: file.type,
        size: file.size,
        active: true
      })
      return false
    },

    alert(msg) {
      alert(msg)
    },

    inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        this.$nextTick( () => {
          this.edit = true
        })
      }
      if(!newFile && oldFile) {
        this.edit = false
      }
    },
  
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          this.alert(this.i18n['layaUploadAvatar.noPicAlert'])
          return prevent()
        }
      }

      if (newFile && (!oldFile || newFile.file != oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        // console.log(URL)
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    }
  }
    
}
</script>

<style scoped>
.avatar-preview {
  width: 7rem;
  height: 7rem;
  margin: auto;
}

</style>