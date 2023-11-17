<template>
  <div>
    <!-- <testB v-model:status="status" :query="question" :ttt.sync="ttt" :a="a" b="ccc"></testB> -->
    <el-button @click="handleChange">点击</el-button>
    <div class="dic" :class="[!show ? 'slide-in' : 'slide-out']"></div>
  </div>
</template>
<script>
// import testB from '@/components/testB.vue'
export default {
  name: 'testA',
  // components: {
  //   testB
  // },
  computed: {},
  data() {
    return {
      squaredNumber: 15,
      status: true,
      question: 'it is ~',
      ttt: 'aaa',
      a: 'ddd',
      show: false
    }
  },
  methods: {
    handleChange() {
      this.show = !this.show
      console.log(this.show)
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.dic {
  width: 500px;
  height: 500px;
  background: darkblue;
  position: absolute;
  right: -500px;
}


.slide-out {
  animation: slide 1s  reverse;
}
.slide-in {
  right: 0vw;
  animation: fadenum 1s;
}
@keyframes slide {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-500px);
    opacity: 1;
  }
}
@keyframes fadenum {
    0% {
      transform: translateX(500px);
      opacity: 1;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>

