<template>
  <div style="border: 2px solid #fff">
    <div>
      <div>员工个人信息</div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef"
        layout="vertical"
        :model="PersonalFormState"
      >
        <a-row :gutter="84" class="tab-form">
          <a-col :span="8">
            <a-form-item label="姓名" name="userName">
              <a-input v-model="PersonalFormState.userName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="英文名" name="englishName">
              <a-input v-model="PersonalFormState.englishName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别" name="gender">
              <a-select
                v-model:value="PersonalFormState.gender"
                allowClear
                show-search
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件类型" name="documentType">
              <a-select
                v-model:value="PersonalFormState.documentType"
                allowClear
                show-search
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件号" name="documentNumber">
              <a-input v-model="PersonalFormState.documentNumber" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="婚姻状况" name="maritalStatus">
              <a-select
                v-model:value="PersonalFormState.maritalStatus"
                allowClear
                show-search
                optionFilterProp="label"
                :options="enumToObjArray(MaritalStatusEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="民族" name="ethnicGroup">
              <a-input v-model="PersonalFormState.ethnicGroup" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="政治面貌" name="politicalOutlook">
              <a-input
                v-model="PersonalFormState.politicalOutlook"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
    </div>
    <div>
      <div>护照信息</div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef"
        layout="vertical"
        :model="PassportFormState"
      >
        <a-row :gutter="84" class="tab-form">
          <a-col :span="8">
            <a-form-item label="护照号码" name="number">
              <a-input v-model="PassportFormState.number" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="护照签发日期" name="startTime">
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
            <a-form-item label="护照过期日期" name="endTime">
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
            <a-form-item label="护照签发国" name="country">
              <a-input v-model="PassportFormState.country" allowClear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
    </div>
    <div>
      <div>联系信息</div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef"
        layout="vertical"
        :model="PersonalFormState"
      >
        <a-row :gutter="84" class="tab-form">
          <a-col :span="8">
            <a-form-item label="居住地址" name="userName">
              <a-input v-model="PersonalFormState.userName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮编" name="englishName">
              <a-input v-model="PersonalFormState.englishName" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="通讯地址" name="documentNumber">
              <a-input v-model="PersonalFormState.documentNumber" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮编" name="ethnicGroup">
              <a-input v-model="PersonalFormState.ethnicGroup" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="移动电话" name="politicalOutlook">
              <a-input
                v-model="PersonalFormState.politicalOutlook"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="办公邮箱" name="politicalOutlook">
              <a-input
                v-model="PersonalFormState.politicalOutlook"
                allowClear
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
const PersonalFormState = reactive({
  userName: '',
  englishName: '',
  nationality: '',
  gender: '',
  documentType: undefined,
  documentNumber: '',
  maritalStatus: undefined,
  ethnicGroup: '',
  politicalOutlook: '',
});
const PassportFormState = reactive({
  number: '',
  startTime: undefined,
  endTime: '',
  country: '',
});
</script>
