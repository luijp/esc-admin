<script setup>
import {ref, watch, watchEffect} from "vue";
import * as attachApi from '../../api/attach.js'
import {ElMessage, ElMessageBox} from "element-plus";
import Upload from '../../component/Upload/index.vue'

const handleNewAttach = () => {
  newAttachRef.value.showDialog = true
}

const newAttachRef = ref({
  showDialog: false,
})

const currentPage = ref(1)
const isLoaded = ref(false)
const attachRef = ref(null)

watchEffect(async () => {
  attachRef.value = (await attachApi.getAllAttach(currentPage.value)).data
  isLoaded.value = true
})

watch(
    () => newAttachRef.value.showDialog,
    (newVal, oldVal) => {
      if (newVal === false) {
        refreshAttach()
      }
    }
)
const refreshAttach = async () => {
  attachRef.value = (await attachApi.getAllAttach(currentPage.value)).data
}

const handleAttachView = (file) => {
  return attachApi.getAttachUrl(file.uuid, 2);
  //window.open(url,'_blank')
}

const handleAttachUrlDownload = (file) => {
  return attachApi.getAttachUrl(file.uuid);
}

const handleAttachDel = async (file) => {
  ElMessageBox.confirm('确定要删除 ' + file.name + ' 么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
    const status = await attachApi.delAttach(file.uuid)
    if (status) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await refreshAttach()
    } else {
      ElMessage.error("删除失败")
    }
  })
}


</script>

<template>
  <div class="attach-container">
    <div class="header">
      <h2>附件管理</h2>
      <el-button plain type="success" @click="handleNewAttach">新增</el-button>
    </div>
    <div v-if="isLoaded" class="content">
      <div class="example-pagination-block">
        <el-table :data="attachRef.attachList" stripe style="width: 100%">
          <el-table-column label="文件名" prop="name"/>
          <el-table-column label="上传时间" prop="createTime"/>
          <el-table-column label="操作">
            <template #default="scope">
              <a :href="handleAttachView(scope.row)" target="_blank">
                <el-button plain size="small" type="primary">查看</el-button>
              </a>
              <a :href="handleAttachUrlDownload(scope.row)" target="_blank">
                <el-button plain size="small" type="primary">下载</el-button>
              </a>
              <el-button plain size="small" type="danger" @click="handleAttachDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :page-count="Math.ceil(attachRef.total/attachRef.size)"
                       layout="prev, pager, next"
                       @current-change="(value)=>currentPage = value"
        />
      </div>
    </div>

    <el-dialog v-model="newAttachRef.showDialog" title="附件管理" width="600">

      <Upload/>

    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.attach-container {
  margin: 0 auto;
  width: 800px;
}

.content {
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  max-width: 800px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
  background-color: white;
  margin-bottom: 20px;
}
</style>