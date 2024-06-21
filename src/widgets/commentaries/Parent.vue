<script setup lang="ts">
import type { Item } from '@/stores/types'
import { defineProps } from 'vue'
import Childrens from './Childrens.vue'
import Avatar from '@/shared/ui/Avatar.vue'

const props = defineProps<{
  commentArray: Item[]
}>()

const emit = defineEmits(['replyToMessage'])

const emiting = (event: { userId: string; userName: string; randomId: string }) => {
  emit('replyToMessage', event)
}
</script>

<template>
  <div class="flex flex-col gap-2" v-for="i in props.commentArray" :key="i">
    <div class="flex flex-row gap-3">
      <div class="flex flex-col justify-center items-center">
        <Avatar :img="i.img" :style="'w-[50px] h-[50px]'" />
        <span>{{ i.userName }}</span>
      </div>
      <div class="flex flex-col grow border-b-[1px] border-white justify-between">
        <span>{{ i.commentary }}</span>
        <div class="flex justify-end">
          <span
            class="text-[15px] self-end cursor-pointer"
            @click="emiting({ userId: i.userId, userName: i.userName, randomId: i.randomId })"
            >Ответить</span
          >
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-3">
      <Childrens
        v-for="(children, index) in i.children"
        :key="children"
        :commentaryArray="children"
        :index="index"
        @replyToMessage="emiting($event)"
      />
    </div>
  </div>
</template>
