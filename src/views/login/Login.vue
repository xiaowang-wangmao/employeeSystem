<template>
  <div class="login">
    <Particles id="tsparticles" class="login__particles" :options="options" />
    <div class="loginPart">
      <div class="title">
        <div class="loginText">登录</div>
      </div>
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="form"
      >
        <a-form-item
          label="code"
          name="code"
          :rules="[{ required: true, message: 'Please input your staffCode!' }]"
        >
          <a-input v-model:value="formState.code" />
        </a-form-item>
        <a-form-item
          label="account"
          name="account"
          :rules="[{ required: true, message: 'Please input your account!' }]"
        >
          <a-input v-model:value="formState.account" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember"
            >Remember me</a-checkbox
          >
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="footer">© 2023 LJJie. All rights reserved.</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../api/user';
import {
  tokenStore,
  accountStore,
} from '../../store/modules/userStore';
const router = useRouter();

interface FormState {
  code: string;
  account: string;
  password: string;
  remember: boolean;
}
const formState = reactive<FormState>({
  code: '',
  account: '',
  password: '',
  remember: true,
});
const onFinish = (values: any) => {
  console.log('Success:', values);
  login(values).then((res) => {
    console.log('11111', res);

    if (res.code == 0) {
      accountStore().setAccount(res.data.user.account);
      accountStore().setStaffCode(res.data.user.code + '');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('staffCode', res.data.user.code);
      router.push({
        name: 'index',
      });
    }
  });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};



const options = reactive({
  fpsLimit: 60,
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onClick: {
        // 开启鼠标点击的效果
        enable: true,
        mode: 'push',
      },
      onHover: {
        // 开启鼠标悬浮的效果(线条跟着鼠标移动)
        enable: true,
        mode: 'grab',
      },
      resize: true,
    },
    modes: {
      // 配置动画效果
      bubble: {
        distance: 400,
        duration: 2,
        opacity: 0.8,
        size: 40,
      },
      push: {
        quantity: 4,
      },
      grab: {
        distance: 200,
        duration: 0.4,
      },
      attract: {
        // 鼠标悬浮时，集中于一点，鼠标移开时释放产生涟漪效果
        distance: 200,
        duration: 0.4,
        factor: 5,
      },
    },
  },
  particles: {
    color: {
      value: '#BA55D3', // 粒子点的颜色
    },
    links: {
      color: '#FFBBFF', // 线条颜色
      distance: 150, //线条距离
      enable: true,
      opacity: 0.4, // 不透明度
      width: 1.2, // 线条宽度
    },
    collisions: {
      enable: true,
    },
    move: {
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
      bounce: false,
      direction: 'none',
      enable: true,
      out_mode: 'out',
      random: false,
      speed: 0.5, // 移动速度
      straight: false,
    },
    number: {
      density: {
        enable: true,
        value_area: 800,
      },
      value: 80, //粒子数
    },
    opacity: {
      //粒子透明度
      value: 0.7,
    },
    shape: {
      //粒子样式
      type: 'star',
    },
    size: {
      //粒子大小
      random: true,
      value: 3,
    },
  },
  detectRetina: true,
});
</script>
<style lang="less" scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background-color: #fff0f5;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.login {
  height: 100%;
  width: 100%;
  /* overflow: hidden; */
}

.login__particles {
  height: 100%;
  width: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('@/assets/back.jpg');
  opacity: 0.9;
  position: fixed;
  pointer-events: none;
}

.loginPart {
  position: absolute;
  /*定位方式绝对定位absolute*/
  top: 50%;
  left: 50%;
  /*顶和高同时设置50%实现的是同时水平垂直居中效果*/
  transform: translate(-50%, -50%);
  /*实现块元素百分比下居中*/
  width: 450px;
  padding: 50px;
  background: rgba(255, 204, 255, 0.5);
  /*背景颜色为黑色，透明度为0.8*/
  box-sizing: border-box;
  /*box-sizing设置盒子模型的解析模式为怪异盒模型，
    将border和padding划归到width范围内*/
  box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.5);
  /*边框阴影  水平阴影0 垂直阴影15px 模糊25px 颜色黑色透明度0.5*/
  border-radius: 15px;
  /*边框圆角，四个角均为15px*/

}

.loginText {
  // color: rgba(255, 204, 255, 1);
  font-size: 2.25rem;
  line-height: 2.5rem;
}
.describe {
  color: rgba(107, 114, 128, 1);
}
.title {
  width: 234px;
  height: 78px;
}
.input {
  width: 284px;
  height: 40px;
  border-color: transparent;
  border-radius: 0.5rem;
  padding-left: 0.5rem;
  padding: 0.25rem;
  color: rgba(255, 204, 255, 1);
  font-size: 16px;
  margin: 12px 0;
}
.input:focus {
  outline: 0;
  border-color: rgba(255, 204, 255, 1);
}
input[type='checkbox'] {
  cursor: pointer;
  position: relative;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  font-size: 14px;
}

input[type='checkbox']::after {
  position: absolute;
  top: 0;
  background-color: white;
  color: #000;
  width: 15px;
  height: 15px;
  display: inline-block;
  visibility: visible;
  padding-left: 0px;
  text-align: center;
  content: ' ';
  border-radius: 3px;
  box-sizing: border-box;
  border: 1pxsolidblack;
}
input[type='checkbox']:checked::after {
  content: '';
  font-size: 2px;
  border-radius: 3px;
  font-weight: bold;
  background-color: rgba(255, 204, 255, 1);
}

.button {
  font-family: 'qiantu';
}
</style>
