<script setup>
import {ref, watchEffect} from "vue";
import * as commentApi from '../../api/comment.js'
const isLoaded = ref(false)
const commentListRef = ref()
const pageNumRef = ref(1)
const refreshCommentList = async ()=>{
  commentListRef.value  = (await commentApi.listAll(pageNumRef.value, 30)).data
  isLoaded.value = true
}
const selectedCommentRef = ref([])
const handleSelect = (comment)=>{
  selectedCommentRef.value = comment
}
watchEffect(async ()=>{
  await refreshCommentList()
})
const handleOpPass = async ()=>{
  for (const comment of selectedCommentRef.value) {
    await commentApi.pass(comment.id)
    await refreshCommentList()
  }
}
const handleOpDeny = async ()=>{
  for (const comment of selectedCommentRef.value) {
    await commentApi.deny(comment.id)
    await refreshCommentList()
  }
}
const handleOpDel = async ()=>{
  for (const comment of selectedCommentRef.value) {
    await commentApi.del(comment.id)
    await refreshCommentList()
  }
}
</script>

<template>
  <div class="comment-container" v-if="isLoaded">
    <div class="header">
      <h2>评论管理</h2>
      <div class="op">
        <el-button type="success" :disabled="selectedCommentRef.length === 0" @click="handleOpPass" plain>通过</el-button>
        <el-button type="warning" :disabled="selectedCommentRef.length === 0" @click="handleOpDeny" plain>驳回</el-button>
        <el-popconfirm title="确认删除所选全部评论？" on-confirm="handleOpDel">
          <template #reference>
            <el-button :disabled="selectedCommentRef.length === 0" type="danger" plain>删除</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
    <el-table
        ref="multipleTableRef"
        :data="commentListRef.commentList"
        @selection-change="handleSelect"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="时间" property="createTime" width="150" />
      <el-table-column label="用户" property="username" width="150" />

      <el-table-column label="内容">
        <template #default="scope">
          <el-tag type="info" v-if="scope.row.visible === false">待批准</el-tag>
          {{ scope.row.content}}
        </template>
      </el-table-column>

    </el-table>

    <el-pagination :page-count="Math.ceil(commentListRef.total/commentListRef.pageSize)"
                   layout="prev, pager, next"
                   :hide-on-single-page="true"
                   v-model:current-page="pageNumRef"
    />
  </div>
</template>

<style scoped>
.comment-container{
  margin: 0 auto;
  width: 800px;
}
.header {
  display: flex;
  justify-content: space-between;
}

.el-table{
  padding: 20px;
  border-radius: 10px;
}
.op{
  text-align: right;
  margin: 20px;
}
</style>