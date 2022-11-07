export default {
  methods: {
    copy(text = "", isAlert = true) {
      if (text === "") return;

      if (navigator?.clipboard) {
        navigator.clipboard.writeText(text);
        if (isAlert) alert("Данные были успешно скопированы в буфер обмена");
        return;
      }

      alert("Ваш браузер не поддерживает копирование в буфер обмена (");
    },

    copyTimeText(title = "") {
      this.$nextTick(() => {
        this.copy(
          (title === "" ? "" : title + "\n\n") +
            this.$refs.timeResult.$el.innerText
        );
      });
    },
  },
};
