<script setup lang="ts">
defineProps<{
    text: string,
    style?: string
}>()
</script>
<template>
  <button  :class="style" class="py-[10px] px-[20px] text-white bg-purple-600 rounded-[10px]">
    {{ text }}
  </button>
</template>


