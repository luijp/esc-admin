<script setup>
import * as categoriesApi from '../../api/categories.js'
import {onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";

const categoriesRef = ref(null)
const categoriesListRef = ref([])
const isLoaded = ref(false)
const refreshCategories = async () => {
  categoriesRef.value = (await categoriesApi.getAllCategories()).data;
  categoriesListRef.value = (await categoriesApi.getCategoriesList()).data;
  categoriesListRef.value.unshift({
    id: 0,
    alias: '[root]',
    name: '[根]'
  })
  isLoaded.value = true
}
const editCategoryRef = ref({
  showDialog: false,
  isNew: false,
  category: {},
})


onMounted(() => {
  refreshCategories()
})

const handleNewCategory = () => {
  editCategoryRef.value.showDialog = true
  editCategoryRef.value.isNew = true
  editCategoryRef.value.category = {name: "", alias: "", id: null, parentId: 0}
}

const editCategoryHandler = (data) => {
  editCategoryRef.value.showDialog = true
  editCategoryRef.value.isNew = false
  editCategoryRef.value.category = data
}

const deleteCategoryHandler = async (data) => {
  ElMessageBox.confirm('确定要删除 ' + data.name + ' 么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
    const status = await categoriesApi.delCategories(data.id)
    if (status) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await refreshCategories()
    } else {
      ElMessage.error("删除失败")
    }
  })
}

const editCategoryDialogBtnHandler = async (save) => {
  if (save) {
    const result = await categoriesApi.updateCategories(editCategoryRef.value.category);
    if (result.code === 0) {
      ElMessage({
        message: '分类更新成功',
        type: 'success',
      })
      await refreshCategories()

    } else {
      ElMessage.error(result.msg)
    }
  }
    editCategoryRef.value.showDialog = false
}
</script>

<template>
  <div class="category-container">
    <div class="header">
      <h2>分类管理</h2>
      <el-button plain type="success" @click="handleNewCategory">新增</el-button>
    </div>
    <div class="tree">
      <el-tree
          v-if="isLoaded"
          :data="categoriesRef"
          :expand-on-click-node="false"
          default-expand-all
          node-key="alias"
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="category-item">{{ data.name }} ( {{ data.alias }} ) </span>
          <span>
            <a @click="editCategoryHandler(data)"> Edit </a>
            <a style="margin-left: 8px" @click="deleteCategoryHandler(data)"> Delete </a>
          </span>
        </span>
        </template>
      </el-tree>
    </div>

    <el-dialog v-model="editCategoryRef.showDialog" title="分类管理" width="500">
      <el-form-item :label-width="80" label="Name">
        <el-input v-model="editCategoryRef.category.name"/>
      </el-form-item>

      <el-form-item :label-width="80" label="Alias">
        <el-input v-model="editCategoryRef.category.alias"/>
      </el-form-item>

      <el-form-item :label-width="80" label="上级分类">
        <el-select v-model="editCategoryRef.category.parentId" placeholder="parent">
          <el-option v-for="category in categoriesListRef" :label="category.name" :value="category.id"/>
        </el-select>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editCategoryDialogBtnHandler(false)">取消</el-button>
          <el-button type="primary" @click="editCategoryDialogBtnHandler(true)">
            <span v-if="editCategoryRef.isNew">新增</span>
            <span v-if="!editCategoryRef.isNew">保存</span>
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.category-container {
  margin: 0 auto;
  width: 800px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  padding-right: 8px;
}

.el-tree {
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  --el-tree-node-content-height: 40px;
  max-width: 800px;
  min-height: 300px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}


</style>