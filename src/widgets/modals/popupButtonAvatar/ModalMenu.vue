<script setup lang="ts">
defineProps<{
  userName?: string | undefined
}>()
</script>

<template>
  <div class="absolute right-0 z-40 top-[50px] shadow-shadowDrop rounded-b-[10px] p-3 bg-slate-50">
    <div class="flex flex-col justify-center items-center gap-3">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
