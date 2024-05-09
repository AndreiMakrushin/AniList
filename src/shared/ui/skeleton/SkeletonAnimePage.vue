<script setup lang="ts">
import noimg from '@/assets/img/noimg.jpeg'
import { ContentLoader } from 'vue-content-loader'
</script>

<template>
  <div class="w-[100%] flex flex-row gap-0 md:gap-5 p-3 text-[#d8d8d8] text-[20px]">
    <div class="max-w-[300px] h-full rounded-[10px] overflow-hidden hidden lg:block">
      <ContentLoader :speed="3" :width="371" :height="387" :animate="true">
        <rect x="0" y="0" rx="0" ry="0" width="371" height="387" />
      </ContentLoader>
    </div>
    <div class="w-[100%] flex flex-col gap-5 p-[10px] mb-2">
      <div class="flex flex-col gap-5">
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="500" :height="40">
            <rect x="0" y="0" rx="10" ry="10" width="500" height="30" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="300" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="300" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="100" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="100" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="400" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="400" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="430" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="430" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="350" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="350" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="450" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="450" height="20" />
          </ContentLoader>
        </p>

        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="500" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="500" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="300" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="300" height="20" />
          </ContentLoader>
        </p>
        <p class="rounded-[10px] flex w-[100%]">
          <ContentLoader :speed="2" :width="200" :height="20">
            <rect x="0" y="0" rx="10" ry="10" width="200" height="20" />
          </ContentLoader>
        </p>
      </div>

      <div class="rounded-[10px] overflow-hidden max-w-[700px] relative">
        <img :src="noimg" alt="" />
        <span class="w-[100%] h-[100%] absolute top-0 left-0 bg-white"></span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
