<template>
  <span v-if="props.time">
    {{ timeformat }}
  </span>
  <span v-else></span>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';

const props = defineProps({
  time: {
    type: String,
    default: '',
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
  },
});
const timeformat = computed(() => dayjs(props.time).format(props.format));
</script>
