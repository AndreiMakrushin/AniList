import { defineStore } from 'pinia'
import { supabase } from '@/supabase'
import type { User, Credentials, Anime } from './types'
import { ref, watch } from 'vue'

export const useAnimeStore = defineStore('animestore', () => {
  const user = ref<User>(null)
  const modal = ref<boolean>(false)
  const authRegModal = ref<boolean>(false)
  const aniList = ref<Anime[]>([])
  const searchedAnime = ref<Anime[]>([])
  const animeCount = ref<number>(20)
  const animePage = ref<number>(1)
  const animeEpisode = ref<number>(1)

/*   const animeList = async () => {
    const response = await axios.get(`${API_list}${animePage.value}&limit=${animeCount.value}`)
    return response.data
  } */
/* https://api.anilibria.tv/v3/title/updates?page=1&limit=24 */
 watch(user, () => {
   if (user.value) authRegModal.value = false
 })

  const login = async (email: string, password: string): Promise<void> => {
    if (!email && !password) return
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    if (error) {
      console.log('Неправильный логин или пароль')
    }
    if (!data.user) return
    const { data: existingUser } = await supabase.from('users').select().eq('email', email).single()

    user.value = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      avatar_url: existingUser.avatar_url
    } as User
  }

  const registerUser = async (credentials: Credentials): Promise<void> => {
    const { name, email, password } = credentials

    const { data: userExistsWithUsername } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()

    if (userExistsWithUsername) return console.log('Такая почта уже зарегистрирована')

    const { error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) {
      return console.error(error)
    }

    await supabase.from('users').insert({
      name: name,
      email: email
    })

    const { data: newUser } = await supabase.from('users').select().eq('email', email).single()

    return (user.value = newUser)
  }

  const getUser = async (): Promise<void> => {
    
    const unauthorized = await supabase.auth.getSession()
    if (unauthorized.data.session === null) return

    const { data, error } = await supabase.auth.getUser()

    const { data: userWithEmail } = await supabase
      .from('users')
      .select()
      .eq('email', data.user.email)
      .single()

    user.value = {
      id: userWithEmail.id,
      name: userWithEmail.name,
      email: userWithEmail.email,
      avatar_url: userWithEmail.avatar_url
    } as User

    if (error) return console.error(error)
  }



    supabase
      .channel('users')
      .on('postgres_changes', {event: '*', schema: 'public', table: 'users'}, (payload: any) => {
        user.value = {
          id: payload.new.id,
          name: payload.new.name,
          email: payload.new.email,
          avatar_url: payload.new.avatar_url
        } as User
      })
      .subscribe()


  const logout = async (): Promise<void> => {
    await supabase.auth.signOut()
    user.value = null
  }

  const recoverPassword = async (email: string): Promise<void> => {
    console.log(email);
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) return console.error(error)
  }


  return { login, registerUser, user, getUser, logout, recoverPassword, modal, authRegModal, aniList, animeCount,  animePage, searchedAnime, animeEpisode }
})
