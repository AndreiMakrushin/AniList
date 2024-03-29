<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { useAnimeStore } from '../stores/animeStore'
import { supabase } from '../supabase'
import UploadAvatar from '@/widgets/modals/uploadAvatar/UploadAvatar.vue'
import axios from 'axios'
import { API_list } from '../composables'

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
const updateUser = async () => {
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
}
const anime = ref([]);

const animeList = async () => {
  const response = await axios.get(`${API_list}1&limit=20`);
  return response.data;
};

onMounted(async () => {
  const data = await animeList();
  anime.value = data.list;
});
</script>
<template>
  <div>
    <div v-for="i in anime" :key="i">
      <div class="border-[1px] border-black">
        {{ i.names.ru }}
        <img :src="`https://vk.anilib.top${i.posters.original.url}`" alt="">
      </div>
    </div>
   
  </div>

  <UploadAvatar />
</template>

<style scoped>
img {
  width: 100px;
}
</style>
