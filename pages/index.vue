<script setup lang="ts">
const { data } = await useFetch("/api/contents/dir");
const karas = computed(() =>
  data.value?.filter((i) => i.type == "dir" && !i.name.startsWith("_"))
);
</script>

<template>
  <div class="max-w-screen-lg mx-auto my-4 px-8">
    <ul>
      <li v-for="kara in karas">
        <a :href="kara.path" class="hover:underline">{{ kara.name }}</a>
      </li>
    </ul>
  </div>
</template>
