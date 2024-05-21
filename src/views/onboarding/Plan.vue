<template>
  <div>
    <ListCard
      title="培训计划"
      :columns="columns"
      :filters="filters"
      :api="{ list: trainPage }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      :needExport="true"
      :show-btn-num="4"
      ref="list"
    >
      <template #tableTopRender>
        <div style="margin-right: 20px">
          <a-button type="primary" @click="add">新增</a-button>
        </div>
      </template>
    </ListCard>
    <a-modal
      v-model:visible="visibleFlag"
      title="详情"
      @ok="handleOK"
      width="600px"
    >
      <a-form
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 13 }"
        :model="plan"
      >
        <a-form-item label="名称" name="name">
          <a-input
            v-model:value="plan.name"
            :placeholder="'请输入'"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="类型" name="type">
          <a-select
            v-model:value="plan.type"
            :placeholder="'请选择'"
            :options="enumToObjArray(TrainTypeEnum)"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="选择部门" name="dept" v-if="plan.type === 1">
          <a-select
            v-model:value="plan.chooseId"
            :placeholder="'请选择'"
            :options="enumToObjArray(DepartmentEnum)"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="选择职级" name="rank" v-if="plan.type === 2">
          <a-select
            v-model:value="plan.chooseId"
            :placeholder="'请选择'"
            :options="enumToObjArray(RoleRankEnum)"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>

        <a-form-item label="描述" name="remark">
          <a-textarea
            v-model:value="plan.remark"
            :disabled="DisableFlag"
            :rows="3"
            :maxlength="100"
            allowClear
          />
        </a-form-item>
        <a-form-item label="截止时间" name="endTime">
          <a-date-picker
            v-model:value="plan.endTime"
            :placeholder="'请选择日期'"
            style="width: 100%"
            allowClear
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            :disabled="DisableFlag"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal
      v-model:visible="TaskFlag"
      title="下发任务"
      @ok="handleBindTask"
      width="600px"
    >
      <a-form
        ref="formRef"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 13 }"
        :model="plan"
      >
        <a-form-item label="视频文件" name="files">
          <DCUpload
            type="primary"
            :ghost="false"
            :showRouteButton="false"
            icon="icon_upload"
            :buttonText="'上传文件'"
            :title="'上传文件'"
            :tip="'注意：只能上传mp4格式的视频文件'"
            :max-count="1"
            accept=".mp4"
            :show-api-error-msg="true"
            :uploadApi="uploadApi"
            :limit-size="100"
            @update="handleUploadSuccess"
          >
          </DCUpload>
          <div class="file-item" v-if="plan.videoId">
            <div class="file-item-name">
              <a class="flex-items-center" style="text-decoration: underline">
                <SvgRaw name="icon_file" />
                {{ plan.files.fileName }}
              </a>
            </div>
          </div>
        </a-form-item>
        <a-form-item label="需要考核">
          <a-switch
            v-model:checked="plan.checkUpProblem"
            checked-children="是"
            un-checked-children="否"
          />
          <DCUpload
            v-if="plan.checkUpProblem"
            style="margin-left: 20px"
            type="primary"
            :ghost="false"
            :showRouteButton="false"
            icon="icon_upload"
            :buttonText="'上传文件'"
            :showButtonText="'导入'"
            :title="'上传题库'"
            :tip="'注意：请下载模版后按照模版修改并上传。'"
            accept=".xls,.xlsx"
            :show-api-error-msg="true"
            :uploadApi="uploadFile"
            :params="plan.id"
            @update="handleUploadSuccess1"
            :limit-size="1"
          >
            <template #templateDownload>
              <a
                class="flex-items-center"
                @click="templateDownload"
                style="text-decoration: underline"
              >
                <SvgRaw name="icon_file" />
                考核题目模板.xlsx
              </a>
            </template>
          </DCUpload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { BtnInfoType } from '@/enums/formEnum';
import { getStaffList } from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import Ellipsis from '@/components/Ellipsis/index.vue';
import { uploadApi } from '@/api/application';
import {
  trainPage,
  addPlan,
  deletePlan,
  bindTask,
  uploadFile,
} from '@/api/train';
import { handleExportTemplate } from '@/utils/common';
import {
  DepartmentEnum,
  TrainTypeEnum,
  RoleRankEnum,
  TrainStatusEnum,
} from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';

