<script setup lang="ts">
import type { Item } from '@/stores/types'
import { defineProps } from 'vue'
import Childrens from './Childrens.vue'
import Avatar from '@/shared/ui/Avatar.vue'

const props = defineProps<{
  commentArray: Item[]
}>()
</script>

<template>
  <div
    class="flex flex-col gap-2"
    v-for="i in props.commentArray"
    :key="i"
  >
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
            @click="replyToMessage(i.userId, i.userName, i.randomId)"
            >Ответить</span
          >
        </div>
      </div>
    </div>
    <div>
      <Childrens
        v-for="(children, index) in i.children"
        :key="children"
        :commentaryArray="children"
        :index="index"
      />
    </div>
  </div>
</template>
