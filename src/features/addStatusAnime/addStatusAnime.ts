import { supabase } from '@/supabase'
import type { Anime } from '@/stores/types'

export const addStatusAnime = async (anime: Anime) => {
  try {
    await supabase.from('animeStatusList').insert({
      animeId: anime.animeId,
      userId: anime.userId,
      nameAnime: anime.nameAnime,
      img: anime.img ? 'https://dl-20211030-963.anilib.top' + anime.img : null,
      status: anime.status
    })
  } catch (error) {
    console.log(error)
  }
}
