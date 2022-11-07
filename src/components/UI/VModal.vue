<template>
  <div
    class="fixed flex justify-center items-center top-0 left-0 bottom-0 right-0 bg-zinc-600 bg-opacity-40 w-full h-full z-10"
    v-show="show"
    :data-modalId="modalId"
    @click="close"
  >
    <div
      @click.stop
      class="rounded-md bg-zinc-800 flex flex-col gap-3 min-w-[280px] w-2/5 p-3.5"
    >
      <header class="flex justify-between items-center">
        <h1 class="uppercase">{{ modalTitle }}</h1>
        <div class="flex flex-wrap justify-end gap-2">
          <slot name="buttons" class="py-2 px-3"></slot>
          <v-button class="py-2 px-3 bg-red-700 hover:bg-red-800" @click="close"
            >x</v-button
          >
        </div>
      </header>

      <main class="w-full max-h-[500px] overflow-y-scroll scrollbar">
        <slot name="body"></slot>
      </main>
    </div>
  </div>
</template>

<script>
  export default {
    name: "VModal",

    emits: {
      close: null,
    },

    props: {
      show: {
        type: Boolean,
        required: true,
      },
      modalTitle: {
        type: String,
        required: true,
      },
      modalId: {
        type: String,
      },
    },

    methods: {
      close() {
        this.$emit("close", null);
      },
    },

    watch: {
      show() {
        if (this.show) {
          document.querySelector("body").classList.add("overflow-hidden");
          return;
        }

        document.querySelector("body").classList.remove("overflow-hidden");
      },
    },
  };
</script>

<style scoped>
  :slotted(button) {
    @apply py-2 px-3;
  }
</style>
