<script setup>
import Aside from './view/Aside/index.vue'
</script>

<template>
<div class="app-container">
  <div class="aside">
    <Aside />
  </div>
  <div class="content">
    <RouterView />
  </div>
</div>
</template>

<style scoped>
.app-container{
  height: 100vh;
  display: flex;
}
.aside{
  flex: 0 0 auto;

  box-sizing: border-box;
  width: 260px;
}
.content{
  flex: 1 1 auto;
  min-width: 800px;
  background: #f4f4f6;
}

</style>
