<template>
    <button @click="open">点我</button>
</template>
<script lang="ts" setup>
import { login } from '../api/user';
const open = () => {
    console.log('huhu');
    login({user: 'ko'}).then(res => {
        console.log(res);
    })
}
</script>
