<!--
  Filename: upload-avatar.vue
  Use: Upload and crop avatar
  Author: cmc
  Since: v1.1.0
-->
<template>
  <div>
    <div>
      <div
        v-show="$refs.upload && $refs.upload.dropActive"
        class="drop-active"
      >
        {{ y18n('layaUploadAvatar.dragFileHere') }}
      </div>
      <div
        v-show="!edit"
        class="avatar-upload"
      >
        <div class="text-center p-2">
          <label>
            <img
              v-auth-image="files.length ? files[0].url : oldAvatar"
              class="d-block rounded-circle avatar-preview"
              alt="User Avatar"
            >
            <br>{{ y18n('layaUploadAvatar.dragAnywhere') }}
          </label>
        </div>
        <div class="text-center p-2">
          <file-upload
            ref="upload"
            v-model="files"
            extensions="gif,jpg,jpeg,png,webp"
            accept="image/png,image/gif,image/jpeg,image/webp"
            name="file"
            class="btn btn-success"
            :post-action="postAvatar"
            :headers="headers"
            :drop="!edit"
            @input-file="inputFile"
            @input-filter="inputFilter"
            @input="setFileURL"
          >
            {{ y18n('layaUploadAvatar.uploadFile') }}
          </file-upload>
        </div>
      </div>

      <div
        v-show="files.length !== 0 && edit"
        class="avatar-edit"
      >
        <div
          v-if="files.length"
          class="avatar-edit-image"
        >
          <img
            ref="editImage"
            :src="files[0].url"
            alt="Edit Image"
          >
        </div>
        <div class="text-center p-4">
          <button
            type="button"
            class="btn btn-primary"
            @click.prevent="$refs.upload.clear"
          >
            {{ y18n('cancel') }}
          </button>
          <button
            type="submit"
            class="btn btn-success"
            @click.prevent="editSave"
          >
            {{ y18n('save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import api from '@/backend-url.ts'
import { locale } from '@/mixins'

export default {
  name: 'UploadAvatar',

  components: {
    FileUpload
  },

  mixins: [
    locale
  ],

  props: {
    oldAvatar: {
      type: String,
      default () { return '' }
    }
  },

  data () {
    return {
      files: [],
      edit: false,
      cropper: false
    }
  },

  computed: {
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
    postAvatar () {
      return `${api}/storage/img/upload`
    },
    downloadURL () {
      return `${api}/storage/img/download/`
    }
  },

  watch: {
    edit (value) {
      if (value) {
        this.$nextTick(() => {
          if (!this.$refs.editImage) return ''

          this.cropper = new Cropper(this.$refs.editImage, {
            aspectRatio: 1,
            viewMode: 1
          })
          // console.log(cropper)
        })
      } else {
        if (this.cropper) {
          this.cropper.destroy()
          this.cropper = false
        }
      }
    }
  },

  methods: {
    editSave () {
      // console.log(`editSave function entered`)

      const oldFile = this.files[0]

      const canvasData = this.cropper.getCanvasData()
      const imageData = this.cropper.getImageData()

      console.log(canvasData)
      console.log(imageData)
      console.log(oldFile.size, oldFile.type)

      if (this.cropper.canvasData.height !== this.cropper.imageData.height) {
        this.cropper.imageData.scaleY = this.cropper.imageData.height / this.cropper.canvasData.height
      }

      if (this.cropper.canvasData.width !== this.cropper.imageData.width) {
        this.cropper.imageData.scaleX = this.cropper.imageData.width / this.cropper.canvasData.width
      }

      // const binStr = atob(this.cropper.getCroppedCanvas().toDataURL(oldFile.type).split(',')[1])
      // const arr = new Uint8Array(binStr.length)
      // for (let i = 0; i < binStr.length; i++) {
      //   arr[i] = binStr.charCodeAt(i)
      // }
      const croppedBlob = this.cropper.getCroppedCanvas()
      croppedBlob.type = oldFile.type
      croppedBlob.toBlob(async (blob) => {
        console.log(blob)
        this.$refs.upload.update(oldFile.id, {
          file: blob,
          type: oldFile.type,
          size: blob.size,
          active: true
        })
      })
      this.edit = false
    },

    alert (msg) {
      alert(msg)
    },

    async inputFile (newFile, oldFile) {
      if (newFile && !oldFile) {
        console.log(await newFile)
        this.$nextTick(() => {
          this.edit = true
        })
      }
      if (!newFile && oldFile) {
        this.edit = false
      }
    },

    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          this.alert(this.y18n('layaUploadAvatar.noPicAlert'))
          return prevent()
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // console.log(newFile)
        newFile.url = ''
        const URL = window.URL || window.webkitURL
        // console.log(URL)
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    },
    async setFileURL () {
      const fileName = await this.files[0].response.result.files.file[0].name
      this.files[0].url = this.downloadURL + fileName
      this.$emit('uploaded', fileName)
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
img {
  max-width: 100%;
}
</style>
