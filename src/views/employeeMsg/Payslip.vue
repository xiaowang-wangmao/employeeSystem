<template>
  <div style="border: 2px solid #fff">
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>银行信息：工资银行账户</div>
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
      <a-divider />
      <a-form
        ref="formRef"
        :label-col="{ span: 2 }"
        :wrapper-col="{ span: 10 }"
        :model="BankAccount"
      >
        <a-form-item label="收款人" name="payee" required>
          <a-input
            v-model:value="BankAccount.payee"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="银行名称" name="bankName" required>
          <a-input
            v-model:value="BankAccount.bankName"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="银行账号" name="bankNumber" required>
          <a-input
            v-model:value="BankAccount.bankNumber"
            :disabled="DisableFlag"
            allowClear
          />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-input
            v-model:value="BankAccount.remark"
            :disabled="DisableFlag"
            allowClear
          />
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

const BankAccount = reactive({
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
    updateBank({ bankAccount: { ...values }, id: id }).then((res) => {
      console.log(res);
      pickBasicData(BankAccount, res);
      DisableFlag.value = true;
    });
  });
}
onMounted(() => {
  getStaffInfo({ id: id }).then((res) => {
    pickBasicData(BankAccount, res.bankAccount);
  });
});
</script>
