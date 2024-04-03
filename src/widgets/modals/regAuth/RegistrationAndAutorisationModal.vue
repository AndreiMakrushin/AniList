<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Input from '../../../shared/ui/Input.vue'
import type { Credentials } from '../../../stores/types'
import { useAnimeStore } from '../../../stores/animeStore'
import Button from '../../../shared/ui/Button.vue'

const animeStore = useAnimeStore()
const switching = ref<boolean>(true)
const credentials: Credentials = reactive({
  name: '',
  email: '',
  password: ''
})

const registration = () => {
  animeStore.registerUser(credentials)
}
const login = () => {
  animeStore.login(credentials.email, credentials.password)
}

const registerAndAuth = computed(() => {
  return switching.value ? 'Вход' : 'Регистрация'
})

const switcher = computed(() => {
  return switching.value ? 'Зарегистрироваться' : 'Войти'
})
</script>

<template>
  <teleport to="body">
    <div
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
      v-if="animeStore.authRegModal"
    >
      <div class="absolute bg-black opacity-50 inset-0"></div>
      <div
        class="bg-white p-6 rounded-lg max-w-md w-full z-10 flex flex-col gap-3 text-center justify-center"
      >
        <span>{{ registerAndAuth }}</span>
        <Input v-if="!switching" type="text" v-model="credentials.name" placeholder="имя" />
        <Input type="email" v-model="credentials.email" placeholder="имеил" />
        <Input type="password" v-model="credentials.password" placeholder="пароль" />
        <Button
          v-if="!switching"
          @click="registration"
          :class="'bg-white rounded-[15px] p-3 hover:shadow-shadowDrop hover:ring-[1px] hover:ring-cyan-300 text-black font-medium'"
          text="Зарегистрироваться"
        />
        <Button
          v-else
          @click="login"
          :class="'bg-white rounded-[15px] p-3 hover:shadow-shadowDrop hover:ring-[1px] hover:ring-cyan-300 text-black font-medium'"
          text="Войти"
        />
        <span>{{ switching ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?' }}</span>
        <Button
          :class="'bg-white rounded-[15px] p-3 hover:shadow-shadowDrop hover:ring-[1px] hover:ring-cyan-300 text-black font-medium'"
          @click="switching = !switching"
          :text="switcher"
        />
      </div>
    </div>
  </teleport>
</template>
