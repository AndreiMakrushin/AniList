<script setup lang="ts">
import { onMounted, defineProps, ref, watch, computed, reactive } from 'vue'
import Hls from 'hls.js'
import SelectEpisode from './widgetsPlayer/SelectEpisode.vue'
import IconSprite from '@/shared/IconSprite.vue'
import Preview from './widgetsPlayer/Preview.vue'
import ProgressBar from './widgetsPlayer/ProgressBar.vue'
import type { Anime, User, addAnime } from '@/stores/types'
import noImg from '@/assets/img/noimg.jpeg'
import { supabase } from '@/supabase'
import { useAnimeStore } from '@/stores/animeStore'
import { updateAnimeHistory } from '../../features/updateAnime/updateAnime'
import {addNewAnimeHistory} from '../../features/addAnime/addAnime'
const animeStore = useAnimeStore()

const props = defineProps<{
  AnimePlay?: Anime
  animeName?: string
  animeId?: number
}>()

const episodeAnime = ref<number>(animeStore.animeEpisode)
const quality = ref<string>('hd')
const timer = ref<number>(0)
const fullscreen = ref<boolean>(false)
const videoElement = ref<HTMLVideoElement | null>(null)
const isPreview = ref<boolean>(false)
const playing = ref<boolean>(false)
const isQualityVideo = ref<boolean>(false)

const seria = computed(() => {
  return 'https://cache.libria.fun' + props.AnimePlay?.list[episodeAnime.value]?.hls[quality.value]
})
const previewAnime = computed(() => {
  return props.AnimePlay?.list[episodeAnime.value]?.preview
    ? 'https://dl-20211030-963.anilib.top' + props.AnimePlay?.list[episodeAnime.value]?.preview
    : noImg
})

onMounted(() => {
  watch([props, episodeAnime, quality], () => {
    if (!seria.value || !videoElement.value) {
      return
    }
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(seria.value)
      hls.attachMedia(videoElement.value)
    } else if (videoElement.value?.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.value.src = seria.value
    }
  })
})

watch(episodeAnime, () => {
  isPreview.value = false
})

const updateEpisode = (event: string) => {
  episodeAnime.value = parseInt(event)
}
const playVideo = () => {
  if (isQualityVideo.value) {
    isQualityVideo.value = false
    return
  }
  if (!videoElement.value) return
  isPreview.value = true
  playing.value = true
  videoElement.value.play()
  addAnimeToHistory()
}

const videoPaused = () => {
  if (isQualityVideo.value) {
    isQualityVideo.value = false
    return
  }
  if (!videoElement.value) return
  playing.value = false
  videoElement.value.pause()
}

