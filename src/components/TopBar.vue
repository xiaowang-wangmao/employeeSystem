<template>
  <div class="topBar">
    <div class="left">
      <span @click="router.push({path:'/index'})">Deloitte</span>
    </div>
    <div class="right">
      <div>wangmao</div>
      <div>消息</div>
      <div>帮助</div>
      <div>退出</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
// import { login, loginReq } from '../../api/user';
import { tokenStore, accountStore, loginStore } from '../../store/modules/user';
const router = useRouter();
</script>
<style lang="less" scoped>
.topBar {
  background-color: #000000;
  color: white;
  display: flex;
  justify-content: space-between;
  // position: fixed;
  top: 0;
  left: 0;
  // width: 100%;
  padding: 10px;
  // height: 30px;
  .left {
    width: 10%;
    cursor: pointer;
    // background-color: aqua;
  }
  .right {
    width: 25%;
    display: flex;
    justify-content: space-around;
    
    // background-color: aqua;
  }
}
</style>
