<template>
    <div>
        <el-button @click="changeLeft">左</el-button>
    <el-button @click="changeRight">右</el-button>
    <!-- 左侧菜单页面 -->
<!-- <transition name="leftMenu"> -->
    <div class="left-content" v-show="isShowLeftMenu">    
        so
    </div>
<!-- </transition>      -->
<!-- 右侧菜单页面——商城 -->
<!-- <transition name="rightMenu"> -->
    <div class="h-wrap" v-show="isShowRightMenu">
        ljk
    </div>
<!-- </transition> -->
    </div>
</template>
<script setup lang="ts">
let isShowLeftMenu = true;
let isShowRightMenu = true;
const changeLeft = () => {
    isShowLeftMenu = !isShowLeftMenu
    console.log(isShowLeftMenu)
}

const changeRight = () => {
    isShowRightMenu = !isShowRightMenu
}
</script>

<style>
.leftMenu-enter {
  animation: leftMenu-dialog-fade-in 0.3s ease;
}
.leftMenu-leave {
  animation: leftMenu-dialog-fade-out 0.1s ease forwards;
}
.leftMenu-enter-active {
  animation: leftMenu-dialog-fade-in 0.3s ease;
}
.leftMenu-leave-active {
  animation: leftMenu-dialog-fade-out 0.1s ease forwards;
}

.rightMenu-enter {
  animation: rightMenu-dialog-fade-in 0.3s ease;
}
.rightMenu-leave {
  animation: rightMenu-dialog-fade-out 0.3s ease forwards;
}
.rightMenu-enter-active {
  animation: rightMenu-dialog-fade-in 0.3s ease;
}
.rightMenu-leave-active {
  animation: rightMenu-dialog-fade-out 0.3s ease forwards;
}

@keyframes leftMenu-dialog-fade-in {
  0% {
    transform: translate3d(-100%, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes leftMenu-dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(-100%, 0, 0);
    opacity: 1;
  }
}

@keyframes rightMenu-dialog-fade-in {
  0% {
    transform: translate3d(100%, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
@keyframes rightMenu-dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(100%, 0, 0);
    opacity: 1;
  }
}
</style>
