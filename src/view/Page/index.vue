<script setup>
import {ref, watchEffect} from "vue";
import * as postApi from "../../api/post.js";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";


const currentPage = ref(1)
const isLoaded = ref(false)
const postRef = ref(null)
watchEffect(async () => {
  postRef.value = (await postApi.getAllPost(currentPage.value,10,2)).data
  isLoaded.value = true
})

const refreshPosts = async () => {
  postRef.value = (await postApi.getAllPost(currentPage.value)).data
  isLoaded.value = true
}
const router = useRouter()
const handleNewPost = () => {
  router.push('/post/update')
}

const handlePostView = (page) => {
  window.location.href = "/post/" + page.id;
}

const handlePostEdit = (page) => {
  router.push(`/post/update/${page.id}`)
}

const handlePostDel = async (page) => {
  ElMessageBox.confirm('确定要删除 ' + page.name + ' 么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
    const status = await postApi.deletePost(page.id)
    if (status) {
      ElMessage({
        message: '删除成功',
        type: 'success',
      })
      await refreshPosts()
    } else {
      ElMessage.error("删除失败")
    }
  })

}
</script>

<template>
  <div class="page-container">
    <div class="header">
      <h2>页面管理</h2>
      <el-button plain type="success" @click="handleNewPost">新增</el-button>
    </div>
    <div v-if="isLoaded" class="content">

      <el-table :data="postRef.postsList" stripe style="width: 100%">
        <el-table-column label="标题" prop="title"/>
        <el-table-column label="时间" prop="createTime"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button plain size="small" type="primary" @click="handlePostView(scope.row)">查看</el-button>
            <el-button plain size="small" type="primary" @click="handlePostEdit(scope.row)">编辑</el-button>
            <el-button plain size="small" type="danger" @click="handlePostDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination :page-count="Math.ceil(postRef.total/postRef.size)"
                     layout="prev, pager, next"
                     @current-change="(value)=>currentPage = value"
      />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.page-container {
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