<template>
  <div>
    <div style="cursor: pointer" @click="back()">返回</div>
    <div><h2>请完成视频学习</h2></div>
    <div class="video">
      <video-player
        :src="videoSrc"
        :options="playerOptions"
        responsive
        :volume="0.5"
        @ended="endPlay"
      />
    </div>
    <div class="start" v-if="examination" @click="startExam">点击开始考试</div>
    <a-modal
      title="培训考核"
      :visible="examFlag"
      width="700px"
      @cancel="examFlag = false"
    >
      <div style="max-height: 400px; overflow: auto">
        <a-form layout="vertical" ref="formRef" :model="answerList">
          <a-form-item
            :label="item.problem"
            v-for="(item, index) in problemList"
            style="margin-bottom: 10px"
            :name="`answer${item.id}`"
            :rules="[{ required: true, message: '请完成该选项' }]"
          >
            <a-radio-group v-model:value="answerList[`answer${item.id}`]">
              <a-radio value="A">A {{ item.a }}</a-radio>
              <a-radio value="B">B {{ item.b }}</a-radio>
              <a-radio value="C">C {{ item.c }}</a-radio>
              <a-radio value="D">D {{ item.d }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <a-button key="back" @click="examFlag = false">取消</a-button>
        <a-button key="submit" type="primary" @click="problemSubmmit"
          >提交</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import 'vue3-video-play/dist/style.css';
import {
  taskStatus,
  planDetails,
  taskDetails,
  getProblemList,
  endTask,
} from '@/api/train';

import { getImage } from '@/api/application';
import { message } from 'ant-design-vue';
const examination = computed(() => task.value.videoLook);
const route = useRoute();
const router = useRouter();
const staffOptions = ref([]);
const DisableFlag = ref(false);
const examFlag = ref(false);
const formRef = ref();
const list = ref();
const userName = ref(localStorage.getItem('userName'));
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const rank = ref(localStorage.getItem('rank'));

const planId = ref();
const taskId = ref();
const plan = ref({
  id: '',
  name: '',
  chooseId: '',
  type: undefined,
  status: '',
  remark: '',
  files: [],
  videoId: undefined,
  checkUpProblem: false,
  endTime: '',
});
const task = ref({
  videoLook: undefined,
});

router.isReady().then(async () => {
  planId.value = route.query.planId;
  taskId.value = route.query.taskId;
});
// 视频链接地址
const videoSrc = ref('http://localhost:8088/files/');
// 视频播放器配置
let playerOptions = reactive({
  // height: 200,
  // width: 200, //播放器宽度
  playbackRates: [1.0, 1.5, 1.75, 2], // 播放速度
  autoplay: false, // 如果true,浏览器准备好时开始回放。
  muted: true, // 默认情况下将会消除任何音频。
  loop: false, // 导致视频一结束就重新开始。
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  language: 'zh-CN',
  aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
  controls: true,
  controlBar: {
    timeDivider: true,
    durationDisplay: true,
    remainingTimeDisplay: false,
    fullscreenToggle: true, // 全屏按钮
    progressControl: false, //是否显示进度条
    pictureInPictureToggle: false, //不显示画中画按钮
  },
});
onMounted(async () => {
  console.log('start', playerOptions);
});

watch(
  () => taskId.value,
  async () => {
    const re = await taskDetails({ id: taskId.value });
    task.value = re;
    console.log(task.value, 'task');
    playerOptions.controlBar.progressControl = task.value.videoLook;
    console.log('load', playerOptions);
    const res = await planDetails({ id: task.value.planId });
    plan.value = res;
    if (plan.value.videoId) {
      getImage({ fileId: plan.value.videoId }).then((res) => {
        console.log(res);
        videoSrc.value = 'http://localhost:8088/files/' + res.fileName;
      });
    }
  }
);

function back() {
  router.push({
    path: '/train/task',
  });
}

async function endPlay() {
  console.log(123);
  const res = await taskStatus({ taskId: taskId.value });
  task.value = res;
  playerOptions.controlBar.progressControl = true;
  console.log(playerOptions, 'end');
}
const problemList = ref([]);
const answerList = reactive({});
async function startExam() {
  examFlag.value = true;
  //获取题目列表
  const res = await getProblemList({ planId: task.value.planId });
  problemList.value = res.map((i) => {
    const answer = 'answer' + i.id;
    answerList[answer] = undefined;
    return {
      ...i,
    };
  });
  console.log(answerList, 'name');
}

function problemSubmmit() {
  formRef.value.validate().then(async (values) => {
    console.log(values);
    const objkey = Object.keys(values);
    let rightItem = 0;
    objkey.forEach((element, index) => {
      // console.log(answerList[element],'el');
      // console.log(index);

      if (answerList[element] === problemList.value[index].answer) {
        rightItem += 1;
      }
    });
    const score = (rightItem / objkey.length) * 100;
    if (score < 60) {
      message.error('分数低于60，请学习后重新考试');
      examFlag.value = false;
    } else {
      task.value.score = score;
      console.log(task.value);
      const res = await endTask(task.value);
      if (res === 'seuccess') {
        examFlag.value = false;
        message.success('提交成功');
      }
    }
  });
}
</script>

<style lang="less" scoped>
.video {
  background-color: red;
  width: 700px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  margin: 20px auto;
}
.start {
  width: 200px;
  height: 50px;
  background-color: rgb(46, 158, 158);
  text-align: center;
  line-height: 50px;
  border-radius: 40px;
  cursor: pointer;
}
</style>
