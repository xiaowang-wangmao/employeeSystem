<template>
  <a-button class="flex-items-center">
    <SvgRaw
      v-if="icon"
      :name="icon"
    />
    <slot></slot>
  </a-button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string;
  }>(),
  {},
);
</script>
