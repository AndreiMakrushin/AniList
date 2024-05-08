<script setup lang="ts">
import AnimeList from '@/widgets/catalog/AnimeList.vue'
import { useAnimeStore } from '@/stores/animeStore'
import type { Anime } from '@/stores/types'
import axios from 'axios'
import { API_list } from '@/composables'
import { watch } from 'vue'

const animeStore = useAnimeStore()
const mapper = new Map()
const addedAnime = (e: Anime[]) => {
  return (animeStore.aniList = e.reduce((acc: Anime[], obj: Anime) => {
    if (mapper.get(obj.id)) {
      return acc
    }
    mapper.set(obj.id, true)
    return [...acc, obj]
  }, animeStore.aniList))
}
const getAnimeFromApi = async () => {
  const response = await axios.get(
    `${API_list}${animeStore.animePage}&limit=${animeStore.animeCount}`
  )
  return addedAnime(response.data.list)
}
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
</script>
<template>
  <div>
    <AnimeList
      :user="animeStore?.user?.id"
      :anime="animeStore.searchedAnime.length ? animeStore.searchedAnime : animeStore.aniList"
      @getAnimeFromApi="getAnimeFromApi"
      @page="animeStore.animePage++"
    />
  </div>
</template>
