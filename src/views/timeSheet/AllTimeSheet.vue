<template>
  <div>
    <ListCard
      :title="'申报记录总表'"
      :filters="filters"
      :columns="columns"
      :api="{ list: getTimeSheetPage }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      :needExport="true"
      ref="list"
    >
      <template #tableTopRender>
        <div>
          <a-button type="primary" class="flex-items-center" @click="add">
            <SvgRaw name="icon_add" />
            新增记录
          </a-button>
        </div>
      </template>
    </ListCard>
    <a-modal v-model:visible="visibleFlag" title="申报表单" @ok="handleOK">
      <a-form
        ref="formRef"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
        :model="timeSheet"
      >
        <a-form-item label="StaffCode" name="staffCode">
          <a-select
            v-model:value="timeSheet.staffCode"
            :placeholder="'请选择职员'"
            :options="staffOptions"
            :disabled="DisableFlag"
            @change="staffChange"
            allowClear
          />
        </a-form-item>
        <a-form-item label="StaffCode" name="staffCode">
          <a-date-picker
            v-model:value="timeSheet.date"
            :placeholder="'请选择日期'"
            style="width: 100%"
            allowClear
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            :disabled="DisableFlag"
          />
        </a-form-item>

        <a-form-item label="Work Location" name="workLocation">
          <a-select
            v-model:value="timeSheet.workLocation"
            :placeholder="'请选择工作地点'"
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
        <a-form-item label="Type" name="overtimeFlag">
          <a-select
            v-model:value="timeSheet.overtimeFlag"
            :placeholder="'请选择类型'"
            :options="enumToObjArray(OverTimeFlagEnum)"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item
          label="Total Actural Hours"
          name="actualHours"
          v-if="timeSheet.overtimeFlag === 0"
        >
          <a-input-number
            v-model:value="timeSheet.actualHours"
            :disabled="DisableFlag"
            :min="0"
            :max="8"
            allowClear
          />
          Hours
        </a-form-item>
        <a-form-item
          label="Overtime Hours"
          name="overtimeHours"
          v-if="timeSheet.overtimeFlag === 1"
        >
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
            :placeholder="'请选择项目'"
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
            @change="approvalChange"
            allowClear
          />
        </a-form-item>
        <a-form-item label="Remark" name="remark">
          <a-textarea
            v-model:value="timeSheet.remark"
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

<script lang="ts" setup>
import { getTimeSheetPage } from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import { BtnInfoType } from '@/enums/formEnum';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  getProjectList,
  getStaffList,
  delareTimesheet,
  getTimeSheetDetail,
  editTimesheet,
  approvalDelete,
} from '@/api/timesheet';
import { OrderStatusEnum, OverTimeFlagEnum } from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData } from '@/utils/translate';
import { message } from 'ant-design-vue';

const projectOptions = ref([]);
const selectedProject = ref();
const staffOptions = ref([]);
const editableFalg = ref(false);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const columns = [
  {
    title: '单号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '项目编号',
    dataIndex: 'projectId',
    key: 'projectId',
  },
  {
    title: '项目名称',
    dataIndex: ['project', 'name'],
  },
  {
    title: '申请人',
    dataIndex: 'staffName',
    key: 'staffName',
  },
  {
    title: '工时',
    dataIndex: 'actualHours',
    key: 'actualHours',
    customRender: ({ text }) => {
      if (text) {
        return h('span', {}, text + '   h');
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '加班工时',
    dataIndex: 'overtimeHours',
    key: 'overtimeHours',
    customRender: ({ text }) => {
      if (text) {
        return h('span', {}, text + '   h');
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => {
      return h('span', {}, OrderStatusEnum[text]);
    },
  },
  {
    title: '类型',
    dataIndex: 'overtimeFlag',
    key: 'overtimeFlag',
    customRender: ({ text }) => {
      if (text) {
        return h('span', {}, OverTimeFlagEnum[text]);
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '工作地点',
    dataIndex: 'workLocation',
    key: 'workLocation',
  },
  {
    title: '摘要',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '提交时间',
    dataIndex: 'date',
    key: 'date',
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
  },
];
const filters = [
  // {
  //   label: '请输入单号',
  //   type: 'input',
  //   prop: 'id',
  //   length: 10,
  // },
  {
    label: '请选择项目',
    type: 'select',
    prop: 'projectId',
    showSearch: true,
    options: projectOptions,
  },
  {
    label: '请选择工单状态',
    type: 'select',
    prop: 'status',
    showSearch: true,
    options: enumToObjArray(OrderStatusEnum),
  },
  {
    label: '请选择职员',
    type: 'select',
    prop: 'staffCode',
    showSearch: true,
    options: staffOptions,
  },
  {
    label: '提交时间',
    type: 'date-range',
    prop: 'date',
  },

];
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '编辑',
    onClick(record) {
      editableFalg.value = true;
    },
  },
  {
    operationType: 'delete',
    text: '作废',
    disabled(row) {
      return row.status === 5;
    },
    async onClick(record) {
      const res = await approvalDelete({ timesheetId: record.id });
      if (res === 'success') {
        message.success('操作成功');
        list.value.fetch();
      } else {
        message.error('操作失败，请重试');
      }
    },
  },
];
let timeSheet = reactive({
  id: '',
  staffCode: undefined,
  staffName: '',
  workLocation: undefined,
  projectId: undefined,
  projectName: '',
  clientName: '',
  approvalCode: '',
  approvalName: '',
  targetHours: '8',
  overtimeFlag: undefined,
  overtimeHours: '',
  actualHours: undefined,
  remark: '',
  date: Dayjs,
});
function change(value, option) {
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
function staffChange(value, option) {
  timeSheet.staffName = option.label;
}
function approvalChange(value, option) {
  console.log('ccc');

  timeSheet.approvalName = option.label;
}
function add() {
  visibleFlag.value = true;
}
const handleOK = () => {
  console.log(timeSheet);

  if (editableFalg.value) {
    editTimesheet(timeSheet).then((res) => {
      console.log('res', res);
      DisableFlag.value = true;
      visibleFlag.value = false;
      list.value.fetch();
    });
  } else {
    delareTimesheet(timeSheet).then((res) => {
      console.log('res', res);
      DisableFlag.value = true;
      visibleFlag.value = false;
      list.value.fetch();
    });
  }
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

onMounted(() => {
  getProjectListData();
  getStaffListData();
});
</script>
