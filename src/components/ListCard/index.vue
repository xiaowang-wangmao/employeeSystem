<template>
  <div
    class="list-card"
    :class="{
      'fix-header': props.fixHeader,
      'fix-footer': props.fixFooter,
    }">
    <div class="list-card-content">
      <h1 class="list-card-content_header">
        <a-row justify="space-between">
          <a-col style="display: flex; align-items: center">
            <SvgRaw
              v-if="props.icon"
              :name="props.icon"
            />
            <span
              v-if="props.title"
              class="list-card-content_header_title"
            >{{
              props.title
            }}</span>
          </a-col>
          <a-col>
            <slot name="headerRightRender"></slot>
          </a-col>
        </a-row>
      </h1>

      <div
        v-if="filters"
        ref="listCardHeaderRef"
        class="list-card-filters"
      >
        <a-form
          ref="formRef"
          :model="state.filtersFormState"
          layout="vertical"
          @submit="onSubmit"
        >
          <div class="list-card_filter">
            <a-row :gutter="50" class="filter-content">
              <a-col
                v-for="(item, index) in mappedFilters"
                v-show="index < 4 || (index >= 4 && !state.showExpand)"
                :key="index"
                :span="item.span || 6"
                style="margin-bottom: 16px"
              >
                <a-form-item
                  v-if="index < 4 || (index >= 4 && !state.showExpand)"
                  :name="item.prop">
                  <a-input
                    v-if="item.type === 'input'"
                    v-model:value="state.filtersFormState[item.prop]"
                    :placeholder="t(item.label)"
                    :maxlength="item.length"
                    allow-clear
                    @change="e => searchInputChange(e, item.needLow)"
                  />
                  <a-select
                    v-if="item.type === 'select'"
                    v-model:value="state.filtersFormState[item.prop]"
                    :placeholder="t(item.label)"
                    style="width: 100%"
                    :options="translateArrayProp(item.options, 'label')"
                    :mode="item.mode || 'combobox'"
                    allow-clear
                    :show-search="item.showSearch"
                    :disabled="item.disabled"
                    option-filter-prop="label"
                    @search="item.onSearch"
                    @blur="handelBlur('', item.searchApi, item.mode)"
                    @change="handleChange(item.prop,item.hasChange)"
                  />
                  <a-date-picker
                    v-if="item.type === 'date'"
                    v-model:value="state.filtersFormState[item.prop]"
                    show-time
                    value-format="YYYY-MM-DDTHH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="t(item.label)"
                    style="width: 100%"
                    allow-clear
                  />

                  <a-range-picker
                    v-if="item.type === 'date-range'"
                    v-model:value="state.filtersFormState[item.prop]"
                    value-format="YYYY-MM-DD"
                    format="YYYY-MM-DD"
                    :placeholder="item.placeholder?[
                      t(item.placeholder) + t('common.divider') + '（起）',
                      t(item.placeholder) + t('common.divider') + '（止）'
                    ] : [
                      t(item.label) + t('common.divider') + t('common.timeStart'),
                      t(item.label) + t('common.divider') + t('common.timeEnd')
                    ]"
                    :disabled-date="item.disabledDate"
                    style="width: 100%"
                    allow-clear
                  />
                  <DCCascader
                    v-if="item.type === 'cascader'"
                    v-model:code="state.filtersFormState[item.prop]"
                    :fieldNames="item.fieldNames"
                    expand-trigger="hover"
                    :options="item.cascaderOptions"
                    :placeholder="t(item.label)"
                    :show-search="item.showSearch"
                    :disabled="item.disabled"
                    style="width: 100%"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <div>
              <a-form-item>
                <a-space>
                  <a-button @click="resetForm">
                    {{ t('component.cropper.btn_reset') }}
                  </a-button>
                  <a-button
                    type="primary"
                    :disabled="!isCanSearch"
                    html-type="submit"
                  >
                    {{ t('common.searchText') }}
                  </a-button>
                </a-space>
              </a-form-item>
            </div>
          </div>
        </a-form>

        <a
          v-if="filters.length > 4 && state.showExpand"
          class="filters-expand"
          @click="handleExpandFilters"
        >
          {{ t('component.form.expand') }}
          <SvgRaw name="icon_drop_down" />
        </a>

        <a
          v-if="!state.showExpand"
          class="filters-expand"
          @click="handleCollapseFilters"
        >
          {{ t('component.form.collapse') }}
          <SvgRaw name="icon_up" />
        </a>
        <slot name="listCardHeaderRender"></slot>
      </div>

      <div class="list-card-content_body">
        <a-row
          class="table-top-render"
          justify="space-between"
        >
          <slot name="tableTopRender"></slot>
        </a-row>

        <a-table
          :locale="{ emptyText: 'common.notData' }"
          :sticky="{ offsetHeader: state.listCardHeaderHeight }"
          :scroll="{ scrollToFirstRowOnChange: true, x: 'min-content', y: props.scrollY }"
          :data-source="state.dataSource"
          :columns="props.columns"
          :pagination="false"
          :loading="state.loading"
          :rowKey="props.rowKey"
          :rowSelection="props.needRow
            ? {
              selectedRowKeys: props.selectedRowKeys,
              preserveSelectedRowKeys: true,
              getCheckboxProps: (record: Record<string, any>) => ({
                disabled: props.checkDisabled? props.checkDisabled(record) : false,
              }),
              onChange: onSelectChange } : undefined"
        >
          <template #emptyText>
            <a-empty
              v-if="!autoRefresh && !state.loading && !state.isSubmit"
              :description="'...'"
              :image="emptyImage"
            />
            <a-empty
              v-else-if="state.loading"
              description="Loading..."
              :image="toBeContinued"
              :image-style="imageStyle"
            />
            <a-empty
              v-else
              :description="'暂无数据'"
              :image="emptyImage"
            />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <div class="list-card-content_body_table_action">
                <slot
                  name="actionRender"
                  :record="record"
                >

                  <div v-if="btnInfo.length" class="btn-wrapper">
                    <span
                      v-for="(item,index) in btnInfo.slice(0,showBtnNum)"
                      :key="index">
                      <a-popconfirm
                        v-if="item.popconfirm && !checkButtonIfDisable(record,item)"
                        placement="topLeft"
                        :title="item.confirmTitle?item.confirmTitle:
                          `请确认是否${item.text}？`"
                        @confirm="() => item.onClick(record)"
                      >
                        <a-button
                          type="link"
                          :disabled="checkButtonIfDisable(record,item)"
                          v-show="(item.visible?item.visible(record):true)"
                        ><SvgRaw v-if="item.icon" :name="item.icon" />
                          {{ item.text }}</a-button>
                      </a-popconfirm>
                      <a-button
                        v-else
                        type="link"
                        v-show="(item.visible?item.visible(record):true)"
                        :disabled="checkButtonIfDisable(record,item)"
                        @click="handelOnClick(record,item)"
                      >
                        <SvgRaw v-if="item.icon" :name="item.icon" class="btn-icon" />
                        {{ item.text }}
                      </a-button>
                    </span>
                    <span><a-popover placement="rightTop" v-if="props.btnInfo.length>showBtnNum">
                      <template #content>
                        <div>
                          <div
                            v-for="(item,index) in btnInfo" :key="index"
                            >
                            <a-button
                              type="link"
                              v-show="(item.visible?item.visible(record):true)"
                              :disabled="checkButtonIfDisable(record,item)"
                              @click="handelOnClick(record,item)"
                            >
                              <SvgRaw v-if="item.icon" :name="item.icon" class="btn-icon" />
                              {{ item.text }}
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
          </template>
        </a-table>
      </div>
      <div
        v-if="props.handleListCardFooter"
        class="list-card-content_footer"
      >
        <Pagination
          v-model:page-number="state.pageNumber"
          v-model:page-size="state.pageSize"
          :total="state.total"
          @change="pageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isArray, isEmpty, isFunction } from '@/utils/is/is.ts';
