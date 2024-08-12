<script setup>
import {ref, watchEffect} from "vue";
import * as postApi from '../../api/post.js'
import {ElMessage} from "element-plus";

const postRef = ref({
  "id": null,
  "title": "micro",
  "content": "",
  "summary": null,
  "cover": null,
  "createTime": null,
  "updateTime": null,
  "visible": 1,
  "encrypt": null,
  "type": 3
})

const pageNumRef = ref(1)
const microListRef = ref()
const isLoadedRef = ref(false)
watchEffect(async ()=>{
  isLoadedRef.value = false
  microListRef.value = await postApi.getAllPost(pageNumRef.value,30,3)
  isLoadedRef.value = true
})
const handleCurrentPageChange = (pageNum)=>{
  pageNumRef.value = pageNum
}
const handlePostMicro = async ()=>{
  if(postRef.value.content === ''){
    ElMessage.error("不得发布空内容")
    return
  }
  await postApi.updatePost(postRef.value)
  location.reload();
}

const handleDelMicro = async (id)=>{
  await postApi.deletePost(id)
  location.reload();
}
</script>

<template>
<div class="micro-container">
  <div class="header">
    <h2>碎语管理</h2>
  </div>
  <div class="post">
    <el-input
        v-model="postRef.content"
        style="width: 700px"
        placeholder="Your idea..."
        type="textarea"
        :rows="5"
    /><br />
    <el-button type="success" @click="handlePostMicro">发布</el-button>
  </div>

  <el-divider />

  <div class="micro-list" v-if="isLoadedRef">
    <el-empty description="暂无碎语" v-if="microListRef.data.total === 0"/>

    <div class="item" v-if="microListRef.data.total !== 0"
         v-for="microItem in microListRef.data.postsList"
         :key="microItem.id"
    >
      <div class="metaInfo">
        {{ microItem.createTime }}
      </div>
      <div class="content">
        {{ microItem.content }}
      </div>
      <div class="btn">
        <el-button type="danger" text @click="handleDelMicro(microItem.id)">删除</el-button>
      </div>
    </div>

    <el-pagination
        layout="prev, pager, next"
        :total="microListRef.data.total"
        :page-size="30"
        :hide-on-single-page="false"
        @current-change="handleCurrentPageChange"
    />
  </div>
</div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.micro-container {
  margin: 0 auto;
  width: 800px;
}

.post{
  margin-top: 20px;
  .el-button{
    margin-top: 10px;
  }
}

.micro-list{
  .item{
    margin-top: 15px;
    padding: 10px;
    background-color: #FFFFFF;
    border-radius: 10px;
    width: 700px;
    .metaInfo{
      font-size: 12px;
      color: #939090;
    }
    .content{
      margin-top: 5px;
    }
    .btn{
      text-align: end;
    }
  }
}

.el-pagination{
  margin-top: 20px;
}
</style>