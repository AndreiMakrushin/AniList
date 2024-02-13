<script setup>
import { ref } from 'vue'
import { useAnimeStore } from '../stores/animeStore'
import { supabase } from '../supabase'

const animeStore = useAnimeStore()
const avatar = ref(null)
const preloadFile = ref(null)

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

const uploadAvatar = (e) => {
  const file = e.target.files[0]
  if (file) {
    avatar.value = file
    const reader = new FileReader()
    reader.onload = function (e) {
      preloadFile.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const addAvatar = async () => {
  const fileName = Math.floor(Math.random() * 9000000000 + 1000000000)
  console.log(fileName)
  let filePath
  if (avatar.value) {
    const { data, error } = await supabase.storage
      .from('images')
      .upload('public/' + fileName, avatar.value)
    if (error) {
      console.error(error)
    }
    if (data) {
      filePath = data.path

      await supabase
        .from('users')
        .update({
          avatar_url: filePath
        })
        .match({ id: animeStore.user.id })

      await animeStore.getUser()
    }
  } else {
    // заглушка, если пользователь не выбрал изображение
    console.log('no avatar')
  }
}

const deleteAvatar = async () => {
  /*  await supabase.storage.from('users').remove({avatar_url: animeStore.user.avatar_url}) */
  await supabase.from('users').update({ avatar_url: null }).match({ id: animeStore.user.id })
  await animeStore.getUser()
}

const updateUser = async () => {
    const { data, error } = await supabase.auth.updateUser({
        email: email.value,
        password: password.value,
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
    <button @click="animeStore.recoverPassword(email)" class="p-[10px] border-red-500 border-[1px]">сбросить пароль</button>
    <button @click="updateUser" class="p-[10px] border-green-500 border-[1px]">сменить пароль</button>

    тут модалка для загрузки аватарки
    <div class="modal-avatar">
      <div class="add-avatar">
        <input type="file" accept=".jpeg, .png, .jpg" @change="uploadAvatar" />
        <img :src="preloadFile ? preloadFile : ''" alt="" />
      </div>
      <button @click="addAvatar" class="py-[10px] px-[20px] text-white bg-purple-600 rounded-[10px]">загрузить аву</button>
    </div>
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
</template>

<style scoped>
img {
  width: 100px;
}
</style>
