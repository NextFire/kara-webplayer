<script setup lang="ts">
const props = defineProps<{
  data: Content[];
}>();

const karas = computed(() => props.data.filter((i) => i.type == "dir"));
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
