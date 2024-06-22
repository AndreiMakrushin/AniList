import { supabase } from '@/supabase'
import type { User } from '@/stores/types'

export const sendCommentary = async (user: User, commentary: string) => {
  try {
    const { data, error } = await supabase.from('animeCommentaries').insert({
      animeId: user.animeId,
      userId: user.userId,
      userName: user.userName,
      img: user.img,
      commentary: commentary,
      randomId: Math.floor(Math.random() * 10000)
    })
    if (error) {
      return console.log('ошибка:', error.message)
    } else {
      return data
    }
  } catch (error) {
    console.log('ошибка:', error)
  }
}
