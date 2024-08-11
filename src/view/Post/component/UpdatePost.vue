<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from 'vue-router'
import * as postApi from '../../../api/post.js'
import * as categoriesApi from '../../../api/categories.js'
import * as tagsApi from '../../../api/tags.js'
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
  "visible": 1,
  "encrypt": null,
  "type": 1
})
const isLoaded = ref(false)
onMounted(async () => {
  const postId = route.params.id
  if (postId) {
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

const handleSavePost = () => {
  savePost(true)
}

const savePost = async (isPublish = false) => {
  const postId = (await postApi.updatePost(postRef.value)).data
  await useNewTags(selectedTagsRef, postId)
  await useNewCategories(selectedCategoriesRef, postId)

  ElMessage({
    message: "文章更新成功",
    type: "success"
  })

  if (isPublish) {
    setTimeout(() => {
      router.push("/post")
    }, 3000)
  }
}

const handleCancel = () => {
  ElMessageBox.confirm('确定退出么？',
      'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
    router.push("/post/")

  })
}

const handleUploadCover = async (result) => {
  postRef.value.cover = await attachApi.getAttachUrl(result.data[0].uuid, 2)
}
</script>

<template>
  <div v-if="isLoaded" class="update-post-container">
    <div class="title">
      <el-input v-model="postRef.title" placeholder="标题" size="large"/>
    </div>
    <div class="content-container">
      <div class="post-content-container">
        <div class="post-content">
          <el-input
              v-model="postRef.content"
              :rows="50"
              placeholder="Content"
              style="width: 98%;margin-bottom: 20px"
              type="textarea"
          />
        </div>
        <div class="post-summary">
          <el-input
              v-model="postRef.summary"
              :rows="3"
              placeholder="Summary"
              style="width: 98%;"
              type="textarea"
          />
        </div>
      </div>
      <div class="meta-info">
        <div class="categories">
          <span>分类：</span>
          <el-select
              v-model="selectedCategoriesRef"
              allow-create
              default-first-option
              filterable
              multiple
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
              allow-create
              default-first-option
              filterable
              multiple
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
              placeholder="选择发布时间"
              style="width: 240px"
              type="datetime"
          />
        </div>
        <div class="update-time">
          <span>更新：</span>
          <el-date-picker
              v-model="postRef.updateTime"
              placeholder="选择更新时间"
              style="width: 240px"
              type="datetime"
          />
        </div>

        <div class="pwd">
          <span>密码：</span>
          <el-input v-model="postRef.encrypt" placeholder="留空则不设置" style="width: 240px" type="password"/>
        </div>

        <div class="visible">
          <span>状态：</span>
          <el-select
              v-model="postRef.visible"
              placeholder="Select"
              style="width: 240px"
          >
            <el-option key="1" label="公开" :value="1"/>
            <el-option key="2" label="登陆可见" :value="2"/>
            <el-option key="0" label="草稿" :value="0"/>
          </el-select>
        </div>

        <div class="cover">
          <span>图片：</span>
          <el-input v-model="postRef.cover" placeholder="Cover URL" style="width: 240px"/>
          <img v-if="postRef.cover" :src="postRef.cover" height="200px" width="240px"/>
          <Upload v-if="!postRef.cover" @success="handleUploadCover"/>
        </div>

        <div class="opBtn">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="success" @click="handleSavePost">发布</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.content-container {
  display: flex;
  margin-top: 20px;

  .post-content-container {
    flex: 1 1 auto
  }

  .meta-info {
    flex: 0 0 auto;
    width: 350px;
    background-color: white;
    padding: 20px;
    border: 1px solid #cbcbcb;

    div {
      margin-bottom: 10px;
      text-align: center;
    }

    .opBtn {
      display: flex;
      justify-content: center;
    }
  }
}
</style>