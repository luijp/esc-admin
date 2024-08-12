<script setup>
import * as backupApi from '../../api/backup.js'
import {onMounted, ref} from "vue";

const handleBackupDatabase = async ()=>{
  await backupApi.backupDatabase()
  await freshList()
}

const handleBackupUpload = async ()=>{
  await backupApi.backupUpload()
  await freshList()
}

const handleDeleteBackup = async (fileName)=>{
  await backupApi.deleteBackup(fileName)
  await freshList()
}

const isLoaded = ref(false)

const attachListRef = ref()

const freshList = async ()=>{
  isLoaded.value = false
  attachListRef.value = await backupApi.listBackup()
  isLoaded.value = true
}

onMounted(async ()=>{
  await freshList()
})

const handleGetBackupFile = (fileName)=>{
  return backupApi.getBackup(fileName)
}
</script>

<template>
<div class="backup-container">
  <el-button type="primary" @click="handleBackupDatabase">备份数据库</el-button>
  <el-button type="success" @click="handleBackupUpload">备份附件</el-button>
  <div class="header">
    <h2>备份文件</h2>
  </div>

  <div class="list" v-if="isLoaded" v-for="attach in attachListRef.data">
    <a :href="handleGetBackupFile(attach)">{{ attach }}</a>
    <a href="#" @click="handleDeleteBackup(attach)" style="margin-left: 10px;">删除</a>
  </div>
</div>
</template>

<style scoped>
.backup-container {
  margin: 0 auto;
  width: 800px;
}
.header{
  margin-top: 10px;
}
</style>