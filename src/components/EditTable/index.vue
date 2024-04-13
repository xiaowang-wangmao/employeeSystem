<template>
  <a-table
    class="app-edit-table"
    :scroll="{ scrollToFirstRowOnChange: true, x: 'max-content', y: props.scrollY }"
    style="width: 100%;"
    :columns="props.columns"
    :data-source="dataSource"
    :pagination="false"
    :rowKey="props.rowKey"
    :rowSelection="props.needRow
      ? {
        selectedRowKeys: props.selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: onSelectChange,
        onSelect: onChangeOneRow,
        getCheckboxProps: (record: any) => ({
          disabled: getResult(props.disableSelect, record, false),
        }),
      } : undefined"
    :locale="{emptyText: 'common.notData'}"
  >
    <template #emptyText>
      <a-empty
        :description="'22'"
        :image="emptyImage"
      />
    </template>
    <template #headerCell="{column}">
      <template v-if="column.needCustomHeader">
        <a-tooltip placement="topRight">
          <template #title>
            {{ column.tip }}
          </template>
          <div style="cursor: pointer;">
            {{ column.title }}
          </div>
          <!-- <SvgRaw name="icon_doubt" class="label-icon" /> -->
        </a-tooltip>
      </template>
    </template>
    <template #bodyCell="{ column, text, record, index }">
      <template v-if="column.key === 'action'">
        <div class="edit_card_body_table_action">
          <slot
            name="actionRender"
            :record="record"
          >
            <div v-if="btnInfo?.length" class="btn-wrapper">
              <span
                v-for="(item,index) in btnInfo.slice(0,showBtnNum)"
                :key="index" >
                <a-popconfirm
                  v-if="item.popconfirm && !checkButtonIfDisable(record,item)"
                  placement="topLeft"
                  :title="item.confirmTitle?item.confirmTitle:
                    `请确认是否${item.code?t(item.code):item.text}？`"
                  @confirm="() => item.onClick(record)"
                >
                  <a-button
                    type="link"
                    :disabled="checkButtonIfDisable(record,item)"
                    v-show="(item.visible?item.visible(record):true)"
                  ><SvgRaw v-if="item.icon" :name="item.icon" />
                    {{ item.code?t(item.code):item.text }}</a-button>
                </a-popconfirm>
                <a-button
                  v-else
                  type="link"
                  v-show="(item.visible?item.visible(record):true)"
                  :disabled="checkButtonIfDisable(record,item)"
                  @click="handelOnClick(record,item)"
                >
                  <SvgRaw v-if="item.icon" :name="item.icon" class="btn-icon" />
                  {{ item.code?t(item.code):item.text }}
                </a-button>
              </span>
              <span><a-popover placement="rightTop" v-if="btnInfo?.length>showBtnNum">
                <template #content>
                  <div>
                    <div
                      v-for="(item,i) in btnInfo" :key="i"
                      v-auth="item.auth">
                      <a-button
                        type="link"
                        v-show="(item.visible?item.visible(record):true)"
                        :disabled="checkButtonIfDisable(record,item)"
                        @click="handelOnClick(record,item)"
                      >
                        <SvgRaw v-if="item.icon" :name="item.icon" class="btn-icon" />
                        {{ item.code?t(item.code):item.text }}
                      </a-button
                      >
                    </div>
                  </div>
                </template>
                <a-button type="link" class="task-list-table_more-action">
                  <SvgRaw name="icon_more_operation" />
                </a-button>
              </a-popover></span>
            </div>
          </slot>
        </div>
      </template>
      <div>
        <div
          v-if="getResult(column.editable, record, false) && isEdit"
          class="editable-cell"
        >
          <div class="editable-cell-input-wrapper">
            <a-form-item
              validateFirst
              :name="[index, column.dataIndex]"
              style="margin-bottom: 0"
              :rules="getResult(props.rulesMap[column.dataIndex], record, [])"
              :class="{'hide-msg': getResult(props.rulesMap[column.dataIndex], record, []).some(
                (rule: { message: string; }: { message: string; }: { message: string; }) => rule.message === '',
              )}"
            >
              <a-select
                v-if="column.type === 'select'"
                :value="record[column.dataIndex]"
                :disabled="getResult(column.disabled, record, false)"
                show-search
                :mode="column.needOtherOptions? 'tags': undefined "
                option-filter-prop="label"
                allowClear
                :options="column.needOtherOptions
                  ? customOptions
                  : getResult(column.options, record, [])"
                style="width: 100%"
                @focus="column.needOtherOptions ? handleBlur(record) : ''"
                @search="(val: string) => {handelSearch(val, column.searchApi)}"
                @change="
                  (e) => {
                    handelFormItemChange(e, [index, column.dataIndex]);
                  }
                "
              />

              <DCSelect
                v-else-if="column.type === 'selectWithInput'"
                :value="record[column.dataIndex]"
                :disabled="getResult(column.disabled, record, false)"
                :options="column.options"
                @change="
                  (e: any) => {
                    handelFormItemChange(e, [index, column.dataIndex]);
                  }
                "
              />
              <a-radio-group
                v-else-if="column.type === 'radio'"
                :value="record[column.dataIndex]"
                :disabled="getResult(column.disabled, record, false)"
                :options="translateArrayProp(column.options, 'label') as any"
                @change="
                  (e: any) => {
                    handelFormItemChange(e, [ index, column.dataIndex]);
                  }
                "
              />
              <a-input-number
                v-else-if="column.type === 'inputNumber'"
                :value="record[column.dataIndex]"
                :disabled="getResult(column.disabled, record, false)"
                :precision="0"
                :prefix="getResult(column.prefix, record)"
                :min="column.min || 0"
                :max="column.max"
                @change="
                  (e: any) => {
                    handelFormItemChange(e, [ index, column.dataIndex]);
                  }
                "
              >
                <template v-if="column.prefixText" #addonBefore>
                  {{ column.prefixText }}
                </template>
                <template v-if="column.suffixText" #addonAfter>
                  {{ column.suffixText }}
                </template>
              </a-input-number>
              <a-date-picker
                v-else-if="column.type === 'date'"
                :value="wrapWithDayjs(record[column.dataIndex])"
                :disabled="getResult(column.disabled, record, false)"
                :valueFormat="getResult(column.format, record, 'YYYY-MM-DD')"
                :format="getResult(column.format, record, 'YYYY-MM-DD')"
                @change="
                  (e) => {
                    handelFormItemChange(e, [index, column.dataIndex]);
                  }
                "
              >
                <template #suffixIcon>
                  <svg-raw name="icon_data_picker" />
                </template>
              </a-date-picker>
              <a-input
                v-else-if="!column.type || column.type === 'input'"
                :value="record[column.dataIndex]"
                :disabled="getResult(column.disabled, record, false)"
                :maxlength="column.limit"
                @change="
                  (e) => {
                    handelFormItemChange(e, [ index, column.dataIndex]);
                  }
                "
              />
            </a-form-item>
          </div>
        </div>
        <div v-else>
          <CustomRender
            v-if="column.customRender"
            :value="column.customRender({ column, text, record, index })"
          />
          <span v-else>{{
            format(text, column.type, translateArrayProp(column.options, 'label'))
          }}</span>
        </div>
      </div>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { RuleObject } from 'ant-design-vue/lib/form';
