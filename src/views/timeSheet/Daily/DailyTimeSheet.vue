<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      style="background-color: #fff"
    >
      <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <router-link :to="'/FillDailyTimeSheet'"> Fill </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <router-link :to="'/ApprovalDailyTimeSheet'"> Approval </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <file-outlined />
          <router-link :to="'/MyList'"> My Record </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 5px 16px">
        <div
          :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
        >
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import {
  PieChartOutlined,
  DesktopOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import { ref } from 'vue';
const collapsed = ref<boolean>(false);
const selectedKeys = ref<string[]>(['1']);
</script>
<style scoped>
/* #components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #000;
} */

:deep(.ant-layout-sider-trigger) {
  background-color: #fff;
  color: #4a4747;
}
.ant-layout .ant-layout-sider-trigger {
  background-color: #fff !important;
}
</style>
