<template>
  <a-result status="500" title="500" sub-title="Sorry, the server is reporting an error.">
    <template #extra>
      <a-button type="primary" @click="toHome">Back Home</a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const toHome = () => {
  router.push({ path: '/' });
};
</script>
