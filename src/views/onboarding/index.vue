<template>
  <div>
    <div style="margin-bottom: 20px" v-if="rank==='0'">
      <DCUpload
        type="primary"
        :ghost="false"
        :showRouteButton="false"
        icon="icon_upload"
        :buttonText="'上传文件'"
        :showButtonText="'上传文件'"
        :title="'上传文件'"
        :tip="'注意：仅支持pdf或pptx等文件格式。'"
        accept=".pdf,.pptx"
        :show-api-error-msg="true"
        :uploadApi="uploadApi"
        @update="handleUploadSuccess"
        :limit-size="10"
      >
      </DCUpload>
    </div>
    <a-list :grid="{ gutter: 16, column: 4 }" :data-source="data">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-card>
            <template #title>
              <div style="display: flex; justify-content: space-between">
                <div>{{ item.title }}</div>
                <a-button danger @click=deleteItem(item.id) v-if="rank==='0'">删除</a-button>
              </div>
            </template>

            <a-tooltip>
              <template #title>点击即可下载至本地</template>
              <div style="cursor: pointer; color: #0764E6;" @click="download(item)">{{ item.fileName }}</div>
            </a-tooltip>
            
          </a-card>
        </a-list-item>
      </template>
    </a-list>

  </div>
</template>

<script lang="ts" setup>

import { getProjectList, getStaffList } from '@/api/timesheet';
import { downloadFile } from "@/utils/common";
import { uploadApi, getFilesList ,deleteFile} from '@/api/common';
import { updateStaff } from '@/api/basicInfo';
import { RoleRankEnum, DepartmentEnum } from '@/enums/optionsEnum';
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
const data = ref([
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
]);

const rank = ref(localStorage.getItem('rank'));

function download(file:any) {
  downloadFile("/files/" + file.fileName, file.fileName);
}

function deleteItem(id){
  deleteFile({ id: id }).then((res) => {
    if (res === 'success') {
      message.success('操作成功');
      getFileListData();
      } else {
        message.error('操作失败');
      }
  })
}


// 文件上传成功后的回调函数
function handleUploadSuccess(data: any) {
  console.log(data);
  getFileListData();
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

function getFileListData() {
  getFilesList({}).then((res) => {
    console.log(res);
    data.value = res.map((i) => {
      return {
        title: i.fileName.split('.')[0],
        ...i,
      };
    });
  });
}
onMounted(() => {
  getStaffListData();
  getFileListData();
});
</script>
