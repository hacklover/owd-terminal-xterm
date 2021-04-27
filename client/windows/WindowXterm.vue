<template>
  <Window
      :title="window.config.title"
      :window="window"
      @open="onOpen"
      @blur="terminalBlur"
      @focus="terminalFocus"
      @resize:end="terminalFit"
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
  data() {
    return {
      terminalMounted: false,
      blurOnMounted: false,
      focusOnMounted: false,
      resizeOnMounted: false
    }
  },
  methods: {
    async onOpen() {
      this.$nextTick(async () => {
        await this.$store.dispatch(`${this.window.uniqueName}/create`, this.window)
        await this.$store.dispatch(`${this.window.uniqueName}/fit`)

        if (!this.terminalMounted && this.blurOnMounted) {
          this.$store.dispatch(`${this.window.uniqueName}/blur`)
        }

        if (!this.terminalMounted && this.focusOnMounted) {
          this.$store.dispatch(`${this.window.uniqueName}/focus`)
        }

        if (!this.terminalMounted && this.resizeOnMounted) {
          this.$store.dispatch(`${this.window.uniqueName}/fit`)
        }

        this.terminalMounted = true
      })
    },
    terminalBlur() {
      if (this.terminalMounted) {
        this.$store.dispatch(`${this.window.uniqueName}/blur`)
      } else {
        this.blurOnMounted = true
      }
    },
    terminalFocus() {
      if (this.terminalMounted) {
        this.$store.dispatch(`${this.window.uniqueName}/focus`)
      } else {
        this.focusOnMounted = true
      }
    },
    terminalFit() {
      if (this.terminalMounted) {
        this.$store.dispatch(`${this.window.uniqueName}/fit`)
      } else {
        this.resizeOnMounted = true
      }
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
