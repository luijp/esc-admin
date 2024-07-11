<script setup>
import * as categoriesApi from '../../api/categories.js'
import {computed, onMounted, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import * as postApi from "../../api/post.js";

const categoriesRef = ref(null)
const categoriesListRef = ref(null)
const isLoaded = ref(false)
const refreshCategories = async ()=>{
  categoriesRef.value = (await categoriesApi.getAllCategories()).data;
  categoriesListRef.value = (await categoriesApi.getCategoriesList()).data;
  isLoaded.value = true
}
const editCategoryRef = ref({
  showDialog: false,
  isNew: false,
  category: {},
})


onMounted(()=>{
  refreshCategories()
} )

const handleNewCategory = ()=>{
  editCategoryRef.value.showDialog = true
  editCategoryRef.value.isNew = true
  editCategoryRef.value.category = {name:"",alias:"",id:null,parentId:1}
}

const editCategoryHandler = (data)=>{
  editCategoryRef.value.showDialog = true
  editCategoryRef.value.isNew = false
  editCategoryRef.value.category = data
}

const deleteCategoryHandler = async (data)=>{
  ElMessageBox.confirm('确定要删除 ' + data.name +' 么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async ()=>{
    const status = await categoriesApi.delCategories(data.id)
    if(status){
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await refreshCategories()
    }else{
      ElMessage.error("删除失败")
    }
  })
}

const editCategoryDialogBtnHandler = async (save)=>{
  if(save){
    const result = await categoriesApi.updateCategories(editCategoryRef.value.category);
    if(result.code === 0){
      ElMessage({
        message: '分类更新成功',
        type: 'success',
      })
      await refreshCategories()
      editCategoryRef.value.showDialog = false
    }else{
      ElMessage.error(result.msg)
    }
  }else{
    editCategoryRef.value.showDialog = false
  }
}
</script>

<template>
<div class="category-container">
  <div class="header">
    <h2>分类管理</h2>
    <el-button type="success" plain @click="handleNewCategory">新增</el-button>
  </div>
  <div class="tree">
    <el-tree
        :data="categoriesRef"
        node-key="alias"
        default-expand-all
        :expand-on-click-node="false"
        v-if="isLoaded"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span class="category-item">{{ data.name }} ( {{data.alias}} ) </span>
          <span>
            <a @click="editCategoryHandler(data)"> Edit </a>
            <a style="margin-left: 8px" @click="deleteCategoryHandler(data)"> Delete </a>
          </span>
        </span>
      </template>
    </el-tree>
  </div>

  <el-dialog v-model="editCategoryRef.showDialog" title="分类管理" width="500">
    <el-form-item label="Name" :label-width="80">
      <el-input v-model="editCategoryRef.category.name"/>
    </el-form-item>

    <el-form-item label="Alias" :label-width="80">
      <el-input v-model="editCategoryRef.category.alias"/>
    </el-form-item>

    <el-form-item label="上级分类" :label-width="80">
      <el-select v-model="editCategoryRef.category.parentId" placeholder="parent">
        <el-option :label="category.name" :value="category.id" v-for="category in categoriesListRef" />
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
.header{
  display: flex;
  justify-content: space-between;
}
.category-container{
  margin:0 auto;
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
.el-tree{
  padding: 20px;
  border-radius: 10px;
  margin-top: 20px;
  --el-tree-node-content-height: 40px;
  max-width: 800px;
  min-height: 300px;
  box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
}



</style>