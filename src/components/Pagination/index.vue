<template>
  <div
    class="pagination"
    v-bind="$attrs"
  >
    <div class="pagination_left">
      <section>
        总共
        {{ props.total }}
       条
      </section>

      <section>
        <span>每页展示</span>
        <a-dropdown placement="topLeft">
          <template #overlay>
            <a-menu @click="pageSizeChange">
              <a-menu-item
                v-for="size in props.pageSizeOptions"
                :key="size.value"
                :class="{ 'page-size-active': props.pageSize == size.value }"
              >
                {{ size.label }}
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            style="width: 48px; margin: 0 5px;"
            size="small"
          >
            {{ props.pageSize }}
            <caret-down-outlined :size="7" />
          </a-button>
        </a-dropdown>
        <span>条</span>
      </section>
    </div>

    <a-pagination
      :total="props.total"
      :current="props.pageNumber"
      :page-size="props.pageSize"
      show-quick-jumper
      :show-size-changer="false"
      size="small"
      @change="pageChange"
    />
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    pageSize?: number;
    pageNumber?: number;
    total?: number;
    pageSizeOptions?: {
      value: number;
      label: string;
    }[];
  }>(),
  {
    total: 0,
    pageSize: 10,
    pageNumber: 0,
    pageSizeOptions: () => [
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
  },
);

const emit = defineEmits(['update:pageSize', 'update:pageNumber', 'change']);

function pageSizeChange(event: any) {
  emit('update:pageSize', event.key as number);
  emit('update:pageNumber', 1);
  emit('change', 1, event.key);
}

function pageChange(page: number, pageSize: number) {
  emit('update:pageNumber', page);
  emit('change', page, pageSize);
}
</script>

<style lang="less" scoped>
.pagination {
  background: #fff;
  margin: 0;
  width: 100%;
  height: 68px;
  line-height: 68px;
  box-shadow: 0px -1px 0px 0px #e6e6e6;

  display: flex;
  justify-content: space-between;
  align-items: center;
  &_left {
    display: flex;
    align-items: center;

    section {
      margin-right: 6px;
    }
    :deep(.ant-dropdown){
      z-index: 1052;
    }
    :deep(.ant-dropdown-trigger) {
      .anticon {
        margin-left: 9px;
        transform: translateX(-4px);
      }
    }
  }
}

:deep(.page-size-active) {
  background-color: #e6f7ff;
}
</style>
