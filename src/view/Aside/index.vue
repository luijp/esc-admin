<script setup>

import {
  CircleCloseFilled,
  Comment,
  HomeFilled,
  List,
  Management, Opportunity,
  PictureFilled, Platform,
  Promotion,
  Tools
} from "@element-plus/icons-vue";
import * as authApi from '../../api/auth.js'
import {ElMessage} from "element-plus";

const handleLogout = async () => {
  await authApi.logout()
  document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  ElMessage({
    message: "已登出",
    type: "success",
  })
}
</script>

<template>
  <div class="aside-container">
    <div class="logo">
      ESC Admin
    </div>
    <div class="nav">
      <RouterLink to="/dashboard">
        <div class="menuItem">
          <el-icon size="28">
            <HomeFilled/>
          </el-icon>
          <span>总览</span>
        </div>
      </RouterLink>

      <RouterLink to="/post">
        <div class="menuItem">
          <el-icon size="28">
            <List/>
          </el-icon>
          <span>文章管理</span>
        </div>
      </RouterLink>

      <RouterLink to="/page">
        <div class="menuItem">
          <el-icon size="28">
            <Opportunity/>
          </el-icon>
          <span>页面管理</span>
        </div>
      </RouterLink>

      <RouterLink to="/gallery">
        <div class="menuItem">
          <el-icon size="28">
            <PictureFilled/>
          </el-icon>
          <span>相册管理</span>
        </div>
      </RouterLink>

      <RouterLink to="/micro">
        <div class="menuItem">
          <el-icon size="28">
            <Promotion/>
          </el-icon>
          <span>碎语管理</span>
        </div>
      </RouterLink>

      <RouterLink to="/category">
        <div class="menuItem">
          <el-icon size="28">
            <Menu/>
          </el-icon>
          <span>分类管理</span>
        </div>
      </RouterLink>

      <RouterLink to="/tag">
        <div class="menuItem">
          <el-icon size="28">
            <Management/>
          </el-icon>
          <span>标签管理</span>
        </div>
      </RouterLink>
      <RouterLink to="/comment">
        <div class="menuItem">
          <el-icon size="28">
            <Comment/>
          </el-icon>
          <span>评论管理</span>
        </div>
      </RouterLink>
      <RouterLink to="/attach">
        <div class="menuItem">
          <el-icon size="28">
            <PictureFilled/>
          </el-icon>
          <span>附件管理</span>
        </div>
      </RouterLink>
    </div>

    <div class="action">

      <RouterLink to="/backup">
        <div class="actionItem">

          <el-icon size="28">
            <Platform/>
          </el-icon>
          <span>备份</span>
        </div>
      </RouterLink>

      <RouterLink to="/setting">
        <div class="actionItem">

          <el-icon size="28">
            <Tools/>
          </el-icon>
          <span>设置</span>
        </div>
      </RouterLink>


      <div class="actionItem" @click="handleLogout">
        <el-icon size="28">
          <CircleCloseFilled/>
        </el-icon>
        <span>登出</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.aside-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.logo {
  font-weight: bolder;
  margin-top: 50px;
  margin-left: 50px;
  font-size: 1.5em;
  margin-bottom: 50px;
  align-self: flex-start;
}

.nav {
  flex: 1 1 auto;
}

.action {
  margin-bottom: 50px;
}

.router-link-active > div {
  color: #2f2f30;
  background: #f3f3fb;
}

.menuItem {
  display: flex;
  align-items: center;
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 5px;
  padding: 10px 20px;
  border-radius: 10px;
  color: #b4b4c7;
  cursor: pointer;

  &:hover {
    color: #2f2f30;
    background: #f3f3fb;
  }

  span {
    margin-left: 10px;
  }
}

.actionItem {
  display: flex;
  cursor: pointer;
  color: #b4b4c7;
  margin-left: 50px;
  margin-right: 40px;
  margin-bottom: 5px;
  padding: 10px 20px;

  &:hover {
    color: #2f2f30;
  }

  span {
    margin-left: 10px;
  }
}

</style>