<template>
  <div>
    <a-layout style="min-height: 100vh">
      <a-layout-sider
        v-model:collapsed="collapsed"
        collapsible
        style="background-color: #fff"
      >
        <div class="logo">XXX公司logo</div>
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="light"
          mode="inline"
          v-model:openKeys="openKeys"
        >
          <a-sub-menu key="basic">
            <template #title>
              <span>
                <team-outlined />
                <span>个人信息管理</span>
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
                >Daily TimeSheet Fill
              </router-link>
            </a-menu-item>

            <a-menu-item key="2-2">
              <desktop-outlined />
              <router-link :to="'/timeSheet/Approval'"> Approval </router-link>
            </a-menu-item>
            <a-menu-item key="2-3">
              <file-outlined />
              <router-link :to="'/timeSheet/MyList'"> My Record </router-link>
            </a-menu-item>
            <a-menu-item key="2-4">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillOT'"
                >OverTime Claim</router-link
              >
            </a-menu-item>
            <a-menu-item key="2-5">
              <file-outlined />
              <router-link :to="'/timeSheet/AllTimeSheetList'">
                All TimeSheet
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
            <!-- <a-menu-item key="3-4">
              <pie-chart-outlined />
              <router-link :to="'/leave/index'">休假记录 </router-link>
            </a-menu-item> -->
          </a-sub-menu>
          <a-menu-item key="4-1">
            <pie-chart-outlined />
            <router-link :to="'/systemNotice'">通知公告 </router-link>
          </a-menu-item>
          <a-menu-item key="5-1">
            <pie-chart-outlined />
            <router-link :to="'/timeSheet/FillDailyTimeSheet'"
              >培训文件
            </router-link>
          </a-menu-item>
          <a-sub-menu key="system">
            <template #title>
              <span>
                <team-outlined />
                <span>后台管理</span>
              </span>
            </template>
            <a-menu-item key="6-1">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillDailyTimeSheet'"
                >账号管理
              </router-link>
            </a-menu-item>
            <a-menu-item key="6-2">
              <pie-chart-outlined />
              <router-link :to="'/systemStaff'">员工管理 </router-link>
            </a-menu-item>
            <a-menu-item key="6-3">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillDailyTimeSheet'"
                >客户项目管理
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { getSystemNoticeList } from '@/api/notice';
import Time from '@/components/Time/index.vue';
import { DownOutlined, UserOutlined } from '@ant-design/icons-vue';
import { accountStore } from '@/store/modules/userStore';

const router = useRouter();

const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['4-1']);
const openKeys = ref<string[]>(['timesheet', 'overtime']);
const list = ref();
const menuList = ref([
  { title: 'Daily-TimeSheet', link: () => router.push({ path: '/timeSheet' }) },
  {
    title: 'Employee-SelfService',
    link: () => router.push({ path: '/employeeMsg' }),
  },
  { title: 'Leave-Manangenment', link: () => router.push({ name: 'leave' }) },
  { title: 'Onboaring', link: () => router.push({ name: 'onboard' }) },
  // { title: 'person-mag', link: () => router.push({ name: 'onboard' }) },
]);
const activeKey = ref('1');

const userName = localStorage.getItem('userName');
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('staffCode');
  localStorage.removeItem('userName');
  accountStore().setStaffCode('');
  router.push('/');
}

const noticeColumns = [
  {
    title: '单号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '主题',
    dataIndex: 'activity',
    key: 'activity',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '发布日期',
    dataIndex: 'date',
    key: 'date',
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '发布部门',
    dataIndex: 'deptName',
    key: 'deptName',
  },
];

const searchKey = ref<string>('');

onMounted(() => {
  // getSystemNoticeList({ current: 1, size: 5 }).then((res) => {
  //   console.log('notice-list',res);
  // })
});
</script>
<style lang="less" scoped>
:deep(.ant-layout-sider-trigger) {
  background-color: #fff;
  color: #4a4747;
}
.ant-layout .ant-layout-sider-trigger {
  background-color: #fff !important;
}
.logo {
  text-align: center;
  height: 32px;
  margin: 16px;
  border-radius: 20px;
  padding-top: 7px;
  background: rgba(143, 65, 65, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
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
  .menu {
    height: 20%;
    display: flex;
    justify-content: space-around;
    // margin-bottom: 30px;
    .menu-item {
      // height: 100px;
      // width: 100px;
      // background-color: saddlebrown;
      border: #808080 1px solid;
      border-radius: 20px;
      margin: 5px;
      padding: 10px;
      cursor: pointer;
    }
  }
  .right {
    width: 55vw;
    // padding: 1% 1%;
    // border: #808080 1px solid;
    background-color: white;
  }
}
</style>
