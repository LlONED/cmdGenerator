<template>
  <setting-item settingTitle="Автоматизация ивента">
    <option-modal modalTitle="зачем нужен дискорд токен?">
      <template #description> дискорд токен (описание*) </template>

      <template #body>
        <div class="flex flex-col gap-5">  
          <p>
            Дискорд токен треубется для отслеживания и логирования действий
            пользователей.
          </p>
          
          <p class="flex flex-col gap-2">
            Проверить добросовестное использование токена со стороны сайта можно
            следующими способами:
            
            <ol>
              <li>
                1) Посмотреть исходный код сайта
                <a
                href="https://github.com/LlONED/cmdGenerator"
                target="_blank"
                class="underline text-blue-500"
                >https://github.com/LlONED/cmdGenerator</a
                >
              </li>

              <li>
                2) Посмотреть запросы отправляемые сайтом в интруметах разработчика. (Вкладка "Network" (Сеть)).
              </li>
            </ol>
          </p>

          <p class="flex flex-col gap-2">
            Инструкция для получения токена:
            
            <ol>
              <li>1) Зарегистрировать новый аккаунт в дискорде (желательно использовать email, который не был связан с основным аккаунтом)</li>
              <li>2) Зайти на сервер, на котором будет производиться отслеживание голосового канала (Прохождение верификации не требуется)</li>
              <li>3) Перейти в инструменты разработчика (клавиша F12) -> Вкладка "Network (Сеть)" -> раздел "Fetch/XHR"</li>
              <li>4) Обновить страницу</li>
              <li>5) Найти и нажать ЛКМ на запрос содержащий "messages?limit"</li>
              <li>6) В открывшимся справа окне перейти в раздел "Headers (Заголовки)"</li>
              <li>7) В "Request Headers (Заголовки запросов)" найти поле "authorization" -> ПКМ -> копировать значение</li>
              <li>8) Сохранить токен в надёжном месте</li>
            </ol>
          </p>

          <p>
            <strong>Внимание!!!</strong>
            Не используйте токен от основного аккаунта дискорда! Частое использование токена путём копирования, хранения в файле повышает вероятность его обнаружения. 
            <br>Надёжная и безопасная альтернатива - регистрация нового аккаунта в дискорде
          </p>
        </div>
        </template>

      <template #options>
        <v-input-text
          placeholder="токен"
          :value="discordToken"
          :hidden="true"
          @input="setDiscordToken"
        />
      </template>
    </option-modal>

    <option-input
      description="id голосового канала"
      v-show="isDiscordTokenValid"
    >
      <v-input-text
        placeholder="id"
        :value="voiceChatId"
        @input="setVoiceChatId"
      />
    </option-input>

    <connection-manager
      v-show="voiceChatId.length > 6"
      :token="discordToken"
      :serverId="currentPreset.id"
      :voiceChatId="voiceChatId"
      :users="users"
      @actionsUpdate="actionsUpdate"
    />
  </setting-item>
</template>

<script>
  import { timeType } from "@/types/time";
  import { userAction, userStatus } from "@/types/user";
  import { connectionAction } from "@/types/connection";

  import { addPointsTimeLogic } from "@/utils/time";

  import ConnectionManager from "@/components/Setting/TheEventAutomation/ConnectionManager.vue";

  import SettingItem from "@/components/Setting/SettingItem.vue";
  import OptionModal from "@/components/Setting/OptionModal.vue";
  import OptionInput from "@/components/Setting/OptionInput.vue";
  import { mapGetters, mapMutations } from "vuex";

  export default {
    name: "TheEventAutomation",

    components: {
      ConnectionManager,
      SettingItem,
      OptionModal,
      OptionInput,
    },

    data() {
      return {
        discordToken: "",
        voiceChatId: "",
      };
    },

    methods: {
      ...mapMutations({
        addUser: "addUser",
        removeUser: "removeUser",
        updateUsers: "updateUsers",
        updateCurrentPreset: "updateCurrentPreset",
      }),

      setDiscordToken(token = "") {
        this.discordToken = token;
      },

      setVoiceChatId(id = "") {
        this.voiceChatId = id;
      },

      actionsUpdate({
        action = connectionAction,
        userActions = [{ action: userAction, id: "", name: "" }],
        meta = {},
      }) {
        for (const action of userActions) {
          this.actionUpdate(action);
        }
      },

      actionUpdate({ action = userAction, id = "", name = "" }) {
        const isUserExist = this.users.some((el) => el.id === id);

        if (action === userAction.Join) {
          if (isUserExist === true)
            this.updateUsers((user) => {
              if (user.id !== id) return user;

              user.isActive = true;
              user.status = userStatus.Online;
              user.times = addPointsTimeLogic(user.times, [action]);
              return user;
            });
          else
            this.addUser({
              name,
              id,
              status: userStatus.Online,
              isActive: true,
              times: {
                actions: [
                  {
                    type: this.isEventActive ? timeType.Event : timeType.Other,
                    index: this.isEventActive ? this.eventCount - 1 : -1,
                    start: Date.now(),
                    end: -1,
                    points: [
                      {
                        ms: Date.now(),
                        action,
                        isOnline: true,
                      },
                    ],
                  },
                ],
                online: 0,
              },
            });
          return;
        }

        if (action === userAction.Leave) {
          this.updateUsers((user) => {
            if (user.id !== id) return user;

            user.isActive = false;
            user.status = userStatus.Offline;
            user.times = addPointsTimeLogic(user.times, [action]);
            return user;
          });
          return;
        }
      },
    },

    computed: {
      ...mapGetters({
        users: "users",
        currentPreset: "currentPreset",
        isEventActive: "isEventActive",
        eventCount: "eventCount",
      }),

      isDiscordTokenValid() {
        return (
          this.discordToken.length > 6 &&
          this.discordToken.split(".").length === 3
        );
      },
    },
  };
</script>
