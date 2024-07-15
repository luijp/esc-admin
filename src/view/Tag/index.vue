<script setup>
import * as tagsApi from "../../api/tags.js"
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

let tagsRef = ref()
const isLoaded = ref(false);
const editTagRef = ref({
  showDialog: false,
  isNew: false,
  tag: {},
})

const refreshTags = async () => {
  tagsRef.value = (await tagsApi.getTags()).data
  isLoaded.value = true
}
onMounted(() => {
  refreshTags()
})

const handleTagClose = (tag) => {
  ElMessageBox.confirm('确定要删除 ' + tag.name + ' 么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
    const status = await tagsApi.deleteTag(tag.id)
    if (status) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await refreshTags()
    } else {
      ElMessage.error("删除失败")
    }

  })
}

const handleTagClick = (tag) => {
  editTagRef.value.tag = tag
  editTagRef.value.showDialog = true
  editTagRef.value.isNew = false
}

const handleNewTag = () => {
  editTagRef.value.showDialog = true
  editTagRef.value.isNew = true
  editTagRef.value.tag = {name: "", alias: "", id: null}
}

const editTagDialogBtnHandler = async (save) => {
  if (save) {
    const result = await tagsApi.updateTag(editTagRef.value.tag);
    if (result.code === 0) {
      ElMessage({
        message: 'Tag 更新成功',
        type: 'success',
      })
      await refreshTags()
      editTagRef.value.showDialog = false
    } else {
      ElMessage.error(result.msg)
    }
  } else {
    editTagRef.value.showDialog = false
  }
}

</script>

<template>
  <div class="tag-container">
    <div class="header">
      <h2>标签管理</h2>
      <el-button plain type="success" @click="handleNewTag">新增</el-button>
    </div>

    <div class="tag-content flex">
      <el-tag
          v-for="tag in tagsRef"
          :key="tag.id"
          closable
          size="large"
          @click="handleTagClick(tag)"
          @close="handleTagClose(tag)"
      >
        <span class="tag-text">{{ tag.name }}</span>
      </el-tag>
    </div>

    <el-dialog v-model="editTagRef.showDialog" title="标签管理" width="500">
      <el-form-item :label-width="50" label="Name">
        <el-input v-model="editTagRef.tag.name"/>
      </el-form-item>

      <el-form-item :label-width="50" label="Alias">
        <el-input v-model="editTagRef.tag.alias"/>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editTagDialogBtnHandler(false)">取消</el-button>
          <el-button type="primary" @click="editTagDialogBtnHandler(true)">
            <span v-if="editTagRef.isNew">新增</span>
            <span v-if="!editTagRef.isNew">保存</span>
          </el-button>
        </div>
      </template>
    </el-dialog>


  </div>

</template>

<style scoped>
.tag-container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
}

.tag-content {
  margin-top: 20px;
  padding: 30px;
  min-height: 300px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);

  .el-tag {
    margin-right: 15px;
    cursor: pointer;
  }

  .tag-text {
    font-size: 1.5em;
  }
}
</style>