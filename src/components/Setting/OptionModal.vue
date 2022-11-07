<template>
  <div
    class="content-field p-2.5 w-full flex flex-wrap items-center gap-2 justify-center lg:justify-between"
  >
    <v-modal
      :modalTitle="modalTitle"
      :modalId="modalId"
      :show="showModal"
      @close="closeModal"
    >
      <template #buttons>
        <slot name="buttons"></slot>
      </template>

      <template #body>
        <slot name="body"></slot>
      </template>
    </v-modal>

    <span class="cursor-pointer" @click="openModal">
      <slot name="description"></slot>
    </span>

    <div class="flex items-center gap-2">
      <slot name="options"></slot>
    </div>
  </div>
</template>

<script>
  import ModalMixin from "@/mixins/modal";

  export default {
    name: "OptionModal",
    mixins: [ModalMixin],

    props: {
      modalTitle: {
        type: String,
        required: true,
      },

      modalId: {
        type: String,
      },
    },
  };
</script>
