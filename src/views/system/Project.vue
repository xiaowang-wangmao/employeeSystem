<template>
  <div>
    <ListCard
      title="项目管理"
      :columns="columns"
      :filters="filters"
      :api="{ list: projectPage }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      :needExport="true"
      ref="list"
    >
      <template #tableTopRender>
        <div style="margin-right: 20px">
          <a-button type="primary" @click="add">新增</a-button>
        </div>
      </template>
    </ListCard>
    <a-modal v-model:visible="visibleFlag" title="调整" @ok="handleOK">
      <a-form
        ref="formRef"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
        :model="project"
      >
        <a-form-item label="项目名称" name="name">
          <a-input
            v-model:value="project.name"
            :placeholder="'请输入'"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="客户公司" name="clientName">
          <a-input
            v-model:value="project.clientName"
            :placeholder="'请输入'"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="负责人" name="pid">
          <a-select
            v-model:value="project.responsibleCode"
            :placeholder="'请选择'"
            :options="staffOptions"
            :disabled="DisableFlag"
            @change="staffChange"
            allowClear
          />
        </a-form-item>
        <a-form-item label="项目类型" name="type">
          <a-select
            v-model:value="project.type"
            :placeholder="'请选择'"
            :options="enumToObjArray(ProjectTypeEnum)"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { BtnInfoType } from '@/enums/formEnum';
import { getProjectList, getStaffList } from '@/api/timesheet';
import { projectPage, updateProject, deleteProject } from '@/api/common';
import { RoleRankEnum, ProjectTypeEnum } from '@/enums/optionsEnum';
import { enumToObjArray, findObjById, pickBasicData } from '@/utils/translate';
import { message } from 'ant-design-vue';

const currentStaff = ref({});
const staffOptions = ref([]);
const editableFalg = ref(false);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const statusOptions = [
  {
    label: '正常',
    value: 0,
  },
  {
    label: '异常',
    value: 1,
  },
];
const columns = [
  {
    title: '项目编号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '客户名称',
    dataIndex: 'clientName',
    key: 'clientName',
  },
  {
    title: '负责人',
    dataIndex: 'responsibleName',
    key: 'responsibleName',
  },
  {
    title: '项目类型',
    dataIndex: 'type',
    key: 'type',
    customRender: ({ text }) => {
      return h('span', {}, ProjectTypeEnum[text]);
    },
  },
  {
    title: '项目状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => {
      if (text === 0) return h('span', {}, '正常');
      else {
        return h('span', {}, '异常');
      }
    },
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
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
    label: '请选择项目状态',
    type: 'select',
    prop: 'status',
    options: statusOptions,
  },
  {
    label: '请选择项目类型',
    type: 'select',
    prop: 'type',
    showSearch: true,
    options: enumToObjArray(RoleRankEnum),
  },
];
const project = ref({
  id: '',
  name: '',
  pid: undefined,
  clientName: undefined,
  responsibleCode: undefined,
  responsibleName: undefined,
  status: 0,
  type: undefined,
});
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '调整',
    onClick(record) {
      visibleFlag.value = true;
      project.value = record;
    },
  },
  {
    operationType: 'delete',
    text: '删除',
    onClick(record) {
      project.value = record;
      deleteProject({ id: record.id }).then((res) => {
        if (res === 'success') {
          message.error('删除成功');
          list.value.fetch();
        }
      });
    },
  },
];

function add() {
  console.log(2);
  
  visibleFlag.value = true;
  project.value = {
    id: '',
    name: '',
    pid: undefined,
    clientName: undefined,
    responsibleCode: undefined,
    responsibleName: undefined,
    status: 0,
    type: undefined,
  };
}

function staffChange(value, option) {
  console.log(option);

  project.value.responsibleName = option.label;
}
const handleOK = async () => {
  const res = await updateProject(project.value);
  if (res === 'success') {
    message.success('操作成功');
    visibleFlag.value = false;
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
