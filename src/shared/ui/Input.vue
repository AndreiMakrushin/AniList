<script setup lang="ts">
defineProps<{
  type?: string
  style?: string
  modelValue?: string
}>()
</script>
<template>
  <input
    :value="modelValue"
    :type="type"
    :class="style"
    class="flex grow font-normal text-[16px] p-[10px] rounded-[15px] outline-none focus:ring-[1px]  bg-[#f5f5f5]"
    @input="$emit('update:modelValue', ($event.currentTarget as HTMLInputElement).value.trim())"
  />
</template>
