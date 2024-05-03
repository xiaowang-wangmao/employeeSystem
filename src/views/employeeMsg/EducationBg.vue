<template>
  <div style="border: 2px solid #fff">
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>教育背景</div>
        <a-button
          type="primary"
          v-if="DisableFlag"
          @click="DisableFlag = !DisableFlag"
        >
          修改</a-button
        >
        <div v-else>
          <a-button type="primary" @click="save" style="margin-right: 5px"
            >保存</a-button
          >
          <a-button @click="DisableFlag = true" style="margin-right: 5px"
            >取消</a-button
          >
          <a-button
            type="primary"
            @click="add"
            v-if="!DisableFlag"
            style="background-color: #c4d600"
          >
            新增</a-button
          >
        </div>
      </div>
      <a-divider />
      <a-form ref="formRef" layout="vertical" :model="EducationList[0]">
        <a-row :gutter="68" class="tab-form">
          <a-col :span="8">
            <a-form-item label="机构地址" name="address">
              <a-input
                v-model:value="EducationList[0].address"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="机构名称" name="organizationName">
              <a-input
                v-model:value="EducationList[0].organizationName"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="专业类别" name="professionalCategory">
              <a-select
                v-model:value="EducationList[0].professionalCategory"
                allowClear
                show-search
                :disabled="DisableFlag"
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="专业名称" name="professionalName">
              <a-input
                v-model:value="EducationList[0].professionalName"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学位" name="degree">
              <a-select
                v-model:value="EducationList[0].degree"
                :disabled="DisableFlag"
                allowClear
                show-search
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="开始日期" name="startTime">
              <a-date-picker
                v-model:value="EducationList[0].startTime"
                :disabled="DisableFlag"
                style="width: 100%"
                allowClear
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束日期" name="endTime">
              <a-date-picker
                v-model:value="EducationList[0].endTime"
                :disabled="DisableFlag"
                style="width: 100%"
                allowClear
                value-format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />

      <div v-for="(item, index) in EducationList.slice(1)" v-if="EducationList.length>1">
        <a-form ref="formRef" layout="vertical" :model="item">
          <a-row :gutter="68" class="tab-form">
            <a-col :span="8">
              <a-form-item label="机构地址" name="address">
                <a-input
                  v-model:value="item.address"
                  :disabled="DisableFlag"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="机构名称" name="organizationName">
                <a-input
                  v-model:value="item.organizationName"
                  :disabled="DisableFlag"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="专业类别" name="endTime">
                <a-select
                  v-model:value="item.professionalCategory"
                  allowClear
                  :disabled="DisableFlag"
                  show-search
                  optionFilterProp="label"
                  :options="enumToObjArray(GenderEnum)"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="专业名称" name="professionalName">
                <a-input
                  v-model:value="item.professionalName"
                  :disabled="DisableFlag"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="学位" name="degree">
                <a-select
                  v-model:value="item.degree"
                  allowClear
                  :disabled="DisableFlag"
                  show-search
                  optionFilterProp="label"
                  :options="enumToObjArray(GenderEnum)"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="开始日期" name="startTime">
                <a-date-picker
                  v-model:value="item.startTime"
                  style="width: 100%"
                  :disabled="DisableFlag"
                  allowClear
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="结束日期" name="endTime">
                <a-date-picker
                  v-model:value="item.endTime"
                  :disabled="DisableFlag"
                  style="width: 100%"
                  allowClear
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div style="display: flex; justify-content: flex-end">
          <a-button
            type="primary"
            @click="deleteCurrent(index)"
            danger
            v-if="!DisableFlag"
          >
            删除</a-button
          >
        </div>

        <a-divider />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GenderEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import dayjs, { Dayjs } from 'dayjs';

import { pickBasicData } from '@/utils/translate';
import {
  deleteEducation,
  getStaffInfo,
  updateEducation,
} from '@/api/basicInfo';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';

const id = localStorage.getItem('staffCode');
let EducationList = ref([
  {
    code: '',
    address: '11',
    organizationName: '',
    professionalCategory: '',
    professionalName: '',
    degree: '',
    startTime: '',
    endTime: '',
    staffCode:id,
  },
]);
const DisableFlag = ref(true);

function add() {
  const t = {
    code: '',
    address: '',
    organizationName: '',
    professionalCategory: '',
    professionalName: '',
    degree: '',
    startTime: '',
    endTime: '',
    staffCode:id,
  };
  EducationList.value.push(t);

  console.log(EducationList.value,'trete');
  
}
function save() {
    console.log(EducationList.value,'fhthr');
  updateEducation({ id, educationBackList: EducationList.value }).then(
    (res) => {
      console.log('update', res);
      EducationList.value = res;
      DisableFlag.value = true;
    }
  );
}
function deleteCurrent(index: number) {
  const value = EducationList.value[index+1];
  Modal.confirm({
    title: 'Are you sure delete this record?',
    icon: createVNode(ExclamationCircleOutlined),
    content: 'Some descriptions',
    okText: 'Yes',
    okType: 'danger',
    cancelText: 'No',
    onOk() {
      if (!value.code) {
        console.log('直接删除');
        EducationList.value.splice(index+1, 1);
      } else {
        deleteEducation({ staffCode: id, code: value.code }).then((res) => {
          console.log('delete', res);
          EducationList.value = res;
        });
      }
    },
    onCancel() {
      console.log('Cancel');
    },
  });
}

onMounted(() => {
  getStaffInfo({ id }).then((res) => {
    if (res.educationBackList.length > 0) {
      EducationList.value = res.educationBackList;
    }
  });
});
</script>

<!-- <style>
</style> -->
