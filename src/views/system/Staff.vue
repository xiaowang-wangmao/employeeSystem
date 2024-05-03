<template>
  <div>
    <ListCard
      title="员工账号管理"
      :columns="columns"
      :filters="filters"
      :api="{ list: getStaffPage }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      :needExport="true"
      ref="list"
    >
     <template #tableTopRender>
          <div style="margin-right: 20px">
            <DCUpload
                  type="primary"
                  :ghost="false"
                  :showRouteButton="false"
                  icon="icon_upload"
                  :buttonText="'上传文件'"
                  :showButtonText="'导入'"
                  :title="'上传文件'"
                  :tip="'注意：请下载模版后按照模版修改并上传。'"
                  accept=".xls,.xlsx"
                  :show-api-error-msg="true"
                  :uploadApi="uploadApi"
                  @update="handleUploadSuccess"
                  :limit-size="1"
                >
                  <template #templateDownload>
                    <a
                      class="flex-items-center" @click="templateDownload"
                      style="text-decoration: underline;">
                      <SvgRaw name="icon_file" />
                      文件模板.xlsx
                    </a>
                  </template>
                </DCUpload>
          </div>
        </template>
    </ListCard>
    <a-modal v-model:visible="visibleFlag" title="调整" @ok="handleOK">
      <a-form
        ref="formRef"
        :label-col="{ span: 7 }"
        :wrapper-col="{ span: 12 }"
        :model="staff"
      >
        <a-form-item label="直接领导" name="pid">
          <a-select
            v-model:value="staff.pid"
            :placeholder="'请选择职员'"
            :options="staffOptions"
            :disabled="DisableFlag"
            @change="staffChange"
            allowClear
          />
        </a-form-item>

        <a-form-item label="部门" name="deptId">
          <a-select
            v-model:value="staff.deptId"
            :placeholder="'请选择部门'"
            :options="enumToObjArray(DepartmentEnum)"
            :disabled="DisableFlag"
            @change="deptChange"
            allowClear
          />
        </a-form-item>
        <a-form-item label="职级" name="roleId">
          <a-select
            v-model:value="staff.roleId"
            :placeholder="'请选择职级'"
            :options="enumToObjArray(RoleRankEnum)"
            :disabled="DisableFlag"
            @change="rankChange"
            allowClear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import Time from '@/components/Time/index.vue';
import { BtnInfoType } from '@/enums/formEnum';
import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {
  getProjectList,
  getStaffList,
} from '@/api/timesheet';
import { updatePassword ,uploadApi} from '@/api/user';
import { updateStaff } from '@/api/basicInfo';
import { getStaffPage } from '@/api/basicInfo';
import {
  OrderStatusEnum,
  RoleRankEnum,
  DepartmentEnum,
} from '@/enums/optionsEnum';
import { enumToObjArray, findObjById, pickBasicData } from '@/utils/translate';
import { handleExportTemplate } from '@/utils/common';
import { message } from 'ant-design-vue';

const currentStaff = ref({});
const staffOptions = ref([]);
const editableFalg = ref(false);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const columns = [
  {
    title: '员工号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '员工姓名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '所属部门',
    dataIndex: 'deptName',
    key: 'deptName',
  },
   {
    title: '直属领导',
    dataIndex: 'pname',
    key: 'pname',
  },
  {
    title: '职级',
    dataIndex: 'roleId',
    key: 'roleId',
    customRender: ({ text }) => {
      return h('span', {}, RoleRankEnum[text]);
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
    label: '请选择员工',
    type: 'select',
    prop: 'id',
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
   {
    label: '请选择职级',
    type: 'select',
    prop: 'roleId',
    showSearch: true,
    options: enumToObjArray(RoleRankEnum),
  },
];
const staff = ref({
  id: '',
  userName: '',
  pid: undefined,
  pname: undefined,
  roleId: undefined,
  roleName: undefined,
  deptName: undefined,
  deptId: undefined,
});
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '调整',
    onClick(record) {
      visibleFlag.value = true;
      // currentStaff.value = record;
      staff.value = record;
    },
  },
  {
    operationType: 'reset',
    text: '重置密码',
    onClick(record) {
      staff.value = record;
      updatePassword({
      code: record.id,
      password: "11111",
    }).then((res) => {
      message.success(res.msg);
    });
    },
  },
];

function templateDownload() {
  handleExportTemplate('/导入模板.xlsx', '导入模板.xlsx');
}

function deptChange(value, option) {
  staff.value.deptName = option.label;
}
function rankChange(value, option) {
  staff.value.roleName = option.label;
}

function staffChange(value, option) {
  console.log(option);
  
  staff.value.pname = option.label;
}
const handleOK = async () => {
  const res = await updateStaff(staff.value);
  if (res === 'success') {
    message.success('操作成功');
    visibleFlag.value = false;
    list.value.fetch();
  } else {
    message.error('操作失败，请重试');
  }
};

// 文件上传成功后的回调函数
function handleUploadSuccess(data: any) {
  console.log(data);
  list.value.fetch();
}

function getStaffListData() {
  getStaffList({}).then((res) => {
    staffOptions.value = res.map((item: any) => {
      return {
        label: item.userName,
        value: item.id,
      };
    });
    staffOptions.value.push({ label: '无', value: 0 });
  });
}

onMounted(() => {
  getStaffListData();
});
</script>
