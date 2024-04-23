<template>
  <div style="border: 2px solid #fff">
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>紧急联系人</div>
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
      <a-form ref="formRef" layout="vertical" :model="contactList[0]">
        <a-row :gutter="68" class="tab-form">
          <a-col :span="8">
            <a-form-item label="姓名" name="name">
              <a-input
                v-model:value="contactList[0].name"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别" name="gender">
              <a-select
                v-model:value="contactList[0].gender"
                allowClear
                show-search
                :disabled="DisableFlag"
                optionFilterProp="label"
                :options="genderOptions"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="关系" name="relationship">
              <a-select
                v-model:value="contactList[0].relationship"
                allowClear
                show-search
                :disabled="DisableFlag"
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="联系电话" name="tel">
              <a-input
                v-model:value="contactList[0].tel"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="通讯地址" name="mailingAddress">
              <a-input
                v-model:value="contactList[0].mailingAddress"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮政编码" name="postalCode">
              <a-input
                v-model:value="contactList[0].postalCode"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />

      <div v-for="(item, index) in contactList.slice(1)">
        <a-form ref="formRef" layout="vertical" :model="item">
          <a-row :gutter="68" class="tab-form">
            <a-col :span="8">
              <a-form-item label="姓名" name="name">
                <a-input
                  v-model:value="item.name"
                  :disabled="DisableFlag"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="性别" name="gender">
                <a-input
                  v-model:value="item.gender"
                  :disabled="DisableFlag"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="关系" name="postalCode">
                <a-select
                  v-model:value="item.relationship"
                  allowClear
                  :disabled="DisableFlag"
                  show-search
                  optionFilterProp="label"
                  :options="enumToObjArray(GenderEnum)"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="联系电话" name="tel">
                <a-input
                  v-model:value="item.tel"
                  :disabled="DisableFlag"
                  allowClear
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
            <a-form-item label="通讯地址" name="mailingAddress">
              <a-input
                v-model:value="item.mailingAddress"
                :disabled="DisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮政编码" name="postalCode">
              <a-input
                v-model:value="item.postalCode"
                :disabled="DisableFlag"
                allowClear
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
  updateContactList,
} from '@/api/basicInfo';
import type { SelectProps } from 'ant-design-vue';
const genderOptions = ref<SelectProps['options']>(enumToObjArray(GenderEnum));
const id = localStorage.getItem('staffCode');
let contactList = ref([
  {
    code: '',
    name: '11',
    gender: '',
    relationship: '',
    tel: '',
    mailingAddress: '',
    postalCode: '',
    staffCode:id,
  },
]);
const DisableFlag = ref(true);

function add() {
  const t = {
    code: '',
    name: '',
    gender: '',
    relationship: '',
    tel: '',
    mailingAddress: '',
    startTime: '',
    postalCode: '',
    staffCode:id,
  };
  contactList.value.push(t);
}
function save() {
  console.log(contactList.value,'lll');
  
  updateContactList({ id, contactList: contactList.value }).then((res) => {
    console.log('update', res);
    contactList.value = res;
    DisableFlag.value = true;
  });
}
function deleteCurrent(index: number) {
  const value = contactList.value[index + 1];
  console.log('删除的数据', value);
  if (!value.code) {
    console.log('直接删除');

    contactList.value.splice(index + 1, 1);
  } else {
    deleteEducation({ staffCode: id, code: value.code }).then((res) => {
      console.log('delete', res);
      contactList.value = res;
    });
  }
}

onMounted(() => {
  getStaffInfo({ id }).then((res) => {
    if (res.contactList.length > 0) {
      contactList.value = res.contactList;
      console.log(contactList.value);
    }
  });
  
});
</script>

<!-- <style>
</style> -->
