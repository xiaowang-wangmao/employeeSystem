<template>
  <TopBar />
  <a-layout style="min-height: 100vh">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      style="background-color: #fff"
    >
      <a-menu v-model:selectedKeys="selectedKeys" theme="light" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <router-link :to="'/BasicInformation'"> 基础信息</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <router-link :to="'/EmergencyContact'">紧急联系人</router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <file-outlined />
          <router-link :to="'/EducationBackground'">教育背景</router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <file-outlined />
          <router-link :to="'/Professional'"> 职业资格证书</router-link>
        </a-menu-item>
        <a-menu-item key="5">
          <file-outlined />
          <router-link :to="'/BankAccount'">银行账户</router-link>
        </a-menu-item>
        <a-menu-item key="6">
          <file-outlined />
          <router-link :to="'/Payslip'">工资条</router-link>
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
<style lang="less" scoped>
:deep(.ant-layout-sider-trigger) {
  background-color: #fff;
  color: #4a4747;
}
.ant-layout {
  .ant-layout-sider-trigger {
    background-color: #fff !important;
  }
}
</style>
