<script setup>

import {onMounted, ref} from "vue";
import * as settingsApi from '../../api/settings.js'
import {ElMessage} from "element-plus";


const globalSettingsRef = ref({})
const customSettingsRef = ref({})
const isLoaded = ref(false)

onMounted(async ()=>{
  await refreshGlobalSettings()
  await refreshCustomSettings()
  isLoaded.value = true
} )
const refreshGlobalSettings = async ()=>{
  globalSettingsRef.value = (await settingsApi.getGlobal()).data
}

const refreshCustomSettings = async ()=>{
  customSettingsRef.value = (await settingsApi.getCustom()).data
}

const handleSaveGlobalSettings = async ()=>{
  const result = await settingsApi.updateGlobal(globalSettingsRef.value)
  if(result.code === 0){
    ElMessage({
      message: '全局设置更新成功',
      type: 'success',
    })
    await refreshGlobalSettings()
  }else{
    ElMessage.error(result.msg)
  }
}
const editCustomSettingsRef = ref({
  showDialog: false,
  customSettings: {},
})

const editCustomSettingsDialogBtnHandler = async (save)=>{
  if(save){
    const customSettingTmp = {}
    customSettingTmp[editCustomSettingsRef.value.customSettings.k] = editCustomSettingsRef.value.customSettings.v
    const result = await settingsApi.updateCustom(customSettingTmp)
    if(result.code === 0){
      ElMessage({
        message: '个人设置更新成功',
        type: 'success',
      })
      await refreshCustomSettings()
      editCustomSettingsRef.value.showDialog = false
    }else{
      ElMessage.error(result.msg)
    }
  }else{
    editCustomSettingsRef.value.showDialog = false
  }
}

const handleNewCustomSettings = ()=>{
  editCustomSettingsRef.value.showDialog = true
  editCustomSettingsRef.value.customSettings = {}
}

const handleSaveCustomSettings = async ()=>{
  const result = await settingsApi.updateCustom(customSettingsRef.value)
  if(result.code === 0){
    ElMessage({
      message: '个人设置更新成功',
      type: 'success',
    })
    await refreshCustomSettings()
  }else{
    ElMessage.error(result.msg)
  }
}
</script>

<template>
  <div class="settings-container" v-if="isLoaded">
    <div class="header">
      <h2>全局设置</h2>
      <el-button type="primary" plain @click="handleSaveGlobalSettings">保存</el-button>
    </div>
    <div class="content">
      <el-row v-for="(v,k) in globalSettingsRef" :key="k" style="margin-bottom:20px">
        <el-col :span="5">
          {{k}}
        </el-col>
        <el-col :span="8">
          <el-input v-model="globalSettingsRef[k]" style="width: 240px"/>
        </el-col>
      </el-row>
    </div>

    <div class="header">
      <h2>个人设置</h2>
      <div class="btn">
        <el-button type="success" plain @click="handleNewCustomSettings">新增</el-button>
        <el-button type="primary" plain @click="handleSaveCustomSettings">保存</el-button>
      </div>

    </div>
    <div class="content">
      <el-row v-for="(v,k) in customSettingsRef" :key="k" style="margin-bottom:20px">
        <el-col :span="5">
          {{k}}
        </el-col>
        <el-col :span="8">
          <el-input v-model="customSettingsRef[k]" style="width: 240px;"/>
        </el-col>
      </el-row>
    </div>
  </div>

  <el-dialog v-model="editCustomSettingsRef.showDialog" title="分类管理" width="500">
    <el-form-item label="k" :label-width="80">
      <el-input v-model="editCustomSettingsRef.customSettings.k"/>
    </el-form-item>

    <el-form-item label="v" :label-width="80">
      <el-input v-model="editCustomSettingsRef.customSettings.v"/>
    </el-form-item>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editCustomSettingsDialogBtnHandler(false)">取消</el-button>
        <el-button @click="editCustomSettingsDialogBtnHandler(true)">新增</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.header{
  display: flex;
  justify-content: space-between;
}

.settings-container{
  margin:0 auto;
  width: 800px;
}

.content{
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  max-width: 800px;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
  background-color: white;
  margin-bottom: 20px;
}
</style>