<template>
  <ul
    class="list-none cnt-block gap-3 flex-[7] p-[10px] flex-col max-w-full rounded-lg text-white overflow-y-scroll scrollbar"
  >
    <TheResult />
    <TheEventSettings />
    <TheEventAutomation v-if="currentPreset.id !== ''" />
    <TheOptions />
  </ul>
</template>

<script>
  import TheResult from "@/components/Setting/TheResult.vue";
  import TheEventSettings from "@/components/Setting/TheEventSettings.vue";
  import TheEventAutomation from "@/components/Setting/TheEventAutomation/TheEventAutomation.vue";
  import TheOptions from "@/components/Setting/TheOptions.vue";
  import { mapGetters } from "vuex";

  export default {
    components: {
      TheResult,
      TheEventAutomation,
      TheEventSettings,
      TheOptions,
    },

    name: "TheSettings",

    computed: {
      ...mapGetters({
        currentPreset: "currentPreset",
      }),
    },
  };
</script>
