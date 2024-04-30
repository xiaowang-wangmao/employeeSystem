<template>
  <div style="border: 2px solid #fff">
    <div>
      <ListCard
        :title="'休假申请'"
        :filters="filters"
        :columns="columns"
        :api="{ list: applicationPage }"
        :params="{
          staffCode:id
        }"
        :needParamsCache="true"
        :btnInfo="btnInfo"
        :needExport="true"
        ref="list"
      >
        <template #tableTopRender>
          <div style="margin-right: 20px">
            <a-button type="primary" class="flex-items-center" @click="add">
              <SvgRaw name="icon_add" />
              发起申请
            </a-button>
          </div>
        </template>
      </ListCard>
    </div>

    <a-modal v-model:visible="visibleFlag" title="申请表单" @ok="handleOK">
      <a-form
        ref="formRef"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
        :model="application"
      >
        <a-form-item label="休假类型" name="type">
          <a-select
            v-model:value="application.type"
            :placeholder="'请选择类型'"
            :options="enumToObjArray(HolidayTypeEnum)"
            :disabled="DisableFlag"
            allowClear
            @change="typeChange"
          />
        </a-form-item>
        <a-form-item label="休假日期" name="startTime">
          <a-range-picker
            v-model:value="application.rangeTime"
            style="width: 100%"
            allowClear
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            :disabled="DisableFlag"
            @change="rangeDateChange"
            :disabled-time="disabledRangeTime"
            :show-time="{
              hideDisabledOptions: true,
              defaultValue: [
                dayjs('09:00:00', 'HH:mm:ss'),
                dayjs('17:00:00', 'HH:mm:ss'),
              ],
            }"
          />
        </a-form-item>
        <a-form-item
          label="DirectLeader"
          name="directLeader"
          v-if="application.processList[0].id !== 0"
        >
          <a-select
            v-model:value="application.processList[0].processorCode"
            :options="staffOptions"
            disabled
            allowClear
            @change="leaderChange"
          />
        </a-form-item>
        <a-form-item
          label="上级主管"
          name="leader"
          v-if="application.dayNumbers >= 7"
        >
          <a-select
            v-model:value="application.processList[1].processorCode"
            :options="staffOptions"
            :disabled="DisableFlag"
            allowClear
            @change="leaderChange1"
          />
        </a-form-item>
        <a-form-item label="上传文件" name="files" v-if="specialLeaveFlag">
          <DCUpload
            type="primary"
            :ghost="false"
            :showRouteButton="false"
            icon="icon_upload"
            :buttonText="'上传文件'"
            :title="'上传文件'"
            :tip="'注意：请下载模版后按照模版修改并上传。'"
            accept=".csv"
            :show-api-error-msg="true"
            :uploadApi="add"
            :limit-size="1"
          >
          </DCUpload>
        </a-form-item>

        <a-form-item label="Remark" name="remark">
          <a-textarea
            v-model:value="application.remark"
            :disabled="DisableFlag"
            :rows="3"
            :maxlength="100"
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { getTimeSheetPage, getStaffList } from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import DCUpload from '@/components/DCUpload/index.vue';
import { BtnInfoType } from '@/enums/formEnum';
import {
  OrderStatusEnum,
  OverTimeFlagEnum,
  HolidayTypeEnum,
} from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData } from '@/utils/translate';
import { message } from 'ant-design-vue';
import { applicationOne ,applicationPage} from '@/api/application';
import { getStaffInfo } from '@/api/basicInfo';

