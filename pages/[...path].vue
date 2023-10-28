<script setup lang="ts">
const route = useRoute();
const path = route.params.path;

const filepath = typeof path == "string" ? path : path.join("/");
const { data } = await useFetch(`/api/contents/dir?filepath=${filepath}`);

const video = computed(() => data.value?.find((i) => i.name.endsWith(".mp4")));
const subs = computed(() => data.value?.find((i) => i.name.endsWith(".ass")));
</script>

<template>
  <Player v-if="video && subs" :video="video" :subs="subs" />
  <Listing v-else-if="data" :data="data" />
</template>
