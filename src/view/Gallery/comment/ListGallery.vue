<script setup>
import * as postApi from '../../../api/post.js'
import {ref, watchEffect} from "vue";
import {useRouter,useRoute} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";

const router = useRouter()
const route = useRoute()
const galleryRef = ref()
const currentPageRef = ref(1)
const isLoaded = ref(false)

const refreshGalleries = async ()=>{
  isLoaded.value = false
  galleryRef.value = await postApi.getAllPost(currentPageRef.value,10,4)
  isLoaded.value = true
}

watchEffect(async ()=>{
  await refreshGalleries()
})

const handleNewGallery = ()=>{
  router.push('/gallery/update')
}

const handleGalleryView = (gallery)=>{
  window.location.href = "/gallery/" + gallery.id;
}

const handleGalleryEdit = (gallery)=>{
  router.push(`/gallery/update/${gallery.id}`)
}

const handleGalleryDel = (gallery)=>{
  console.log(gallery)
  ElMessageBox.confirm('确定要删除 ' + gallery.title + ' 么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
    const status = await postApi.deletePost(gallery.id)
    if (status) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await refreshGalleries()
    } else {
      ElMessage.error("删除失败")
    }
  })
}
</script>

<template>
<div class="list-gallery-container">
  <div class="header">
    <h2>相册管理</h2>
    <el-button plain type="success" @click="handleNewGallery">新建相册</el-button>
  </div>

  <div v-if="isLoaded" class="content">

    <el-table :data="galleryRef.data.postsList" stripe style="width: 100%">
      <el-table-column label="标题" prop="title"/>
      <el-table-column label="时间" prop="createTime"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button plain size="small" type="primary" @click="handleGalleryView(scope.row)">查看</el-button>
          <el-button plain size="small" type="primary" @click="handleGalleryEdit(scope.row)">编辑</el-button>
          <el-button plain size="small" type="danger" @click="handleGalleryDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :page-count="Math.ceil(galleryRef.total/galleryRef.size)"
                   layout="prev, pager, next"
                   @current-change="(value)=>currentPageRef = value"
    />
  </div>
</div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.list-gallery-container {
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