<template>
  <div style="border: 2px solid #fff">
    <div>
      <ListCard
        :title="'休假申请'"
        :filters="filters"
        :columns="columns"
        :api="{ list: applicationPage }"
        :params="{
          staffCode: id,
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

    <a-modal v-model:visible="visibleFlag" title="申请表单" @ok="confirm">
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
            :tip="'注意：'"
            :max-count="3"
            accept=".jpg"
            :show-api-error-msg="true"
            :uploadApi="uploadApi"
            :limit-size="1"
            @update="handleUploadSuccess"
          >
          </DCUpload>
          <div
            class="file-item"
            v-if="application.files && application.files.length > 0"
          >
            <div class="file-item-name">
              <a class="flex-items-center" style="text-decoration: underline">
                <SvgRaw name="icon_file" />
                {{ application.files[0].fileName }}
              </a>
            </div>
          </div>
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

    <a-modal v-model:visible="visibleProcess" title="流程信息" :footer="null">
      <a-steps direction="vertical" :current="currentProcess">
        <a-step title="提交申请">
          <template #description>
            <p>发起人：{{ currentApplication.applicationStaffName }}</p>
            <p>创建时间：{{ currentApplication.createdTime }}</p>
          </template></a-step
        >
        <a-step title="直属领导审批">
          <template #description>
            <p>处理人：{{ processList[0]?.processorName }}</p>
            <p>状态：{{ ProcessStatusEnum[processList[0]?.status] }}</p>
            <p>
              结果：{{ ProcessResultEnum[processList[0]?.processingResult] }}
            </p>
            <p>审核意见：{{ processList[0]?.remark }}</p>
            <p>完成时间：{{ processList[0]?.endTime }}</p>
          </template>
        </a-step>
        <a-step title="上级主管审批" v-if="currentApplication.dayNumbers >= 7">
          <template #description>
            <p>处理人：{{ processList[1]?.processorName }}</p>
            <p>状态：{{ ProcessStatusEnum[processList[1]?.status] }}</p>
            <p>
              结果：{{ ProcessResultEnum[processList[1]?.processingResult] }}
            </p>
            <p>审核意见：{{ processList[1]?.remark }}</p>
            <p>完成时间：{{ processList[1]?.endTime }}</p>
          </template>
        </a-step>
      </a-steps>
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
  ProcessStatusEnum,
  HolidayTypeEnum,
  ProcessResultEnum,
} from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData, findObjById } from '@/utils/translate';
import { message } from 'ant-design-vue';
import {
  applicationOne,
  applicationPage,
  uploadApi,
  getProcessList,
  deleteApplicationOne,
  ApplicationRevocation,
} from '@/api/application';
import { getStaffInfo } from '@/api/basicInfo';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode, defineComponent } from 'vue';
import { Modal } from 'ant-design-vue';

const specialLeaveFlag = ref(false);
const currentProcess = ref(1);
const staffOptions = ref([]);
const DisableFlag = ref(false);
const visibleProcess = ref(false);
const currentApplication = ref();
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
  applicationStaffCode: localStorage.getItem('staffCode'),
  applicationStaffName: localStorage.getItem('userName'),
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
  files: [],
  fileId: undefined,
});

watch(
  () => staffOptions.value,
  (values) => {
    if (values[0]) {
      application.processList[0].processorName = findObjById(
        directLeader.value,
        staffOptions.value
      )[0].label;
    }
  }
);
const columns = [
  {
    title: '单号',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },

  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    customRender: ({ text }) => {
      return h('span', {}, OrderStatusEnum[text]);
    },
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    customRender: ({ text }) => {
      return h('span', {}, HolidayTypeEnum[text]);
    },
  },
  {
    title: '摘要',
    dataIndex: 'remark',
    key: 'remark',
    width: 200,
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
const processList = ref([]);
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '取消申请',
    disabled(row) {
      return row.status !== 0;
    },
    async onClick(record) {
      Modal.confirm({
        title: '你确定要取消当前休假申请?',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          'div',
          { style: 'color:red;' },
          '由于休假申请涉及到多个流程处理，改操作为不可逆操作，请谨慎选择'
        ),
        async onOk() {
          const res = await deleteApplicationOne({ id: record.id ,staffCode:id});
          if (res === 'success') {
            message.success('取消成功');
            list.value.fetch();
          }
        },
        onCancel() {},
        class: 'test',
      });
    },
  },
  {
    operationType: 'delete',
    text: '撤销',
    disabled(row) {
      return row.status === 1 || row.status === 4 || row.status===0 || row.status===5;
    },
    async onClick(record) {
      record.remark = "请求撤销申请";
      ApplicationRevocation({ ...record }).then((res) => {
      visibleFlag.value = false;
      list.value.fetch();
      if (res === 'success') {
        message.success('申请成功');
      } else {
        message.error('操作失败');
      }
    });
    },
  },
  {
    operationType: 'view',
    text: '查看流程',
    onClick(record) {
      visibleProcess.value = true;
      currentApplication.value = record;
      getProcessList({ applicationId: record.id }).then((res) => {
        processList.value = res;
        console.log(res);

        if (res.length > 1 && res[0].status === 2) {
          currentProcess.value = 2;
        } else {
          currentProcess.value = 1;
        }
      });
    },
  },
];

const id = localStorage.getItem('staffCode');

onMounted(() => {
  getStaffListData();
  getStaffInfo({ id: id }).then((res) => {
    directLeader.value = res.pid;
    application.processList[0].processorCode = res.pid;
  });
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
  console.log(values);

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
  if (application.dayNumbers >= 7) {
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
  console.log(application);
  formRef.value.validate().then((values: any) => {
    applicationOne({ ...application }).then((res) => {
      visibleFlag.value = false;
      list.value.fetch();
      if (res === 'success') {
        message.success('申请成功');
      } else {
        message.error('操作失败');
      }
    });
  });
};

const confirm = () => {
  Modal.confirm({
    title: '你确定要按照当前填写数据发起申请?',
    icon: createVNode(ExclamationCircleOutlined),
    content: createVNode(
      'div',
      { style: 'color:red;' },
      '由于休假申请涉及到多个流程处理，一旦提交后将不可再进行编辑'
    ),
    onOk() {
      handleOK();
    },
    onCancel() {},
    class: 'test',
  });
};

// 文件上传成功后的回调函数
function handleUploadSuccess(data: any) {
  console.log(data);

  application.files = [{ ...data }];
  application.fileId = application.files[0].id;
}
</script>
