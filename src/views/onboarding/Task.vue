<template>
  <div>
    <ListCard
      title="我的任务"
      :columns="columns"
      :api="{ list: myTaskPage }"
      :params="{
        staffCode: id,
      }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      ref="list"
    >
    </ListCard>
    <a-modal v-model:visible="visibleFlag" title="详情" width="600px">
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
  </div>
</template>

<script lang="ts" setup>
import { BtnInfoType } from '@/enums/formEnum';
import { getStaffList } from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import { nextTick } from 'vue';
import { myTaskPage, planDetails } from '@/api/train';
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

const staffOptions = ref([]);
const DisableFlag = ref(true);
const formRef = ref();
const list = ref();
const router = useRouter();
const userName = ref(localStorage.getItem('userName'));
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const rank = ref(localStorage.getItem('rank'));
const columns = [
  {
    title: '任务编号',
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
    title: '分数',
    dataIndex: 'score',
    key: 'score',
    width: 120,
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
    width: 180,
  },
];
// const filters = [
//   {
//     label: '请选择负责人',
//     type: 'select',
//     prop: 'staffCode',
//     showSearch: true,
//     options: staffOptions,
//   },
//   {
//     label: '请选择部门',
//     type: 'select',
//     prop: 'deptId',
//     showSearch: true,
//     options: enumToObjArray(DepartmentEnum),
//   },
// ];
const task = ref({
  id: '',
  name: '',
  activity: '',
  title: '',
  publishDeptName: '',
  publishDeptCode: '',
  content: '',
});
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
  endTime: '',
});
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'view',
    text: '查看详情',
    async onClick(record) {
      task.value = record;
      const res = await planDetails({ id: record.planId });
      plan.value = res;
      visibleFlag.value = true;
      // DisableFlag.value = false;
    },
  },

  {
    operationType: 'view',
    text: '开始学习',
    visible(row) {
      return row.status !== 2;
    },
    onClick(record) {
      task.value = record;
      router.push({
        path: '/train/train',
        query: { planId: record.planId, taskId: record.id },
      });
    },
  },
  {
    operationType: 'view',
    text: '继续学习',
    visible(row) {
      return row.status === 2;
    },
    onClick(record) {
      task.value = record;
      router.push({
        path: '/train/train',
        query: { planId: record.planId, taskId: record.id },
      });
    },
  },
  // {
  //   operationType: 'delete',
  //   text: '删除',
  //   visible() {
  //     return rank.value === '0';
  //   },
  //   onClick(record) {
  //     task.value = record;
  //     Modal.confirm({
  //       title: '你确定要删除该条通知?',
  //       icon: createVNode(ExclamationCircleOutlined),
  //       content: createVNode(
  //         'div',
  //         { style: 'color:red;' },
  //         '该操作为不可逆操作，请谨慎选择'
  //       ),
  //       onOk() {
  //         deleteNotice({ id: record.id }).then((res) => {
  //           if (res === 'success') {
  //             message.error('删除成功');
  //             list.value.fetch();
  //           }
  //         });
  //       },
  //       onCancel() {},
  //       class: 'test',
  //     });
  //   },
  // },
];

const handleOK = async () => {
  // const res = await updateNotice(task.value);
  // if (res === 'success') {
  //   message.success('操作成功');
  //   visibleFlag.value = false;
  //   list.value.fetch();
  // } else {
  //   message.error('操作失败，请重试');
  // }
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
