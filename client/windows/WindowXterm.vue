<template>
  <WindowApp
      :window="props.window"
      @open="onOpen"
      @blur="terminalBlur"
      @focus="terminalFocus"
      @resize:end="terminalFit"
  >
    <div :id="props.window.uniqueName" class="terminal" />
  </WindowApp>
</template>

<script setup>
import {defineProps, nextTick, ref} from "vue";
import {useStore} from "vuex";

const props = defineProps({
  window: Object
})

const store = useStore()

const terminalMounted = ref(false)
const blurOnMounted = ref(false)
const focusOnMounted = ref(false)
const resizeOnMounted = ref(false)

async function onOpen() {
  nextTick(async () => {
    await store.dispatch(`${props.window.uniqueName}/create`, props.window)
    await store.dispatch(`${props.window.uniqueName}/fit`)

    if (!terminalMounted.value && blurOnMounted.value) {
      store.dispatch(`${props.window.uniqueName}/blur`)
    }

    if (!terminalMounted.value && focusOnMounted.value) {
      store.dispatch(`${props.window.uniqueName}/focus`)
    }

    if (!terminalMounted.value && resizeOnMounted.value) {
      store.dispatch(`${props.window.uniqueName}/fit`)
    }

    terminalMounted.value = true
  })
}

function terminalBlur() {
  if (terminalMounted.value) {
    store.dispatch(`${props.window.uniqueName}/blur`)
  } else {
    blurOnMounted.value = true
  }
}

function terminalFocus() {
  if (terminalMounted.value) {
    store.dispatch(`${props.window.uniqueName}/focus`)
  } else {
    focusOnMounted.value = true
  }
}

function terminalFit() {
  if (terminalMounted.value) {
    store.dispatch(`${props.window.uniqueName}/fit`)
  } else {
    resizeOnMounted.value = true
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
