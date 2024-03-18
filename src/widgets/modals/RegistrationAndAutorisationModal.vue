<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import Input from '../../shared/ui/Input.vue'
import type { Credentials } from '../../stores/types'
import { useAnimeStore } from '../../stores/animeStore'
import Button from '../../shared/ui/Button.vue'

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
</script>

<template>
  <teleport to="body">
    <div class="absolute top-0 w-[100%] h-[100%]" v-if="animeStore.authRegModal">
      <div class="w-[100%] h-[100%] bg-black opacity-[0.5]"></div>
      <div class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div class="flex flex-col gap-5 w-[600px] justify-center text-center">
          <span>{{ registerAndAuth }}</span>
          <Input
            v-if="!switching"
            :type="'text'"
            :modelValue="credentials.name"
            v-model="credentials.name"
            placeholder="имя"
          />
          <Input
            :type="'email'"
            :modelValue="credentials.email"
            v-model="credentials.email"
            placeholder="имеил"
          />
          <Input
            :type="'password'"
            :modelValue="credentials.password"
            v-model="credentials.password"
            placeholder="пароль"
          />
          <Button
            v-if="!switching"
            @click="registration"
            :style="'bg-white p-[11px] rounded-[17px] text-black font-medium '"
            :text="'Зарегистрироваться'"
          />
          <Button
            v-else
            @click="login"
            :style="'bg-white p-[11px] rounded-[17px] text-black font-medium '"
            :text="'Войти'"
          />
          <span>{{ switching ? 'Ещё нет аккаунта?' : 'Уже есть аккаунт?' }}</span>
          <button @click="switching = !switching">
            {{ switching ? 'Зарегистрироваться' : 'Войти' }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>
