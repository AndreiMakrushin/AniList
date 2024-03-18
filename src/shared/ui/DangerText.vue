<script setup lang="ts">
defineProps<{
    dangerText: string
}>()
</script>

<template>
    <div>
        <h1 class="text-red-500 font-semibold text-[23px]">{{ dangerText }}</h1>
    </div>
</template>
