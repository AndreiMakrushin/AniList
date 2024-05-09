import { supabase } from '@/supabase'

export const updateAnimeHistory = async (
  userId: number,
  animeId: number | undefined,
  episode: number,
  timer: number,
  realTimeUpdate: string
) => {
  try {
    await supabase
      .from('animeUserList')
      .update({
        current_Time: timer,
        updated: realTimeUpdate
      })
      .match({
        animeId: animeId,
        episode: episode,
        userId: userId
      })
    return
  } catch (updateError) {
    console.log(updateError)
  }
}


/* updateAnimeHistory(animeStore.user.id, props.animeId, episodeAnime.value ,timer.value) */