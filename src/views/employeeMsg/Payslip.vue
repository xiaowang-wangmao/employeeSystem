<template>
  <div style="border: 2px solid #fff">
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>工资信息</div>
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
          <a-button @click="DisableFlag = true">取消</a-button>
        </div>
      </div>
      <div>！需要二次登录验证！</div>
      <a-divider />
      <a-form
        :model="formState"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 10 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
        class="form"
      >
        <a-form-item
          label="StaffCode"
          name="code"
          :rules="[{ required: true, message: 'Please input your staffCode!' }]"
        >
          <a-input v-model:value="formState.code" />
        </a-form-item>
        <a-form-item
          label="Account"
          name="account"
          :rules="[{ required: true, message: 'Please input your account!' }]"
        >
          <a-input v-model:value="formState.account" />
        </a-form-item>

        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 6, span: 10 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
      <a-divider />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStaffInfo, updateBank } from '@/api/basicInfo';
import { pickBasicData } from '@/utils/translate';
import dayjs, { Dayjs } from 'dayjs';

import { login} from '../../api/user';

const formState = reactive({
  payee: '',
  bankName: '',
  bankNumber: '',
  remark: '',
});
const DisableFlag = ref(true);
const formRef = ref();
const id = localStorage.getItem('staffCode');

function save() {
  formRef.value.validate().then((values:any) => {
    updateBank({ formState: { ...values }, id: id }).then((res) => {
      console.log(res);
      pickBasicData(formState, res);
      DisableFlag.value = true;
    });
  });
}

const onFinish = (values: any) => {
  console.log('Success:', values);
  login(values).then((res) => {
    console.log('11111', res);
    if (res.code == 0) {
    }
  });
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

onMounted(() => {
  getStaffInfo({ id: id }).then((res) => {
    pickBasicData(formState, res.formState);
  });
});
</script>