// import dayjs from 'dayjs';
import { isFunction } from '@/utils/is/is.ts';

import { BtnInfoType } from '@/enums/formEnum';
import emptyImage from '@/assets/images/customEmpty.png';
import { Modal } from 'ant-design-vue';
import { column } from 'element-plus/es/components/table-v2/src/common';
import text from 'element-plus/es/components/text';
import * as dayjs from 'dayjs';

const CustomRender = defineComponent({
  render() {
    return this.$attrs.value;
  },
});

const props = withDefaults(
  defineProps<{
    isEdit: boolean;
    columns?: any[];
    dataSource?: any;
    rulesMap: Record<string, RuleObject[]|((record: any) => RuleObject[])>;
    needRow?: boolean;
    selectedRowKeys?: string[];
    rowKey?: string;
    disableSelect: boolean | ((record: any) => boolean);
    childProp: string;
    checkButtonDisabled?:(record: Record<string, any>, name: string) => boolean;
    btnInfo?: BtnInfoType[];
    showBtnNum?: number;
    scrollY?: number;
  }>(),
  {
    isEdit: false,
    needRow: false,
    selectedRowKeys: () => [],
    rulesMap: () => ({}),
    disableSelect: false,
    childProp: '',
    showBtnNum: 3,
  },
);
function handelOnClick(record: any, btnInfoItem:BtnInfoType) {
  if (btnInfoItem.modalconfirm) {
    Modal.confirm({
      title: btnInfoItem.confirmTitle,
      content: btnInfoItem.confirmContent,
      onOk: () => btnInfoItem.onClick(record),
      iconType: 'info',
      closable: true, // 右上角显示关闭图标
    });
  } else {
    btnInfoItem.onClick(record);
  }
}
// 检查按钮是否可用
function checkButtonIfDisable(record: Record<string, any>, item: { operationType: string; disabled: (arg0: any) => any; }):boolean {
  const globalDisabled = props.checkButtonDisabled
    ? props.checkButtonDisabled(record, item.operationType)
    : false;
  const columnDisabled = item.disabled ? item.disabled(record) : false;
  return globalDisabled || columnDisabled;
}
const customOptions = ref([]);

