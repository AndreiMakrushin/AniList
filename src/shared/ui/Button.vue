<script setup lang="ts">
defineProps<{
    text: string,
    style?: string
}>()
</script>
<template>
  <button  :class="style">
    {{ text }}
  </button>
</template>


