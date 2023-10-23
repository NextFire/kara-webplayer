<script setup lang="ts">
import subOctoWorkerLegacyUrl from "~/node_modules/libass-wasm/dist/js/subtitles-octopus-worker-legacy.js?url";
import subOctoWorkerUrl from "~/node_modules/libass-wasm/dist/js/subtitles-octopus-worker.js?url";
import subOctoWorkerWasmUrl from "~/node_modules/libass-wasm/dist/js/subtitles-octopus-worker.wasm?url";
import subOctoUrl from "~/node_modules/libass-wasm/dist/js/subtitles-octopus.js?url";

const subOctoLoaded = ref(false);
useHead({
  script: [
    {
      src: subOctoUrl,
      async: true,
      onload: () => {
        subOctoLoaded.value = true;
      },
    },
  ],
  link: [
    { href: subOctoWorkerUrl },
    { href: subOctoWorkerWasmUrl },
    { href: subOctoWorkerLegacyUrl },
  ],
});

const route = useRoute();
const { data } = await useFetch(
  `/api/contents/dir?filepath=${route.params.kara}`
);
const video = computed(() => data.value?.find((i) => i.name.endsWith(".mp4")));
const subs = computed(() => data.value?.find((i) => i.name.endsWith(".ass")));

const videoRef = ref<HTMLVideoElement | null>(null);
watch([subOctoLoaded, subs], async () => {
  if (subOctoLoaded && subs.value) {
    const { data } = await useFetch(
      `/api/contents/file?filepath=${subs.value.path}`
    );

    // https://developer.mozilla.org/en-US/docs/Glossary/Base64#the_unicode_problem
    const binString = atob(data.value!.content);
    const decoded = new TextDecoder().decode(
      // @ts-ignore
      Uint8Array.from(binString, (m) => m.codePointAt(0))
    );

    const options = {
      video: videoRef.value, // HTML5 video element
      subContent: decoded,
      fonts: [
        // Links to fonts (not required, default font already included in build)
        "/fonts/Amaranth-Bold.ttf",
        "/fonts/Amaranth-BoldItalic.ttf",
        "/fonts/Amaranth-Italic.ttf",
        "/fonts/Amaranth-Regular.ttf",
      ],
      workerUrl: subOctoWorkerUrl, // Link to WebAssembly-based file "libassjs-worker.js"
      legacyWorkerUrl: subOctoWorkerLegacyUrl, // Link to non-WebAssembly worker
    };
    // @ts-ignore
    window.octopusInstance = new SubtitlesOctopus(options);
  }
});

onUnmounted(() => {
  // @ts-ignore
  window.octopusInstance.dispose();
});
</script>

<template>
  <video ref="videoRef" controls autoplay class="h-screen w-screen">
    <!-- LFS workaround -->
    <source
      :src="video?.download_url.replace('/raw/branch/', '/media/branch/')"
    />
  </video>
</template>

<style>
body {
  @apply bg-black;
}
</style>
