<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  type?: string
  style?: string
  modelValue?: string
}>()

const emit = defineEmits(['update:modelValue'])

const input = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value as string)
  }
})
</script>
<template>
  <input
    v-model="input"
    :type="type"
    :class="style"
    class="flex grow font-normal text-[16px] p-[10px] rounded-[15px] outline-none focus:ring-[1px] bg-[#f5f5f5]"
  />
</template>
