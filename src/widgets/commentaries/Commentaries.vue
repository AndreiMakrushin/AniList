<script setup lang="ts">
import Input from '@/shared/ui/Input.vue'
import Button from '@/shared/ui/Button.vue'
import Avatar from '@/shared/ui/Avatar.vue'
import { supabase } from '@/supabase'
import type { Anime, User, Item } from '@/stores/types'
import { onMounted, ref, defineProps, watch, computed } from 'vue'
import Parent from './Parent.vue'

const props = defineProps<{
  anime?: Anime | null
  animeStore?: User | null
}>()

watch(
  () => props.anime,
  async () => {
    await addCommentaries()
  }
)
const commentary = ref<string>('')

const sendCommentary = async () => {
  try {
    const { data, error } = await supabase.from('animeCommentaries').insert({
      animeId: props.anime,
      userId: props.animeStore.id,
      userName: props.animeStore.name,
      img: props.animeStore.avatar_url,
      commentary: commentary.value,
      randomId: Math.floor(Math.random() * 10000)
    })
    if (error) {
      return console.log('ошибка:', error.message)
    } else {
      return data
    }
  } catch (error) {
    console.log('ошибка:', error)
  }
}

const commentArray = ref<Item[]>([])

supabase
  .channel('animeCommentaries')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'animeCommentaries' },
    (payload: any) => {
      console.log(payload)
    }
  )
  .subscribe()

async function addCommentaries() {
  try {
    const { data, error } = await supabase
      .from('animeCommentaries')
      .select()
      .filter('animeId', 'eq', props.anime)
    if (error) {
      console.log('ошибка:', error)
    }
    commentArray.value = data
    console.log(buildTree(commentArray.value))
  } catch (error) {
    console.log('ошибка:', error)
  }
}

const replyToMessage = async (answerUserId: number, answerUserName: string, commentId: number) => {
  const { data, error } = await supabase
    .from('animeCommentaries')
    .select()
    .filter('randomId', 'eq', commentId)
    .single()
  try {
    const { data, error } = await supabase.from('animeCommentaries').insert({
      animeId: props.anime,
      commentary: `${answerUserName + ': ' + commentary.value}`,
      userId: answerUserId,
      img: props.animeStore.avatar_url,
      userName: answerUserName,
      parentId: commentId,
      answerId: props.animeStore.id,
      answerName: props.animeStore.name,
      randomId: Math.floor(Math.random() * 10000)
    })

    if (error) {
      return console.log('ошибка:', error.message)
    } else {
      console.log(data)
    }
  } catch (error) {
    console.log('ошибка:', error)
  }
}

function buildTree(comments: Item[]): Item[] {
  const commentsMap: Record<number, Item & { children: Item[] }> = {}

  comments.map((comment) => {
    commentsMap[comment.randomId] = { ...comment, children: [] }
  })

  const rootComments: Item[] = []

  comments.map((comment) => {
    if (comment.parentId === null) {
      rootComments.push(commentsMap[comment.randomId])
    } else {
      const parentComment = commentsMap[comment.parentId]
      if (parentComment) {
        parentComment.children.push(commentsMap[comment.randomId])
      }
    }
  })

  return rootComments
}
</script>
<template>
  <div class="flex flex-col gap-5 bg-slate-600 p-3 rounded-[10px]">
    <span>Коментарии</span>
    <Parent
      :commentArray="buildTree(commentArray)"
      @replyToMessage="replyToMessage($event.userId, $event.userName, $event.randomId)"
    />
    <!-- <div
      class="flex flex-col gap-2"
      v-for="i in commentArray.filter((item) => item.parentId === null)"
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
      <div
        class="pl-[10%] flex flex-row gap-3 justify-center items-center"
        v-for="j in commentArray.filter(
          (item) => item.randomId !== null && item.parentId === i.randomId
        )"
        :key="j"
      >
        <div class="flex flex-col justify-center items-center">
          <Avatar :img="j.img" :style="'w-[30px] h-[30px]'" />
          <span>{{ j.userName }}</span>
        </div>
        <div class="flex flex-col grow justify-between">
          <span>{{ j.commentary }}</span>
          <div class="flex justify-end" v-if="animeStore">
            <span
              class="text-[15px] self-end cursor-pointer"
              @click="replyToMessage(j.userId, j.userName, j.randomId)"
              >Ответить</span
            >
          </div>
        </div>
      </div>
    </div> -->

    <!-- replyToMessage(i.userId, i.userName, i.randomId) -->

    <span class="m-auto" v-if="commentArray.length === 0"
      >Пока комментариев нет, будь одним из первых и напиши свой комментарий!</span
    >
    <div class="flex flex-col gap-3 items-start" v-if="animeStore">
      <span>Напиши отзыв!</span>
      <div class="flex flex-row w-full grow gap-3 items-center">
        <div class="flex flex-col justify-center items-center">
          <Avatar :img="animeStore?.avatar_url" :style="'w-[50px] h-[50px]'" />
          <span>{{ animeStore?.name }}</span>
        </div>
        <Input :style="'text-black'" v-model="commentary" placeholder="Комментарий" type="text" />
      </div>
      <Button
        @click="sendCommentary"
        text="Отправить"
        :style="'hover:shadow-shadowDrop p-1 hover:bg-slate-500 rounded-[15px]'"
      />
    </div>
  </div>
</template>
