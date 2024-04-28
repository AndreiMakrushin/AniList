<script setup lang="ts">
defineProps<{
  userName?: string | undefined
  style?: string
}>()
</script>

<template>
  <div :class="style" class="absolute z-10 shadow-shadowDrop rounded-[10px] p-3 bg-slate-50">
    <div class="flex flex-col justify-center items-center gap-3">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
