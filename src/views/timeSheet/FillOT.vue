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
        <a-form-item label="Total Actural Hours" name="overtimeHours">
          <a-input-number
            v-model:value="timeSheet.overtimeHours"
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
          <a-input v-model:value="timeSheet.clientName" disabled allowClear />
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
            v-model:value="timeSheet.approvalCode"
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
          <a-space>
            <a-button v-if="editableFalg" @click="edit">Edit</a-button>
            <a-button type="primary" html-type="submit" v-if="!DisableFlag"
              >Submit</a-button
            >
          </a-space>
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
  editTimesheet,
} from '@/api/timesheet';
import { getDayList } from '@/api/common';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { Modal, message } from 'ant-design-vue';

const DisableFlag = ref(true);
const formRef = ref();
const id = localStorage.getItem('staffCode');
const projectOptions = ref([]);
const staffOptions = ref([]);

const disabledDates = ref([]);
//当前点击选中的日期
const currentDate = ref();
const editableFalg = ref(false);
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
const selectedProject = ref();
let timeSheet = reactive({
  id: '',
  staffCode: localStorage.getItem('staffCode'),
  staffName: localStorage.getItem('userName'),
  workLocation: '',
  projectId: undefined,
  projectName: '',
  clientName: '',
  approvalCode: '',
  approvalName: '',
  targetHours: '8',
  overtimeFlag: 1,
  overtimeHours: undefined,
  remark: '',
  date: Dayjs,
});

const tomorrowTime = dayjs().subtract(-1, 'day').format('YYYY-MM-DD'); //获取后一天时间
const yesterdayTime = dayjs().subtract(1, 'day').format('YYYY-MM-DD'); //获取前一天时间

function chooseDay(calendarDay: any) {
  editableFalg.value = false;
  DisableFlag.value = true;
  pickBasicData(timeSheet, {
    staffCode: localStorage.getItem('staffCode'),
    staffName: localStorage.getItem('userName'),
    targetHours: '8',
    overtimeFlag: 1,
  });
  selectedProject.value = {
    id: '',
    name: '',
    clientName: '',
    responsibleCode: undefined,
    responsibleName: undefined,
  };
  const flag = disabledDates.value.some((i: Date) => {
    return i.getTime() == calendarDay.date.getTime();
  });

  const nowTimeFlag =
    dayjs(calendarDay.date).format('YYYY-MM-DD') > tomorrowTime;
  if (flag) {
    message.info('非工作日不可提交工时！');
  } else if (nowTimeFlag) {
    message.info('可以延后申报，但只能提前一天进行申报，遇到周末不可提前');
  } else {
    const todayFlag = selectedDates.value.some((i: Date) => {
      return (
        dayjs(i).format('YYYY-MM-DD') ==
        dayjs(calendarDay.date).format('YYYY-MM-DD')
      );
    });
    if (todayFlag) {
      //是否已经选择过了，选择过的可以查看和编辑，未选择的可以填报

      getTimeSheetDetail({
        staffCode: id,
        date: dayjs(calendarDay.date).format('YYYY-MM-DD'),
      }).then((res) => {
        pickBasicData(timeSheet, res);
        selectedProject.value = res.project;
      });
      //是否可以进行编辑
      const edita =
        dayjs(calendarDay.date).format('YYYY-MM-DD') ===
        dayjs().format('YYYY-MM-DD');

      if (edita) {
        editableFalg.value = true;
      } else {
        message.info('只可以对当天的工时申报进行修改,其他日期只可查看');
      }
    } else {
      DisableFlag.value = false;
      editableFalg.value = false;
      timeSheet.date = dayjs(calendarDay.date).format('YYYY-MM-DD');
      currentDate.value = calendarDay.date;
    }
  }
}
const onFinish = (values: any) => {
  if (editableFalg.value) {
    editTimesheet(timeSheet).then((res) => {
      console.log('res', res);
      DisableFlag.value = true;
      selectedDates.value = res.map((item: any) => {
        return new Date(item.date);
      });
      // window.location.reload();
    });
  } else {
    delareTimesheet(timeSheet).then((res) => {
      console.log('res', res);
      DisableFlag.value = true;
      selectedDates.value = res.map((item: any) => {
        return new Date(item.date);
      });
      // window.location.reload();
    });
  }
};

function edit() {
  DisableFlag.value = false;
}

function change() {
  timeSheet.projectName = option.name;
  timeSheet.clientName = option.clientName;
  timeSheet.approvalCode = option.responsibleCode;
  timeSheet.approvalName = option.responsibleName;
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
const disabledDate = ref([]);

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
