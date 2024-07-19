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
    <div class="op">
      <el-button type="success" @click="handleOpPass" plain>通过</el-button>
      <el-button type="warning" @click="handleOpDeny" plain>驳回</el-button>
      <el-popconfirm title="确认删除所选全部评论？" on-confirm="handleOpDel">
        <template #reference>
          <el-button type="danger" plain>删除</el-button>
        </template>
      </el-popconfirm>

    </div>
    <el-pagination :page-count="Math.ceil(commentListRef.total/commentListRef.pageSize)"
                   layout="prev, pager, next"
                   :hide-on-single-page="true"
                   v-model:current-page="pageNumRef"
    />
  </div>
</template>

<style scoped>
.op{
  text-align: right;
  margin: 20px;
}
</style>