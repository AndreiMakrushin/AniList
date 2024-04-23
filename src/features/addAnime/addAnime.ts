import { supabase } from '@/supabase';
import { addAnime } from '@/stores/types';

export const addNewAnimeHistory = async (anime: addAnime) => {
  try {
    await supabase.from('animeUserList').insert({
      animeId: anime.animeId,
      userId: anime.userId,
      current_Time: Math.floor(anime.current_Time),
      duration_Time: Math.floor(anime.duration_Time),
      nameAnime: anime.nameAnime,
      img: 'https://dl-20211030-963.anilib.top' + anime.img,
      episode: anime.episode
    });
  } catch (insertError) {
    console.log(insertError);
  }
};