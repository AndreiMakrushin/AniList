<script setup lang="ts">
import Input from '@/shared/ui/Input.vue'
import Button from '@/shared/ui/Button.vue'
import Avatar from '@/shared/ui/Avatar.vue'
import { supabase } from '@/supabase'
import type { Anime, User, Item } from '@/stores/types'
import { onMounted, ref, defineProps, watch, computed } from 'vue'
import Commentaries from './Commentaries.vue'
import { buildTree } from '@/features/buildTree/buildTree'
import { sendCommentary } from '@/features/sendCommentary/sendCommentary'

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
const commentArray = ref<Item[]>([])

supabase
  .channel('animeCommentaries')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'animeCommentaries' },
    (payload: any) => {
      commentArray.value.push(payload.new)
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
</script>
<template>
  <div class="flex flex-col gap-5 bg-slate-600 p-3 rounded-[10px]">
    <span>Коментарии</span>
    <Commentaries
      :user="props.animeStore"
      :commentArray="buildTree(commentArray)"
      @replyToMessage="replyToMessage($event.userId, $event.userName, $event.randomId)"
    />

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
        @click="
          sendCommentary(
            {
              animeId: props.anime,
              userId: props.animeStore.id,
              userName: props.animeStore.name,
              img: props.animeStore.avatar_url
            },
            commentary
          )
        "
        text="Отправить"
        :style="'hover:shadow-shadowDrop p-1 hover:bg-slate-500 rounded-[15px]'"
      />
    </div>
  </div>
</template>
