<script setup lang="ts">
import { ref, watch } from 'vue'
defineProps<{
  episodes?: object
  selected?: number
}>()
const isOpen = ref<boolean>(false)

const open = () => {
  isOpen.value = !isOpen.value
}
const emit = defineEmits(['update'])
const close = (event) => {
  emit('update', event)
  isOpen.value = false
}
</script>

<template>
  <div class="flex flex-col text-white w-[90px]">
    <span @click="open" class="px-1 bg-gray-500 rounded-[5px] cursor-pointer">{{ selected }} Серия</span>
    <div class="flex flex-col w-full border-t-1 border-white rounded-[5px] bg-gray-500 mt-1" v-if="isOpen">
      <p v-for="e in episodes" :key="e" @click="close(e.episode)" class="cursor-pointer hover:bg-gray-700 px-1 duration-short">
        {{ e.episode }} Серия
      </p>
    </div>
  </div>
</template>