import emptyImage from '@/assets/images/customEmpty.png';
import toBeContinued from '@/assets/images/to-be-continued.png';
import { cloneDeep, isEqual } from 'lodash-es';
import { BtnInfoType } from '@/enums/formEnum';
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import Pagination from '@/components/Pagination/index.vue';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, toRaw, watch } from 'vue';

const listCardHeaderRef = ref();
const emit = defineEmits(['update:selectedRowKeys', 'update:selectedRows', 'filterChange']);
const router = useRouter();
const route = useRoute();
const imageStyle = { height: '150px' };
const state = reactive({
  
  isSubmit: false,
  listCardHeaderHeight: 0,
  loading: false,
  showExpand: true,
  newFilters: {} as any,
  originFilterParams: {} as any,
  filtersFormState: {} as any,
  dataSource: [] as any[],
  pageSizeOptions: [
    {
      value: 10,
      label: '10',
    },
    {
      value: 20,
      label: '20',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 40,
      label: '40',
    },
  ],
  pageSize: 10,
  pageNumber: 1,
  total: 0,
});
const props = withDefaults(
  defineProps<{
    handleListCardFooter?: boolean;
    title?: string;
    icon?: string;
    columns?: any[];
    checkButtonDisabled?:(record: Record<string, any>, name: string) => boolean;
    btnInfo: BtnInfoType[];
    showBtnNum?: number;
    filters?: any[] | null;
    fixHeader: boolean;
    fixFooter: boolean;
    api?: {
      list?: Function;
      detail?: Function;
      delete?: Function;
      export?: Function;
      downloadTemplate?: Function;
      refreshStatus?: Function;
    };
    params?: any;
    hidden?: boolean;
    refreshProps: string[];
    autoRefresh: boolean;
    isCanSearch: boolean;
    needRow?: boolean;
    rowKey?: string;
    selectedRowKeys?: string[];
    selectedRows?: [];
    checkDisabled?:(record: Record<string, any>) => boolean;
    needParamsCache: boolean;
    scrollY?: number
  }>(),
  {
    handleListCardFooter: true,
    showBtnNum: 3,
    filters: null,
    fixHeader: true,
    fixFooter: true,
    btnInfo: () => [],
    params: () => ({}),
    hidden: false,
    refreshProps: () => ['runStatus', 'deploymentStatus', 'runStatusName', 'deploymentStatusName'],
    autoRefresh: true,
    isCanSearch: true,
    needRow: false,
    rowKey: 'code',
    selectedRowKeys: () => [],
    selectedRows: () => [],
    needParamsCache: false,
  },
);

