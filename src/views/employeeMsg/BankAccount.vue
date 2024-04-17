<template>
  <div style="border: 2px solid #fff">
    <div>
      <div>银行信息：工资银行账户</div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 10 }"
        :model="PersonalFormState"
      >
        <a-form-item label="收款人" name="userName">
          <a-input v-model="PersonalFormState.userName" allowClear />
        </a-form-item>
        <a-form-item label="银行名称" name="userName">
          <a-input v-model="PersonalFormState.userName" allowClear />
        </a-form-item>
        <a-form-item label="银行账号" name="userName">
          <a-input v-model="PersonalFormState.userName" allowClear />
        </a-form-item>
        <a-form-item label="备注" name="userName">
          <a-input v-model="PersonalFormState.userName" allowClear />
        </a-form-item>
      </a-form>
      <a-divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GenderEnum, MaritalStatusEnum } from '@/enums/optionsEnum';
import { enumToObjArray } from '@/utils/translate';
import dayjs, { Dayjs } from 'dayjs';

const disabledDate = (current: Dayjs) =>
  current && current < dayjs().subtract(1, 'days').endOf('day');
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
</script>
