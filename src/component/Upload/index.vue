<script setup>

import * as attachApi from "../../api/attach.js";
import {UploadFilled} from "@element-plus/icons-vue";

const emit = defineEmits(['success', 'error'])
const handleUploadError = (result) => {
  emit('error', result)
}

const handleUploadSuccess = (result) => {
  emit('success', result)
}
</script>

<template>
  <el-upload
      :http-request="attachApi.updateAttach"
      :on-error="handleUploadError"
      :on-success="handleUploadSuccess"
      class="upload-demo"
      drag
      multiple
      name="files"
      with-credentials
  >
    <el-icon class="el-icon--upload">
      <upload-filled/>
    </el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">

      </div>
    </template>
  </el-upload>
</template>

<style scoped>

</style>