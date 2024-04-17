<template>
  <div style="border: 2px solid #fff">
    <div>
      <div>教育背景</div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef"
        layout="vertical"
        :model="PassportFormState"
      >
        <a-row :gutter="68" class="tab-form">
          <a-col :span="8">
            <a-form-item label="机构地址" name="number">
              <a-input v-model="PassportFormState.number" allowClear />
            </a-form-item>
          </a-col>
           <a-col :span="8">
            <a-form-item label="机构名称" name="number">
              <a-input v-model="PassportFormState.number" allowClear />
            </a-form-item>
          </a-col>
           <a-col :span="8">
            <a-form-item label="专业类别" name="endTime">
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
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GenderEnum, MaritalStatusEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import dayjs, { Dayjs } from 'dayjs';

const disabledDate = (current: Dayjs) => current && current < dayjs().subtract(1, 'days').endOf('day');
const PassportFormState = reactive({
  number: '',
  startTime: undefined,
  endTime: '',
  country: '',
});
</script>

<style>
.tab-form {
}
</style>
