<template>
  <main class="flex flex-wrap justify-between1 w-5/6 h-5/6 gap-7">
    <TheUsers />
    <TheSettings />
  </main>
</template>

<script>
  import TheSettings from "@/components/Setting/TheSettings.vue";
  import TheUsers from "@/components/User/TheUsers.vue";

  export default {
    name: "App",

    components: {
      TheSettings,
      TheUsers,
    },
  };
</script>
