<script setup lang="ts">
const { data } = await useFetch("/api/contents/dir");
const karas = computed(() =>
  data.value?.filter((i) => i.type == "dir" && !i.name.startsWith("_"))
);
</script>

<template>
  <ul>
    <li v-for="kara in karas">
      <a :href="kara.path">{{ kara.name }}</a>
    </li>
  </ul>
</template>