function handelOnClick(record: any, btnInfoItem:BtnInfoType) {
  if (btnInfoItem.modalconfirm) {
    createConfirm({
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
function checkButtonIfDisable(record, item):boolean {
  const globalDisabled = props.checkButtonDisabled
    ? props.checkButtonDisabled(record, item.operationType)
    : false;
  const columnDisabled = item.disabled ? item.disabled(record) : false;
  return globalDisabled || columnDisabled;
}
async function loopFetch() {
  const { api, params } = props;
  if (
    api
    && api.refreshStatus
    && !isEmpty(state.dataSource)
    && route.path.includes('list')
  ) {
    api.refreshStatus(
      params.env,
      (state.dataSource as any[]).map((i) => i.code),
      params.colonyStatusCode,
    ).then((res) => {
      if (res) {
        res.forEach((element) => {
          const index = state.dataSource.findIndex(
            (i: any) => i && i.code && element.code === i.code,
          );
          if (props.refreshProps) {
            props.refreshProps.forEach((item) => {
              state.dataSource[index][item] = element[item];
            });
          }
        });
      }
    }).catch(() => message.error('请求错误'));
  }
}

// 复杂度拆分
function filterTime(filtersFormState: any) {
  const arr = ['createTime', 'lastUpdateTime', 'operationTime', 'runTime', 'expectedTime', 'submissionTime'];
  const newFilters = filtersFormState;
  if (isArray(newFilters.runDetailTime) && newFilters.runDetailTime[0]) {
    newFilters.startTime = `${newFilters.runDetailTime[0]} 00:00:00`;
    newFilters.endTime = `${newFilters.runDetailTime[1]} 23:59:59`;
  } else {
    newFilters.startTime = undefined;
    newFilters.endTime = undefined;
  }
  arr.forEach((item) => {
    if (isArray(newFilters[item]) && newFilters[item][0]) {
      newFilters[`${item}Start`] = `${newFilters[item][0]}T00:00:00`;
      newFilters[`${item}End`] = `${newFilters[item][1]}T23:59:59`;
    } else {
      newFilters[`${item}Start`] = undefined;
      newFilters[`${item}End`] = undefined;
    }
  });
  return newFilters;
}
/**
 * @description Interface request
 * @description 接口请求
 */
async function fetch(operateLogType?: string, cache = props.needParamsCache) {
  const { api, params } = props;
  const filtersFormState = toRaw(state.originFilterParams);
  const filterTimeValue = filterTime(filtersFormState);
  Object.assign(filtersFormState, filterTimeValue);
  state.loading = true;
  if (api && api.list) {
    const searchParams = {
      ...params,
      ...filtersFormState,
      pageNumber: state.pageNumber,
      pageSize: state.pageSize,
      operateLogType: props.params.operateLogType
        ? operateLogType || props.params.operateLogType : undefined,
    };
    const res = await api.list(searchParams);
    if (res.data && res.data.length === 0) {
      state.isSubmit = true;
    }
    state.dataSource = res.data;
    state.total = res.total;
    if (cache) {
      router.replace({
        query: {
          searchParams: JSON.stringify(searchParams),
        },
      });
    }
  }
  state.loading = false;
}

const loopFetchInterval = ref();
/**
 * @description Parameter change
 * @description 参数变化
 */
function paramsChange(isSearch? : boolean) {
  if (loopFetchInterval.value) {
    clearInterval(loopFetchInterval.value);
  }
  state.pageNumber = 1;
  fetch(isSearch ? 'search' : '');
  loopFetchInterval.value = setInterval(() => {
    loopFetch();
  }, 3000);
}
const formRef = ref();

/**
 * 初始化搜索值
 */
function setOriginFilterParams() {
  state.originFilterParams = cloneDeep(state.filtersFormState);
}
function defaultSelectedStyle() {
  state.newFilters = props.filters;
  state.newFilters.forEach((i) => {
    if (i.type === 'select') {
      state.filtersFormState[i.prop] = i.initial || undefined;
    } else if (i.type === 'date-range' && i.defaultDate) {
      state.filtersFormState[i.prop] = [...i.defaultDate];
    } else {
      state.filtersFormState[i.prop] = '';
    }
  });
  setOriginFilterParams();
}

// 重置搜索内容
const resetForm = () => {
  formRef.value.resetFields(props.filters?.filter((i) => !i.disabled).map((i) => i.prop));
  defaultSelectedStyle();
  emit('update:selectedRowKeys', []);
  emit('update:selectedRows', []);
  if (!props.autoRefresh) {
    state.dataSource = [];
    state.isSubmit = false;
  } else {
    paramsChange(props.params.operateLogType);
  }
};

function searchInputChange(e, needLow) {
  if (needLow) {
    e.target.value = e.target.value.toLowerCase();
  }
}

function handelSearch(name: string, api?: Function) {
  if (isFunction(api)) api(name);
}

const mappedFilters = computed(() => (props.filters || []).map((filter) => ({
  ...filter,
  onSearch: filter.showSearch
    ? (val: string) => { handelSearch(val, filter.searchApi); }
    : undefined,
})));

function handelBlur(name: string, api?: Function, mode?: string) {
  if (isFunction(api) && mode === 'multiple') api(name);
}

/**
 * 多选框change
 */
const onSelectChange = (selectedRowKeys, selectedRows) => {
  emit('update:selectedRowKeys', selectedRowKeys);
  emit('update:selectedRows', selectedRows);
};

/**
 * 数据清洗规则模板切换清洗模板
 * @param name
 * @param hasChange
 */
function handleChange(name:string, hasChange:boolean) {
  if (hasChange) {
    if (name === 'templateType') {
      state.filtersFormState.cleaningType = undefined;
      state.filtersFormState.ruleType = undefined;
    } else if (name === 'database') {
      state.filtersFormState.dataLevel = undefined;
    }
  }
}

// 搜索
const onSubmit = () => {
  setOriginFilterParams();
  if (!props.autoRefresh) {
    if (props.isCanSearch) {
      paramsChange(props.params.operateLogType);
    } else {
      state.dataSource = [];
    }
  } else {
    paramsChange(props.params.operateLogType);
  }
};

function exportFn() {
  const { api } = props;
  if (api && api.export) {
    api.export({
      ...state.filtersFormState,
    });
  }
}

function downloadFn() {
  const { api } = props;
  if (api && api.downloadTemplate) {
    api.downloadTemplate();
  }
}

/**
 * @description Interface request
 * @description 接口请求
 */
async function deleteItem(id: string) {
  const { api } = props;
  if (api && api.delete) {
    await api.delete({
      code: id,
    });
    state.pageNumber = 1;
    fetch();
  }
}

/**
 * @description Change the current page
 * @description 更改当前页面
 * @param page number
 * @param pageSize number
 */
function pageChange(page: number, pageSize: number) {
  if (!props.autoRefresh) {
    if (props.isCanSearch) {
      state.pageNumber = page;
      state.pageSize = pageSize;
      fetch();
    }
  } else {
    state.pageNumber = page;
    state.pageSize = pageSize;
    fetch();
  }
}

function fixLayout() {
  nextTick(() => {
    if (props.filters && props.fixHeader) {
      state.listCardHeaderHeight = listCardHeaderRef.value.offsetHeight;
    }
  });
}

// onMounted复杂度拆分
function newFilterDetermine(searchParams) {
  state.newFilters.forEach((i) => {
    const initial = searchParams ? searchParams[i.prop] : i.initial;
    if (i.type === 'select') {
      state.filtersFormState[i.prop] = initial || undefined;
    }
    if (i.type === 'input') {
      state.filtersFormState[i.prop] = initial || '';
    }
    if (i.type === 'date-range' && i.defaultDate) {
      state.filtersFormState[i.prop] = [...i.defaultDate];
    }
  });
}

// 自动请求
onMounted(() => {
  fixLayout();

  state.newFilters = props.filters;
  if (state.newFilters) {
    const searchParams = route.query.searchParams
      ? JSON.parse(route.query.searchParams as string)
      : null;
    newFilterDetermine(searchParams);
    state.pageNumber = searchParams ? searchParams.pageNumber : 1;
    state.pageSize = searchParams ? searchParams.pageSize : 10;
    setOriginFilterParams();
  }
  if (!props.hidden && props.autoRefresh) {
    fetch(undefined, false);
    loopFetchInterval.value = setInterval(() => {
      loopFetch();
    }, 3000);
  }
});

function handleExpandFilters() {
  state.showExpand = false;
  fixLayout();
}

function handleCollapseFilters() {
  state.showExpand = true;
  fixLayout();
}

watch(
  () => props.params,
  (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      paramsChange();
    }
  },
);

// 监听过滤数据
watch(
  () => state.filtersFormState,
  () => {
    const filterParams = state.filtersFormState;
    emit('filterChange', filterParams);
  },
  { deep: true },
);

function setFiltersFormState(obj: Record<string, any>) {
  Object.assign(state.filtersFormState, obj);
  Object.assign(state.originFilterParams, obj);
  fetch();
}

defineExpose({
  fetch,
  exportFn,
  downloadFn,
  paramsChange,
  state,
  resetForm,
  setFiltersFormState,
});

onUnmounted(() => {
  if (loopFetchInterval.value) {
    clearInterval(loopFetchInterval.value);
  }
});


function createConfirm(arg0: { title: string | undefined; content: string | undefined; onOk: () => void; iconType: string; closable: boolean; }) {
  throw new Error('Function not implemented.');
}
</script>

<style lang="less">

.list-card {
  width: 100%;
  background: #fff;
  position: relative;

  &.fix-header {
    .list-card-filters {
      order: 1;
      min-height: 64px;
      position: sticky;
      top: 0;
      margin: 0;
      background: #fff;
      padding: 16px 24px 0;
      z-index: 9;
    }
    .list-card-content_header {
      order: 2;
      padding-top: 16px;
    }
  }

  &_filter {
    display: flex;
    justify-content: space-between;
    column-gap: 50px;

    .filter-content {
      width: 100%;
    }
  }

  &.fix-footer {
    .list-card-content_body {
      padding-bottom: 8px;
    }
    .list-card-content_footer {
      z-index: 9;
      position: sticky;
      bottom: 0;
      right: 40px;
      margin: auto 0 0 0;
    }
  }

  &-header {
    :deep(.ant-form-item) {
      margin-bottom: 0;
    }
  }

  &.fix-header, &.fix-footer {
    .list-card-content {
      min-height: calc(100vh - 48px);
    }
    .list-card-content_header {
      margin: 16px 24px 0 24px;
    }
    .list-card-content_body {
      margin: 0 24px;
      padding: 0 15px;
    }
  }

  &-content {
    display: flex;
    flex-direction: column;
    background-color: #f3f7fd;
    &_header {
      order: 1;
      font-size: 20px;
      font-weight: 600;
      color: #262626;
      background-color: white;
      padding: 0 15px 16px 15px;
      margin-bottom: 0;

      &_title {
        margin-left: 7px;
      }
    }

    .list-card-filters {
      order: 2;
    }

    &_body {
      order: 3;
      background-color: white;
      flex: 1;
      &_table {
        &_action {
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
    }

    &_footer {
      order: 4;
      background-color: white;
      height: 68px;
      line-height: 68px;
      padding: 0 16px;
      box-shadow: 0px -1px 0px 0px #e6e6e6;

      &_pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;

        &——left {
          display: flex;
          align-items: center;

          section {
            margin-right: 6px;
          }

          :deep(.ant-dropdown-trigger) {
            .anticon {
              margin-left: 9px;
              transform: translateX(-4px);
            }
          }
        }
      }
    }

    .list-card-filters {
      order: 2;
      background-color: white;
      .ant-form-item {
        margin: 0;
      }
    }
  }

  .table-top-render {
    position: relative;
    align-items: center;
    margin-bottom: 16px;

    .ant-tabs-nav {
      margin: 0;
    }
  }
  .page-size-active {
    background-color: #e6f7ff;
  }
}
</style>