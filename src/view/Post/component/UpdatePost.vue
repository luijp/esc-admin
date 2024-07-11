<script setup>
import {onMounted, ref, watchEffect} from "vue";
import {useRoute, useRouter} from 'vue-router'
import * as postApi from '../../../api/post.js'
import * as categoriesApi from '../../../api/categories.js'
import * as tagsApi from '../../../api/tags.js'
import {getCategoriesList} from "../../../api/categories.js";
import useNewTags from "./composition/useNewTags.js";
import useNewCategories from "./composition/useNewCategories.js";
import {ElMessage, ElMessageBox} from "element-plus";
import Upload from "../../../component/Upload/index.vue";
import * as attachApi from '../../../api/attach.js'
const categoriesRef = ref(null)
const tagsRef = ref(null)
const selectedTagsRef = ref([])
const selectedCategoriesRef = ref([])
const route = useRoute()
const router = useRouter()
const postRef = ref({
  "id": null,
  "title": "",
  "content": "",
  "summary": null,
  "cover": null,
  "createTime": null,
  "updateTime": null,
  "visible": true,
  "encrypt": null,
  "type": 1
})
const isLoaded = ref(false)
onMounted(async ()=>{
  const postId = route.params.id
  if(postId){
    postRef.value = (await postApi.getPost(postId)).data
    await loadTagsCategories(postId)
  }
  categoriesRef.value = (await categoriesApi.getCategoriesList()).data
  tagsRef.value = (await tagsApi.getTags()).data
  isLoaded.value = true
})

const loadTagsCategories = async (postId) => {
  const tags = (await tagsApi.getTagsByPostId(postId)).data
  const categories = (await categoriesApi.getCategoriesByPostId(postId)).data
  tags.forEach(tag => {
    selectedTagsRef.value.push(tag.tagName)
  })
  categories.forEach(category => {
    selectedCategoriesRef.value.push(category.categoryName)
  })
}

const handleSaveDraft = ()=>{
  postRef.value.visible = false
  savePost()
}

const handlePublish = ()=>{
  postRef.value.visible = true
  savePost(true)
}

const savePost = async (isPublish = false)=>{
  const postId = (await postApi.updatePost(postRef.value)).data
  await useNewTags(selectedTagsRef,postId)
  await useNewCategories(selectedCategoriesRef,postId)

  ElMessage({
    message:"文章更新成功",
    type:"success"
  })

  if(isPublish){
    setTimeout(()=>{
      router.push("/post")
    },3000)
  }
}

const handleCancel = ()=>{
  ElMessageBox.confirm('确定退出么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(()=>{
    router.push("/post/")

  })
}

const handleUploadCover = async (result) =>{
  postRef.value.cover = await attachApi.getAttachUrl(result.data[0].uuid,2)
}
</script>

<template>
<div class="update-post-container" v-if="isLoaded">
  <div class="title">
    <el-input v-model="postRef.title" placeholder="标题" size="large"/>
  </div>
  <div class="content-container">
    <div class="post-content-container">
      <div class="post-content">
        <el-input
            v-model="postRef.content"
            :rows="50"
            type="textarea"
            style="width: 98%;margin-bottom: 20px"
            placeholder="Content"
        />
      </div>
      <div class="post-summary">
        <el-input
            v-model="postRef.summary"
            :rows="3"
            type="textarea"
            placeholder="Summary"
            style="width: 98%;"
        />
      </div>
    </div>
    <div class="meta-info">
      <div class="categories">
        <span>分类：</span>
        <el-select
            v-model="selectedCategoriesRef"
            multiple
            filterable
            default-first-option
            allow-create
            placeholder="Categories"
            style="width: 240px"
        >
          <el-option
              v-for="item in categoriesRef"
              :key="item.id"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
      </div>
      <div class="tags">
        <span>标签：</span>
        <el-select
            v-model="selectedTagsRef"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="Tags"
            style="width: 240px"
        >
          <el-option
              v-for="item in tagsRef"
              :key="item.id"
              :label="item.name"
              :value="item.name"
          />
        </el-select>
      </div>
      <div class="create-time">
        <span>发布：</span>
        <el-date-picker
            v-model="postRef.createTime"
            type="datetime"
            placeholder="选择发布时间"
            style="width: 240px"
        />
      </div>
      <div class="update-time">
        <span>更新：</span>
        <el-date-picker
            v-model="postRef.updateTime"
            type="datetime"
            placeholder="选择更新时间"
            style="width: 240px"
        />
      </div>

      <div class="pwd">
        <span>密码：</span>
        <el-input v-model="postRef.encrypt" type="password" style="width: 240px" placeholder="留空则不设置" />
      </div>

      <div class="cover">
        <span>图片：</span>
        <el-input v-model="postRef.cover" style="width: 240px" placeholder="Cover URL" />
        <img :src="postRef.cover" v-if="postRef.cover" height="200px" width="240px"/>
        <Upload v-if="!postRef.cover" @success="handleUploadCover"/>
      </div>

      <div class="opBtn">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSaveDraft">存草稿</el-button>
        <el-button type="success" @click="handlePublish">发布</el-button>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>

.content-container{
  display: flex;
  margin-top: 20px;
  .post-content-container{
    flex: 1 1 auto
  }
  .meta-info{
    flex: 0 0 auto;
    width: 350px;
    background-color: white;
    padding: 20px;
    border: 1px solid #cbcbcb;
    div{
      margin-bottom: 10px;
      text-align: center;
    }
    .opBtn{
      display: flex;
      justify-content: center;
    }
  }
}
</style>