<template>
  <div>
    <TopBar />

    <div class="main">
      <div class="left">1</div>
      <div class="right">
        <div class="menu">
          <div class="menu-item" @click="router.push({name:'timeSheet'})">TimeSheet</div>
          <div class="menu-item">信息管理</div>
          <div class="menu-item">入职培训资料</div>
          <div class="menu-item">休假系统</div>
        </div>
        <div class="notification">222</div>
      </div>
    </div>

    <div class="footer">View cookies|声明|联系我们 版权所有© 2017-2027.</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import { login, loginReq } from '../../api/user';
const router = useRouter();

let imgUrl = ref(
  'http://localhost:5173/api/user/verifyCode?time=' + new Date()
);
const resetImg = () => {
  imgUrl.value = 'http://localhost:5173/api/user/verifyCode?time=' + new Date();
};
</script>
<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #808080;
  text-align: center;
  font-size: 12px;
  color: #e0e4d4;
}

.main {
  height: 100%;
  // width: 1000px;
  /* overflow: hidden; */
  display: flex;
  margin: 0 2%;
  // justify-content: ;
  background-color: #808080;
  justify-content: space-between;
  .left {
    width: 48%;
    background-color: aqua;
    margin-right: 3%;
    height: 90vh;
  }
  .right {
    width: 48%;
    background-color: aquamarine;
    .menu {
      height: 20%;
      background-color: dodgerblue;
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      .menu-item {
        height: 100px;
        width: 100px;
        background-color: saddlebrown;
        margin: 5px;
        padding: 10px;
      }
    }
    .notification {
      height: 70%;
      background-color: darkkhaki;
    }
  }
}
</style>
