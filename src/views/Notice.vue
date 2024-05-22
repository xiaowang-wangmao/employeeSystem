<template>
  <div>
    <ListCard
      title="系统通知公告"
      :columns="columns"
      :filters="filters"
      :api="{ list: noticePage }"
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
        <a-form-item label="内容" name="content" v-if="!DisableFlag">
          <div
            style="
              border: 1px solid #dcdfe6;
              width: 100%;
              border-radius: 4px;
              margin-bottom: 10px;
            "
          >
            <toolbar
              style="
                border-bottom: 1px solid #dcdfe6;
                width: 100%;
                border-radius: 4px;
              "
              :editor="editorRef"
              :default-config="toolbarConfig"
              mode="default"
            />
            <editor
              v-model="notice.content"
              style="height: 300px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="onCreated"
            />
          </div>
        </a-form-item>
        <a-form-item label="正文" name="content" v-else>
          <div
            style="
              border: 1px solid #dcdfe6;
              width: 100%;
              border-radius: 4px;
              margin-bottom: 10px;
            "
          >
            <editor
              v-model="notice.content"
              style="height: 300px; overflow-y: hidden"
              :default-config="editorConfig"
              mode="default"
              @onCreated="onCreated"
            />
          </div>
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
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { nextTick, shallowRef } from 'vue';
import { noticePage, updateNotice, deleteNotice } from '@/api/common';
import { DepartmentEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import { message } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';

const staffOptions = ref([]);
const editableFalg = ref(false);
const DisableFlag = ref(false);
const formRef = ref();
const list = ref();
const visibleFlag = ref(false);
const id = Number(localStorage.getItem('staffCode'));
const rank = ref(localStorage.getItem('rank'));
const columns = [
  {
    title: '通知编号',
    dataIndex: 'id',
    key: 'id',
    width: 100,
  },
  {
    title: '通知主题',
    dataIndex: 'activity',
    key: 'activity',
    width: 120,
  },
  {
    title: '通知标题',
    dataIndex: 'title',
    key: 'title',
    width: 130,
  },
  {
    title: '公告内容',
    dataIndex: 'content',
    key: 'content',
    width: 230,
    customRender: ({ record }) =>
      h(Ellipsis, { value: record.content, width: 200 }),
  },
  {
    title: '发布时间',
    dataIndex: 'date',
    key: 'date',
    width: 200,
    customRender: ({ text }) => {
      if (text) {
        return h(Time, { time: text, format: 'YYYY-MM-DD HH:mm:ss' });
      }
      return h('span', {}, '-');
    },
  },
  {
    title: '发布部门',
    dataIndex: 'publishDeptName',
    key: 'publishDeptName',
    width: 130,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 150,
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
      editorConfig.value.readOnly = false;
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
      editorConfig.value.readOnly = true;
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

function add() {
  visibleFlag.value = true;
  notice.value = {
    id: '',
    name: '',
    activity: '',
    title: '',
    publishDeptName: '',
    publishDeptCode: '',
    content: '',
  };
}

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

// 富文本实例对象
const editorRef = shallowRef();
// 编辑器配置
const editorConfig = ref({
  placeholder: '请输入文本内容...',
  readOnly: DisableFlag.value, // 只读
  MENU_CONF: {},
});

const toolbarConfig = ref({
  toolbarKeys: [
    'headerSelect',
    'blockquote',
    '|',
    'bold',
    'underline',
    'italic',
    {
      key: 'group-more-style',
      title: '更多',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
      menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle'],
    },
    'color',
    'bgColor',
    '|',
    'fontSize',
    'fontFamily',
    'lineHeight',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    {
      key: 'group-justify',
      title: '对齐',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
      menuKeys: [
        'justifyLeft',
        'justifyRight',
        'justifyCenter',
        'justifyJustify',
      ],
    },
    {
      key: 'group-indent',
      title: '缩进',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
      menuKeys: ['indent', 'delIndent'],
    },
    '|',
    'emotion',
    'insertLink',

    'insertTable',
    'codeBlock',
    'divider',
    '|',
    'undo',
    'redo',
    '|',
  ],
  excludeKeys: [],
  insertKeys: {
    index: 0,
    keys: [],
  },
  modalAppendToBody: false,
});
const onCreated = (editor: any) => {
  editorRef.value = editor;
  nextTick(() => {
    editorRef.value = editor; // 一定要用 Object.seal() ，否则会报错
  });
};
</script>
