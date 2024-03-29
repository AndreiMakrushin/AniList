<script setup lang="ts">
defineProps<{
  userName?: string | undefined
}>()
</script>

<template>
  <div class="absolute right-2 shadow-shadowDrop rounded-b-[10px] p-3">
    <div class="flex flex-col justify-center items-center gap-3">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
