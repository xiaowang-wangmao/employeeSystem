<template>
  <div>
    <ListCard
      title="员工账号管理"
      :columns="columns"
      :filters="filters"
      :api="{ list: getStaffPage }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      ref="list"
    >
      <!-- <template #tableTopRender>
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
                class="flex-items-center"
                @click="templateDownload"
                style="text-decoration: underline"
              >
                <SvgRaw name="icon_file" />
                文件模板.xlsx
              </a>
            </template>
          </DCUpload>
        </div>
      </template> -->
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
import { BtnInfoType } from '@/enums/formEnum';
import { getStaffList } from '@/api/timesheet';
import { updateStaff } from '@/api/basicInfo';
import { getStaffPage, deleteStaff } from '@/api/basicInfo';
import { RoleRankEnum, DepartmentEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';


const router = useRouter();
const staffOptions = ref([]);
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
    operationType: 'details',
    text: '详情',
    onClick(record) {
      staff.value = record;
      router.push({
        name:'details',
      })
    },
  },
  {
    operationType: 'delete',
    text: '注销',
    onClick(record) {
      staff.value = record;
      Modal.confirm({
        title: '你确定要注销该账号?',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          'div',
          { style: 'color:red;' },
          '该操作为不可逆操作，请谨慎选择'
        ),
        onOk() {
          deleteStaff({ id: record.id }).then((res) => {
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
