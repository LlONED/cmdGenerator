<template>
  <setting-item settingTitle="Результат">
    <v-textarea :value="commandResult" class="h-60"></v-textarea>

    <div class="flex flex-wrap gap-2">
      <v-button class="p-3" @click="saveEventsStats">скачать отчёт </v-button>
      <v-button class="p-3" @click="resetPrizeCount">сброс выдач</v-button>
      <v-button class="p-3" @click="resetCoins">сброс коинов</v-button>
    </div>
  </setting-item>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";

  import SettingItem from "@/components/Setting/SettingItem.vue";
  export default {
    name: "TheResult",

    components: {
      SettingItem,
    },

    computed: {
      ...mapGetters({
        commandResult: "commandResult",
        defaultCoins: "defaultCoins",
        defaultPrizeCount: "defaultPrizeCount",
        currentServer: "currentServer",
      }),
    },

    methods: {
      ...mapMutations({
        updateUsers: "updateUsers",
      }),

      resetPrizeCount() {
        this.updateUsers((user) => {
          user.prizeCount = this.defaultPrizeCount;
          return user;
        });
      },

      resetCoins() {
        this.updateUsers((user) => {
          user.coins = this.defaultCoins;
          return user;
        });
      },

      saveEventsStats() {
        // TODO rewrite logic
        let text = [...document.querySelectorAll('[data-modalId="time"]')]
          .map((el) => {
            el.style.display = "flex";
            let str = el.innerText.replace("\nкопировать\nx", "");
            el.style.display = "none";
            return str;
          })
          .join("\n\n\n\n");

        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(
          new Blob([text], { type: "text/plain" })
        );
        a.download = `${this.currentServer}.txt`;
        a.click();
      },
    },
  };
</script>
