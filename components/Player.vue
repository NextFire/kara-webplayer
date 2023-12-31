<script setup lang="ts">
const props = defineProps<{
  video: Content;
  subs: Content;
}>();

const subOctoLoaded = ref(false);
useHead({
  script: [
    {
      src: "/libass-wasm/subtitles-octopus.js",
      async: true,
      onload: () => {
        subOctoLoaded.value = true;
      },
    },
  ],
});

const videoRef = ref<HTMLVideoElement | null>(null);
watch([subOctoLoaded, props.subs], async () => {
  if (subOctoLoaded && props.subs) {
    const { data } = await useFetch(
      `/api/contents/file?filepath=${props.subs.path}`
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
        "/fonts/Amaranth/amaranth-latin-400-italic.woff",
        "/fonts/Amaranth/amaranth-latin-400-italic.woff2",
        "/fonts/Amaranth/amaranth-latin-400-normal.woff",
        "/fonts/Amaranth/amaranth-latin-400-normal.woff2",
        "/fonts/Amaranth/amaranth-latin-700-italic.woff",
        "/fonts/Amaranth/amaranth-latin-700-italic.woff2",
        "/fonts/Amaranth/amaranth-latin-700-normal.woff",
        "/fonts/Amaranth/amaranth-latin-700-normal.woff2",
        "/fonts/Trebuchet MS/Trebuchet MS Bold Italic.ttf",
        "/fonts/Trebuchet MS/Trebuchet MS Bold.ttf",
        "/fonts/Trebuchet MS/Trebuchet MS Italic.ttf",
        "/fonts/Trebuchet MS/Trebuchet MS.ttf",
      ],
      workerUrl: "/libass-wasm/subtitles-octopus-worker.js", // Link to WebAssembly-based file "libassjs-worker.js"
      legacyWorkerUrl: "/libass-wasm/subtitles-octopus-worker-legacy.js", // Link to non-WebAssembly worker
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
  <video
    ref="videoRef"
    controls
    controlslist="nofullscreen"
    playsinline
    autoplay
    loop
    class="h-screen w-screen bg-black"
  >
    <!-- LFS workaround -->
    <source
      :src="video?.download_url.replace('/raw/branch/', '/media/branch/')"
    />
  </video>
</template>
