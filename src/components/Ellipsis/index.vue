<template>
  <a-tooltip
    placement="topLeft"
    v-bind="$attrs"
    overlay-class-name="custom-ellipsis"
  >
    <template #title>
      <slot v-if="props.needArray">
        <div
          v-for="item in value"
          :key="item"
        >
          {{ item }},
        </div>
      </slot>

      <slot v-else-if="props.isTime">
        {{ timeFormat }}
      </slot>
      <slot v-else>
        {{ value }}
      </slot>
    </template>
    <div
      class="ellipsis-row"
      :style="{
        width: `${props.width}px`,
        '-webkit-line-clamp': props.maxRow || 2,
      }"
    >
      <div v-if="props.needArray">
        <div
          v-for="item in value"
          :key="item"
        >
          {{ item }},
        </div>
      </div>
      <slot v-else-if="props.isTime">
        {{ timeFormat }}
      </slot>
      <slot v-else>
        {{ value }}
      </slot>
    </div>
  </a-tooltip>
</template>
<script lang="ts" setup>
import dayjs from 'dayjs';

const props = withDefaults(defineProps<{
  value?: string,
  width?: number,
  maxRow?: number,
  needArray?: boolean,
  isTime: boolean,
}>(), {
  value: '',
  width: 200,
  maxRow: undefined,
  needArray: false,
  isTime: false,
});

const timeFormat = computed(() => dayjs(props.value).format('YYYY-MM-DD HH:mm:ss'));

</script>
<style lang="less">
.ellipsis-row {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.custom-ellipsis{
  .ant-tooltip-inner{
    max-height: 200px;
    overflow-y: auto;
  }
}
</style>
