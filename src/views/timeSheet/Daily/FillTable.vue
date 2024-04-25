<template>
  <div class="main">
    <div class="left">
      <VCalendar
        borderless
        :attributes="attributes"
        @dayclick="chooseDay"
        :disabled-dates="disabledDates"
      />
    </div>
    <div class="right">
      <a-form
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 9 }"
        :model="timeSheet"
        @finish="onFinish"
      >
        <a-form-item label="Work Location" name="workLocation">
          <a-select
            v-model:value="timeSheet.workLocation"
            :disabled="DisableFlag"
            :options="
              ['重庆', '上海', '大连', '广州'].map((item) => ({
                label: item,
                value: item,
              }))
            "
            allowClear
          />
        </a-form-item>
        <a-form-item label="Target Hours" name="targetHours">
          <a-input-number
            :value="timeSheet.targetHours"
            disabled
            allowClear
            :min="0"
            :max="8"
          />
          Hours
        </a-form-item>
        <a-form-item label="Total Actural Hours" name="acturalHours">
          <a-input-number
            v-model:value="timeSheet.acturalHours"
            :disabled="DisableFlag"
            :min="0"
            :max="8"
            allowClear
          />
          Hours
        </a-form-item>
        <a-form-item label="Project" name="project">
          <a-select
            v-model:value="timeSheet.projectId"
            :options="projectOptions"
            :disabled="DisableFlag"
            @change="change"
            showSearch
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="Client Name"
          name="clientName"
          v-if="Number(timeSheet.projectId) !== 2"
        >
          <a-input :value="selectedProject?.clientName" disabled allowClear />
        </a-form-item>
        <a-form-item label="Client Name" name="clientName" v-else>
          <a-input
            v-model:value="timeSheet.clientName"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="Approval"
          name="approval"
          v-if="Number(timeSheet.projectId) !== 2"
        >
          <a-select
            :value="selectedProject?.responsibleCode"
            :options="staffOptions"
            disabled
            allowClear
          />
        </a-form-item>
        <a-form-item label="Approval" name="approval" v-else>
          <a-select
            v-model:value="timeSheet.approvalCode"
            :options="staffOptions"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="Remark" name="remark">
          <a-textarea
            v-model:value="timeSheet.remark"
            :disabled="DisableFlag"
            :rows="2"
            :maxlength="100"
            allowClear
          />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 9, span: 9 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { formattedDate } from '@/utils/translate';
import { pickBasicData } from '@/utils/translate';
import {
  delareTimesheet,
  getTimeSheetList,
  getProjectList,
  getStaffList,
  getTimeSheetDetail,
} from '@/api/timesheet';
import { getDayList } from '@/api/common';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Modal, message } from 'ant-design-vue';
import { log } from 'console';

const timeSheet = reactive({
  id: '',
  staffCode: localStorage.getItem('staffCode'),
  workLocation: '',
  projectId: '',
  clientName: '',
  approvalCode: '',
  targetHours: '8',
  acturalHours: '',
  remark: '',
  date: Dayjs,
});
const DisableFlag = ref(true);
const formRef = ref();
const id = localStorage.getItem('staffCode');
const projectOptions = ref([]);
const staffOptions = ref([]);

const disabledDates = ref([]);
//当前点击选中的日期
const currentDate = ref();
const selectedDates = ref([]);
const attributes = computed(() => {
  return [
    {
      highlight: 'green',

      dates: selectedDates.value,
    },
    {
      highlight: {
        color: 'green',
        fillMode: 'outline',
      },
      dates: currentDate.value,
    },
  ];
});

function chooseDay(calendarDay: any) {
  const flag = disabledDates.value.some((i: Date) => {
    return i.getTime() == calendarDay.date.getTime();
  });

  if (flag) {
    console.log('节假日');
    message.info('非工作日不可提交工时！');
  } else {
    console.log('工作日');
    const todayFlag = selectedDates.value.some((i: Date) => {
      return dayjs(i).format('YYYY-MM-DD') == dayjs(calendarDay.date).format('YYYY-MM-DD');
    });
    console.log(todayFlag);
    if (todayFlag) {
      console.log('已经提交了要查看');
      getTimeSheetDetail({ staffCode: id, date: dayjs(calendarDay.date).format('YYYY-MM-DD') }).then((res) => {
        pickBasicData(timeSheet, res);
        selectedProject.value = res.project;
        
      })
    } else {
      DisableFlag.value = false;
      timeSheet.date = dayjs(calendarDay.date).format('YYYY-MM-DD');
      currentDate.value = calendarDay.date;
    }
  }
}
const onFinish = (values: any) => {
  delareTimesheet(timeSheet).then((res) => {
    console.log('res', res);
    DisableFlag.value = true;
    selectedDates.value = res.map((item: any) => {
      return new Date(item.date);
    });
    window.location.reload();
  });
};

const selectedProject = ref({
  id: undefined,
  name: '',
  clientName: '',
  responsibleCode: undefined,
});
function change() {
  console.log(timeSheet.projectId);
  console.log(projectOptions.value);
  selectedProject.value = findObjById(
    Number(timeSheet.projectId),
    projectOptions.value
  )[0];
}
function findObjById(id: number, arr: any[]) {
  const obj = arr.filter((item) => {
    return item.id === id;
  });
  return obj;
}
function fetchData() {
  getTimeSheetList({ staffCode: id }).then((res) => {
    selectedDates.value = res.map((item: any) => {
      return new Date(item.date);
    });
  });
}

const getDateList = () => {
  getDayList({}).then((res) => {
    disabledDates.value = res
      .filter((i) => i.type === 1 || i.type === 2)
      .map((item) => {
        return formattedDate(item.day + '');
      });
  });
};

function getProjectListData() {
  getProjectList({}).then((res) => {
    projectOptions.value = res.map((item: any) => {
      return {
        label: item.name,
        value: item.id,
        ...item,
      };
    });
  });
}
function getStaffListData() {
  getStaffList({}).then((res) => {
    staffOptions.value = res.map((item: any) => {
      return {
        label: item.userName,
        value: item.id,
      };
    });
  });
}
const currentYear = ref(2024);
const disabledDate = ref([]);
// 请求指定年份的节假日
// function getDate() {
//   axios
// .get(
// `https://api.apihubs.cn/holiday/get?field=date,weekend&year=${currentYear}&workday=2&order_by=1&cn=1&page=1&size=500`
// )
// .then((res) => {
// console.log(res);
// localStorage.setItem('disableList', res.data.list);
// disabledDate.value = res.data.list.map((item:any) => {
//   return formattedDate(item.date);
// });
// });
// }

onMounted(() => {
  // getDate();
  fetchData();
  getProjectListData();
  getStaffListData();
  getDateList();
});
</script>

<style lang="less">
.main {
  display: flex;
  .left {
    width: 30vw;
  }
  .right {
    width: 50vw;
  }
}
</style>
