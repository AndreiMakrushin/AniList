<script setup lang="ts">
import { defineProps, defineEmits, watch, ref, computed } from 'vue'

const props = defineProps<{
  videoCurrentTime?: number
  videoDurationTime?: number
  style?: object | undefined
}>()

const emit = defineEmits(['rewind'])

const progress = computed(() => {
  if (!props.videoDurationTime || !props.videoCurrentTime) return
  return {
    width: `${(props.videoCurrentTime / props.videoDurationTime) * 100}%`
  }
})

const value = computed(() => {
  if (!props.videoDurationTime || !props.videoCurrentTime) return
  return (props.videoCurrentTime / props.videoDurationTime) * 100
})

const onReving = (event: number) =>{
  if (!props.videoDurationTime || !props.videoCurrentTime) return
  emit('rewind', (props.videoDurationTime * event) / 100)
}
</script>

<template>
  <div class="relative h-[5px] hover:h-[8px] duration-short bg-[#525151] rounded-[5px]">
    <div
      class="absolute z-10 h-full duration-short bg-slate-500 rounded-[5px] cursor-pointer"
      :style="progress"
    ></div>
    <input
      type="range"
      class="w-full absolute z-20 h-full"
      min="0"
      max="100"
      :value="value"
      @input="onReving($event.target.value)"
    />
  </div>
</template>

<style scoped>
/* -webkit-appearance: none; */
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
