<template>
  <div>
    <TopBar />
    <div>
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1" tab="Daily TimeSheet">
          <DailyTimeSheet />
        </a-tab-pane>
        <a-tab-pane key="2" tab="Overtime" force-render>
          <Overtime />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DailyTimeSheet from './Daily/DailyTimeSheet.vue';
import Overtime from './Overtime/Overtime.vue';

const activeKey = ref('1');
</script>
