<template>
  <button
    class="cnt__select"
    @blur="open = false"
    @click="clickHandler()"
    @keydown="toggleAciveSelect($event.code, $event)"
  >
    <div class="button__select">
      <span>{{ defaultOption }}</span>
      <span>&#9660;</span>
    </div>

    <div class="absolute z-10 w-full flex flex-col bg-zinc-700" v-show="open">
      <div
        v-for="option in options"
        :key="Math.floor(Math.random() * 100000000)"
        :class="{
          button__select: true,
          'hover:bg-zinc-600': option === activeOption ? false : true,
          active: option === activeOption,
        }"
        @click.stop="select(option)"
      >
        {{ option }}
      </div>
    </div>
  </button>
</template>

<script>
  export default {
    name: "VInputSelect",

    data() {
      return {
        open: false,
        activeOption: this.defaultOption,
      };
    },

    props: {
      options: {
        type: Array,
        required: true,
      },

      defaultOption: {
        type: String,
        required: true,
      },
    },

    methods: {
      clickHandler() {
        this.open = !this.open;

        if (this.activeOption !== this.defaultOption) {
          this.select(this.activeOption);
        }
      },

      toggleAciveSelect(code, e) {
        if (this.open === false) return;

        switch (code) {
          case "KeyW":
          case "ArrowUp": {
            e.preventDefault();
            let index = this.options.findIndex(
              (el) => el === this.activeOption
            );

            if (index === 0) {
              this.activeOption = this.options.at(-1);
              return;
            }

            this.activeOption = this.options[index - 1];
            return;
          }

          case "KeyS":
          case "ArrowDown": {
            e.preventDefault();
            let index = this.options.findIndex(
              (el) => el === this.activeOption
            );

            if (index === this.options.length - 1) {
              this.activeOption = this.options[0];
              return;
            }

            this.activeOption = this.options[index + 1];
            return;
          }
        }
      },

      select(name) {
        if (name === this.defaultOption) {
          this.open = false;
          return;
        }

        this.activeOption = name;
        this.$emit("input", name);
        this.open = false;
      },
    },

    watch: {
      defaultOption() {
        if (this.activeOption !== this.defaultOption) {
          this.activeOption = this.defaultOption;
        }
      },

      open(value) {
        if (value === false) {
          this.activeOption = this.defaultOption;
        }
      },
    },
  };
</script>
