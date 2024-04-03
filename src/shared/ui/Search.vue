<script setup lang="ts">
defineProps<{
  style?: string
  modelValue?: string
  type?: string
}>()
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.currentTarget as HTMLInputElement).value.trim())"
    :type="type"
    class="flex grow font-medium text-[15px] text-gray-700 pl-[10px] rounded-[5px] outline-none focus:ring-[1px]"
    :class="style"
  />
</template>

<style scoped></style>