const videoTimer = (time: number) => {
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor((time % 3600) % 60)

  if (time >= 3600) {
    const hour = Math.floor(time / 3600)
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

const videoTime = computed(() => {
  const time = Math.floor(timer.value)
  return videoTimer(time)
})

const videoDuration = computed(() => {
  if (!videoElement.value) return
  const time = Math.floor(videoElement.value?.duration)

  return videoTimer(time)
})

const progress = computed(() => {
  if (!videoElement.value) return
  if (!timer.value) return
  return {
    width: `${(timer.value / videoElement.value?.duration) * 100}%`
  }
})
watch(timer, () => {
  if (timer.value === videoElement.value?.duration) {
    episodeAnime.value++
  }
})
const nextEpisode = () => {
  if (episodeAnime.value === Object.keys(props.AnimePlay?.list).length) {
    episodeAnime.value = 0
  }
  episodeAnime.value++
}
const prevEpisode = () => {
  if (episodeAnime.value === 1) return
  episodeAnime.value--
}
const seekVideo = (e: MouseEvent | TouchEvent) => {
  if (!videoElement.value) return

  const progressWidth = (e.target as HTMLElement).offsetWidth
  let clickX = 0

  if (e instanceof MouseEvent) {
    clickX = (e as MouseEvent).offsetX
  } else if (e instanceof TouchEvent) {
    clickX =
      (e as TouchEvent).changedTouches[0].clientX -
      (e.target as HTMLElement).getBoundingClientRect().left
  }

  const newTime = (clickX / progressWidth) * (videoElement.value?.duration || 0)
  videoElement.value.currentTime = newTime
}
const fullScreen = () => {
  if (!videoElement.value) return
  const player = document.getElementById('player') as HTMLVideoElement | null
  if (!player) return
  player
    .requestFullscreen()
    .then(() => {
      fullscreen.value = true
    })
    .catch((err) => {
      console.log(err)
    })
}
const normalScreen = () => {
  if (!videoElement.value) return
  if (!fullscreen.value) return
  document.exitFullscreen()
  fullscreen.value = false
}
const openSelectQuality = () => {
  isQualityVideo.value = !isQualityVideo.value
}
const updateQuality = (event: string) => {
  quality.value = event
  isQualityVideo.value = false
}

/* const addNewAnimeHistory = async () => {
  if (!animeStore.user) return
  try {
    await supabase.from('animeUserList').insert({
      animeId: props.animeId,
      userId: animeStore.user.id,
      current_Time: Math.floor(timer.value),
      duration_Time: Math.floor(videoElement.value?.duration || 0),
      nameAnime: props.animeName,
      img:
        'https://dl-20211030-963.anilib.top' + props.AnimePlay?.list[episodeAnime.value]?.preview,
      episode: episodeAnime.value
    })
  } catch (insertError) {
    console.log(insertError)
  }
} */
/* const updateAnimeHistory = async () => {
  if (!animeStore.user) return
  try {
    await supabase
      .from('animeUserList')
      .update({
        current_Time: timer.value
      })
      .match({
        animeId: props.animeId,
        episode: episodeAnime.value,
        userId: animeStore.user.id
      })
    return
  } catch (updateError) {
    console.log(updateError)
  }
} */

async function addAnimeToHistory() {
  if (!animeStore.user) return
  try {
    const { data: existsAnime, error: existsAnimeError } = await supabase
      .from('animeUserList')
      .select()
      .filter('animeId', 'eq', props.animeId)
      .filter('episode', 'eq', episodeAnime.value)
      .filter('userId', 'eq', animeStore.user.id)
      .single()
    console.log(existsAnime)
    if (videoElement.value && existsAnime) {
      videoElement.value.currentTime = existsAnime.current_Time
      return
    }
  } catch (error) {
    console.log(error)
  }
  const anime = {
    animeId: props.animeId,
    userId: animeStore.user.id,
    current_Time: timer.value,
    duration_Time: Math.floor(videoElement.value?.duration || 0),
    nameAnime: props.animeName,
    img: props.AnimePlay?.list[episodeAnime.value]?.preview,
    episode: episodeAnime.value
  }
  addNewAnimeHistory(anime)
}

const timeUpdate = () => {
  timer.value = Math.floor(videoElement.value?.currentTime)
}

watch(timer, () => {
  if (!animeStore.user) return
  if (timer.value >= 10) {
    updateAnimeHistory(animeStore.user.id, props.animeId, episodeAnime.value, timer.value)
  }
})
</script>

<template>
  <div
    class="max-w-[700px] max-h-[400px] relative flex flex-col bg-slate-800 rounded-[10px]"
    id="player"
  >
    <Preview
      :previewAnime="previewAnime ? previewAnime : noImg"
      v-if="!isPreview"
      @click="playVideo()"
    />

    <video
      id="my-video"
      v-show="isPreview"
      class="w-full h-full rounded-[10px]"
      ref="videoElement"
      @timeupdate="timeUpdate"
      @click="playing ? videoPaused() : playVideo()"
      :controls="false"
    ></video>
    <SelectEpisode
      class="absolute top-2 right-2"
      :episodes="props.AnimePlay?.list"
      :selected="episodeAnime"
      @update="updateEpisode($event)"
    />
    <div
      class="absolute bottom-0 w-full flex flex-col text-white px-2 py-1 gap-1 transition-all ease-in-out duration-500"
      v-if="isPreview"
    >
      <ProgressBar
        :style="progress"
        :value="(timer / videoElement?.duration) * 100"
        @update="seekVideo($event)"
      />

      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row gap-2 items-center">
          <IconSprite class="cursor-pointer" name="icon-prev" @click.stop="prevEpisode" />
          <IconSprite
            class="cursor-pointer"
            name="icon-pause"
            @click.stop="videoPaused"
            v-if="playing"
          />
          <IconSprite
            class="cursor-pointer"
            name="icon-play-small"
            @click.stop="playVideo"
            v-if="!playing"
          />
          <IconSprite class="cursor-pointer" name="icon-next" @click.stop="nextEpisode" />

          <p>
            {{ videoTime }}
            / {{ videoDuration }}
          </p>
        </div>
        <div class="flex flex-row gap-3">
          <IconSprite
            @click.stop="openSelectQuality"
            name="icon-settings"
            class="hover:rotate-[60deg] duration-short cursor-pointer"
          />
          <IconSprite
            v-if="!fullscreen"
            name="icon-fullScreen"
            class="hover:scale-110 duration-short cursor-pointer"
            @click="fullScreen()"
          />
          <IconSprite
            v-else
            name="icon-smallScreen"
            class="hover:scale-20 duration-short cursor-pointer"
            @click="normalScreen()"
          />
        </div>
      </div>
    </div>

    <div
      class="absolute text-white bottom-10 right-5 bg-gray-500 rounded-[10px] overflow-hidden"
      v-if="isQualityVideo"
    >
      <ol>
        <li
          class="cursor-pointer px-2 py-1 hover:bg-gray-700 duration-short"
          :class="{ 'bg-gray-700': quality === key, hidden: q === null }"
          v-for="(q, key) in props.AnimePlay?.list[episodeAnime]?.hls"
          :key="key"
          @click="updateQuality(key)"
        >
          {{ String(key) === 'fhd' ? 1080 : String(key) === 'hd' ? 720 : 480 }}p
        </li>
      </ol>
    </div>
  </div>
</template>
