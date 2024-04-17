<template>
  <div>
    <TopBar />

    <div class="main">
      <div class="left">
        <div>logo-----工作任务</div>
        <div class="top-actions">
          <div class="refresh">
            刷新
            <redo-outlined />
            <icon-font type="icon-refresh" />
          </div>
          <div class="search">
            <a-input-search
              v-model:value="searchKey"
              placeholder="申请人/类型"
              allow-clear
              style="width: 200px"
              @search="onSearch"
            />
          </div>
        </div>

        <div>
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1" tab="待办">
              <ListCard
                :columns="columns"
                :needParamsCache="true"
                :fixHeader="false"
                :fixFooter="false"
                ref="list"
              />
            </a-tab-pane>
            <a-tab-pane key="2" tab="已办" force-render>
              <ListCard
                :columns="columns"
                :needParamsCache="true"
                :fixHeader="false"
                :fixFooter="false"
                ref="list"
              />
              ></a-tab-pane
            >
          </a-tabs>
        </div>
      </div>
      <div class="right">
        <div class="menu">
          <div
            v-for="(item, index) in menuList"
            :key="index"
            @click="item.link"
            class="menu-item"
          >
            <div>logo</div>
            {{ item.title }}
          </div>
        </div>
        <div class="notification">
          <ListCard
            title="系统公告"
            :columns="noticeColumns"
            :api="{list:getSystemNoticeList}"
            :needParamsCache="true"
            :fixHeader="false"
            :fixFooter="false"
            ref="list"
          />
        </div>
      </div>
    </div>

    <div class="footer">View cookies|声明|联系我们 版权所有© 2017-2027.</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// import { createFromIconfontCN } from '@ant-design/icons-vue';
import { RedoOutlined } from '@ant-design/icons-vue';
import { getSystemNoticeList } from '@/api/notice';
import Time from '@/components/Time/index.vue';

// const IconFont = createFromIconfontCN({
//   scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
// });
const router = useRouter();

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
const columns = [
  {
    title: '单号',
  },
  {
    title: '主题',
  },
  {
    title: '类型',
  },
  {
    title: '申请日期',
  },
  {
    title: '申请人',
  },
];

const noticeColumns = [
  {
    title: '单号',
    dataIndex: 'id',
    key:'id',
  },
  {
    title: '主题',
    dataIndex: 'activity',
    key:'activity',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key:'content',
  },
  {
    title: '发布日期',
    dataIndex: 'date',
    key:'date',
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
    key:'deptName',
  },
];

const searchKey = ref<string>('');

const onSearch = (searchValue: string) => {
  console.log('use value', searchValue);
  console.log('or use this.value', searchKey.value);
};

onMounted(() => {
  // getSystemNoticeList({ current: 1, size: 5 }).then((res) => {
  //   console.log('notice-list',res);
    
  // })
})
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
  // padding: 1% 2%;
  margin: 5px 0;
  // justify-content: ;
  // background-color: #eeeeee;
  justify-content: space-between;
  .left {
    width: 48%;
    padding: 1% 1%;
    border: #808080 1px solid;
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
  .right {
    width: 48%;
    // padding: 1% 1%;
    border: #808080 1px solid;
    background-color: white;
    .menu {
      height: 20%;
      display: flex;
      justify-content: space-around;
      // margin-bottom: 30px;
      .menu-item {
        // height: 100px;
        // width: 100px;
        background-color: saddlebrown;
        margin: 5px;
        padding: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
