<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useAnimeStore } from '../stores/animeStore'
import { supabase } from '../supabase'
import UploadAvatar from '@/widgets/modals/uploadAvatar/UploadAvatar.vue'
import axios from 'axios'
import { API_list } from '../composables'
import type { Anime } from '../stores/types'
import IconSprite from '../shared/IconSprite.vue'

const animeStore = useAnimeStore()

const name = ref(null)
const email = ref(null)
const password = ref(null)

/* const login = () => {
  animeStore.login(email.value, password.value)
} */

/* const registration = () => {
  const register = {
    name: name.value,
    email: email.value,
    password: password.value
  }
  animeStore.registerUser(register)
} */

/* const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
}
 */

/* const updateUser = async () => {
  const { data, error } = await supabase.auth.updateUser({
    email: email.value,
    password: password.value
  })
  if (data) {
    console.log('пароль изменен')
  }
  if (error) {
    console.error(error)
  }
} */

const anime = ref<Anime[] | null>(null)

const animeList = async () => {
  const response = await axios.get(`${API_list}1&limit=21`)
  return response.data
}

onMounted(async () => {
  if (anime.value) return
  const data = await animeList()
  anime.value = data.list
  console.log(anime.value[0])
})
const hovered = ref<Anime[] | null>(null)
</script>
<template>
  <div
    class="grid gap-[30px] p-[20px] 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  grid-cols-2"
  >
    <div v-for="i in anime" :key="i">
      <article
        @mouseover="hovered = i"
        @mouseleave="hovered = null"
        class="flex flex-col items-center gap-3 cursor-pointer"
      >
        <div class="relative z-0 rounded-[15px] overflow-hidden">
          <img
            :src="`https://dl-20240330-7.anilib.moe${i.posters.original.url}`"
            class="w-full h-auto"
          />
          <div
            class="flex absolute z-10 top-0 left-0 w-full h-full duration-300 items-center justify-center text-transparent"
            :class="{ 'bg-cardOpacity text-white': hovered === i }"
          >
            <IconSprite :width="50" :height="50" name="icon-play" />
          </div>
        </div>
        <div
          class="flex flex-col items-center w-full"
        >
          <h2 class="font-medium w-full duration-300 whitespace-nowrap text-ellipsis overflow-hidden" :class="{ 'text-red-500': hovered === i }">
            {{ i.names.ru }}
          </h2>
          <p class="font-medium text-gray-500">{{ i.season.year }}</p>
        </div>
      </article>
    </div>
  </div>

  <UploadAvatar />
</template>

