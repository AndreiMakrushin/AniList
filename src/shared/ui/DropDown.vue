<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'

defineProps<{
  status: Array<string>
}>()

const dropDown = ref<boolean>(false)

const emit = defineEmits(['sendStatus'])

const send = (status: string) => {
  dropDown.value = false
  emit('sendStatus', status)
}
</script>

<template>
  <div class="flex flex-col w-full text-white text-[18px] text-center rounded-[10px] overflow-hidden">
    <div class="flex w-full p-2 bg-slate-400 cursor-pointer" @click="dropDown = !dropDown">
      <span class="w-full">Добавить в список</span>
    </div>
    <div v-if="dropDown" class="border-t-[2px] border-white bg-slate-400 animate-slide-up">
      <ol class="flex flex-col">
        <li
          v-for="i in status"
          :key="i"
          class="p-2 cursor-pointer hover:bg-slate-500 duration-short"
          @click="send(i)"
        >
          {{ i }}
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 260px;
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-in-out;
}
</style>
