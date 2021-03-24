<template>
  <Window
    :title="window.config.title"
    :window="window"
    @open="onOpen"
    @blur="$store.dispatch(`${this.window.uniqueName}/blur`)"
    @focus="$store.dispatch(`${this.window.uniqueName}/focus`)"
    @resize:end="$store.dispatch(`${this.window.uniqueName}/fit`)"
  >
    <div :id="window.uniqueName" class="terminal" />
  </Window>
</template>

<script>
  import Window from "@owd-client/core/src/components/window/Window";

  export default {
    components: {Window},
    props: {
      window: Object
    },
    methods: {
      async onOpen() {
        this.$nextTick(async () => {
          await this.$store.dispatch(`${this.window.uniqueName}/create`, this.window.uniqueName)
          await this.$store.dispatch(`${this.window.uniqueName}/fit`)
        })
      }
    }
  }
</script>

<style lang="scss">
  .owd-window-xterm {
    .v-progress-linear {
      top: initial;
    }

    .terminal {
      position: relative;
      height: 100%;
      box-sizing: border-box;
      padding: 12px;

      .xterm {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;

        .xterm-screen {
          width: 100% !important;
          height: 100% !important;

          .xterm-rows {
            box-sizing: border-box;
            max-height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }

          canvas {
            width: 100% !important;
            height: 100% !important;
          }
        }
      }
    }
  }
</style>