const emit = defineEmits(['change', 'update:selectedRowKeys', 'update:selectedRow']);

function getResult(value: any | ((record: any) => any), record: any, defaultValue?: any) {
  if (typeof value === 'function') {
    return value(record);
  }
  return value === undefined ? defaultValue : value;
}

function wrapWithDayjs(value: { format: any; }) {
  if (!value || value?.format) {
    return value;
  }
  return dayjs(value);
}

function onSelectChange(selectedRowKeys: any) {
  emit('update:selectedRowKeys', selectedRowKeys);
}

function onChangeOneRow(...args: any[]) {
  emit('update:selectedRow', ...args);
}

function handelFormItemChange(e: { target: { value: any; }; }, name: [number, string]) {
  const newNextValue = e?.target ? e.target.value : e;
  emit('change', {
    name,
    value: newNextValue,
  });
}

function handelSearch(name: string, api?: Function) {
  if (isFunction(api)) api(name);
}

// 选项搜索
const handleBlur = async (record: { databaseName: any; tableName: any; }) => {
  const fieldParams = {
    dataLevel: record.databaseName,
    tableName: record.tableName,
  };
  // const fieldNameResult = await queryFieldByDataLevelAndTableApi(fieldParams);
  // customOptions.value = fieldNameResult?.map((item: any) => ({ value: item, label: item }));
};

function format(text: string, type?: string, options?: any) {
  if ((type === 'radio' && text === 'boolean') || type === 'select') {
    return options.find((i: { value: any; }) => i.value === text)?.label;
  }
  return text;
}
</script>

<style lang="scss">
.app-edit-table {
  .editable-cell {
    .ant-input-number,
    .ant-select,
    .ant-input {
      width: 100%;
    }

    .ant-form-item {
      &.hide-msg {
        .ant-form-item-explain {
          display: none;
        }
      }

      .ant-input-number-prefix {
        margin: 0;
      }
    }
  }
  .edit_card_body_table_action {
    .btn-wrapper {
      display: flex;
      align-items: center;
      margin-left: -8px;
      .btn-icon {
        margin-right: 6px;
      }
      .ant-btn-link {
        padding: 4px 8px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .task-list-table_more-action {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: -2px;
      }
    }
  }
}
</style>
