<template>
  <div>
    <ListCard
      title="申报记录总表"
      :filters="filters"
      :columns="columns"
      :api="{ list: getTimeSheetPage }"
      :needParamsCache="true"
      :params="{
        staffCode: id,
      }"
      :btnInfo="btnInfo"
      ref="list"
    >
      <template #tableTopRender>
        <a-col />
        <a-col>
          <a-button
            type="primary"
            class="flex-items-center"
          >
            <SvgRaw name="icon_add" />
            新增申请
          </a-button>
        </a-col>
      </template>
    </ListCard>
  </div>
</template>

<script lang="ts" setup>
import { getTimeSheetPage } from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import { BtnInfoType } from '@/enums/formEnum';

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
    title: '工时',
    dataIndex: 'acturalHours',
    key: 'acturalHours',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
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
  {
    label: '提交时间',
    type: 'date-range',
    prop: 'date',
  },
  // {
  //   label: '请输入单号',
  //   type: 'input',
  //   prop: 'id',
  //   length: 10,
  // },
  {
    label: '请输入项目编号',
    type: 'input',
    prop: 'projectId',
    length: 10,
  },
  {
    label: '请选择工单状态',
    type: 'select',
    prop: 'status',
    showSearch: true,
    options: [],
  },

  // {
  //   label: '更新时间',
  //   type: 'date-range',
  //   prop: 'lastUpdateTime',
  // },
];
const btnInfo: BtnInfoType[] = [
  // {
  //   operationType: 'edit',
  //   text: '修改',
  //   onClick(record) {
  //   },
  // },
];
</script>