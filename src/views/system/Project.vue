<template>
  <div>
    <ListCard
      title="审批清单"
      :filters="filters"
      :columns="columns"
      :api="{ list: getApprovalTimeSheetList }"
      :needParamsCache="true"
      :params="{
        staffCode: id,
      }"
      :handleListCardFooter="false"
      :btnInfo="btnInfo"
      ref="list"
    />
    <a-modal
      v-model:visible="ApprovalVisible"
      title="审批意见"
      @ok="handleApproval"
    >
      <a-textarea v-model:value="approvalMsg" :rows="3" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import {
  getApprovalTimeSheetList,
  approvalPass,
  approvalOverruled,
} from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import { BtnInfoType } from '@/enums/formEnum';
import { OrderStatusEnum, OverTimeFlagEnum } from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData } from '@/utils/translate';
import { message } from 'ant-design-vue';

const list = ref();
const ApprovalVisible = ref(false);
const approvalMsg = ref();
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
    dataIndex: 'projectName',
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
      if (text) {
        return h('span', {}, OrderStatusEnum[text]);
      }
      return h('span', {}, '-');
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
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
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
  {
    label: '请输入项目编号',
    type: 'input',
    prop: 'projectId',
    length: 10,
  },
  {
    label: '请选择申请人',
    type: 'select',
    prop: 'status',
    showSearch: true,
    options: [],
  },
  {
    label: '请选择工单状态',
    type: 'select',
    prop: 'status',
    showSearch: true,
    options: enumToObjArray(OrderStatusEnum),
  },
  {
    label: '提交时间',
    type: 'date-range',
    prop: 'date',
  },
];
async function handleApproval(id: Number) {
  const res = await approvalOverruled({
    timesheetId: id,
    msg: approvalMsg.value,
  });
  if (res === 'success') {
    message.success('操作成功');
    list.value.fetch();
  } else {
    message.error('操作失败，请重试');
  }
}
const btnInfo: BtnInfoType[] = [
  {
    operationType: 'aggree',
    text: '通过',
    disabled(row) {
      return row.status != 1;
    },
    async onClick(record) {
      approvalMsg.value = 'aggree'; //同意默认意见
      const res = await approvalPass({
        timesheetId: record.id,
        msg: approvalMsg.value,
      });
      if (res === 'success') {
        message.success('操作成功');
        list.value.fetch();
      } else {
        message.error('操作失败，请重试');
      }
    },
  },
  {
    operationType: 'disagrre',
    text: '驳回',
    disabled(row) {
      return row.status != 1;
    },
    async onClick(record) {
      ApprovalVisible.value = true;
      handleApproval(record.id);
    },
  },
];
</script>
