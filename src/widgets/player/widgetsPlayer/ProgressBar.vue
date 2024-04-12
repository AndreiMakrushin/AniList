<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  value?: number | undefined;
  style?: object | undefined;
}>();

const emit = defineEmits(['update']);

const emited = (event: Event) => {
  emit('update', event);
}
</script>

<template>
  <div class="relative h-[5px] hover:h-[8px] duration-short bg-[#525151] rounded-[5px]">
    <div
      class="absolute z-10 h-full duration-short bg-slate-500 rounded-[5px] cursor-pointer"
      :style="props.style"
    ></div>
    <input
      type="range"
      class="w-full absolute z-20 h-full"
      @click="emited($event)"
      @touchend="emited($event)"
      min="0"
      max="100"
      :value="props.value"
    />
  </div>
</template>

<style scoped>
input[type='range'] {
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  border-radius: 5px;
  transition: 0.5s;
  background: none;
}
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 100%;
  width: 0px;
  transition:
    height 0.5s,
    width 0.5s;
}
</style>
