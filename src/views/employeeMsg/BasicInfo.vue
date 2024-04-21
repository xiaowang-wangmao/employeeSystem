<template>
  <div style="border: 2px solid #fff">
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>员工个人信息</div>
        <a-button
          type="primary"
          v-if="OneDisableFlag"
          @click="OneDisableFlag = !OneDisableFlag"
        >
          修改</a-button
        >
        <div v-else>
          <a-button type="primary" @click="saveOne" style="margin-right: 5px"
            >保存</a-button
          >
          <a-button @click="OneDisableFlag = true">取消</a-button>
        </div>
      </div>

      <a-divider />
      <a-form ref="formRef1" layout="vertical" :model="PersonalFormState">
        <a-row :gutter="84" class="tab-form">
          <a-col :span="8">
            <a-form-item label="姓名" name="userName">
              <a-input
                v-model:value="PersonalFormState.userName"
                allowClear
                :disabled="OneDisableFlag"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="英文名" name="englishName">
              <a-input
                v-model:value="PersonalFormState.englishName"
                :disabled="OneDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="性别" name="gender">
              <a-select
                v-model:value="PersonalFormState.gender"
                allowClear
                show-search
                :disabled="OneDisableFlag"
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
                :disabled="OneDisableFlag"
                optionFilterProp="label"
                :options="enumToObjArray(GenderEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="证件号" name="documentNumber">
              <a-input
                v-model:value="PersonalFormState.documentNumber"
                :disabled="OneDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="婚姻状况" name="maritalStatus">
              <a-select
                v-model:value="PersonalFormState.maritalStatus"
                allowClear
                :disabled="OneDisableFlag"
                show-search
                optionFilterProp="label"
                :options="enumToObjArray(MaritalStatusEnum)"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="民族" name="ethnicGroup">
              <a-input
                v-model:value="PersonalFormState.ethnicGroup"
                :disabled="OneDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="政治面貌" name="politicalOutlook">
              <a-input
                v-model:value="PersonalFormState.politicalOutlook"
                allowClear
                :disabled="OneDisableFlag"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
    </div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>护照信息</div>
        <a-button
          type="primary"
          v-if="TwoDisabledFlag"
          @click="TwoDisabledFlag = !TwoDisabledFlag"
        >
          修改</a-button
        >
        <div v-else>
          <a-button type="primary" @click="saveTwo" style="margin-right: 5px"
            >保存</a-button
          >
          <a-button @click="TwoDisabledFlag = true">取消</a-button>
        </div>
      </div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef2"
        layout="vertical"
        :model="PassportFormState"
      >
        <a-row :gutter="84" class="tab-form">
          <a-col :span="8">
            <a-form-item label="护照号码" name="number">
              <a-input
                v-model:value="PassportFormState.number"
                :disabled="TwoDisabledFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="护照签发日期" name="startTime">
              <a-date-picker
                v-model:value="PassportFormState.startTime"
                style="width: 100%"
                allowClear
                :disabled="TwoDisabledFlag"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                :disabled-date="disabledDate"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="护照过期日期" name="endTime">
              <a-date-picker
                v-model:value="PassportFormState.startTime"
                style="width: 100%"
                :disabled="TwoDisabledFlag"
                allowClear
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="护照签发国" name="country">
              <a-input
                v-model:value="PassportFormState.country"
                :disabled="TwoDisabledFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-divider />
    </div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>联系信息</div>
        <a-button
          type="primary"
          v-if="ThreeDisableFlag"
          @click="ThreeDisableFlag = !ThreeDisableFlag"
        >
          修改</a-button
        >
        <div v-else>
          <a-button type="primary" @click="saveThree" style="margin-right: 5px"
            >保存</a-button
          >
          <a-button @click="ThreeDisableFlag = true">取消</a-button>
        </div>
      </div>
      <a-divider />
      <a-form
        class="app-application-basic-info"
        ref="formRef3"
        layout="vertical"
        :model="ContactFormState"
      >
        <a-row :gutter="84" class="tab-form">
          <a-col :span="8">
            <a-form-item label="居住地址" name="residentialAddress">
              <a-input
                v-model:value="ContactFormState.residentialAddress"
                :disabled="ThreeDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮编" name="residentialPostalCode">
              <a-input
                v-model:value="ContactFormState.residentialPostalCode"
                :disabled="ThreeDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="通讯地址" name="mailingAddress">
              <a-input
                v-model:value="ContactFormState.mailingAddress"
                :disabled="ThreeDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="邮编" name="mailingPostalCode">
              <a-input
                v-model:value="ContactFormState.mailingPostalCode"
                :disabled="ThreeDisableFlag"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="移动电话" name="tel">
              <a-input
                v-model:value="ContactFormState.tel"
                allowClear
                :disabled="ThreeDisableFlag"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="办公邮箱" name="workEmail">
              <a-input
                v-model:value="ContactFormState.workEmail"
                allowClear
                :disabled="ThreeDisableFlag"
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
import { getStaffInfo, updateContact, updatePassport } from '@/api/basicInfo';
import { GenderEnum, MaritalStatusEnum } from '@/enums/optionsEnum';
import { enumToObjArray, pickBasicData } from '@/utils/translate';
import dayjs, { Dayjs } from 'dayjs';
import { updateBasic } from '@/api/basicInfo';
import { accountStore } from '../../store/modules/userStore';

const disabledDate = (current: Dayjs) =>
  current && current < dayjs().subtract(1, 'days').endOf('day');

const OneDisableFlag = ref(true);
const TwoDisabledFlag = ref(true);
const ThreeDisableFlag = ref(true);
const PersonalFormState = reactive({
  userName: '',
  englishName: '',
  nationality: '',
  gender: undefined,
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

const ContactFormState = reactive({
  residentialAddress: '',
  residentialPostalCode: '',
  effectiveDate: undefined,
  mailingAddress: '',
  mailingPostalCode: '',
  mailingEffectiveDate: undefined,
  tel: '',
  workEmail: '',
});

const id = localStorage.getItem('staffCode');
const formRef1 = ref();
const formRef2 = ref();
const formRef3 = ref();

onMounted(() => {
  getStaffInfo({ id: id }).then((res) => {
    console.log('res', res);
    pickBasicData(PersonalFormState, res.basicInfo);
    pickBasicData(PassportFormState, res.passportInfo);
    pickBasicData(ContactFormState, res.contactInfo);
  });
});

function saveOne() {
  formRef1.value.validate().then((values: any) => {
    updateBasic({ id: id, basicInfo: { ...values } }).then((res)=> {
      console.log(res, 'res222');
      pickBasicData(PersonalFormState, res);
      OneDisableFlag.value = true;
    })
  });
}
function saveTwo() {
  formRef2.value.validate().then((values: any) => {
    updatePassport({ id: id, passportInfo: { ...values } }).then((res)=> {
      console.log(res, 'res222');
      pickBasicData(PassportFormState, res);
      TwoDisabledFlag.value = true;
    })
  });
}
function saveThree() {
  formRef3.value.validate().then((values: any) => {
    updateContact({ id: id, contactInfo: { ...values } }).then((res)=> {
      console.log(res, 'res222');
      pickBasicData(ContactFormState, res);
      ThreeDisableFlag.value = true;
    })
  });
}
</script>
