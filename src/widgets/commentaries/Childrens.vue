<script setup lang="ts">
import type { Item } from '@/stores/types'
import { defineProps } from 'vue'
import Avatar from '@/shared/ui/Avatar.vue'
import Childrens from './Childrens.vue'

const props = defineProps<{
  commentaryArray: Item
}>()

const emit = defineEmits(['replyToMessage'])

const replyToMessage = (userId: string, userName: string, randomId: string) => {
  emit('replyToMessage', { userId: userId, userName: userName, randomId: randomId })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="ml-[10%] flex flex-row gap-3 justify-center items-center border-b-[1px] border-white">
      <div class="flex flex-col justify-center items-center">
        <Avatar :img="props.commentaryArray.img" :style="'w-[30px] h-[30px]'" />
        <span>{{ props.commentaryArray.userName }}</span>
      </div>
      <div class="flex flex-col grow justify-between">
        <span>{{ props.commentaryArray.commentary }}</span>
        <div class="flex justify-end">
          <span
            class="text-[15px] self-end cursor-pointer"
            @click="
              replyToMessage(
                props.commentaryArray.userId,
                props.commentaryArray.userName,
                props.commentaryArray.randomId
              )
            "
            >Ответить</span
          >
        </div>
      </div>
    </div>
    <div
      v-if="props.commentaryArray.children && props.commentaryArray.children.length > 0"
      class="pl-[10%]"
    >
      <Childrens
        v-for="children in props.commentaryArray.children"
        :key="children"
        :commentaryArray="children"
        @replyToMessage="replyToMessage($event.userId, $event.userName, $event.randomId)"
      />
    </div>
  </div>
</template>
