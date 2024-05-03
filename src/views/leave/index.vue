<template>
  <div>
    <a-descriptions title="Leave Info" bordered>
      <a-descriptions-item label="全年可享用休假" :span="2"
        >{{ holidays.totalHolidays }}天</a-descriptions-item
      >
      <a-descriptions-item label="已批准休假" 
        >{{ holidays.approvedHolidays }}天</a-descriptions-item
      >
      <a-descriptions-item label="已申请休假" :span="2"
        >{{ holidays.appliedHolidays }}天</a-descriptions-item
      >
      <a-descriptions-item label="剩余调休"
        >{{ holidays.transferLeave }}天</a-descriptions-item
      >
      <a-descriptions-item label="剩余年假" :span="1"
        >{{ holidays.annualLeave }}天</a-descriptions-item
      >
      <a-descriptions-item label="休事假"
        >{{ holidays.personalLeave }}天</a-descriptions-item
      >
      <a-descriptions-item label="休病假"
        >{{ holidays.sickLeave }}天</a-descriptions-item
      >
      <a-descriptions-item label="休婚假"
        >{{ holidays.marriageLeave }}天</a-descriptions-item
      >
      <a-descriptions-item label="休产假"
        >{{ holidays.maternityLeave }}天</a-descriptions-item
      >
      <a-descriptions-item label="休丧假"
        >{{ holidays.bereavementLeave }}天</a-descriptions-item
      >

    </a-descriptions>

    <div style="margin-top: 20px">
      <a-space>
        <a-button type="primary" @click="toHistory">休假历史</a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getHolidays } from '@/api/application';
import { pickBasicData } from '@/utils/translate';
const router = useRouter();
const holidays = ref({});

onMounted(() => {
  getHolidays({ staffCode: localStorage.getItem('staffCode') }).then((res) => {
    holidays.value = res;
    console.log(res);
  });
});

function toHistory() {
  router.push({
    path: '/leave/application',
  });
}
</script>
