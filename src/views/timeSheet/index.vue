<template>
  <div>
    <!-- <TopBar /> -->
    <div>
      <a-layout style="min-height: 100vh">
        <a-layout-sider
          v-model:collapsed="collapsed"
          collapsible
          style="background-color: #fff"
        >
          <a-menu
            v-model:selectedKeys="selectedKeys"
            theme="light"
            mode="inline"
            v-model:openKeys="openKeys"
          >
            <a-menu-item key="1">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillDailyTimeSheet'"
                >Daily TimeSheet Fill
              </router-link>
            </a-menu-item>

            <a-menu-item key="2">
              <desktop-outlined />
              <router-link :to="'/timeSheet/Approval'"> Approval </router-link>
            </a-menu-item>
            <a-menu-item key="3">
              <file-outlined />
              <router-link :to="'/timeSheet/MyList'"> My Record </router-link>
            </a-menu-item>
            <a-menu-item key="4">
              <pie-chart-outlined />
              <router-link :to="'/timeSheet/FillOT'"
                >OverTime Claim</router-link
              >
            </a-menu-item>
            <a-menu-item key="7">
              <file-outlined />
              <router-link :to="'/timeSheet/AllTimeSheetList'">
                All TimeSheet
              </router-link>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
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
  </div>
</template>

<script lang="ts" setup>
import DailyTimeSheet from './Daily/DailyTimeSheet.vue';
import Overtime from './Overtime/Overtime.vue';

import {
  PieChartOutlined,
  DesktopOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
const openKeys = ref<string[]>(['daily', 'overtime']);
</script>

<style lang="less">
:deep(.ant-layout-sider-trigger) {
  background-color: #fff;
  color: #4a4747;
}
.ant-layout .ant-layout-sider-trigger {
  background-color: #fff !important;
}
</style>
