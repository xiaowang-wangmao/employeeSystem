<template>
  <a-cascader
    v-model:value="selectedValue"
    :options="props.options"
    expand-trigger="hover"
    :fieldNames="props.fieldNames"
    :placeholder="props.placeholder"
    :show-search="props.showSearch"
    :disabled="props.disabled"
    v-bind="$attrs"
    @change="change"
  />
</template>

<script setup lang="ts">
import type { CascaderProps } from 'ant-design-vue';

export type Props = {
  code: string,
  options: CascaderProps['options'],
  fieldNames?: any,
  placeholder: string,
  showSearch?:boolean,
  disabled?:boolean,
};

const props = withDefaults(
  defineProps<Props>(),
  {
    code: '',
    fieldNames: {},
    placeholder: '请选择',
    showSearch: true,
    disabled: false,
    options: () => [],
  },
);
const emit = defineEmits(['update:code', 'update:label']);

function parseTreePath(tree, id) {
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i].code === id) {
      return [tree[i].code];
    } if (tree[i].dictList) {
      const reuslt = parseTreePath(tree[i].dictList, id);
      if (reuslt) {
        reuslt.unshift(tree[i].code);
        return reuslt;
      }
    }
  }
  return undefined;
}
// 获取数据labelName路径
function parseTreeNamePath(tree, id) {
  for (let i = 0; i < tree.length; i += 1) {
    if (tree[i].code === id) {
      return [tree[i].name];
    } if (tree[i].dictList) {
      const reuslt = parseTreeNamePath(tree[i].dictList, id);
      if (reuslt) {
        reuslt.unshift(tree[i].name);
        return reuslt;
      }
    }
  }
  return undefined;
}
const label:string[] = [];

const selectedValue = ref([]);
watch(() => [props.code, props.options], () => {
  if (props.options.length > 0) {
    selectedValue.value = parseTreePath(props.options, props.code);
    label.values = parseTreeNamePath(props.options, props.code);
    emit('update:label', label.values);
  }
}, { immediate: true });

function change(val) {
  if (val !== undefined) {
    const newCode = val[val.length - 1];
    label.values = parseTreeNamePath(props.options, newCode);
    emit('update:code', newCode);
    emit('update:label', label.values);
  } else {
    emit('update:code', undefined);
    emit('update:label', undefined);
  }
}

</script>
