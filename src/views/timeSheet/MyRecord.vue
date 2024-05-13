<template>
  <div>
    <ListCard
      :title="'申报记录'"
      :filters="filters"
      :columns="columns"
      :api="{ list: getTimeSheetPage }"
      :needParamsCache="true"
      :params="{
        staffCode: id,
      }"
      :needExport="true"
      :btnInfo="btnInfo"
      ref="list"
    />
  </div>
</template>

<script lang="ts" setup>
import { getProjectList, getTimeSheetPage } from '@/api/timesheet';
import Time from '@/components/Time/index.vue';
import { BtnInfoType } from '@/enums/formEnum';
import { OrderStatusEnum } from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData } from '@/utils/translate';

const id = Number(localStorage.getItem('staffCode'));
const projectOptions = ref([]);
const columns = [
  {
    title: '单号',
    dataIndex: 'id',
    key: 'id',
    width:130,
  },
  {
    title: '项目编号',
    dataIndex: 'projectId',
    key: 'projectId',
    width:130,
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    width:130,
  },
  {
    title: '负责人',
    dataIndex: 'approvalName',
    width:130,
  },

  {
    title: '工时',
    dataIndex: 'actualHours',
    key: 'actualHours',
    width:130,
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
    width:130,
    customRender: ({ text }) => {
      if (text) {
        return h('span', {}, OrderStatusEnum[text]);
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '工作地点',
    dataIndex: 'workLocation',
    key: 'workLocation',
    width:130,
  },
  {
    title: '摘要',
    dataIndex: 'remark',
    key: 'remark',
    width:230,
  },
  {
    title: '提交时间',
    dataIndex: 'date',
    key: 'date',
    width:200,
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
    width:200,
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD' });
      }
      return h('span', {}, '-');
    },
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   fixed:'right',
  // }
];
const filters = [
  {
    label: '提交时间',
    type: 'date-range',
    prop: 'date',
  },
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

];
const btnInfo: BtnInfoType[] = [
  // {
  //   operationType: 'edit',
  //   text: '修改',
  //   onClick(record) {
  //   },
  // },
];
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
onMounted(() => {
  getProjectListData();
})
</script>
