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
                :options="documentTypeOptions"
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
              <a-select
                v-model:value="PersonalFormState.ethnicGroup"
                :disabled="OneDisableFlag"
                :options="nationDataList"
                allowClear
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="政治面貌" name="politicalOutlook">
              <a-select
                v-model:value="PersonalFormState.politicalOutlook"
                allowClear
                :disabled="OneDisableFlag"
                :options="politicalOutlookOptions"
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
const documentTypeOptions = [
  '居民身份证',
  '港澳居民来往内地通行证',
  '台湾居民来往大陆通行证',
  '外国人居留证',
  '军官证',
].map((i) => ({ label: i, value: i }));
const nationDataList = [
  { value: '汉族', label: '汉族' },

  { value: '蒙古族', label: '蒙古族' },

  { value: '回族', label: '回族' },

  { value: '藏族', label: '藏族' },

  { value: '维吾尔族', label: '维吾尔族' },

  { value: '苗族', label: '苗族' },

  { value: '彝族', label: '彝族' },

  { value: '壮族', label: '壮族' },

  { value: '布依族', label: '布依族' },

  { value: '朝鲜族', label: '朝鲜族' },

  { value: '满族', label: '满族' },

  { value: '侗族', label: '侗族' },

  { value: '瑶族', label: '瑶族' },

  { value: '白族', label: '白族' },

  { value: '土家族', label: '土家族' },

  { value: '哈尼族', label: '哈尼族' },

  { value: '哈萨克族', label: '哈萨克族' },

  { value: '傣族', label: '傣族' },

  { value: '黎族', label: '黎族' },

  { value: '傈僳族', label: '傈僳族' },

  { value: '佤族', label: '佤族' },

  { value: '畲族', label: '畲族' },

  { value: '高山族', label: '高山族' },

  { value: '拉祜族', label: '拉祜族' },

  { value: '水族', label: '水族' },

  { value: '东乡族', label: '东乡族' },

  { value: '纳西族', label: '纳西族' },

  { value: '景颇族', label: '景颇族' },

  { value: '柯尔克孜族', label: '柯尔克孜族' },

  { value: '土族', label: '土族' },

  { value: '达翰尔族', label: '达翰尔族' },

  { value: '么佬族', label: '么佬族' },

  { value: '羌族', label: '羌族' },

  { value: '羌族', label: '羌族' },

  { value: '撒拉族', label: '撒拉族' },

  { value: '毛南族', label: '毛南族' },

  { value: '仡佬族', label: '仡佬族' },

  { value: '锡伯族', label: '锡伯族' },

  { value: '阿昌族', label: '阿昌族' },

  { value: '普米族', label: '普米族' },

  { value: '塔吉克族', label: '塔吉克族' },

  { value: '怒族', label: '怒族' },

  { value: '乌孜别克族', label: '乌孜别克族' },

  { value: '俄罗斯族', label: '俄罗斯族' },

  { value: '鄂温克族', label: '鄂温克族' },

  { value: '德昂族', label: '德昂族' },

  { value: '保安族', label: '保安族' },

  { value: '裕固族', label: '裕固族' },

  { value: '京族', label: '京族' },

  { value: '塔塔尔族', label: '塔塔尔族' },

  { value: '独龙族', label: '独龙族' },

  { value: '鄂伦春族', label: '鄂伦春族' },

  { value: '赫哲族', label: '赫哲族' },

  { value: '门巴族', label: '门巴族' },

  { value: '珞巴族', label: '珞巴族' },

  { value: '基诺族', label: '基诺族' },
   { value: '其他', label: '其他' },
];
const politicalOutlookOptions = [
  '中共党员', '中共预备党员', '共青团员', '无党派人士', '群众'
].map((i) => ({ label: i, value: i }));
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
    updateBasic({ id: id, basicInfo: { ...values } }).then((res) => {
      console.log(res, 'res222');
      pickBasicData(PersonalFormState, res);
      OneDisableFlag.value = true;
    });
  });
}
function saveTwo() {
  formRef2.value.validate().then((values: any) => {
    updatePassport({ id: id, passportInfo: { ...values } }).then((res) => {
      console.log(res, 'res222');
      pickBasicData(PassportFormState, res);
      TwoDisabledFlag.value = true;
    });
  });
}
function saveThree() {
  formRef3.value.validate().then((values: any) => {
    updateContact({ id: id, contactInfo: { ...values } }).then((res) => {
      console.log(res, 'res222');
      pickBasicData(ContactFormState, res);
      ThreeDisableFlag.value = true;
    });
  });
}
</script>,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
