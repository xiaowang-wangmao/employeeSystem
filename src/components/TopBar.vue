<template>
  <div class="topBar">
    <div class="left">
      <span @click="router.push({ path: '/index' })">Deloitte</span>
    </div>
    <div class="right">
      <div>wangmao</div>
      <a-dropdown :trigger="['click']">
        <DownOutlined style="margin-top:4px;margin-left:2px;" />
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <a href="javascript:;">修改密码</a>
            </a-menu-item>
            <a-menu-item>
              <div @click="logout">退出登录</div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { DownOutlined, UserOutlined } from '@ant-design/icons-vue';
import {
  tokenStore,
  accountStore,
} from '@/store/modules/userStore';
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  accountStore().setStaffCode("");
  router.push("/");
}


</script>
<style lang="less" scoped>
.topBar {
  background-color: #000000;
  color: white;
  display: flex;
  justify-content: space-between;
  position: sticky;
  z-index: 999;
  top: 0;
  left: 0;
  padding: 10px;
  margin: 0 auto;
  height: 20px;
  // width: 100%;
  // overflow: hidden;
  .left {
    width: 10%;
    cursor: pointer;
    // background-color: aqua;
  }
  .right {
    width: 10%;
    display: flex;
    // background-color: aqua;

  }
}
</style>