const router = useRouter();
const staffOptions = ref([]);
const TaskFlag = ref(false);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const rank = ref(localStorage.getItem('rank'));
const userName = ref(localStorage.getItem('userName'));
const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 130,
    customRender: ({ text }) => {
      return h('span', {}, TrainTypeEnum[text]);
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 130,
    customRender: ({ text }) => {
      return h('span', {}, TrainStatusEnum[text]);
    },
  },
  {
    title: '描述',
    dataIndex: 'remark',
    key: 'remark',
    width: 230,
    customRender: ({ record }) =>
      h(Ellipsis, { value: record.remark, width: 200 }),
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    width: 200,
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '截止时间',
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
    title: '完成时间',
    dataIndex: 'completionTime',
    key: 'completionTime',
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
    width: 230,
  },
];
const filters = [
  {
    label: '请选择负责人',
    type: 'select',
    prop: 'staffCode',
    showSearch: true,
    options: staffOptions,
  },
  {
    label: '请选择部门',
    type: 'select',
    prop: 'deptId',
    showSearch: true,
    options: enumToObjArray(DepartmentEnum),
  },
];
const plan = ref({
  id: '',
  name: '',
  chooseId: '',
  type: undefined,
  status: '',
  remark: '',
  files: [],
  videoId: undefined,
  checkUpProblem: false,
  createdCode: id,
  createdName: userName.value,
  endTime: '',
});
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '编辑',
    disabled(record) {
      return record.status !== 0;
    },
    onClick(record) {
      visibleFlag.value = true;
      DisableFlag.value = false;
      plan.value = record;
      console.log(plan.value);
    },
  },
  {
    operationType: 'view',
    text: '下发任务',
    visible(record) {
      return record.status === 0;
    },
    onClick(record) {
      plan.value = record;
      console.log(plan.value);

      TaskFlag.value = true;
      DisableFlag.value = true;
    },
  },
  {
    operationType: 'view',
    text: '查看任务',
    visible(record) {
      return record.status !== 0;
    },
    onClick(record) {
      // visibleFlag.value = true;
      // DisableFlag.value = true;
      plan.value = record;
      router.push({
        path: '/train/taskList',
        query: { planId: record.id },
      });
    },
  },
  {
    operationType: 'delete',
    text: '删除',
    disabled(record) {
      return record.status !== 0;
    },
    onClick(record) {
      plan.value = record;
      Modal.confirm({
        title: '你确定要删除?',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          'div',
          { style: 'color:red;' },
          '该操作为不可逆操作，请谨慎选择'
        ),
        onOk() {
          deletePlan({ id: record.id }).then((res) => {
            if (res === 'success') {
              message.error('删除成功');
              list.value.fetch();
            }
          });
        },
        onCancel() {},
        class: 'test',
      });
    },
  },
];

function add() {
  visibleFlag.value = true;
  plan.value = {
    id: '',
    name: '',
    chooseId: '',
    type: undefined,
    status: '',
    remark: '',
    files: [],
    videoId: undefined,
    checkUpProblem: false,
    createdCode: id,
    createdName: userName.value,
    endTime: '',
  };
}

function templateDownload() {
  handleExportTemplate('/导入模板.xlsx', '导入模板.xlsx');
}
// 文件上传成功后的回调函数
function handleUploadSuccess(data: any) {
  console.log(data);
  plan.value.videoId = data.id;
  plan.value.files = data;
}

// 文件上传成功后的回调函数
function handleUploadSuccess1(data: any) {
  console.log(data);

  // application.files = [{ ...data }];
  // application.fileId = application.files[0].id;
}

// function deptChange(value, option) {
//   plan.value.publishDeptName = option.label;
// }
const handleOK = async () => {
  const res = await addPlan(plan.value);
  if (res === 'success') {
    message.success('操作成功');
    visibleFlag.value = false;
    list.value.fetch();
  } else {
    message.error('操作失败，请重试');
  }
};

const handleBindTask = async () => {
  const res = await bindTask(plan.value);
  if (res === 'success') {
    message.success('操作成功');
    TaskFlag.value = false;
    list.value.fetch();
  } else {
    message.error('操作失败，请重试');
  }
};

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
  getStaffListData();
});
</script>
