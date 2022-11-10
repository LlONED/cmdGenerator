<template>
  <option-modal modalTitle="Логи ошибок">
    <template #description>управление соединением (просмотр логов*)</template>

    <template #body>
      <div class="flex flex-col gap-3" v-if="logs.length > 0">
        <p v-for="log in logs" :key="Math.floor(Math.random() * 10000000)">
          {{ log }}
        </p>
      </div>

      <div class="flex items-center" v-else>логи отсутствуют</div>
    </template>

    <template #options>
      <v-button
        class="p-2 flex justify-between items-center gap-3"
        :disabled="isDisabled"
        @click="toggleConnection"
      >
        <span>{{ buttonText }}</span>
        <div :class="statusClassName"></div>
      </v-button>
    </template>
  </option-modal>
</template>

<script>
  import {
    connectionStatus,
    connectionMessage,
    connectionErrorMessage,
    connectionAction,
  } from "@/types/connection";
  import { userAction, userStatus } from "@/types/user";

  import { sleep } from "@/utils/tools";

  import OptionModal from "@/components/Setting/OptionModal.vue";

  let ws = null;
  let heartbeatInterval = null;
  let heartbeatDelay = 0;

  export default {
    name: "ConnectionManager",

    components: {
      OptionModal,
    },

    data() {
      return {
        status: connectionStatus.Init,
        logs: [],
      };
    },

    emits: {
      actionsUpdate: null,
    },

    props: {
      users: {
        type: Array,
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
      voiceChatId: {
        type: String,
        required: true,
      },
      serverId: {
        type: String,
        required: true,
      },
    },

    methods: {
      async toggleConnection() {
        switch (this.status) {
          case connectionStatus.Disconnect:
          case connectionStatus.Init: {
            await this.setLoading(5000);
            this.connect({ isInit: true });
            return;
          }

          case connectionStatus.Connect: {
            await this.setLoading(5000);
            this.disconnect();
            return;
          }
        }
      },

      connect(options = { isInit: false }) {
        ws = new WebSocket("wss://gateway.discord.gg/?v=9&encoding=json");

        const payload = JSON.stringify({
          op: 2,
          d: {
            token: this.token,
            properties: {
              $os: "windows",
              $browser: "chrome",
              $device: "pc",
            },
          },
        });

        const closeTimeout = setTimeout(() => {
          this.errorLog(connectionErrorMessage.FailedConnect);
        }, 5000);

        ws.onopen = function () {
          ws.send(payload);
        };

        ws.onmessage = ({ data }) => {
          const { t, s, op, d } = JSON.parse(data);

          if (op === 10) {
            heartbeatDelay = d.heartbeat_interval - 500;
            return;
          }

          if (op === 9) {
            this.errorLog("Ошибка сессии");
            return;
          }

          if (op === 7) {
            this.errorLog("Требуется переподключение");

            return;
          }

          if (
            options.isInit === true &&
            t === "READY" &&
            d.guilds.some((el) => el.id === this.serverId)
          ) {
            const payload = JSON.stringify({
              op: 14,
              d: {
                guild_id: this.serverId,
                activities: true,
                threads: true,
                typing: true,
              },
            });

            ws.send(payload);

            clearTimeout(closeTimeout);

            this.status = connectionStatus.Connect;
            this.heartbeatStart();

            const guild = d.guilds.find((el) => el.id === this.serverId);
            const channel = guild.channels.find(
              (el) => el.id === this.voiceChatId
            );

            if (channel === undefined) {
              this.errorLog("Канал не найден");
            }

            this.actionsUpdate({
              action: connectionAction.Init,
              userActions: guild.voice_states
                .filter((el) => el.channel_id === this.voiceChatId)
                .map((el) => {
                  const member = guild.members.find(
                    (e) => e.user.id === el.user_id
                  );

                  return {
                    action: userAction.Join,
                    id: member.user.id,
                    name: this.validateUserName(
                      member.user.username,
                      member.user.discriminator,
                      member.nick
                    ),
                  };
                }),
            });

            return;
          }

          if (
            t === "VOICE_STATE_UPDATE" &&
            d.guild_id === this.serverId &&
            (d.channel_id === this.voiceChatId || d.channel_id === null) &&
            d.member.user.bot === false
          ) {
            const user = this.users.find((el) => el.id === d.user_id);

            // join new user
            if (user === undefined && this.voiceChatId === d.channel_id) {
              this.actionsUpdate({
                action: connectionAction.Update,
                userActions: [
                  {
                    action: userAction.Join,
                    id: d.user_id,
                    name: this.validateUserName(
                      d.member.user.username,
                      d.member.user.discriminator,
                      d.member.nick
                    ),
                  },
                ],
              });
              return;
            }

            // join exist user
            if (
              user !== undefined &&
              user.status !== userStatus.Online &&
              this.voiceChatId === d.channel_id
            ) {
              this.actionsUpdate({
                action: connectionAction.Update,
                userActions: [
                  {
                    action: userAction.Join,
                    id: d.user_id,
                    name: this.validateUserName(
                      d.member.user.username,
                      d.member.user.discriminator,
                      d.member.nick
                    ),
                  },
                ],
              });
              return;
            }

            // leave user
            if (
              user !== undefined &&
              user.status === userStatus.Online &&
              d.channel_id === null
            ) {
              this.actionsUpdate({
                action: connectionAction.Update,
                userActions: [
                  {
                    action: userAction.Leave,
                    id: d.user_id,
                    name: this.validateUserName(
                      d.member.user.username,
                      d.member.user.discriminator,
                      d.member.nick
                    ),
                  },
                ],
              });
              return;
            }
          }
        };

        ws.onerror = (error) => {
          this.errorLog(
            error?.message || error?.msg || "ошибка в потоке сокетов"
          );
        };
      },

      disconnect() {
        this.wsClose();
        return;
      },

      heartbeatStart() {
        heartbeatInterval = setInterval(() => {
          if (ws.readyState !== 1) {
            this.disconnect();
            this.connect();
            return;
          }

          const payload = JSON.stringify({
            op: 1,
            d: null,
          });

          ws.send(payload);
        }, heartbeatDelay);
      },

      wsClose() {
        this.status = connectionStatus.Disconnect;
        ws.close();
        ws = null;
        heartbeatDelay = 0;
        if (heartbeatInterval !== null) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
      },

      async setLoading(delay = 0) {
        this.status = connectionStatus.Loading;
        await sleep(delay);
      },

      errorLog(errorText = "") {
        this.logs.push(errorText);
        this.wsClose();
      },

      actionsUpdate(payload = {}) {
        this.$emit("actionsUpdate", payload);
      },

      validateUserName(username = "", discriminator = "", nick = "") {
        return nick === null ? `${username}#${discriminator}` : nick;
      },
    },

    computed: {
      isDisabled() {
        return this.status === connectionStatus.Loading;
      },

      buttonText() {
        switch (this.status) {
          case connectionStatus.Init:
          case connectionStatus.Disconnect: {
            return connectionMessage.Connect;
          }

          case connectionStatus.Connect: {
            return connectionMessage.Disconnect;
          }

          case connectionStatus.Loading: {
            return connectionMessage.Loading;
          }
        }
      },

      statusClassName() {
        const statusPreset = {
          [connectionStatus.Init]: "bg-white",
          [connectionStatus.Disconnect]: "bg-red-700",
          [connectionStatus.Connect]: "bg-green-700",
          [connectionStatus.Loading]: "bg-orange-700",
        };

        return `w-3 h-3 rounded-full ${statusPreset[this.status]}`;
      },
    },
  };
</script>
