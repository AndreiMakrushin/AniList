<script setup lang="ts">
defineProps<{
    text: string,
    style?: string
}>()
</script>
<template>
  <button  :class="style" class="p-[10px] duration-short">
    {{ text }}
  </button>
</template>


