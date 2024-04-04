<script setup lang="ts">
import AnimeList from '@/widgets/catalog/AnimeList.vue'
import { useAnimeStore } from '@/stores/animeStore'


const animeStore = useAnimeStore()



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





</script>
<template>
  <div>
    <AnimeList :anime="animeStore.aniList" @loadAnime="animeStore.aniList = $event"/>
  </div>
</template>

