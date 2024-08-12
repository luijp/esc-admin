<script setup>
import Aside from './Aside/index.vue'
</script>

<template>
  <div class="admin-container">
    <div class="aside">
      <Aside/>
    </div>
    <div class="content">
      <RouterView/>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  display: flex;
}

.aside {
  flex: 0 0 auto;

  box-sizing: border-box;
  width: 260px;
}

.content {
  flex: 1 1 auto;
  min-width: 800px;
  background: #f4f4f6;
  padding: 50px 50px;
}

</style>