const specialLeaveFlag = ref(false);
const staffOptions = ref([]);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const range = (start: number, end: number) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const disabledRangeTime = (_: Dayjs, type: 'start' | 'end') => {
  if (type === 'start') {
    return {
      disabledHours: () => range(0, 60).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  return {
    disabledHours: () => range(0, 60).splice(20, 4),
    disabledMinutes: () => range(0, 31),
    disabledSeconds: () => [55, 56],
  };
};

const disabledDate = (current: Dayjs) =>
  current && current < dayjs().subtract(1, 'days').endOf('day');
const directLeader = ref();
const application = reactive({
  applicationStaffCode: localStorage.getItem("staffCode"),
  applicationStaffName: localStorage.getItem("userName"),
  processList: [
    { processorCode: undefined, processorName: '' },
    { processorCode: undefined, processorName: '' },
  ],
  status: '',
  type: undefined,
  endTime: undefined,
  rangeTime: ref<[Dayjs, Dayjs]>(),
  startTime: '',
  dayNumbers: 0,
  remark: '',
  files: '',
});
const columns = [
  {
    title: '单号',
    dataIndex: 'id',
    key: 'id',
    width:100,
  },

  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width:100,
    customRender: ({ text }) => {
      return h('span', {}, OrderStatusEnum[text]);
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width:100,
    customRender: ({ text }) => {
        return h('span', {}, HolidayTypeEnum[text]);
    },
  },
  {
    title: '摘要',
    dataIndex: 'remark',
    key: 'remark',
    width:200,
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    width: 200,
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD HH:mm:ss' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    width: 200,
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD HH:mm:ss' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '提交时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    width: 200,
    sorter: (a, b) => a.date.localeCompare(b.date),
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '修改时间',
    dataIndex: 'date',
    key: 'date',
    width: 200,
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
  },
];
const filters = [
  {
    label: '请输入单号',
    type: 'input',
    prop: 'id',
    length: 10,
  },
  {
    label: '请选择工单状态',
    type: 'select',
    prop: 'status',
    showSearch: true,
    options: enumToObjArray(OrderStatusEnum),
  },
  {
    label: '请选择休假类型',
    type: 'select',
    prop: 'type',
    showSearch: true,
    options: enumToObjArray(HolidayTypeEnum),
  },
  {
    label: '提交时间',
    type: 'date-range',
    prop: 'createdTime',
  },
];
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '编辑',
    onClick(record) {
      // editableFalg.value = true;
    },
  },
  {
    operationType: 'delete',
    text: '撤销',
    // disabled(row) {
    //   return row.status === 5;
    // },
    async onClick(record) {
      //   const res = await approvalDelete({ applicationId: record.id });
      //   if (res === 'success') {
      //     message.success('操作成功');
      //     list.value.fetch();
      //   } else {
      //     message.error('操作失败，请重试');
      //   }
    },
  },
  {
    operationType: 'view',
    text: '查看',
    onClick(record) {
      // editableFalg.value = true;
    },
  },
];

const id = localStorage.getItem('staffCode');

onMounted(() => {
  getStaffInfo({ id: id }).then((res) => {
    directLeader.value = res.pid;
    application.processList[0].processorCode = res.pid;
  });
  getStaffListData();
});


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

function add() {
  visibleFlag.value = true;
}
function rangeDateChange(values: any[]) {
  if (values.length > 1) {
    application.startTime = values[0];
    application.endTime = values[1];
  }

  const diffHour = dayjs(application.endTime).diff(
    dayjs(application.startTime),
    'hour'
  );
  if (diffHour > 8) {
    application.dayNumbers = dayjs(application.endTime).diff(
      dayjs(application.startTime),
      'day'
    );
  } else {
    application.dayNumbers = diffHour / 8;
  }
  // console.log('number', application.dayNumbers);
  if (application.dayNumbers >=7 ) {
    message.info('请向你的直属领导确认上级审批主管');
  }
}

function typeChange(value, option) {
  if (value === 0) {
    //检查年假是否有剩余
  } else if (value === 1) {
    //检查调休是否有剩余
  } else if (value === 2) {
    //事假
  } else {
    //特殊
    specialLeaveFlag.value = true;
  }
}

function leaderChange(value, option) {
  application.processList[0].processorName = option.label;
}
function leaderChange1(value, option) {
  application.processList[1].processorName = option.label;
}

const handleOK = () => {
  formRef.value.validate().then((values: any) => {
    applicationOne({  ...application }).then((res) => {
      visibleFlag.value = false;
      list.value.fetch();
      if (res === 'success') {
        message.success("申请成功");
      } else {
        message.error("操作失败");
      }
    });
  });
}
</script>
