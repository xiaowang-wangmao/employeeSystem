<template>
  <div>
    <a-layout style="min-height: 100vh">
      <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        style="background-color: #b5e3ac"
      >
        <div class="logo">XXX公司logo</div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="light"
          mode="inline"
          v-model:openKeys="openKeys"
        >
          <a-menu-item key="4-1">
            <pie-chart-outlined />
            <router-link :to="'/systemNotice'">通知公告 </router-link>
          </a-menu-item>
          <a-sub-menu key="basic">
            <template #title>
              <span>
                <team-outlined />
                <span>信息管理</span>
              </span>
            </template>
            
            <a-menu-item key="1">
              <pie-chart-outlined />
              <router-link :to="'/employeeMsg/BasicInformation'">
                基础信息</router-link
              >
            </a-menu-item>
            <a-menu-item key="2">
              <desktop-outlined />
              <router-link :to="'/employeeMsg/EmergencyContact'"
                >紧急联系人</router-link
              >
            </a-menu-item>
            <a-menu-item key="3">
              <file-outlined />
              <router-link :to="'/employeeMsg/EducationBackground'"
                >教育背景</router-link
              >
            </a-menu-item>
            <a-menu-item key="4">
              <file-outlined />
              <router-link :to="'/employeeMsg/BankAccount'"
                >银行账户</router-link
              >
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="timesheet">
            <template #title>
              <span>
                <team-outlined />
                <span>工时申报管理</span>
              </span>
            </template>
            <a-menu-item key="2-1">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillDailyTimeSheet'"
                >日常工时申报
              </router-link>
            </a-menu-item>
            <a-menu-item key="2-4">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillOT'">加班工时申报</router-link>
            </a-menu-item>

            <a-menu-item key="2-2">
              <desktop-outlined />
              <router-link :to="'/timeSheet/Approval'"> 审核清单 </router-link>
            </a-menu-item>
            <a-menu-item key="2-3">
              <file-outlined />
              <router-link :to="'/timeSheet/MyList'">申报记录</router-link>
            </a-menu-item>

            <a-menu-item key="2-5" v-if="rank === '0'">
              <file-outlined />
              <router-link :to="'/timeSheet/AllTimeSheetList'">
               总表管理
              </router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="leave">
            <template #title>
              <span>
                <team-outlined />
                <span>休假管理</span>
              </span>
            </template>
            <a-menu-item key="3-1">
              <pie-chart-outlined />
              <router-link :to="'/leave/index'">汇总表格 </router-link>
            </a-menu-item>
            <a-menu-item key="3-2">
              <pie-chart-outlined />
              <router-link :to="'/leave/application'">休假申请 </router-link>
            </a-menu-item>
            <a-menu-item key="3-3">
              <pie-chart-outlined />
              <router-link :to="'/leave/approval'">休假审批 </router-link>
            </a-menu-item>
          </a-sub-menu>

          
           <a-sub-menu key="train">
            <template #title>
              <span>
                <team-outlined />
                <span>培训管理</span>
              </span>
            </template>
            <a-menu-item key="5-1">
            <pie-chart-outlined />
            <router-link :to="'/train/plan'">培训计划 </router-link>
          </a-menu-item>
            <a-menu-item key="5-2">
            <pie-chart-outlined />
            <router-link :to="'/train/systemFile'">指导手册 </router-link>
          </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="system" v-if="rank === '0'">
            <template #title>
              <span>
                <team-outlined />
                <span>后台管理</span>
              </span>
            </template>
            <a-menu-item key="6-2">
              <pie-chart-outlined />
              <router-link :to="'/system/systemStaff/list'"
                >员工账号管理
              </router-link>
            </a-menu-item>
            <!-- <a-menu-item key="6-3">
              <pie-chart-outlined />
              <router-link :to="'/employeeMsg/archives'">
                员工档案</router-link
              >
            </a-menu-item> -->
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #738958; padding: 0">
          <div id="header">
            <div id="left">
              <span>内部员工事务自助工作平台</span>
            </div>

            <div id="right">
              <a-avatar>
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              {{ userName }}
              <a-dropdown :trigger="['click']">
                <DownOutlined />
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <div @click="update">修改密码</div>
                    </a-menu-item>
                    <a-menu-item>
                      <div @click="logout">退出登录</div>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content style="margin: 5px 16px">
          <div
            :style="{
              padding: '24px',
              background: '#fff',
              minHeight: '85vh',
            }"
          >
            <router-view></router-view>
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-layout>

    <a-modal v-model:visible="visibleFlag" title="个人账号" @ok="handleOk">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
        autocomplete="off"
        ref="form"
      >
        <a-form-item
          label="员工号"
          name="staffCode"
          :rules="[{ required: true, message: 'Please input your staffCode!' }]"
        >
          <a-input v-model:value="formState.staffCode" />
        </a-form-item>

        <a-form-item
          label="新密码"
          name="newPassword"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.newPassword" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { DownOutlined, UserOutlined } from '@ant-design/icons-vue';
import { accountStore } from '@/store/modules/userStore';
import { updatePassword } from '@/api/user';
import { message } from 'ant-design-vue';

const router = useRouter();
const visibleFlag = ref(false);
const form = ref();
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['4-1']);
const openKeys = ref<string[]>(['leave']);
const list = ref();
const formState = reactive({
  staffCode: '',
  newPassword: '',
});
const userName = localStorage.getItem('userName');
const rank = ref(localStorage.getItem('rank'));
console.log(rank);

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('staffCode');
  localStorage.removeItem('userName');
  localStorage.removeItem('rank');
  accountStore().setStaffCode('');
  router.push('/');
}
function update() {
  visibleFlag.value = true;
}
const handleOk = () => {
  form.value.validate().then(() => {
    updatePassword({
      code: Number(formState.staffCode),
      password: formState.newPassword,
    }).then((res) => {
      message.success(res.msg);
      visibleFlag.value = false;
    });
  });
};

onMounted(() => {});
</script>
<style lang="less" scoped>
:deep(.ant-layout-sider-trigger) {
  background-color: #738958;
  color: #4a4747;
}
:deep(.ant-menu) {
  background-color: #b5e3ac;
}
.logo {
  text-align: center;
  height: 32px;
  margin: 16px;
  border-radius: 20px;
  padding-top: 7px;
  background: rgba(143, 65, 65, 0.3);
}

#header {
  display: flex;
  height: 70px;
  /*margin: 0;*/
  padding: 0;
}

#left {
  width: 80%;
  /*height: 25px;*/
  /*background-color: darksalmon;*/
  justify-content: flex-start;
  display: flex;
  align-items: center;
  margin-left: 16px;
}

#right {
  flex: 1;
  width: 20%;
  /*background-color: coral;*/
  /*height: 50px;*/
  justify-content: flex-end;
  display: flex;
  align-items: center;
  margin-right: 26px;
}

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
  // padding: 1% 2%;
  margin: 5px 0;
  // justify-content: ;
  // background-color: #533232;
  // justify-content: space-between;
  .left {
    width: 40vw;
    padding: 1% 1%;
    // border: #808080 1px solid;
    // margin-right: 2px;
    height: 85vh;
    background-color: white;

    .top-actions {
      position: relative;
      top: 40px;
      left: 120px;
      display: flex;
      justify-content: space-between;
      width: 35vw;
      z-index: 99;
      .refresh {
        // border: 1px solid black;
        cursor: pointer;
      }
      .search {
        position: absolute;
        top: 32px;
        right: 0;
      }
    }
  }
}
</style>
