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
    class="border border-[#d1d1d1] rounded-[17px] p-[10px] w-full text-black "
    @input="$emit('update:modelValue', ($event.currentTarget as HTMLInputElement).value.trim())"
  />
</template>
