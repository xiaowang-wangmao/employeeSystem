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
          <a-button type="primary" @click="add" v-if="!DisableFlag"
          style="background-color: #c4d600">
            新增</a-button
          >
        </div>
      </div>
      <a-divider />
      <a-form ref="formRef" layout="vertical" :model="EducationList[0]">
        <a-row :gutter="68" class="tab-form">
          <a-col :span="8">
            <a-form-item label="机构地址" name="address">
              <a-input v-model="EducationList[0].address" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="机构名称" name="organizationName">
              <a-input v-model="EducationList[0].organizationName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="专业类别" name="professionalCategory">
              <a-select
                v-model:value="EducationList[0].professionalCategory"
                allowClear
                show-search
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="专业名称" name="professionalName">
              <a-input v-model="EducationList[0].professionalName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学位" name="degree">
              <a-select
                v-model:value="EducationList[0].degree"
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
                style="width: 100%"
                allowClear
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束日期" name="endTime">
              <a-date-picker
                v-model:value="EducationList[0].startTime"
                style="width: 100%"
                allowClear
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />

      <div v-for="(item, index) in EducationList.slice(1)">
        <a-form ref="formRef" layout="vertical" :model="item">
          <a-row :gutter="68" class="tab-form">
            <a-col :span="8">
              <a-form-item label="机构地址" name="number">
                <a-input v-model="item.address" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="机构名称" name="number">
                <a-input v-model="item.organizationName" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="专业类别" name="endTime">
                <a-select
                  v-model:value="item.professionalCategory"
                  allowClear
                  show-search
                  optionFilterProp="label"
                  :options="enumToObjArray(GenderEnum)"
                />
              </a-form-item>
            </a-col>
            <!-- <a-col :span="8">
            <a-form-item label="专业名称" name="number">
              <a-input v-model="PassportFormState.number" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="学位" name="endTime">
              <a-select
                v-model:value="PassportFormState.gender"
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
                v-model:value="PassportFormState.startTime"
                style="width: 100%"
                allowClear
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="结束日期" name="endTime">
              <a-date-picker
                v-model:value="PassportFormState.startTime"
                style="width: 100%"
                allowClear
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col> -->
          </a-row>
        </a-form>
        <div style="display: flex; justify-content: flex-end">
          <a-button type="primary" @click="deleteCurrent(index)" danger v-if="!DisableFlag">
            删除</a-button
          >
        </div>

        <a-divider />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GenderEnum, MaritalStatusEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import dayjs, { Dayjs } from 'dayjs';

const disabledDate = (current: Dayjs) =>
  current && current < dayjs().subtract(1, 'days').endOf('day');
const EducationList = reactive([
  {
    address: '',
    organizationName: '',
    professionalCategory: '',
    professionalName: '',
    degree: '',
    startTime: '',
    endTime: '',
  },
]);
const DisableFlag = ref(true);

function add() {
  const t = {
    address: '',
    organizationName: '',
    professionalCategory: '',
    professionalName: '',
    degree: '',
    startTime: '',
    endTime: '',
  };
  EducationList.push(t);
}

function deleteCurrent(index:number){
  EducationList.splice(index, 1);
}
</script>

<!-- <style>
</style> -->
