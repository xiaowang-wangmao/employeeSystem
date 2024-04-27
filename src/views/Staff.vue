<template>
  <div>
    <ListCard
      title="员工职级管理"
      :columns="columns"
      :api="{ list: getStaffPage }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      :treeFlag="true"
      ref="list"
    >
      <!-- <template #tableTopRender>
        <a-col />
        <a-col>
          <a-button type="primary" class="flex-items-center" @click="add">
            <SvgRaw name="icon_add" />
            新增记录
          </a-button>
        </a-col>
      </template> -->
      1
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
import { updateStaff } from '@/api/basicInfo';
import { getStaffPage } from '@/api/basicInfo';
import {
  OrderStatusEnum,
  OverTimeFlagEnum,
  RoleRankEnum,
  DepartmentEnum,
} from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData } from '@/utils/translate';
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
    title: '职级',
    dataIndex: 'roleId',
    key: 'roleId',
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
const staff = ref({
  id: '',
  userName: '',
  pid: undefined,
  pidName: undefined,
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
];

function deptChange(value, option) {
  staff.value.deptName = option.label;
}
function rankChange(value, option) {
  staff.value.roleName = option.label;
}

function staffChange(value, option) {
  staff.value.pidName = option.label;
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
