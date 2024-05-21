<template>
  <div>
    <div style="cursor: pointer" @click="back()">返回</div>
    <ListCard
      title="任务列表"
      :columns="columns"
      :api="{ list: taskPage }"
      :params="{ planId: planId }"
      :needParamsCache="true"
      :btnInfo="btnInfo"
      ref="list"
    >
    </ListCard>
    <a-modal
      v-model:visible="visibleFlag"
      title="详情"
      @ok="handleOK"
      width="700px"
    >
      <a-form
        ref="formRef"
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 19 }"
        :model="notice"
      >
        <a-form-item label="主题" name="activity">
          <a-input
            v-model:value="notice.activity"
            :placeholder="'请输入'"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="标题" name="title">
          <a-input
            v-model:value="notice.title"
            :placeholder="'请输入'"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="发布部门" name="dept">
          <a-select
            v-model:value="notice.publishDeptCode"
            :placeholder="'请选择'"
            :options="enumToObjArray(DepartmentEnum)"
            :disabled="DisableFlag"
            @change="deptChange"
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
import Time from '@/components/Time/index.vue';
import Ellipsis from '@/components/Ellipsis/index.vue';
import '@wangeditor/editor/dist/css/style.css'; // css样式
import { nextTick } from 'vue';
import { noticePage, updateNotice, deleteNotice } from '@/api/common';
import {
  taskPage,
  addPlan,
  deletePlan,
  bindTask,
  uploadFile,
} from '@/api/train';
import { DepartmentEnum, TrainStatusEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';

const router = useRouter();
const route = useRoute();
const planId = ref();
const staffOptions = ref([]);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const rank = ref(localStorage.getItem('rank'));

router.isReady().then(async () => {
  planId.value = route.query.planId;
});

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
    width: 130,
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
const notice = ref({
  id: '',
  name: '',
  activity: '',
  title: '',
  publishDeptName: '',
  publishDeptCode: '',
  content: '',
});
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'edit',
    text: '编辑',
    visible() {
      return rank.value === '0';
    },
    onClick(record) {
      visibleFlag.value = true;
      DisableFlag.value = false;
      // editorConfig.value.readOnly = false;
      notice.value = record;
    },
  },
  {
    operationType: 'view',
    text: '查看',
    onClick(record) {
      visibleFlag.value = true;
      DisableFlag.value = true;
      notice.value = record;
      // editorConfig.value.readOnly = true;
    },
  },
  {
    operationType: 'delete',
    text: '删除',
    visible() {
      return rank.value === '0';
    },
    onClick(record) {
      notice.value = record;
      Modal.confirm({
        title: '你确定要删除该条通知?',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          'div',
          { style: 'color:red;' },
          '该操作为不可逆操作，请谨慎选择'
        ),
        onOk() {
          deleteNotice({ id: record.id }).then((res) => {
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

function back() {
  router.push({
    path: '/train/plan',
  });
}
// function add() {
//   visibleFlag.value = true;
//   notice.value = {
//     id: '',
//     name: '',
//     activity: '',
//     title: '',
//     publishDeptName: '',
//     publishDeptCode: '',
//     content: '',
//   };
// }

function deptChange(value, option) {
  notice.value.publishDeptName = option.label;
}
const handleOK = async () => {
  const res = await updateNotice(notice.value);
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
const onCreated = (editor: any) => {
  editorRef.value = editor;
  nextTick(() => {
    editorRef.value = editor; // 一定要用 Object.seal() ，否则会报错
  });
};
</script>
