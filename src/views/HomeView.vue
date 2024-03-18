<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAnimeStore } from '../stores/animeStore'
import { supabase } from '../supabase'
import UploadAvatar from '@/widgets/UploadAvatar.vue'

const animeStore = useAnimeStore()

const name = ref(null)
const email = ref(null)
const password = ref(null)

const login = () => {
  animeStore.login(email.value, password.value)
}

const registration = () => {
  const register = {
    name: name.value,
    email: email.value,
    password: password.value
  }
  animeStore.registerUser(register)
}

const deleteAvatar = async () => {
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
}

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
</script>
<template>
  <div>
    <main v-if="!animeStore.user">
      <button @click="login" class="flex border border-gray-700 text-[20px] px-[10px]">
        войти
      </button>
      <button @click="registration">зарегать</button>
      home
    </main>
    <main v-else>
      <div class="text-green-200 font-semibold">тут будет модалка профиля</div>
      <h1 class="text-brand">имя пользователя:</h1>
      <h2 class="text-orange-500">{{ animeStore.user.name }}</h2>
      <button @click="animeStore.logout"><strong>выйти с аккуунта</strong></button>
      сдесь будет аватар пользователя
      <div class="avatar">
        <img
          class="rounded-[50%] object-cover overflow-hidden w-[100px] h-[100px]"
          @click="deleteAvatar"
          :src="
            animeStore.user.avatar_url
              ? `https://ivpfaitqeojbyulslqde.supabase.co/storage/v1/object/public/images/${animeStore.user.avatar_url}`
              : 'https://stroitel-btsk.ru/assets/cache_image/price/imeges/66493_1200x1200_0c1.jpeg'
          "
          alt=""
        />
      </div>
    </main>
    <button @click="animeStore.recoverPassword(email)" class="p-[10px] border-red-500 border-[1px]">
      сбросить пароль
    </button>
    <button @click="updateUser" class="p-[10px] border-green-500 border-[1px]">
      сменить пароль
    </button>

    тут модалка для загрузки аватарки
  </div>

  форма пока что регистрации и авторизации

  <div class="flex flex-col p-[10px] w-[300px]">
    {{ name }}
    <input
      type="text"
      v-model="name"
      class="border border-red-400"
      placeholder="имя (не заполняется при авторизации)"
    />
    <input type="email" v-model="email" class="border border-red-400" placeholder="имеил" />
    <input type="password" v-model="password" class="border border-red-400" placeholder="пароль" />
  </div>

  <UploadAvatar />
</template>

<style scoped>
img {
  width: 100px;
}
</style>
