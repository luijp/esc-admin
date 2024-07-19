<script setup>
import * as loginFailedApi from '../../api/loginFailed.js'
import {onMounted, ref} from "vue";
import * as postApi from "../../api/post.js";
import * as commentApi from "../../api/comment.js";
import * as categoriesApi from "../../api/categories.js";
import * as tagsApi from "../../api/tags.js";

const loginFailedListRef = ref()
const isLoaded = ref(false)
const postCountRef = ref(0)
const commentCountRef = ref(0)
const tagCountRef = ref(0)
const categoryCountRef = ref(0)

onMounted(async ()=>{
  loginFailedListRef.value = (await loginFailedApi.getLoginFailed()).data
  postCountRef.value = (await postApi.getAllPost()).data.total
  commentCountRef.value  = (await commentApi.listAll()).data.total
  categoryCountRef.value = (await categoriesApi.getCategoriesList()).data.length
  tagCountRef.value = (await tagsApi.getTags()).data.length
  isLoaded.value = true
})
</script>

<template>
  <div class="dashboard-container" v-if="isLoaded">
    <el-card shadow="hover">
      <h3>文章总数</h3>
      {{ postCountRef }}
    </el-card>

    <el-card shadow="hover">
      <h3>评论数量</h3>
      {{commentCountRef}}
    </el-card>

    <el-card shadow="hover">
      <h3>标签数量</h3>
      {{tagCountRef}}
    </el-card>

    <el-card shadow="hover">
      <h3>分类数量</h3>
      {{categoryCountRef}}
    </el-card>

    <el-card shadow="hover">
      <h3>最近失败登录</h3>
      <div class="no-data" v-if="!loginFailedListRef">暂无数据</div>
      <div class="login-failed-item" v-if="loginFailedListRef" v-for="loginFailed in loginFailedListRef">
        {{ loginFailed.ip }} {{ loginFailed.createTime }}
      </div>
    </el-card>

  </div>
</template>

<style scoped>
.dashboard-container{
  margin: 0 auto;
  width: 800px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.el-card{
  margin-top: 10px;
  width: 300px;
  min-height: 200px;
}
.no-data{
  font-style: italic;
}

h3{
  margin-bottom: 10px;
}
</style>