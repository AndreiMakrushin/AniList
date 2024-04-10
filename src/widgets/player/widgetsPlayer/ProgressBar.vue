<script setup lang="ts">
defineProps<{
  value?: number | undefined
  style?: object | undefined
}>()
const emit = defineEmits(['update'])
const handleTouchEnd = (event) => {
  const el = event.target;
  const inputRect  = el.getBoundingClientRect();
  const touchX = Math.floor(event.changedTouches[0].clientX - inputRect.left);  
    
  emit('update', {event, touchX})
    console.log("X координата касания:", touchX , 'длина', event.target.offsetWidth);
}
</script>

<template>
  <div class="relative h-[5px] hover:h-[8px] duration-short bg-[#525151] rounded-[5px]">
    <div
      class="absolute z-10 h-full duration-short bg-slate-500 rounded-[5px] cursor-pointer"
      :style="style"
    ></div>
    <input
      type="range"
      class="w-full absolute z-20 h-full"
      @click="$emit('update', $event)"
      @touchend="$emit('update', $event)"
      min="0"
      max="100"
      :value="value"
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
