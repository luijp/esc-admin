<script setup>
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import * as postApi from "../../../api/post.js";
import {ElMessage} from "element-plus";
import * as attachApi from '../../../api/attach.js'
import Upload from "../../../component/Upload/index.vue";
import {Files} from "@element-plus/icons-vue";

const route = useRoute()
const router = useRouter()
const galleryRef = ref({
  "id": null,
  "title": "",
  "content": "",
  "summary": null,
  "cover": null,
  "createTime": null,
  "updateTime": null,
  "visible": 1,
  "encrypt": null,
  "type": 4
})

const galleryListRef = ref({})

const isGalleryIdValid = async ()=>{
  const galleryId = route.params.id
  if (galleryId) {
    galleryRef.value = (await postApi.getPost(galleryId)).data
    if(galleryRef.value.type !== 4){
      ElMessage.error("gallery id error")
      await router.push("/gallery")
    }
    galleryListRef.value = JSON.parse(galleryRef.value.content)
  }
}
const isLoaded = ref(false)
const currentPageRef = ref(1)
const attachRef = ref()
const getAttachList = async ()=>{
  isLoaded.value = false
  attachRef.value = await attachApi.getAllAttach(currentPageRef.value,10)
  isLoaded.value = true
}
const isImgByName = (fileName)=>{
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return imageExtensions.includes(fileExtension);
}
onMounted(async ()=>{
  await isGalleryIdValid()
  await getAttachList()
})

const handleTriggerAttach = (attachItem) =>{
  if(galleryListRef.value.hasOwnProperty(attachItem.uuid)){
    delete galleryListRef.value[attachItem.uuid];
  }else{
    galleryListRef.value[attachItem.uuid] = {
      "name": attachItem.name,
      "description": "",
    }
  }
}

const handleUploadSuccess = async ()=>{
  ElMessage.success("upload success")
  await getAttachList()
}

const handleUploadError = ()=>{
  ElMessage.error("upload error")
}

const handlePublish = async ()=>{
  if(galleryRef.value.title === ""){
    ElMessage.error("title is valid")
    return
  }
  if(Object.keys(galleryListRef.value).length === 0){
    ElMessage.error("picture cannot be empty")
    return
  }
  galleryRef.value.content = JSON.stringify(galleryListRef.value)
  const result = await postApi.updatePost(galleryRef.value)
  if(result.code === 0){
    ElMessage.success("publish success")
    await router.push("/gallery")
  }else{
    ElMessage.error("publish error")
  }
}
</script>

<template>
<div class="update-gallery-container">
  <div class="title">
    <el-input v-model="galleryRef.title" placeholder="标题" size="large"/>
  </div>
  <div class="pic-list" v-for="galleryUUID in Object.keys(galleryListRef)">
    <div class="pic">
      <el-image style="width: 150px; height: 100px"
                :src="attachApi.getAttachUrl(galleryUUID, 2)"
                fit="cover"
                v-if="isImgByName(galleryListRef[galleryUUID].name)"
      >
        <template #error>
          <div class="image-slot">
            {{ galleryListRef[galleryUUID].name }}
          </div>
        </template>
      </el-image>

      <el-image style="width: 150px; height: 100px"
                src=""
                fit="cover"
                v-if="!isImgByName(galleryListRef[galleryUUID].name)"
      >
        <template #error>
          <div class="image-slot">
            {{ galleryListRef[galleryUUID].name }}
          </div>
        </template>
      </el-image>
    </div>

    <div class="description">
      <el-input
          v-model="galleryListRef[galleryUUID].description"
          style="width: 550px"
          :rows="5"
          type="textarea"
          placeholder="description..."
      />
    </div>
  </div>

  <div class="btn">
    <el-button type="success" @click="handlePublish">发布</el-button>
  </div>

  <div class="attach-list">
    <div class="attach-item" v-for="attachItem in attachRef.data.attachList" v-if="isLoaded">
      <div class="item" @click="handleTriggerAttach(attachItem)">
        <el-image style="width: 150px; height: 100px"
                  :src="attachApi.getAttachUrl(attachItem.uuid, 2)"
                  fit="cover"
                  v-if="isImgByName(attachItem.name)"
        >
          <template #error>
            <div class="image-slot">
              {{ attachItem.name }}
            </div>
          </template>
        </el-image>

        <el-image style="width: 150px; height: 100px"
                  src=""
                  fit="cover"
                  v-if="!isImgByName(attachItem.name)"
        >
          <template #error>
            <div class="image-slot">
              {{ attachItem.name }}
            </div>
          </template>
        </el-image>

        <div class="overlay" v-if="galleryListRef.hasOwnProperty(attachItem.uuid)"></div>
      </div>
    </div>
    <div class="upload">
      <Upload @success="handleUploadSuccess" @error="handleUploadError"/>
    </div>
  </div>
</div>
</template>

<style scoped>
.update-gallery-container {
  margin: 0 auto;
  width: 800px;
}
.btn{
  margin-top: 10px;
  text-align: end;
}
.pic-list{
  display: flex;
  background-color: #FFFFFF;
  margin-top: 20px;
  .pic{
    height: 100px;
    width: 200px;
    margin: 10px;

    text-align: center;
    vertical-align: middle;
    line-height: 110px;
    color: #878787;
  }
  .description{
    margin: 10px;
  }
}
.attach-list{
  margin-top: 20px;
  .upload{
    margin-top: 20px;
  }
  .attach-item{
    display: inline-block;
    margin-left: 10px;
    .item{
      cursor: pointer;
      position: relative;
      display: inline-block;
      .overlay{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(192, 236, 199, 0.7);
      }
      .file{
        width: 150px;
        height: 100px;
        border: 1px solid #000000;
      }
    }
  }
}
</style>